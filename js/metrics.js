/* PIANO live metrics — Track Record factsheet
 * Reads data/metrics.json (published by piano-coin-gamma/scripts/publish_metrics.py)
 * and fills the Track Record section.
 * The section stays HIDDEN unless the feed has showReturns:true AND a real ROI value.
 * Detail blocks (charts, risk stats, mix) stay hidden unless the feed carries a curve,
 * so an older feed still renders the basic cards.
 * All feed text goes into the DOM via textContent (never innerHTML).
 */
(function () {
  'use strict';

  var FEED_URL = 'data/metrics.json';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MONTHLY_MAX = 12;
  var MIX_COLORS = { crypto: '--tr-mix-1', commodity: '--tr-mix-2', equity: '--tr-mix-3', other: '--tr-mix-4' };

  var section = document.querySelector('[data-metrics-section]');
  if (!section) return;

  var data = null;
  var hoverIndex = null;

  // ---------- helpers ----------
  function t(key, fallback) {
    var v = window.PianoI18n && PianoI18n.t(key);
    return v == null ? fallback : v;
  }
  function lang() { return (window.PianoI18n && PianoI18n.current) || 'en'; }
  function signed(v, digits) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Number(v)).toFixed(digits) + '%'; }
  function pct(v) { return signed(v, 2); }
  function datePart(iso) { return String(iso).slice(0, 10); }
  // "{name} — {n}" style templates from i18n; values are plain text (rendered via textContent)
  function fmt(tpl, vals) { return tpl.replace(/\{(\w+)\}/g, function (_, k) { return vals[k] == null ? '' : vals[k]; }); }
  function shortDate(day) {
    if (lang() === 'ko') return Number(day.slice(5, 7)) + '/' + Number(day.slice(8, 10));
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(parseDay(day));
  }
  function q(sel) { return section.querySelector(sel); }
  function set(metric, text) {
    section.querySelectorAll('[data-metric="' + metric + '"]').forEach(function (el) { el.textContent = text; });
  }
  function svgEl(name, attrs, style) {
    var el = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    Object.keys(style || {}).forEach(function (k) { el.style[k] = style[k]; });
    return el;
  }
  function makeSvg(host) {
    while (host.firstChild) host.removeChild(host.firstChild);
    var w = host.clientWidth, h = host.clientHeight;
    var svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h });
    host.appendChild(svg);
    return { svg: svg, w: w, h: h };
  }
  function parseDay(d) { return new Date(d + 'T00:00:00Z'); }
  function monthName(ym, style) {
    var d = new Date(ym + '-01T00:00:00Z');
    return new Intl.DateTimeFormat(lang() === 'ko' ? 'ko-KR' : 'en-US', { month: style || 'short', timeZone: 'UTC' }).format(d);
  }
  // Clean tick values covering [lo, hi]
  function niceTicks(lo, hi, count) {
    var span = hi - lo || 1;
    var raw = span / count;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (s) { return s >= raw; })[0];
    var start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
    var out = [];
    for (var v = start; v <= end + step / 2; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
  }

  // ---------- basic cards (work with old and new feeds) ----------
  function renderBasics() {
    var d = data;
    set('roi', pct(d.accountRoiPct));
    set('winrate', d.winRatePct == null ? '—' : Number(d.winRatePct).toFixed(1) + '%');
    set('trades', d.totalTrades == null ? '—' : String(d.totalTrades));
    set('cycles', d.hedgeCycles == null ? (d.totalTrades == null ? '—' : String(d.totalTrades)) : String(d.hedgeCycles));

    var since = d.since ? datePart(d.since) : '?';
    var end = d.asOf ? datePart(d.asOf) : '?';
    var days = (d.since && d.asOf) ? Math.max(0, Math.round((new Date(d.asOf) - new Date(d.since)) / 86400000)) : null;
    set('period', since + ' ~ ' + end + (days == null ? '' : ' (' + days + t('index.track.daysUnit', ' days') + ')'));
    set('days', days == null ? '—' : days + t('index.track.daysUnit', ' days'));
  }

  // ---------- detail blocks (new feed) ----------
  function renderDetailText() {
    var d = data;
    var dayU = t('index.track.daysUnit', ' days');
    set('leverage', d.leverage == null ? '—' : d.leverage + t('index.track.leverageUnit', '×'));
    set('instruments', d.instruments == null ? '—' : String(d.instruments));
    set('mdd', pct(d.maxDrawdownPct));
    // Show the peak → trough span so MDD is not mistaken for a monthly figure
    set('mddNote', d.maxDrawdownPeakDate && d.maxDrawdownDate
      ? fmt(t('index.track.mddRange', 'Peak {peak} → trough {trough} · unrealized incl.'),
            { peak: shortDate(d.maxDrawdownPeakDate), trough: shortDate(d.maxDrawdownDate) })
      : t('index.track.mddNote', 'Unrealized losses included ·') + ' ' + (d.maxDrawdownDate || '—'));
    set('sharpe', Number(d.sharpe).toFixed(2));
    set('upDays', Number(d.upDayPct).toFixed(1) + '%');
    set('vol', Number(d.dailyVolPct).toFixed(2) + '%');
    set('recovery', d.longestRecoveryDays + dayU);
    set('hold', Number(d.medianHoldDays).toFixed(1) + dayU);
    set('cashflows', d.cashflowCount + t('index.track.timesUnit', ''));
    var last = d.curve[d.curve.length - 1];
    set('curveNow', last.v.toFixed(1));
    set('curveDd', pct(d.currentDrawdownPct));
  }

  // Equity line + area wash, with month ticks
  function renderEquity() {
    var host = q('[data-chart="equity"]');
    var c = data.curve;
    var g = makeSvg(host), svg = g.svg;
    var pad = { l: 40, r: 44, t: 10, b: 24 };
    var vals = c.map(function (p) { return p.v; });
    var ticks = niceTicks(Math.min.apply(null, vals), Math.max.apply(null, vals), 4);
    var lo = ticks[0], hi = ticks[ticks.length - 1];
    var x = function (i) { return pad.l + (c.length < 2 ? 0 : i / (c.length - 1)) * (g.w - pad.l - pad.r); };
    var y = function (v) { return pad.t + (1 - (v - lo) / (hi - lo)) * (g.h - pad.t - pad.b); };

    ticks.forEach(function (v) {
      svg.appendChild(svgEl('line', { x1: pad.l, x2: g.w - pad.r, y1: y(v), y2: y(v), 'class': 'tr-grid' }));
      var lab = svgEl('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'tr-axis' });
      lab.textContent = String(v);
      svg.appendChild(lab);
    });
    monthTicks(svg, c, x, g.h - 6);

    var line = c.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(p.v).toFixed(1); }).join('');
    var area = line + 'L' + x(c.length - 1).toFixed(1) + ',' + y(lo) + 'L' + x(0).toFixed(1) + ',' + y(lo) + 'Z';
    svg.appendChild(svgEl('path', { d: area }, { fill: 'var(--tr-line)', fillOpacity: '0.10' }));
    svg.appendChild(svgEl('path', { d: line, fill: 'none', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, { stroke: 'var(--tr-line)' }));

    var lx = x(c.length - 1), ly = y(c[c.length - 1].v);
    svg.appendChild(svgEl('circle', { cx: lx, cy: ly, r: 4, 'stroke-width': 2 }, { fill: 'var(--tr-line)', stroke: 'var(--bg)' }));
    var endLab = svgEl('text', { x: lx + 8, y: ly + 4, 'class': 'tr-label' });
    endLab.textContent = c[c.length - 1].v.toFixed(1);
    svg.appendChild(endLab);

    svg.appendChild(svgEl('line', { y1: pad.t, y2: g.h - pad.b, x1: 0, x2: 0, 'class': 'tr-cross', 'data-cross': '' }, { visibility: 'hidden' }));
    host._geom = { x: x, pad: pad, w: g.w };
    host.setAttribute('aria-label', t('index.track.curveAria', 'Account equity index from 100 to ') + c[c.length - 1].v.toFixed(1));
  }

  // Underwater (drawdown) chart sharing the equity chart's x positions
  function renderDrawdown() {
    var host = q('[data-chart="drawdown"]');
    var c = data.curve;
    var g = makeSvg(host), svg = g.svg;
    var pad = { l: 40, r: 44, t: 4, b: 6 };
    var minDd = Math.min.apply(null, c.map(function (p) { return p.dd; }));
    var ticks = niceTicks(minDd, 0, 2);
    var lo = ticks[0];
    var x = function (i) { return pad.l + (c.length < 2 ? 0 : i / (c.length - 1)) * (g.w - pad.l - pad.r); };
    var y = function (v) { return pad.t + (v / lo) * (g.h - pad.t - pad.b); };

    ticks.forEach(function (v) {
      svg.appendChild(svgEl('line', { x1: pad.l, x2: g.w - pad.r, y1: y(v), y2: y(v), 'class': 'tr-grid' }));
      var lab = svgEl('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'tr-axis' });
      lab.textContent = v === 0 ? '0' : '−' + Math.abs(v);
      svg.appendChild(lab);
    });
    var line = c.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(p.dd).toFixed(1); }).join('');
    var area = line + 'L' + x(c.length - 1).toFixed(1) + ',' + y(0) + 'L' + x(0).toFixed(1) + ',' + y(0) + 'Z';
    svg.appendChild(svgEl('path', { d: area }, { fill: 'var(--tr-dd)', fillOpacity: '0.14' }));
    svg.appendChild(svgEl('path', { d: line, fill: 'none', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, { stroke: 'var(--tr-dd)' }));

    // Label only the trough (the headline MDD)
    var ti = 0;
    c.forEach(function (p, i) { if (p.dd < c[ti].dd) ti = i; });
    var tx = x(ti), ty = y(c[ti].dd);
    svg.appendChild(svgEl('circle', { cx: tx, cy: ty, r: 4, 'stroke-width': 2 }, { fill: 'var(--tr-dd)', stroke: 'var(--bg)' }));
    var lab = svgEl('text', { x: tx + 8, y: ty + 2, 'class': 'tr-label' });
    lab.textContent = pct(c[ti].dd) + ' · ' + c[ti].d;
    svg.appendChild(lab);
    if (tx + 8 + lab.getComputedTextLength() > g.w) { // flip left if it would run off the edge
      lab.setAttribute('x', tx - 8);
      lab.setAttribute('text-anchor', 'end');
    }

    svg.appendChild(svgEl('line', { y1: 0, y2: g.h, x1: 0, x2: 0, 'class': 'tr-cross', 'data-cross': '' }, { visibility: 'hidden' }));
  }

  function monthTicks(svg, c, x, yPos) {
    var lastX = -Infinity;
    c.forEach(function (p, i) {
      // first recorded day of each month (a month may have no snapshot on the 1st)
      if (i !== 0 && p.d.slice(0, 7) === c[i - 1].d.slice(0, 7)) return;
      if (i === 0 && p.d.slice(8) > '20') return; // avoid crowding the next month's tick
      if (x(i) - lastX < 44) return; // long histories: thin labels so they never collide
      lastX = x(i);
      var ym = p.d.slice(0, 7);
      var lab = svgEl('text', { x: x(i), y: yPos, 'text-anchor': i === 0 ? 'start' : 'middle', 'class': 'tr-axis' });
      lab.textContent = (ym.slice(5) === '01' ? ym.slice(2, 4) + '/' : '') + monthName(ym);
      svg.appendChild(lab);
    });
  }

  // Crosshair + tooltip across both charts
  function showHover(i) {
    var c = data.curve, eq = q('[data-chart="equity"]'), tip = q('[data-chart-tooltip]');
    if (i == null || !eq._geom) {
      hoverIndex = null;
      tip.hidden = true;
      section.querySelectorAll('[data-cross]').forEach(function (l) { l.style.visibility = 'hidden'; });
      return;
    }
    hoverIndex = Math.max(0, Math.min(c.length - 1, i));
    var p = c[hoverIndex], px = eq._geom.x(hoverIndex);
    section.querySelectorAll('[data-cross]').forEach(function (l) { l.setAttribute('x1', px); l.setAttribute('x2', px); l.style.visibility = 'visible'; });

    while (tip.firstChild) tip.removeChild(tip.firstChild);
    var date = document.createElement('div');
    date.className = 'track-tooltip__date';
    date.textContent = p.d;
    tip.appendChild(date);
    tip.appendChild(tipRow('--tr-line', t('index.track.ttIndex', 'Equity index'), p.v.toFixed(2)));
    tip.appendChild(tipRow('--tr-dd', t('index.track.ttDd', 'Drawdown'), pct(p.dd)));
    tip.hidden = false;

    var fig = tip.parentElement;
    var left = eq.offsetLeft + px + 14;
    if (left + tip.offsetWidth > fig.clientWidth - 8) left = eq.offsetLeft + px - tip.offsetWidth - 14;
    tip.style.left = left + 'px';
    tip.style.top = (eq.offsetTop + 8) + 'px';
  }
  function tipRow(colorVar, label, value) {
    var row = document.createElement('div');
    row.className = 'track-tooltip__row';
    var name = document.createElement('span');
    var key = document.createElement('span');
    key.className = 'track-tooltip__key';
    key.style.background = 'var(' + colorVar + ')';
    name.appendChild(key);
    name.appendChild(document.createTextNode(label));
    var val = document.createElement('b');
    val.textContent = value;
    row.appendChild(val);
    row.insertBefore(name, val);
    return row;
  }
  function bindHover() {
    var eq = q('[data-chart="equity"]');
    function indexAt(host, clientX) {
      var g = eq._geom, rect = host.getBoundingClientRect();
      var frac = (clientX - rect.left - g.pad.l) / (g.w - g.pad.l - g.pad.r);
      return Math.round(frac * (data.curve.length - 1));
    }
    ['[data-chart="equity"]', '[data-chart="drawdown"]'].forEach(function (sel) {
      var host = q(sel);
      host.addEventListener('pointermove', function (e) { showHover(indexAt(host, e.clientX)); });
      host.addEventListener('pointerleave', function () { showHover(null); });
    });
    eq.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var base = hoverIndex == null ? data.curve.length - 1 : hoverIndex;
      showHover(base + (e.key === 'ArrowRight' ? 1 : -1));
    });
    eq.addEventListener('focus', function () { showHover(data.curve.length - 1); });
    eq.addEventListener('blur', function () { showHover(null); });
  }

  // Monthly return columns from a zero baseline; value on each cap (6~12 bars)
  function renderMonthly() {
    var host = q('[data-chart="monthly"]');
    var m = data.monthly.slice(-MONTHLY_MAX); // older months stay in the table view
    var g = makeSvg(host), svg = g.svg;
    var pad = { l: 40, r: 8, t: 18, b: 38 };
    var vals = m.map(function (r) { return r.pct; }).concat([0]);
    // headroom so value labels outside the bar ends never touch the month labels
    var ticks = niceTicks(Math.min.apply(null, vals) * 1.3, Math.max.apply(null, vals) * 1.15, 4);
    var lo = ticks[0], hi = ticks[ticks.length - 1];
    var y = function (v) { return pad.t + (1 - (v - lo) / (hi - lo)) * (g.h - pad.t - pad.b); };
    var slot = (g.w - pad.l - pad.r) / m.length;
    var bw = Math.min(24, slot * 0.5);

    ticks.forEach(function (v) {
      svg.appendChild(svgEl('line', { x1: pad.l, x2: g.w - pad.r, y1: y(v), y2: y(v), 'class': 'tr-grid' }));
      var lab = svgEl('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'tr-axis' });
      lab.textContent = (v < 0 ? '−' + Math.abs(v) : String(v)) + '%';
      svg.appendChild(lab);
    });

    var summary = [];
    m.forEach(function (r, i) {
      var cx = pad.l + slot * (i + 0.5), x0 = cx - bw / 2, y0 = y(0), y1 = y(r.pct);
      var up = r.pct >= 0, rad = Math.min(4, Math.abs(y1 - y0));
      // square at the baseline, 4px rounded at the data end
      var d = up
        ? 'M' + x0 + ',' + y0 + 'V' + (y1 + rad) + 'Q' + x0 + ',' + y1 + ' ' + (x0 + rad) + ',' + y1 + 'H' + (x0 + bw - rad) + 'Q' + (x0 + bw) + ',' + y1 + ' ' + (x0 + bw) + ',' + (y1 + rad) + 'V' + y0 + 'Z'
        : 'M' + x0 + ',' + y0 + 'V' + (y1 - rad) + 'Q' + x0 + ',' + y1 + ' ' + (x0 + rad) + ',' + y1 + 'H' + (x0 + bw - rad) + 'Q' + (x0 + bw) + ',' + y1 + ' ' + (x0 + bw) + ',' + (y1 - rad) + 'V' + y0 + 'Z';
      var bar = svgEl('path', { d: d }, { fill: up ? 'var(--tr-up)' : 'var(--tr-down)', fillOpacity: r.partial ? '0.45' : '1' });
      var title = svgEl('title');
      title.textContent = monthName(r.month, 'long') + ' ' + pct(r.pct) + (r.partial ? ' *' : '');
      bar.appendChild(title);
      svg.appendChild(bar);

      var val = svgEl('text', { x: cx, y: up ? y1 - 6 : y1 + 14, 'text-anchor': 'middle', 'class': 'tr-label' });
      val.textContent = slot < 52 ? signed(r.pct, 1).replace('%', '') : signed(r.pct, 1); // tight: axis carries the %
      svg.appendChild(val);
      var mon = svgEl('text', { x: cx, y: g.h - 18, 'text-anchor': 'middle', 'class': 'tr-axis' });
      mon.textContent = monthName(r.month) + (r.partial ? '*' : '');
      svg.appendChild(mon);
      if (i === 0 || r.month.slice(5) === '01') {
        var yr = svgEl('text', { x: cx, y: g.h - 3, 'text-anchor': 'middle', 'class': 'tr-axis' });
        yr.textContent = r.month.slice(0, 4);
        svg.appendChild(yr);
      }
      summary.push(r.month + ' ' + pct(r.pct));
    });
    svg.appendChild(svgEl('line', { x1: pad.l, x2: g.w - pad.r, y1: y(0), y2: y(0) }, { stroke: 'var(--fg-4)', strokeWidth: '1' }));
    host.setAttribute('aria-label', t('index.track.monthlyTitle', 'Monthly return') + ': ' + summary.join(', '));
  }

  // Asset-class mix: tall segmented bar + legend
  function renderMix() {
    var bar = q('[data-chart="mix"]'), legend = q('[data-chart="mixLegend"]');
    var mix = data.assetMix || [];
    var total = mix.reduce(function (s, r) { return s + r.trades; }, 0) || 1;
    [bar, legend].forEach(function (el) { while (el.firstChild) el.removeChild(el.firstChild); });
    var labels = [];
    mix.forEach(function (r) {
      var share = r.trades / total * 100;
      var name = t('index.track.mix.' + r.key, r.key);
      var color = 'var(' + (MIX_COLORS[r.key] || MIX_COLORS.other) + ')';

      var seg = document.createElement('div');
      seg.className = 'track-mix__seg';
      seg.style.flex = r.trades + ' 1 0';
      seg.style.background = color;
      seg.textContent = Math.round(share) + '%';
      seg.title = name + ' ' + Math.round(share) + '%';
      bar.appendChild(seg);

      var li = document.createElement('li');
      var sw = document.createElement('span');
      sw.className = 'track-mix__swatch';
      sw.style.background = color;
      li.appendChild(sw);
      li.appendChild(document.createTextNode(fmt(
        t('index.track.mixItem', '{name} — {n} instruments, {legs} closed legs ({share}%)'),
        { name: name, n: r.instruments, legs: r.trades, share: Math.round(share) }
      )));
      legend.appendChild(li);
      labels.push(name + ' ' + Math.round(share) + '%');
    });
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', labels.join(', '));
    // A segment too narrow for its label prints none (value stays in legend/title)
    bar.querySelectorAll('.track-mix__seg').forEach(function (seg) {
      if (seg.scrollWidth > seg.clientWidth) seg.textContent = '';
    });
  }

  function renderTable() {
    var body = q('[data-chart="table"]');
    while (body.firstChild) body.removeChild(body.firstChild);
    data.monthly.forEach(function (r) {
      var days = data.curve.filter(function (p) { return p.d.slice(0, 7) === r.month; });
      var worst = Math.min.apply(null, days.map(function (p) { return p.dd; }));
      var end = days.length ? days[days.length - 1].v.toFixed(2) : '—';
      var tr = document.createElement('tr');
      [r.month + (r.partial ? ' *' : ''), pct(r.pct), end, days.length ? pct(worst) : '—'].forEach(function (txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function hasDetail(d) {
    return Array.isArray(d.curve) && d.curve.length >= 2 && Array.isArray(d.monthly) && d.maxDrawdownPct != null;
  }

  function renderCharts() {
    if (!hasDetail(data) || section.hidden) return;
    renderEquity();
    renderDrawdown();
    renderMonthly();
    renderMix();
    if (hoverIndex != null) showHover(hoverIndex);
  }

  function renderAll() {
    if (!data) return;
    renderBasics();
    if (hasDetail(data)) {
      renderDetailText();
      renderTable();
      renderCharts();
    }
  }

  fetch(FEED_URL, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || d.showReturns !== true || d.accountRoiPct == null) return; // stay hidden
      data = d;
      section.hidden = false;
      if (hasDetail(d)) {
        section.querySelectorAll('[data-track-detail]').forEach(function (el) { el.hidden = false; });
        bindHover();
      }
      renderAll();
      if (window.PianoI18n) PianoI18n.onChange(renderAll);
      if (window.ResizeObserver) {
        var pending = false, lastW = 0;
        new ResizeObserver(function () {
          var w = section.clientWidth;
          if (w === lastW || pending) return;
          lastW = w;
          pending = true;
          requestAnimationFrame(function () { pending = false; renderCharts(); });
        }).observe(section);
      }
    })
    .catch(function () { /* stay hidden on any error */ });
})();

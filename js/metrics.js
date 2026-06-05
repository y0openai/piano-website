/* PIANO live metrics
 * Reads a small JSON feed and fills the Track Record box.
 * The box stays HIDDEN unless the feed has showReturns:true AND a real ROI value.
 * Change FEED_URL to the hosted feed once the PC-side bridge is publishing.
 */
(function () {
  'use strict';

  var FEED_URL = 'data/metrics.json';

  var section = document.querySelector('[data-metrics-section]');
  if (!section) return;

  var data = null;

  function pct(v) { return (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%'; }
  function num(v) { return Number(v).toFixed(2); }
  function datePart(iso) { return String(iso).slice(0, 10); }
  function set(metric, text) {
    var el = section.querySelector('[data-metric="' + metric + '"]');
    if (el) el.textContent = text;
  }

  // Period string is language-aware (day unit), so re-render it on language change.
  function renderPeriod() {
    if (!data) return;
    var since = data.since ? datePart(data.since) : '?';
    var end = data.asOf ? datePart(data.asOf) : '?';
    var tail = '';
    if (data.since && data.asOf) {
      var days = Math.max(0, Math.round((new Date(data.asOf) - new Date(data.since)) / 86400000));
      var unit = (window.PianoI18n && PianoI18n.t('index.track.daysUnit')) || ' days';
      tail = ' (' + days + unit + ')';
    }
    set('period', since + ' ~ ' + end + tail);
  }

  fetch(FEED_URL, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || d.showReturns !== true || d.capitalRoiPct == null) return; // stay hidden
      data = d;
      set('roi', pct(d.capitalRoiPct));
      set('winrate', d.winRatePct == null ? '—' : Math.round(d.winRatePct) + '%');
      set('trades', d.totalTrades == null ? '—' : String(d.totalTrades));
      renderPeriod();
      if (window.PianoI18n) PianoI18n.onChange(renderPeriod);
      section.hidden = false;
    })
    .catch(function () { /* stay hidden on any error */ });
})();

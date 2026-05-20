/* PIANO i18n
 * data-i18n="key"        → textContent
 * data-i18n-html="key"   → innerHTML (use for strings containing <br>, <a>, <strong>)
 * data-i18n-attr="attr:key[;attr:key]"  → element attribute (title, placeholder, content, alt, aria-label)
 * <html data-i18n-title="key">          → document.title
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'piano-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'ko'];

  const T = {
    en: {
      // ---------- Common (nav / footer / shared CTAs) ----------
      'nav.features': 'Features',
      'nav.howItWorks': 'How It Works',
      'nav.security': 'Security',
      'nav.pricing': 'Pricing',
      'nav.whatIsEwy': 'What is EWY',
      'nav.risks': 'Risks',
      'nav.home': '← Home',
      'nav.getStarted': 'Get Started →',
      'nav.contactUs': 'Contact Us →',
      'nav.themeAuto': 'Auto (system)',
      'nav.themeLight': 'Light',
      'nav.themeDark': 'Dark',
      'nav.langGroup': 'Language',
      'nav.openMenu': 'Open menu',
      'nav.logoAria': 'PIANO home',

      'footer.tagline': 'Automated Hedge Balancing for Crypto',
      'footer.contact.prefix': 'Get in Touch → ',
      'footer.contact.link': 'Telegram',
      'footer.nav.learn': 'Learn',
      'footer.nav.connect': 'Connect',
      'footer.link.basis': 'What is Basis Hedge?',
      'footer.link.ewy': 'EWY Futures',
      'footer.link.home': 'Home',
      'footer.link.telegram': 'Telegram Support',
      'footer.copy': '© 2025 PIANO. All rights reserved.',

      'back.home': '← Back to Home',

      // ---------- index.html ----------
      'index.title': 'PIANO — Algorithmic RWA Strategy Automation',
      'index.metaDesc': 'Automate market signal analysis and execution for approved crypto and RWA futures strategies within user-defined assets, limits, and API permissions.',

      'index.hero.badge': 'Algorithmic Strategy Automation',
      'index.hero.h1': 'Automate your<br>approved market<br>strategy.',
      'index.hero.sub': 'Piano analyzes market signals and executes approved strategies across supported crypto and RWA futures, within the assets, limits, and API permissions you set.',
      'index.hero.ctaPrimary': 'Get Started →',
      'index.hero.ctaSecondary': 'How It Works',
      'index.hero.figCaption': 'Approved strategies coordinate exposure across supported markets.',

      'index.portfolio.label': 'Portfolio Structure',
      'index.portfolio.h2': 'Diversify with<br>supported RWA markets',
      'index.portfolio.sub': 'Diversification is a classic risk-management idea: different markets can react to different drivers. Piano helps automate approved strategy rules across supported instruments without promising outcomes.',
      'index.portfolio.c1.kicker': '01 / Diversification',
      'index.portfolio.c1.h3': 'Different markets, different drivers',
      'index.portfolio.c1.p': 'Supported crypto and RWA futures can reference assets such as equity indices, ETFs, or commodities depending on exchange availability. Piano helps monitor them under one approved rule set.',
      'index.portfolio.c2.kicker': '02 / Discipline',
      'index.portfolio.c2.h3': 'All-weather inspired structure',
      'index.portfolio.c2.p': 'The goal is not to predict one winning market. The goal is to define exposure rules, risk limits, and execution conditions before volatility arrives.',
      'index.portfolio.c3.kicker': '03 / Long & Short',
      'index.portfolio.c3.h3': 'Designed for both directions',
      'index.portfolio.c3.p': 'Futures can express both long and short exposure, so approved strategies may be designed for rising or falling markets. Short exposure can also create large losses and requires strict limits.',

      'index.features.label': 'Core Features',
      'index.features.h2': 'Three mechanisms for<br>approved automation',
      'index.features.sub': 'Built on the freqtrade open-source framework. Every execution stays inside the target assets, strategy rules, and risk boundaries you approve.',
      'index.features.f1.caption': 'Signals pass only when configured conditions are met.',
      'index.features.f1.h3': 'Statistical Entry Condition Filter',
      'index.features.f1.p': 'Market conditions are evaluated before entering. Execution only happens when your configured conditions are met.',
      'index.features.f1.note': 'Entry / Risk gate',
      'index.features.f2.caption': 'Ratio drift is detected and tuned back toward balance.',
      'index.features.f2.h3': 'Auto Position Imbalance Correction',
      'index.features.f2.p': 'When market movements drift an approved portfolio or hedge ratio, Piano evaluates the rule set in real time and adjusts positions inside configured limits.',
      'index.features.f2.note': 'Rebalance / AI correction',
      'index.features.f3.caption': 'AI adjusts size ratio and closes favorable positions.',
      'index.features.f3.h3': 'Linked Balancing',
      'index.features.f3.p': "Piano can automate long and short position sizing for approved strategies. When configured exit conditions are met, orders are executed according to the user's rules.",
      'index.features.f3.note': 'DCA + auto-rebalance',

      'index.hiw.label': 'Get Started',
      'index.hiw.h2': 'Running in<br>three steps',
      'index.hiw.sub': 'Default parameters are provided so you can start right away.',
      'index.hiw.s1.time': '~5 min',
      'index.hiw.s1.h3': 'Create Binance API Key',
      'index.hiw.s1.p': 'Create an API key from your Binance account. Disable withdrawal permission and allow only the designated server IP.',
      'index.hiw.s2.time': 'Configure',
      'index.hiw.s2.h3': 'Set Parameters',
      'index.hiw.s2.p': 'Configure target assets, execution rules, risk limits, and position size. You can adjust any parameter at any time.',
      'index.hiw.s3.time': 'Ongoing',
      'index.hiw.s3.h3': 'Monitor',
      'index.hiw.s3.p': 'Piano runs approved strategy rules automatically. Check status and execution history on the dashboard.',

      'index.sec.label': 'Security',
      'index.sec.h2': 'We never directly<br>access your assets',
      'index.sec.sub': 'Piano connects to Binance via API but never holds or transfers your assets.',
      'index.sec.c1.h3': 'API Key Creation',
      'index.sec.c1.p': 'You create it directly on Binance',
      'index.sec.c2.h3': 'Withdrawal Disabled',
      'index.sec.c2.p': 'Only keys without withdrawal permission are used',
      'index.sec.c3.h3': 'IP Restriction',
      'index.sec.c3.p': 'Access only from authorized server IPs',
      'index.sec.c4.h3': 'Instant Revocation',
      'index.sec.c4.p': 'Revoke the API key and access is cut immediately',
      'index.sec.c5.h3': 'Parameter Control',
      'index.sec.c5.p': 'You set and change all execution conditions yourself',
      'index.sec.c6.h3': 'Isolated Environment',
      'index.sec.c6.p': 'Each user runs on a dedicated instance',
      'index.sec.do.h3': 'What Piano does',
      'index.sec.do.li1': 'Runs approved strategy rules automatically',
      'index.sec.do.li2': 'Monitors and corrects portfolio or hedge drift',
      'index.sec.do.li3': 'Executes only per your preconfigured conditions',
      'index.sec.do.li4': 'Monitors 24/7 automatically',
      'index.sec.dont.h3': "What Piano doesn't do",
      'index.sec.dont.li1': 'No investment advice or asset recommendations',
      'index.sec.dont.li2': 'No profit guarantees or performance promises',
      'index.sec.dont.li3': 'Never arbitrarily disposes of your assets',
      'index.sec.dont.li4': 'No withdrawals or asset transfers',

      'index.pricing.label': 'Pricing',
      'index.pricing.h2': 'Simple, transparent pricing',
      'index.pricing.sub': 'No fees tied to profits or trading volume.',
      'index.pricing.setup.label': 'Setup Fee',
      'index.pricing.setup.val': 'Flat rate (inquire)',
      'index.pricing.monthly.label': 'Monthly Maintenance',
      'index.pricing.monthly.val': 'Flat rate (inquire)',
      'index.pricing.note': 'Contact us for exact pricing details.',
      'index.pricing.cta': 'Contact Us →',

      'index.faq.label': 'FAQ',
      'index.faq.h2': 'Frequently asked questions',
      'index.faq.q1.q': 'What is Piano?',
      'index.faq.q1.a': 'Piano is a software tool that analyzes market signals and automates execution for user-approved strategies across supported crypto and RWA futures. Hedge balancing is one supported strategy structure.',
      'index.faq.q2.q': 'Do I need crypto trading experience?',
      'index.faq.q2.a': 'A basic understanding of the target assets and automated trading risks is required. Piano analyzes market signals and automates execution only within the strategy and risk limits you approve.',
      'index.faq.q3.q': 'Are my assets safe?',
      'index.faq.q3.a': 'Your funds always remain in your Binance account. Piano only uses API keys without withdrawal permission. Revoke the API key and access is blocked immediately.',
      'index.faq.q4.q': 'Does Piano trade automatically?',
      'index.faq.q4.a': 'Piano can automate signal analysis and order execution after you approve the strategy, target assets, risk limits, and API permissions. It does not guarantee returns, and all gains and losses are your responsibility.',
      'index.faq.q5.q': 'Which exchanges are supported?',
      'index.faq.q5.a': 'Piano focuses on Binance-connected instruments, including supported crypto markets and selected RWA perpetual/futures products such as EWY where available. Supported markets depend on exchange availability and user approval.',

      'index.cta.h2': 'Start automating approved strategies',
      'index.cta.sub': 'Connect via Telegram and define the assets, rules, and limits before activation.',
      'index.cta.btn': 'Get Started →',

      'index.risk.header': '⚠️ Risk Disclosure',
      'index.risk.sub1': 'Nature of Service',
      'index.risk.i1': '<strong>1. Piano is a software tool.</strong> — It is not an investment advisory, discretionary investment management, or financial product brokerage service.',
      'index.risk.i2': '<strong>2. Piano does not solicit investments.</strong> — It does not recommend or solicit the purchase or sale of any specific assets.',
      'index.risk.i3': "<strong>3. Piano analyzes market signals through algorithms and automatically executes trades within the conditions and limits set by the user.</strong> — Before activating automated trading, the user must directly approve the strategy, target assets, risk limits, and API permissions. All investment gains and losses are the user's responsibility.",
      'index.risk.i4': '<strong>4. Piano does not guarantee returns.</strong> — Past performance, backtests, and simulation results do not guarantee future returns.',
      'index.risk.sub2': 'Investment Risk Disclosure',
      'index.risk.body': 'Crypto and RWA-linked futures or derivative trading involves significant risk and may result in the complete loss of principal. Automated execution can amplify losses if parameters are unsuitable or market conditions change. Before activating any strategy, carefully consider your financial situation, investment experience, and risk tolerance.',

      // ---------- basis-hedge.html ----------
      'bh.title': 'What Is a Basis Hedge? — PIANO',
      'bh.metaDesc': "Learn how Basis Hedge works, step by step with everyday analogies. Understand the risk management strategy used by the world's largest financial institutions.",

      'bh.hero.label': 'Financial Concepts',
      'bh.hero.h1': 'What Is a<br>Basis Hedge?',
      'bh.hero.sub': "It's the strategy used by the world's largest financial institutions. It can bring your risk down to nearly zero. The name sounds technical — the idea is actually simple.",
      'bh.hero.figCaption': 'For every Long position above zero, an equal Short below cancels it. Together ≈ 0.',

      'bh.s1.badge': 'Step 01',
      'bh.s1.h2': 'Start with an everyday example',
      'bh.s1.p': 'Think about planning a trip to Europe. Nobody knows if the exchange rate will go up or down. So you exchange your money ahead of time.',
      'bh.s1.eq1.h3': 'Before the trip',
      'bh.s1.eq1.p': 'Exchange USD → EUR early',
      'bh.s1.eq2.h3': 'Even if rates change',
      'bh.s1.eq2.p': 'Already exchanged — no worries',
      'bh.s1.eq3.h3': 'Certainty',
      'bh.s1.eq3.p': 'Lock in now, not later',
      'bh.s1.callout': "That's exactly what <strong>hedging</strong> is. You lock in certainty now, instead of worrying about what the future holds.",

      'bh.s2.badge': 'Step 02',
      'bh.s2.h2': 'Apply this to crypto',
      'bh.s2.p': 'Buy (LONG) and sell (SHORT) the same asset at the same time. No matter which way the price moves, they cancel each other out.',
      'bh.s2.eq1.h3': 'Buy spot',
      'bh.s2.eq1.p': '📈 Spot position',
      'bh.s2.eq2.h3': 'Sell futures',
      'bh.s2.eq2.p': '📉 Futures position',
      'bh.s2.eq3.h3': 'Combined',
      'bh.s2.eq3.p': 'Risk neutralized',
      'bh.s2.scenIntro': 'Every scenario plays out the same way:',
      'bh.s2.sc1.num': 'Scenario 01',
      'bh.s2.sc1.h3': 'Price goes up 10%',
      'bh.s2.sc1.math': 'Spot: +10%<br>Futures: −10%',
      'bh.s2.sc1.result': 'Total ≈ 0',
      'bh.s2.sc2.num': 'Scenario 02',
      'bh.s2.sc2.h3': 'Price goes down 10%',
      'bh.s2.sc2.math': 'Spot: −10%<br>Futures: +10%',
      'bh.s2.sc2.result': 'Total ≈ 0',
      'bh.s2.sc3.num': 'Scenario 03',
      'bh.s2.sc3.h3': 'Price stays the same',
      'bh.s2.sc3.math': 'Spot: 0%<br>Futures: 0%',
      'bh.s2.sc3.result': 'Total ≈ 0',

      'bh.s3.badge': 'Step 03',
      'bh.s3.h2': 'If profit is zero, why bother?',
      'bh.s3.p': "Great question. Here's where the concept of <strong style=\"color:#EDEDED\">Funding Fee</strong> comes in.",
      'bh.s3.callout1.title': 'What is a Funding Fee?',
      'bh.s3.callout1.p1': 'In perpetual futures markets, a fee is exchanged between longs and shorts <strong>every 8 hours</strong>. This is called the Funding Fee.',
      'bh.s3.callout1.p2': 'When there are more longs → longs pay shorts<br>When there are more shorts → shorts pay longs',
      'bh.s3.callout1.p3': 'In a Basis Hedge, the SHORT position is usually the one <strong>receiving</strong> the Funding Fee.',
      'bh.s3.callout2': "The Funding Rate changes with market conditions. You won't always receive it. If the rate turns negative, it becomes a cost instead.",
      'bh.s3.callout3.title': "There's more: rebalancing creates profit opportunities",
      'bh.s3.callout3.p1': 'Piano continuously rebalances the long and short positions as the ratio drifts. When market conditions turn favorable — for example, when the basis narrows significantly — Piano closes the position and <strong>captures the profit</strong>.',
      'bh.s3.callout3.p2': "The hedge isn't just a waiting game. It's an active structure that generates returns when the moment is right.",

      'bh.who.label': 'Who Uses This',
      'bh.who.h2': 'So, who actually uses this strategy?',
      'bh.who.c1.type': 'Hedge Funds',
      'bh.who.c1.h3': 'Citadel · Bridgewater · Two Sigma',
      'bh.who.c1.p': 'Eliminate directional risk and capture spreads through Basis Trades',
      'bh.who.c2.type': 'Investment Banks',
      'bh.who.c2.h3': 'Goldman Sachs · JP Morgan · Morgan Stanley',
      'bh.who.c2.p': 'Their derivatives hedge desks manage client asset risk to stay neutral',
      'bh.who.c3.type': 'Market Makers',
      'bh.who.c3.h3': 'Jane Street · Wintermute · Jump Trading',
      'bh.who.c3.p': 'Hedge inventory risk while providing liquidity to the market',
      'bh.who.foot': 'Basis Hedge (also known as Cash-and-Carry) is one of the oldest arbitrage strategies in financial markets.',

      'bh.ch.h2': "But it's hard to manage on your own",
      'bh.ch.p': 'The strategy itself is simple. But running it yourself means constant management.',
      'bh.ch.c1.h3': '24/7 Monitoring',
      'bh.ch.c1.p': "The crypto market never sleeps. Position ratios drift even while you're sleeping.",
      'bh.ch.c2.h3': 'Manual Rebalancing',
      'bh.ch.c2.p': 'Every time ratios drift, you need to calculate and adjust manually.',
      'bh.ch.c3.h3': 'Emotional Interference',
      'bh.ch.c3.p': 'When prices swing hard, fear and greed kick in. You end up breaking your own hedge.',
      'bh.ch.callout': '<strong>Piano</strong> is the software that automates all of this maintenance for you.',

      'bh.cta.h2': 'Curious about Piano?',
      'bh.cta.sub': 'See how Piano automates your hedge position management.',
      'bh.cta.primary': 'Piano Homepage →',
      'bh.cta.secondary': 'Chat on Telegram',

      // ---------- ewy.html ----------
      'ewy.title': 'PIANO — EWY Perpetual Futures Basis Hedge Balancing',
      'ewy.metaDesc': "Piano's hedge position balancing feature now extends to Binance EWY perpetual futures.",

      'ewy.hero.label': 'New — EWY Perpetual Futures',
      'ewy.hero.h1': 'Basis Hedge Balancing<br>for EWY Futures',
      'ewy.hero.sub': "Piano's hedge position balancing feature now extends to Binance EWY perpetual futures. Positions are automatically rebalanced based on your configured conditions — using the same principles as crypto.",
      'ewy.hero.ctaPrimary': 'Learn More ↓',
      'ewy.hero.ctaSecondary': 'Contact Us',
      'ewy.hero.note': 'Piano automates risk management. It does not provide investment advice or guarantee returns.',

      'ewy.what.label': 'What Is EWY',
      'ewy.what.h2': 'iShares MSCI South Korea ETF',
      'ewy.what.p': 'EWY is the flagship South Korean equity ETF managed by BlackRock. It tracks the MSCI Korea 25/50 Index and consists of approximately 83 leading Korean stocks.',
      'ewy.what.s1.label': 'Asset Manager',
      'ewy.what.s1.h3': 'BlackRock',
      'ewy.what.s1.p': "World's largest asset manager",
      'ewy.what.s2.label': 'Benchmark Index',
      'ewy.what.s2.h3': 'MSCI Korea',
      'ewy.what.s2.p': '25/50 Index',
      'ewy.what.s3.label': 'Holdings',
      'ewy.what.s3.h3': 'Approx. 83',
      'ewy.what.s3.p': 'Leading Korean companies',
      'ewy.what.s4.label': 'Listed Exchange',
      'ewy.what.s4.h3': 'NYSE Arca',
      'ewy.what.s4.p': 'U.S. stock exchange',
      'ewy.what.holdings.title': 'Top Holdings',
      'ewy.what.h.r1.name': 'Samsung Electronics',
      'ewy.what.h.r1.w': 'Approx. 22%',
      'ewy.what.h.r2.name': 'SK Hynix',
      'ewy.what.h.r2.w': 'Approx. 10%',
      'ewy.what.h.r3.name': 'Hyundai Motor',
      'ewy.what.h.r3.w': 'Approx. 4%',
      'ewy.what.h.r4.name': 'KB Financial',
      'ewy.what.h.r4.w': 'Approx. 3%',
      'ewy.what.h.r5.name': 'POSCO Holdings',
      'ewy.what.h.r5.w': 'Approx. 3%',
      'ewy.what.h.r6.name': 'Remaining approx. 78 stocks',
      'ewy.what.h.r6.w': 'Approx. 58%',
      'ewy.what.h.note': 'Weightings may change due to MSCI rebalancing. Figures above are for reference only and are not real-time data.',
      'ewy.what.callout': 'Binance offers perpetual futures (EWYUSDT Perpetual) based on the EWY ETF. Settlement is in USDT, with Funding Rate settlement every 8 hours.',

      'ewy.hiw.label': 'How It Works',
      'ewy.hiw.h2': 'The Same Basis Hedge Balancing Method',
      'ewy.hiw.p': 'The same hedge balancing principles used for crypto are applied to EWY perpetual futures.',
      'ewy.hiw.c1.num': 'Basic Structure',
      'ewy.hiw.c1.h3': 'Spot + Opposite Futures',
      'ewy.hiw.c1.math': 'Offsets directional risk',
      'ewy.hiw.c2.num': 'Core Function',
      'ewy.hiw.c2.h3': 'Ratio Maintenance',
      'ewy.hiw.c2.math': 'Manages Funding Fee settlement',
      'ewy.hiw.c3.num': 'Key Feature',
      'ewy.hiw.c3.h3': 'Imbalance → Correction',
      'ewy.hiw.c3.math': 'Automatically restores balance',
      'ewy.hiw.note': 'It only executes within your configured parameter ranges. You can change parameters or stop execution at any time.',
      'ewy.hiw.th1': 'Feature',
      'ewy.hiw.th2': 'Description',
      'ewy.hiw.r1.k': 'Imbalance Detection',
      'ewy.hiw.r1.v': 'Monitors spot-futures ratio deviations in real time',
      'ewy.hiw.r2.k': 'Auto Correction',
      'ewy.hiw.r2.v': 'Adjusts position ratios based on your configured conditions',
      'ewy.hiw.r3.k': 'Balance Restoration',
      'ewy.hiw.r3.v': 'Automatically restores 1:1 balance and achieves better entry prices',
      'ewy.hiw.r4.k': 'Funding Rate Management',
      'ewy.hiw.r4.v': 'Manages positions by reflecting settlement every 8 hours',

      'ewy.hours.label': 'Trading Hours',
      'ewy.hours.h2': 'Trading Hours',
      'ewy.hours.p': 'Trading hours for EWY perpetual futures differ from those of the underlying EWY ETF.',
      'ewy.hours.th1': 'Market',
      'ewy.hours.th2': 'Trading Hours (KST)',
      'ewy.hours.th3': 'Note',
      'ewy.hours.r1.k': 'Korea Stock Exchange (KRX)',
      'ewy.hours.r1.v': '09:00 – 15:30',
      'ewy.hours.r1.n': 'Closed on Korean holidays',
      'ewy.hours.r2.k': 'EWY ETF (NYSE Arca)',
      'ewy.hours.r2.v': '23:30 – 06:00 (next day)',
      'ewy.hours.r2.n': 'Based on U.S. market hours',
      'ewy.hours.r3.k': 'EWYUSDT Perpetual Futures',
      'ewy.hours.r3.v': '24 hours',
      'ewy.hours.r3.n': 'Year-round',
      'ewy.hours.callout': 'Perpetual futures trade 24 hours a day. However, during hours when the underlying EWY ETF market is closed, <strong>liquidity may decrease, spreads may widen, and price discrepancies may occur.</strong> This is an additional risk factor.',

      'ewy.risk.label': 'Risk Factors',
      'ewy.risk.h2': 'Risks Specific to EWY Perpetual Futures',
      'ewy.risk.p': 'EWY perpetual futures carry unique risks that differ from standard crypto perpetual futures. Please make sure you understand the following before getting started.',
      'ewy.risk.r1.h3': '1. Leverage Risk',
      'ewy.risk.r1.l1': 'Using leverage may result in losses exceeding your principal',
      'ewy.risk.r1.l2': 'If the market moves sharply against your position, forced liquidation may result in total loss',
      'ewy.risk.r1.l3': 'Higher leverage multipliers dramatically increase liquidation risk',
      'ewy.risk.r1.l4': 'Piano does not advise on leverage selection — this is entirely your responsibility',
      'ewy.risk.r2.h3': '2. Off-Hours Liquidity Risk',
      'ewy.risk.r2.l1': 'During Korean daytime hours, the underlying asset market is closed',
      'ewy.risk.r2.l2': 'Liquidity may drop significantly, and bid-ask spreads may widen considerably',
      'ewy.risk.r2.l3': 'Discrepancies may arise between futures prices and the underlying asset value',
      'ewy.risk.r2.l4': 'Slippage may increase significantly',
      'ewy.risk.r3.h3': '3. Funding Rate Risk',
      'ewy.risk.r3.l1': 'Funding Rate is settled every 8 hours and may fluctuate between positive and negative',
      'ewy.risk.r3.l2': 'Depending on position direction, you may be required to pay Funding Fee continuously',
      'ewy.risk.r3.l3': 'Sudden changes in Funding Rate may result in unexpected costs',
      'ewy.risk.r4.h3': '4. Price Divergence Risk',
      'ewy.risk.r4.l1': 'Perpetual futures prices do not always match the underlying EWY ETF price',
      'ewy.risk.r4.l2': 'Significant divergence may occur when the underlying market is closed',
      'ewy.risk.r4.l3': 'Global events may cause unexpected price movements',
      'ewy.risk.r5.h3': '5. Exchange Risk',
      'ewy.risk.r5.l1': 'EWY perpetual futures are traded exclusively on Binance',
      'ewy.risk.r5.l2': 'Trading may be suspended due to exchange system failures or policy changes',
      'ewy.risk.r5.l3': 'The contract may be terminated if the exchange decides to delist it',

      'ewy.boundary.label': 'Service Boundary',
      'ewy.boundary.h2': 'Service Boundaries',
      'ewy.boundary.do.h3': 'What Piano Does',
      'ewy.boundary.do.l1': 'Maintains position balance based on your configured conditions',
      'ewy.boundary.do.l2': 'Automatically corrects spot-futures ratio imbalances',
      'ewy.boundary.do.l3': 'Manages Funding Rate settlement',
      'ewy.boundary.do.l4': 'Monitors position status 24/7',
      'ewy.boundary.do.l5': 'Executes according to your configured parameters only',
      'ewy.boundary.dont.h3': 'What Piano Does Not Do',
      'ewy.boundary.dont.l1': 'Does not recommend investment decisions or trade timing',
      'ewy.boundary.dont.l2': 'Does not guarantee returns or promise performance',
      'ewy.boundary.dont.l3': 'Does not advise on leverage multipliers',
      'ewy.boundary.dont.l4': 'Does not arbitrarily dispose of your assets',
      'ewy.boundary.dont.l5': 'Does not provide market forecasts or investment strategies',
      'ewy.boundary.callout': 'Piano is a <strong>tool that automates risk management</strong>. It is not an investment advisory, discretionary investment management, or financial product brokerage service.',

      'ewy.full.label': 'Risk Disclosure',
      'ewy.full.h2': 'Full Risk Disclosure',
      'ewy.full.p1': '<strong style="color:#EDEDED">1. Piano is a software tool.</strong> — It is not an investment advisory, discretionary investment management, or financial product brokerage service.',
      'ewy.full.p2': '<strong style="color:#EDEDED">2. Piano does not solicit investment.</strong> — It does not recommend or encourage the purchase or sale of any specific asset.',
      'ewy.full.p3': "<strong style=\"color:#EDEDED\">3. Piano analyzes market signals through algorithms and automatically executes trades within the conditions and limits set by the user.</strong> — Before activating automated trading, the user must directly approve the strategy, target assets, risk limits, and API permissions. All investment gains and losses are the user's responsibility.",
      'ewy.full.p4': '<strong style="color:#EDEDED">4. Piano does not guarantee returns.</strong> — Past performance, backtests, and simulation results do not guarantee future returns.',
      'ewy.full.p5': '<strong style="color:#EDEDED">5. Risk of Principal Loss</strong> — Trading EWY perpetual futures is a leveraged derivative transaction that may result in total loss of principal.',
      'ewy.full.p6': "<strong style=\"color:#EDEDED\">6. Leverage Risk</strong> — The decision to use leverage and the chosen multiplier are entirely the user's own judgment and responsibility.",
      'ewy.full.p7': '<strong style="color:#EDEDED">7. Liquidity and Market Risk</strong> — During hours when the underlying asset market is closed, risks such as insufficient liquidity and price divergence may occur.',
      'ewy.full.p8': '<strong style="color:#EDEDED">8. Software Risk</strong> — The service may not function properly due to bugs, network outages, API errors, or changes to exchange systems.',
      'ewy.full.p9': "<strong style=\"color:#EDEDED\">9. Personal Responsibility</strong> — All trading decisions and resulting profits or losses are entirely the user's own judgment and responsibility.",

      'ewy.cta.h2': 'Questions about EWY futures?',
      'ewy.cta.sub': 'Reach out to us on Telegram. Please review the risk disclosures above before getting started.',
      'ewy.cta.btn': 'Contact Us →',
    },

    ko: {
      // ---------- Common ----------
      'nav.features': '주요 기능',
      'nav.howItWorks': '작동 방식',
      'nav.security': '보안',
      'nav.pricing': '요금',
      'nav.whatIsEwy': 'EWY 소개',
      'nav.risks': '위험 고지',
      'nav.home': '← 홈',
      'nav.getStarted': '시작하기 →',
      'nav.contactUs': '문의하기 →',
      'nav.themeAuto': '자동 (시스템)',
      'nav.themeLight': '라이트',
      'nav.themeDark': '다크',
      'nav.langGroup': '언어',
      'nav.openMenu': '메뉴 열기',
      'nav.logoAria': 'PIANO 홈',

      'footer.tagline': '암호화폐 헷지 자동 밸런싱',
      'footer.contact.prefix': '문의 → ',
      'footer.contact.link': '텔레그램',
      'footer.nav.learn': '알아보기',
      'footer.nav.connect': '연결',
      'footer.link.basis': '베이시스 헷지란?',
      'footer.link.ewy': 'EWY 무기한선물',
      'footer.link.home': '홈',
      'footer.link.telegram': '텔레그램 지원',
      'footer.copy': '© 2025 PIANO. All rights reserved.',

      'back.home': '← 홈으로 돌아가기',

      // ---------- index.html ----------
      'index.title': 'PIANO — RWA 전략 자동 실행 소프트웨어',
      'index.metaDesc': '사용자가 승인한 가상자산 및 RWA 선물 전략에 대해 시장 신호 분석과 매매 실행을 자동화합니다. 실행은 사용자가 정한 자산, 한도, API 권한 안에서만 이루어집니다.',

      'index.hero.badge': '알고리즘 기반 전략 자동화',
      'index.hero.h1': '승인한 시장 전략을<br>자동으로<br>실행합니다.',
      'index.hero.sub': 'Piano는 지원되는 가상자산 및 RWA 선물에서 시장 신호를 분석하고, 사용자가 설정한 자산·한도·API 권한 안에서 승인된 전략을 자동 실행합니다.',
      'index.hero.ctaPrimary': '시작하기 →',
      'index.hero.ctaSecondary': '작동 방식',
      'index.hero.figCaption': '승인된 전략이 지원 시장의 익스포저를 조율합니다.',

      'index.portfolio.label': '포트폴리오 구조',
      'index.portfolio.h2': '지원되는 RWA 시장으로<br>분산 구조를 설계하세요',
      'index.portfolio.sub': '분산은 오래된 리스크 관리 아이디어입니다. 시장마다 움직이는 요인이 다를 수 있기 때문입니다. Piano는 결과를 약속하지 않고, 사용자가 승인한 전략 규칙의 실행을 자동화합니다.',
      'index.portfolio.c1.kicker': '01 / 분산',
      'index.portfolio.c1.h3': '서로 다른 시장, 서로 다른 동인',
      'index.portfolio.c1.p': '지원되는 가상자산 및 RWA 선물은 거래소 제공 범위에 따라 주가지수, ETF, 원자재 등 다양한 기초자산을 참조할 수 있습니다. Piano는 이를 하나의 승인된 규칙 안에서 모니터링하도록 돕습니다.',
      'index.portfolio.c2.kicker': '02 / 규율',
      'index.portfolio.c2.h3': '올웨더에서 착안한 구조',
      'index.portfolio.c2.p': '핵심은 하나의 승자 시장을 예측하는 것이 아닙니다. 변동성이 오기 전에 익스포저 규칙, 위험 한도, 실행 조건을 미리 정해 두는 것입니다.',
      'index.portfolio.c3.kicker': '03 / 롱 & 숏',
      'index.portfolio.c3.h3': '상승과 하락 양방향 설계',
      'index.portfolio.c3.p': '선물은 롱과 숏 익스포저를 모두 표현할 수 있어, 승인된 전략은 상승장과 하락장 모두를 전제로 설계될 수 있습니다. 숏 익스포저 역시 큰 손실을 만들 수 있으므로 엄격한 한도가 필요합니다.',

      'index.features.label': '핵심 기능',
      'index.features.h2': '승인된 자동화를 위한<br>세 가지 메커니즘',
      'index.features.sub': 'freqtrade 오픈소스 프레임워크 기반. 모든 실행은 사용자가 승인한 대상 자산, 전략 규칙, 위험 한도 안에서만 이루어집니다.',
      'index.features.f1.caption': '설정된 조건을 만족할 때만 신호를 통과시킵니다.',
      'index.features.f1.h3': '통계 기반 진입 조건 필터',
      'index.features.f1.p': '진입 전 시장 상황을 평가합니다. 사용자가 설정한 조건이 충족될 때만 실행됩니다.',
      'index.features.f1.note': '진입 / 리스크 게이트',
      'index.features.f2.caption': '비율 이탈을 감지하고 균형으로 되돌립니다.',
      'index.features.f2.h3': '포지션 불균형 자동 보정',
      'index.features.f2.p': '시장 움직임으로 승인된 포트폴리오 또는 헷지 비율이 이탈하면 Piano가 규칙을 실시간 평가하고 설정된 한도 안에서 포지션을 조정합니다.',
      'index.features.f2.note': '리밸런싱 / AI 보정',
      'index.features.f3.caption': 'AI가 사이즈 비율을 조정하고 유리한 포지션을 청산합니다.',
      'index.features.f3.h3': '연동 밸런싱',
      'index.features.f3.p': 'Piano는 승인된 전략에 따라 롱·숏 포지션 사이즈를 자동화할 수 있습니다. 사용자가 설정한 종료 조건이 충족되면 해당 규칙에 따라 주문이 실행됩니다.',
      'index.features.f3.note': 'DCA + 자동 리밸런싱',

      'index.hiw.label': '시작 방법',
      'index.hiw.h2': '세 단계로<br>바로 시작',
      'index.hiw.sub': '기본 파라미터가 제공되므로 곧바로 시작할 수 있습니다.',
      'index.hiw.s1.time': '약 5분',
      'index.hiw.s1.h3': '바이낸스 API 키 생성',
      'index.hiw.s1.p': '바이낸스 계정에서 API 키를 생성합니다. 출금 권한은 비활성화하고, 지정된 서버 IP만 허용하세요.',
      'index.hiw.s2.time': '설정',
      'index.hiw.s2.h3': '파라미터 설정',
      'index.hiw.s2.p': '대상 자산, 실행 규칙, 위험 한도, 포지션 사이즈를 설정합니다. 모든 파라미터는 언제든 변경할 수 있습니다.',
      'index.hiw.s3.time': '운영',
      'index.hiw.s3.h3': '모니터링',
      'index.hiw.s3.p': 'Piano가 승인된 전략 규칙을 자동으로 실행합니다. 상태와 실행 이력은 대시보드에서 확인하세요.',

      'index.sec.label': '보안',
      'index.sec.h2': '자산에<br>직접 접근하지 않습니다',
      'index.sec.sub': 'Piano는 API를 통해 바이낸스에 연결되지만, 자산을 보관하거나 이체하지 않습니다.',
      'index.sec.c1.h3': 'API 키 생성',
      'index.sec.c1.p': '바이낸스에서 직접 생성합니다',
      'index.sec.c2.h3': '출금 권한 차단',
      'index.sec.c2.p': '출금 권한이 없는 키만 사용합니다',
      'index.sec.c3.h3': 'IP 제한',
      'index.sec.c3.p': '허용된 서버 IP에서만 접근합니다',
      'index.sec.c4.h3': '즉시 차단',
      'index.sec.c4.p': 'API 키를 해지하면 즉시 접근이 차단됩니다',
      'index.sec.c5.h3': '파라미터 제어',
      'index.sec.c5.p': '모든 실행 조건은 사용자가 직접 설정·변경합니다',
      'index.sec.c6.h3': '격리 환경',
      'index.sec.c6.p': '사용자마다 전용 인스턴스에서 실행됩니다',
      'index.sec.do.h3': 'Piano가 하는 일',
      'index.sec.do.li1': '승인된 전략 규칙을 자동으로 실행합니다',
      'index.sec.do.li2': '포트폴리오 또는 헷지 비율 이탈을 모니터링하고 보정합니다',
      'index.sec.do.li3': '사전 설정된 조건에 따라서만 실행됩니다',
      'index.sec.do.li4': '24시간 자동으로 모니터링합니다',
      'index.sec.dont.h3': 'Piano가 하지 않는 일',
      'index.sec.dont.li1': '투자 조언이나 자산 추천을 하지 않습니다',
      'index.sec.dont.li2': '수익을 보장하거나 성과를 약속하지 않습니다',
      'index.sec.dont.li3': '자산을 임의로 처분하지 않습니다',
      'index.sec.dont.li4': '출금이나 자산 이체를 하지 않습니다',

      'index.pricing.label': '요금',
      'index.pricing.h2': '단순하고 투명한 요금제',
      'index.pricing.sub': '수익이나 거래량에 연동된 수수료가 없습니다.',
      'index.pricing.setup.label': '셋업 비용',
      'index.pricing.setup.val': '정액 (문의)',
      'index.pricing.monthly.label': '월 유지비',
      'index.pricing.monthly.val': '정액 (문의)',
      'index.pricing.note': '정확한 요금은 문의해 주세요.',
      'index.pricing.cta': '문의하기 →',

      'index.faq.label': 'FAQ',
      'index.faq.h2': '자주 묻는 질문',
      'index.faq.q1.q': 'Piano는 무엇인가요?',
      'index.faq.q1.a': 'Piano는 지원되는 가상자산 및 RWA 선물에서 사용자가 승인한 전략의 시장 신호 분석과 매매 실행을 자동화하는 소프트웨어입니다. 헷지 밸런싱은 지원되는 전략 구조 중 하나입니다.',
      'index.faq.q2.q': '암호화폐 거래 경험이 필요한가요?',
      'index.faq.q2.a': '운용 대상 자산과 자동매매 위험에 대한 기본적인 이해가 필요합니다. Piano는 사용자가 승인한 전략과 위험 한도 안에서만 시장 신호 분석과 매매 실행을 자동화합니다.',
      'index.faq.q3.q': '자산은 안전한가요?',
      'index.faq.q3.a': '자금은 항상 사용자의 바이낸스 계정에 보관됩니다. Piano는 출금 권한이 없는 API 키만 사용합니다. API 키를 해지하면 즉시 접근이 차단됩니다.',
      'index.faq.q4.q': 'Piano는 자동으로 매매하나요?',
      'index.faq.q4.a': 'Piano는 사용자가 전략, 대상 자산, 위험 한도, API 권한을 승인한 뒤 그 범위 안에서 신호 분석과 주문 실행을 자동화합니다. 수익을 보장하지 않으며 모든 투자 손익은 사용자 책임입니다.',
      'index.faq.q5.q': '어떤 거래소를 지원하나요?',
      'index.faq.q5.a': 'Piano는 바이낸스 연동 상품을 중심으로, 지원되는 가상자산 시장과 EWY 등 일부 RWA 무기한선물/선물 상품을 다룹니다. 지원 시장은 거래소 제공 여부와 사용자 승인 범위에 따라 달라집니다.',

      'index.cta.h2': '승인한 전략을 자동화하세요',
      'index.cta.sub': '텔레그램으로 연결해 활성화 전 대상 자산, 규칙, 한도를 먼저 정의하세요.',
      'index.cta.btn': '시작하기 →',

      'index.risk.header': '⚠️ 위험 고지',
      'index.risk.sub1': '서비스 성격',
      'index.risk.i1': '<strong>1. Piano는 소프트웨어 도구입니다.</strong> — 투자 자문, 일임 투자, 금융상품 중개 서비스가 아닙니다.',
      'index.risk.i2': '<strong>2. Piano는 투자를 권유하지 않습니다.</strong> — 특정 자산의 매수·매도를 추천하거나 권유하지 않습니다.',
      'index.risk.i3': '<strong>3. Piano는 알고리즘을 통해 시장 신호를 분석하고, 사용자가 설정한 조건과 한도 안에서 매매를 자동 실행합니다.</strong> — 사용자는 자동매매 기능을 활성화하기 전에 전략, 대상 자산, 위험 한도, API 권한을 직접 승인해야 하며, 모든 투자 손익은 사용자 책임입니다.',
      'index.risk.i4': '<strong>4. Piano는 수익을 보장하지 않습니다.</strong> — 과거 성과, 백테스트, 시뮬레이션 결과는 향후 수익을 보장하지 않습니다.',
      'index.risk.sub2': '투자 위험 고지',
      'index.risk.body': '가상자산 및 RWA 연계 선물·파생상품 거래는 상당한 위험을 수반하며 원금 전액 손실 가능성이 있습니다. 자동 실행은 파라미터가 부적절하거나 시장 상황이 바뀔 경우 손실을 확대할 수 있습니다. 전략 활성화 전 본인의 재정 상황, 투자 경험, 위험 감내 수준을 신중히 고려하세요.',

      // ---------- basis-hedge.html ----------
      'bh.title': '베이시스 헷지란? — PIANO',
      'bh.metaDesc': '베이시스 헷지가 어떻게 작동하는지 일상적인 비유로 단계별 설명합니다. 세계 최대 금융기관들이 사용하는 리스크 관리 전략을 이해해 보세요.',

      'bh.hero.label': '금융 개념',
      'bh.hero.h1': '베이시스 헷지란<br>무엇인가요?',
      'bh.hero.sub': '세계 최대 금융기관들이 사용하는 전략입니다. 리스크를 거의 0에 가깝게 만들 수 있습니다. 이름은 어려워 보이지만, 개념은 실제로 단순합니다.',
      'bh.hero.figCaption': '0 위의 롱 포지션마다, 그 아래에 동일한 숏이 상쇄합니다. 합치면 ≈ 0.',

      'bh.s1.badge': 'Step 01',
      'bh.s1.h2': '일상의 예에서 시작합니다',
      'bh.s1.p': '유럽 여행을 계획한다고 생각해 보세요. 환율이 오를지 내릴지 누구도 모릅니다. 그래서 환전을 미리 해둡니다.',
      'bh.s1.eq1.h3': '여행 전',
      'bh.s1.eq1.p': '미리 USD → EUR 환전',
      'bh.s1.eq2.h3': '환율이 변해도',
      'bh.s1.eq2.p': '이미 환전 — 걱정 없음',
      'bh.s1.eq3.h3': '확실성',
      'bh.s1.eq3.p': '지금 확정, 나중이 아니라',
      'bh.s1.callout': '이게 바로 <strong>헷지</strong>입니다. 미래를 걱정하는 대신 지금 확실성을 확보하는 거죠.',

      'bh.s2.badge': 'Step 02',
      'bh.s2.h2': '암호화폐에 적용해 봅시다',
      'bh.s2.p': '같은 자산을 동시에 사고(LONG) 팔면(SHORT). 가격이 어느 쪽으로 움직이든 서로 상쇄됩니다.',
      'bh.s2.eq1.h3': '현물 매수',
      'bh.s2.eq1.p': '📈 현물 포지션',
      'bh.s2.eq2.h3': '선물 매도',
      'bh.s2.eq2.p': '📉 선물 포지션',
      'bh.s2.eq3.h3': '합산',
      'bh.s2.eq3.p': '리스크 중립',
      'bh.s2.scenIntro': '모든 시나리오가 동일한 결과로 이어집니다:',
      'bh.s2.sc1.num': '시나리오 01',
      'bh.s2.sc1.h3': '가격이 10% 상승',
      'bh.s2.sc1.math': '현물: +10%<br>선물: −10%',
      'bh.s2.sc1.result': '합계 ≈ 0',
      'bh.s2.sc2.num': '시나리오 02',
      'bh.s2.sc2.h3': '가격이 10% 하락',
      'bh.s2.sc2.math': '현물: −10%<br>선물: +10%',
      'bh.s2.sc2.result': '합계 ≈ 0',
      'bh.s2.sc3.num': '시나리오 03',
      'bh.s2.sc3.h3': '가격이 동일',
      'bh.s2.sc3.math': '현물: 0%<br>선물: 0%',
      'bh.s2.sc3.result': '합계 ≈ 0',

      'bh.s3.badge': 'Step 03',
      'bh.s3.h2': '수익이 0이면, 왜 하는 건가요?',
      'bh.s3.p': '좋은 질문입니다. 여기서 <strong style="color:#EDEDED">펀딩비(Funding Fee)</strong> 개념이 등장합니다.',
      'bh.s3.callout1.title': '펀딩비란?',
      'bh.s3.callout1.p1': '무기한 선물 시장에서는 <strong>8시간마다</strong> 롱과 숏 사이에 수수료가 주고받아집니다. 이를 펀딩비라고 합니다.',
      'bh.s3.callout1.p2': '롱이 더 많으면 → 롱이 숏에 지급<br>숏이 더 많으면 → 숏이 롱에 지급',
      'bh.s3.callout1.p3': '베이시스 헷지에서는 일반적으로 SHORT 포지션이 펀딩비를 <strong>수령</strong>하는 쪽입니다.',
      'bh.s3.callout2': '펀딩 비율은 시장 상황에 따라 변합니다. 항상 받는 것은 아니며, 비율이 마이너스로 전환되면 오히려 비용이 됩니다.',
      'bh.s3.callout3.title': '추가로: 리밸런싱이 수익 기회를 만듭니다',
      'bh.s3.callout3.p1': 'Piano는 비율이 이탈할 때마다 롱과 숏 포지션을 지속적으로 리밸런싱합니다. 시장 조건이 유리해지면 — 예를 들어 베이시스가 크게 좁아질 때 — 포지션을 청산해 <strong>수익을 확정</strong>합니다.',
      'bh.s3.callout3.p2': '헷지는 단순히 기다리기만 하는 전략이 아닙니다. 적절한 순간에 수익을 만들어 내는 능동적인 구조입니다.',

      'bh.who.label': '사용 주체',
      'bh.who.h2': '그렇다면 누가 이 전략을 쓰나요?',
      'bh.who.c1.type': '헤지펀드',
      'bh.who.c1.h3': 'Citadel · Bridgewater · Two Sigma',
      'bh.who.c1.p': '베이시스 트레이드를 통해 방향성 리스크를 제거하고 스프레드를 포착합니다',
      'bh.who.c2.type': '투자은행',
      'bh.who.c2.h3': 'Goldman Sachs · JP Morgan · Morgan Stanley',
      'bh.who.c2.p': '파생상품 헷지 데스크가 고객 자산의 리스크를 중립적으로 관리합니다',
      'bh.who.c3.type': '마켓 메이커',
      'bh.who.c3.h3': 'Jane Street · Wintermute · Jump Trading',
      'bh.who.c3.p': '시장에 유동성을 공급하면서 재고 리스크를 헷지합니다',
      'bh.who.foot': '베이시스 헷지(Cash-and-Carry라고도 함)는 금융시장에서 가장 오래된 차익거래 전략 중 하나입니다.',

      'bh.ch.h2': '하지만 혼자 운영하기는 어렵습니다',
      'bh.ch.p': '전략 자체는 단순합니다. 하지만 직접 운영한다면 끊임없는 관리가 필요합니다.',
      'bh.ch.c1.h3': '24/7 모니터링',
      'bh.ch.c1.p': '암호화폐 시장은 잠들지 않습니다. 자는 동안에도 포지션 비율이 이탈합니다.',
      'bh.ch.c2.h3': '수동 리밸런싱',
      'bh.ch.c2.p': '비율이 이탈할 때마다 직접 계산하고 조정해야 합니다.',
      'bh.ch.c3.h3': '감정 개입',
      'bh.ch.c3.p': '가격이 크게 흔들리면 공포와 욕심이 끼어듭니다. 결국 본인이 만든 헷지를 스스로 무너뜨리게 됩니다.',
      'bh.ch.callout': '<strong>Piano</strong>는 이 모든 유지·관리를 자동화하는 소프트웨어입니다.',

      'bh.cta.h2': 'Piano가 궁금하신가요?',
      'bh.cta.sub': 'Piano가 어떻게 헷지 포지션 관리를 자동화하는지 확인해 보세요.',
      'bh.cta.primary': 'Piano 홈페이지 →',
      'bh.cta.secondary': '텔레그램으로 문의',

      // ---------- ewy.html ----------
      'ewy.title': 'PIANO — EWY 무기한선물 베이시스 헷지 밸런싱',
      'ewy.metaDesc': 'Piano의 헷지 포지션 밸런싱 기능이 바이낸스 EWY 무기한선물까지 확장되었습니다.',

      'ewy.hero.label': 'New — EWY 무기한선물',
      'ewy.hero.h1': 'EWY 선물에 적용되는<br>베이시스 헷지 밸런싱',
      'ewy.hero.sub': 'Piano의 헷지 포지션 밸런싱 기능이 바이낸스 EWY 무기한선물까지 확장되었습니다. 암호화폐와 동일한 원리로, 사용자가 설정한 조건에 따라 포지션이 자동으로 리밸런싱됩니다.',
      'ewy.hero.ctaPrimary': '자세히 알아보기 ↓',
      'ewy.hero.ctaSecondary': '문의하기',
      'ewy.hero.note': 'Piano는 리스크 관리를 자동화하는 도구입니다. 투자 조언이나 수익을 보장하지 않습니다.',

      'ewy.what.label': 'EWY 소개',
      'ewy.what.h2': 'iShares MSCI 한국 ETF',
      'ewy.what.p': 'EWY는 BlackRock이 운용하는 한국 주식시장 대표 ETF입니다. MSCI Korea 25/50 Index를 추종하며, 약 83개의 한국 대표 종목으로 구성됩니다.',
      'ewy.what.s1.label': '운용사',
      'ewy.what.s1.h3': 'BlackRock',
      'ewy.what.s1.p': '세계 최대 자산운용사',
      'ewy.what.s2.label': '추종 지수',
      'ewy.what.s2.h3': 'MSCI Korea',
      'ewy.what.s2.p': '25/50 Index',
      'ewy.what.s3.label': '구성 종목',
      'ewy.what.s3.h3': '약 83개',
      'ewy.what.s3.p': '한국 대표 기업',
      'ewy.what.s4.label': '상장 거래소',
      'ewy.what.s4.h3': 'NYSE Arca',
      'ewy.what.s4.p': '미국 증권거래소',
      'ewy.what.holdings.title': '주요 구성 종목',
      'ewy.what.h.r1.name': '삼성전자 (Samsung Electronics)',
      'ewy.what.h.r1.w': '약 22%',
      'ewy.what.h.r2.name': 'SK하이닉스 (SK Hynix)',
      'ewy.what.h.r2.w': '약 10%',
      'ewy.what.h.r3.name': '현대차 (Hyundai Motor)',
      'ewy.what.h.r3.w': '약 4%',
      'ewy.what.h.r4.name': 'KB금융 (KB Financial)',
      'ewy.what.h.r4.w': '약 3%',
      'ewy.what.h.r5.name': '포스코홀딩스 (POSCO Holdings)',
      'ewy.what.h.r5.w': '약 3%',
      'ewy.what.h.r6.name': '기타 약 78개 종목',
      'ewy.what.h.r6.w': '약 58%',
      'ewy.what.h.note': '구성 비중은 MSCI 리밸런싱에 따라 변동될 수 있습니다. 상기 수치는 참고용이며 실시간 데이터가 아닙니다.',
      'ewy.what.callout': '바이낸스는 EWY ETF 기반의 무기한선물(EWYUSDT Perpetual)을 제공합니다. USDT로 정산되며, 펀딩 비율은 8시간마다 정산됩니다.',

      'ewy.hiw.label': '작동 방식',
      'ewy.hiw.h2': '동일한 베이시스 헷지 밸런싱 방식',
      'ewy.hiw.p': '암호화폐에 적용되던 동일한 헷지 밸런싱 원리가 EWY 무기한선물에도 적용됩니다.',
      'ewy.hiw.c1.num': '기본 구조',
      'ewy.hiw.c1.h3': '현물 + 반대 방향 선물',
      'ewy.hiw.c1.math': '방향성 리스크 상쇄',
      'ewy.hiw.c2.num': '핵심 기능',
      'ewy.hiw.c2.h3': '비율 유지',
      'ewy.hiw.c2.math': '펀딩비 정산 관리',
      'ewy.hiw.c3.num': '주요 특징',
      'ewy.hiw.c3.h3': '불균형 → 보정',
      'ewy.hiw.c3.math': '자동으로 균형을 복원',
      'ewy.hiw.note': '사용자가 설정한 파라미터 범위 안에서만 실행됩니다. 언제든 파라미터를 변경하거나 실행을 중단할 수 있습니다.',
      'ewy.hiw.th1': '기능',
      'ewy.hiw.th2': '설명',
      'ewy.hiw.r1.k': '불균형 감지',
      'ewy.hiw.r1.v': '현물·선물 비율 이탈을 실시간 모니터링',
      'ewy.hiw.r2.k': '자동 보정',
      'ewy.hiw.r2.v': '사용자가 설정한 조건에 따라 포지션 비율 조정',
      'ewy.hiw.r3.k': '균형 복원',
      'ewy.hiw.r3.v': '1:1 균형을 자동으로 복원하며 더 나은 진입 가격을 확보',
      'ewy.hiw.r4.k': '펀딩 비율 관리',
      'ewy.hiw.r4.v': '8시간마다 정산을 반영해 포지션을 관리',

      'ewy.hours.label': '거래 시간',
      'ewy.hours.h2': '거래 시간',
      'ewy.hours.p': 'EWY 무기한선물의 거래 시간은 기초자산인 EWY ETF의 거래 시간과 다릅니다.',
      'ewy.hours.th1': '시장',
      'ewy.hours.th2': '거래 시간 (KST)',
      'ewy.hours.th3': '비고',
      'ewy.hours.r1.k': '한국거래소 (KRX)',
      'ewy.hours.r1.v': '09:00 – 15:30',
      'ewy.hours.r1.n': '한국 공휴일 휴장',
      'ewy.hours.r2.k': 'EWY ETF (NYSE Arca)',
      'ewy.hours.r2.v': '23:30 – 06:00 (다음 날)',
      'ewy.hours.r2.n': '미국 시장 시간 기준',
      'ewy.hours.r3.k': 'EWYUSDT 무기한선물',
      'ewy.hours.r3.v': '24시간',
      'ewy.hours.r3.n': '연중무휴',
      'ewy.hours.callout': '무기한선물은 24시간 거래됩니다. 다만 기초자산인 EWY ETF 시장이 휴장 중인 시간대에는 <strong>유동성이 감소하고, 스프레드가 확대되며, 가격 괴리가 발생할 수 있습니다.</strong> 이는 추가적인 위험 요인입니다.',

      'ewy.risk.label': '위험 요인',
      'ewy.risk.h2': 'EWY 무기한선물 고유 위험',
      'ewy.risk.p': 'EWY 무기한선물은 일반 암호화폐 무기한선물과는 다른 고유 위험을 수반합니다. 시작 전 다음 사항을 반드시 이해해 주세요.',
      'ewy.risk.r1.h3': '1. 레버리지 위험',
      'ewy.risk.r1.l1': '레버리지 사용 시 원금을 초과하는 손실이 발생할 수 있습니다',
      'ewy.risk.r1.l2': '시장이 포지션과 반대로 급변하면 강제 청산으로 전액 손실이 발생할 수 있습니다',
      'ewy.risk.r1.l3': '레버리지 배수가 클수록 청산 위험이 급격히 증가합니다',
      'ewy.risk.r1.l4': 'Piano는 레버리지 선택에 대해 조언하지 않습니다 — 전적으로 사용자 책임입니다',
      'ewy.risk.r2.h3': '2. 시간외 유동성 위험',
      'ewy.risk.r2.l1': '한국 주간 시간대에는 기초자산 시장이 휴장합니다',
      'ewy.risk.r2.l2': '유동성이 크게 감소하고, 매수·매도 스프레드가 상당히 확대될 수 있습니다',
      'ewy.risk.r2.l3': '선물 가격과 기초자산 가치 간 괴리가 발생할 수 있습니다',
      'ewy.risk.r2.l4': '슬리피지가 크게 증가할 수 있습니다',
      'ewy.risk.r3.h3': '3. 펀딩 비율 위험',
      'ewy.risk.r3.l1': '펀딩 비율은 8시간마다 정산되며 양수와 음수 사이에서 변동할 수 있습니다',
      'ewy.risk.r3.l2': '포지션 방향에 따라 펀딩비를 지속적으로 지급해야 할 수 있습니다',
      'ewy.risk.r3.l3': '펀딩 비율의 급변은 예상치 못한 비용으로 이어질 수 있습니다',
      'ewy.risk.r4.h3': '4. 가격 괴리 위험',
      'ewy.risk.r4.l1': '무기한선물 가격이 기초자산 EWY ETF 가격과 항상 일치하지는 않습니다',
      'ewy.risk.r4.l2': '기초자산 시장 휴장 시 큰 괴리가 발생할 수 있습니다',
      'ewy.risk.r4.l3': '글로벌 이벤트로 예상치 못한 가격 변동이 발생할 수 있습니다',
      'ewy.risk.r5.h3': '5. 거래소 위험',
      'ewy.risk.r5.l1': 'EWY 무기한선물은 바이낸스에서만 거래됩니다',
      'ewy.risk.r5.l2': '거래소 시스템 장애나 정책 변경으로 거래가 중단될 수 있습니다',
      'ewy.risk.r5.l3': '거래소가 상장 폐지를 결정하면 계약이 종료될 수 있습니다',

      'ewy.boundary.label': '서비스 경계',
      'ewy.boundary.h2': '서비스 경계',
      'ewy.boundary.do.h3': 'Piano가 하는 일',
      'ewy.boundary.do.l1': '사용자가 설정한 조건에 따라 포지션 균형을 유지합니다',
      'ewy.boundary.do.l2': '현물·선물 비율 불균형을 자동으로 보정합니다',
      'ewy.boundary.do.l3': '펀딩 비율 정산을 관리합니다',
      'ewy.boundary.do.l4': '포지션 상태를 24시간 모니터링합니다',
      'ewy.boundary.do.l5': '사용자가 설정한 파라미터에 따라서만 실행됩니다',
      'ewy.boundary.dont.h3': 'Piano가 하지 않는 일',
      'ewy.boundary.dont.l1': '투자 결정이나 매매 시점을 추천하지 않습니다',
      'ewy.boundary.dont.l2': '수익을 보장하거나 성과를 약속하지 않습니다',
      'ewy.boundary.dont.l3': '레버리지 배수를 조언하지 않습니다',
      'ewy.boundary.dont.l4': '자산을 임의로 처분하지 않습니다',
      'ewy.boundary.dont.l5': '시장 전망이나 투자 전략을 제공하지 않습니다',
      'ewy.boundary.callout': 'Piano는 <strong>리스크 관리를 자동화하는 도구</strong>입니다. 투자 자문, 일임 투자, 금융상품 중개 서비스가 아닙니다.',

      'ewy.full.label': '위험 고지',
      'ewy.full.h2': '전체 위험 고지',
      'ewy.full.p1': '<strong style="color:#EDEDED">1. Piano는 소프트웨어 도구입니다.</strong> — 투자 자문, 일임 투자, 금융상품 중개 서비스가 아닙니다.',
      'ewy.full.p2': '<strong style="color:#EDEDED">2. Piano는 투자를 권유하지 않습니다.</strong> — 특정 자산의 매수·매도를 추천하거나 권유하지 않습니다.',
      'ewy.full.p3': '<strong style="color:#EDEDED">3. Piano는 알고리즘을 통해 시장 신호를 분석하고, 사용자가 설정한 조건과 한도 안에서 매매를 자동 실행합니다.</strong> — 사용자는 자동매매 기능을 활성화하기 전에 전략, 대상 자산, 위험 한도, API 권한을 직접 승인해야 하며, 모든 투자 손익은 사용자 책임입니다.',
      'ewy.full.p4': '<strong style="color:#EDEDED">4. Piano는 수익을 보장하지 않습니다.</strong> — 과거 성과, 백테스트, 시뮬레이션 결과는 향후 수익을 보장하지 않습니다.',
      'ewy.full.p5': '<strong style="color:#EDEDED">5. 원금 손실 위험</strong> — EWY 무기한선물 거래는 레버리지 파생거래로서 원금 전액 손실 가능성이 있습니다.',
      'ewy.full.p6': '<strong style="color:#EDEDED">6. 레버리지 위험</strong> — 레버리지 사용 여부와 배수 선택은 전적으로 사용자 본인의 판단과 책임입니다.',
      'ewy.full.p7': '<strong style="color:#EDEDED">7. 유동성 및 시장 위험</strong> — 기초자산 시장 휴장 시간대에는 유동성 부족 및 가격 괴리 등의 위험이 발생할 수 있습니다.',
      'ewy.full.p8': '<strong style="color:#EDEDED">8. 소프트웨어 위험</strong> — 버그, 네트워크 장애, API 오류, 거래소 시스템 변경 등으로 서비스가 정상 작동하지 않을 수 있습니다.',
      'ewy.full.p9': '<strong style="color:#EDEDED">9. 개인 책임</strong> — 모든 거래 결정과 그로 인한 손익은 전적으로 사용자 본인의 판단과 책임입니다.',

      'ewy.cta.h2': 'EWY 선물에 대해 궁금하신가요?',
      'ewy.cta.sub': '텔레그램으로 문의해 주세요. 시작 전 위의 위험 고지를 반드시 확인하세요.',
      'ewy.cta.btn': '문의하기 →',
    },
  };

  function detectInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browser.startsWith('ko')) return 'ko';
    return DEFAULT_LANG;
  }

  function tr(lang, key) {
    const dict = T[lang] || T[DEFAULT_LANG];
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    if (T[DEFAULT_LANG] && Object.prototype.hasOwnProperty.call(T[DEFAULT_LANG], key)) {
      return T[DEFAULT_LANG][key];
    }
    return null;
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);

    // <title>
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      const t = tr(lang, titleKey);
      if (t !== null) document.title = t;
    }

    // textContent
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      const t = tr(lang, k);
      if (t !== null) el.textContent = t;
    });

    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const k = el.getAttribute('data-i18n-html');
      const t = tr(lang, k);
      if (t !== null) el.innerHTML = t;
    });

    // attributes
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (!attr || !key) return;
        const t = tr(lang, key);
        if (t !== null) el.setAttribute(attr, t);
      });
    });

    // toggle button states
    document.querySelectorAll('.lang-toggle__btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  const listeners = [];
  function emit(lang) {
    listeners.forEach((fn) => {
      try { fn(lang); } catch (e) { /* swallow */ }
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
    emit(lang);
  }

  function init() {
    const lang = detectInitialLang();
    applyLang(lang);
    emit(lang);
    document.querySelectorAll('.lang-toggle__btn').forEach((b) => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PianoI18n = {
    setLang,
    applyLang,
    get current() { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; },
    t(key) { return tr(this.current, key); },
    onChange(fn) {
      listeners.push(fn);
      return () => {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    },
  };
})();

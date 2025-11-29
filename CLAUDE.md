# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PIANO is a static marketing website for an AI-powered crypto trading platform. It's a single-page application built with vanilla HTML, CSS, and JavaScript featuring bilingual support (Korean/English), interactive calculators, animated sections, and responsive design.

## Development Commands

Since this is a static website with no build process, development is straightforward:

**Local Development:**
- Open `index.html` directly in a browser, or
- Use a local server: `python -m http.server 8000` or `npx serve`
- Access at `http://localhost:8000`

**No build, lint, or test commands exist** - this is pure static HTML/CSS/JS.

## Architecture & Structure

### Core Architecture Pattern

**Static Single-Page Application (SPA)** with modular JavaScript files:
- `index.html` - Main landing page with all marketing content sections
- `faq.html` - Standalone FAQ page with category tabs and accordion UI
- `terms.html`, `privacy.html`, `risk-disclosure.html`, `transparency.html` - Legal pages
- `js/main.js` - Core functionality (navigation, animations, FAQ accordion)
- `js/language.js` - Bilingual i18n system with translation dictionary
- `js/calculator.js` - Interactive profit comparison calculator
- `js/enhancements.js` - Additional UI enhancements
- `js/legal-pages.js` - Language switching for legal pages

### Page Structure

The website consists of two main types of pages:

1. **Marketing Pages**: `index.html` (main landing page)
2. **Legal/Informational Pages**: `faq.html`, `terms.html`, `privacy.html`, `risk-disclosure.html`, `transparency.html`

All pages share the same design system and CSS architecture but have different layouts and functionality.

### Key Architectural Decisions

**1. Language System (`js/language.js`)**
- `LanguageManager` class manages translations and persistence
- Two-way binding via `data-i18n` attributes on HTML elements
- Language preference stored in `localStorage`
- Browser language auto-detection on first visit
- Translation keys structured hierarchically (e.g., `hero.subtitle`, `modules.orderflow.title`)
- **Important**: Legal pages use `js/legal-pages.js` for separate language handling

**2. Module System (Main Landing Page)**
The website uses a **tabbed interface for AI modules** (`#ai-modules` section):
- 5 AI modules: Order Flow, Dynamic Allocation, Execution Probability, Tiered Pyramid, Dynamic TP
- Tab switching handled in `main.js` via `data-tab` and `data-panel` attributes
- Expandable technical details with toggle buttons
- Each module has benefit-focused and technical content variants

**3. Animation System**
- Intersection Observer API for scroll-triggered animations
- Counter animations for statistics (`animateValue()` function)
- Chart bar animations with staggered delays
- Smooth scroll navigation with offset calculation for fixed navbar

**4. Calculator Component**
- Real-time profit comparison (Bank Savings vs PIANO)
- Three scenario tabs: Conservative (2%), Balanced (3%), Aggressive (4%)
- Timeline projections (3 months, 6 months, 1 year)
- Currency conversion between KRW and USD based on language
- Compound interest calculations with tax considerations

**5. FAQ System (`faq.html`)**
- Category-based tabs: 일반, 기술 및 사용법, 요금 및 환불, 법적 사항, 투자 위험
- Accordion UI for questions/answers
- Inline styles within the HTML file for self-contained design
- Standalone JavaScript at the bottom of the file

### Component Interaction Flow

```
User Action → Event Listener → State Update → DOM Update → Animation
                                      ↓
                              localStorage (for language)
```

**Example: Language Toggle**
1. User clicks `#langToggle` button
2. `LanguageManager.toggleLanguage()` called
3. Language switched in memory and `localStorage`
4. All `[data-i18n]` elements updated via `setLanguage()`
5. Calculator values recalculated in new currency
6. Visual feedback animation applied

### CSS Architecture

**Seven-layer styling system:**
1. `css/style.css` - Base styles, layout, components (36KB)
2. `css/responsive.css` - Breakpoint-specific overrides
3. `css/animations.css` - Keyframes and transitions
4. `css/enhancements.css` - Visual polish and effects
5. `css/legal-pages.css` - Styles for legal/informational pages (15KB)
6. `css/validation.css` - Third-party validation badge styles
7. `css/chart-badge.css` - Hero chart Binance badge styles

**CSS Custom Properties** used extensively for theming:
- Colors: `--ai-cyan`, `--dark-bg`, `--card-bg`
- Spacing and typography variables
- Responsive breakpoints at 768px (tablet) and 480px (mobile)

**Note**: Legal pages (`faq.html`, `terms.html`, etc.) contain inline styles in addition to the shared CSS files for page-specific components.

### State Management

**No framework - vanilla JS with:**
- `localStorage` for language preference persistence
- Class toggles for UI state (`active`, `visible`, `scrolled`)
- Data attributes for component configuration (`data-tab`, `data-i18n`, `data-value`)
- Intersection Observer for scroll-based state

## Important Implementation Details

### Language System Integration

When adding new translatable content:
1. Add key to both `translations.en` and `translations.ko` objects in `js/language.js`
2. Use `data-i18n="your.key.here"` attribute on HTML element
3. For HTML content (with `<br>` tags), the system uses `innerHTML`; otherwise `textContent`
4. **Legal pages**: If adding content to legal pages, also update `js/legal-pages.js` with corresponding translations

### Calculator Logic

The calculator implements compound interest with these formulas:
- **Bank**: `principal * (1 + 0.04)^years - principal * 0.154` (4% annual with 15.4% tax)
- **PIANO**: `principal * (1 + monthlyRate)^12` (tax-free compound growth)
- Monthly rates: Conservative (2%), Balanced (3%), Aggressive (4%)

### Module Tab System

When adding new AI modules:
1. Add tab button with `data-tab="module-id"` in `.module-tabs`
2. Add panel with `data-panel="module-id"` in `.module-content`
3. Include both benefit-focused and expandable technical sections
4. Follow the existing structure: title → benefit card → tech details toggle

### Animation Performance

- Scroll events use Intersection Observer (not scroll listeners) for better performance
- FAQ accordion uses `max-height` transitions instead of `height` for smoother animation
- Chart animations use `requestAnimationFrame` for 60fps
- Parallax effect on hero section uses `transform: translateY()` for GPU acceleration

### Legal Pages Pattern

Legal pages (`faq.html`, `terms.html`, `privacy.html`, `risk-disclosure.html`, `transparency.html`) follow a consistent pattern:
- Shared navigation tabs in sidebar for cross-linking between legal documents
- Inline `<style>` tags for page-specific CSS (in addition to shared stylesheets)
- Language toggle button typically in top-right corner
- Standalone JavaScript at bottom of file (no separate JS files except `legal-pages.js`)
- Content structured with clear headers, metadata, and semantic HTML

## Content Structure

### Main Landing Page (index.html)

The page follows this section order:
1. **Hero** - Value proposition with comparison chart
2. **Live Stats** - Animated counters (total profits, active traders, etc.)
3. **Testimonials** - Customer reviews carousel
4. **Calculator** - Interactive profit comparison tool
5. **AI System Intro** - Institutional technology comparison
6. **Third-Party Validation** - Binance performance ranking
7. **AI Modules** - Tabbed interface for 5 AI modules
8. **How It Works** - 3-step process
9. **Pricing** - Two pricing plans with limited offer
10. **FAQ** - Accordion-style questions
11. **Marquee** - Animated scrolling brand mentions
12. **Risk Warning** - Regulatory disclaimer
13. **Footer** - Links and institutional logos

### FAQ Page (faq.html)

The FAQ page has 5 categories:
1. **일반** (General) - Basic product questions
2. **기술 및 사용법** (Technical & Usage) - Setup and API questions
3. **요금 및 환불** (Pricing & Refunds) - Payment and billing
4. **법적 사항** (Legal Matters) - Regulatory compliance, contracts
5. **투자 위험** (Investment Risk) - Risk disclosures, disclaimers

## Key Files Reference

### Main Landing Page
- `index.html:89-176` - Hero section with dual headline and chart
- `index.html:262-363` - Calculator section
- `index.html:484-577` - Third-party validation (Binance ranking)
- `index.html:580-931` - AI modules tabbed interface
- `js/language.js:5-603` - Complete translation dictionaries
- `js/calculator.js` - Profit calculator logic
- `js/main.js:375-401` - Module tab switching system
- `js/main.js:149-203` - FAQ accordion implementation

### Legal Pages
- `faq.html:186-192` - Category tab navigation
- `faq.html:572-613` - Inline JavaScript for tabs and accordion
- `js/legal-pages.js` - Language switching for legal pages
- `css/legal-pages.css` - Shared styles for all legal pages

## Development Notes

### Adding New Sections to Landing Page
1. Add HTML structure to `index.html`
2. Style in appropriate CSS file (`style.css` for layout, `animations.css` for motion)
3. Add interactivity in `main.js` or create new JS module
4. Add translations to both languages in `language.js`
5. Test responsive behavior at 1440px, 768px, 480px breakpoints

### Creating New Legal/Informational Pages
1. Use `faq.html` or another legal page as a template
2. Keep the legal navigation tabs in sidebar for consistency
3. Add inline styles for page-specific components
4. Add standalone JavaScript at bottom if needed
5. Update translations in `js/legal-pages.js`
6. Link from footer in `index.html`

### Modifying Translations
Both language objects must be kept in sync. The structure is:
```javascript
'section.component.property': 'Translation text'
```

For legal pages, update both `js/language.js` (if used on main page) and `js/legal-pages.js` (for legal pages).

### Working with the Calculator
Calculator currency display automatically switches between KRW (₩) and USD ($) based on language. Exchange rate is hardcoded at `0.00075` in the calculator logic.

### File Organization
- **HTML Files**: Root directory (`index.html`, `faq.html`, etc.)
- **JavaScript**: `/js/` directory
- **CSS**: `/css/` directory
- **Assets**: `/assets/` directory (favicon, images, etc.)
- **Documentation**: `README.md`, `CLAUDE.md` in root

### Company Information (for legal pages)
```
상호: 와이알파 주식회사
사업자등록번호: 565-86-03395
대표자: 신용수
주소: 서울시 양천구 월정로9길20
고객센터: 0505-4004-4231
이메일: yalpha9999@gmail.com
```

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
- `index.html` - Single entry point with all content sections
- `js/main.js` - Core functionality (navigation, animations, FAQ accordion)
- `js/language.js` - Bilingual i18n system with translation dictionary
- `js/calculator.js` - Interactive profit comparison calculator
- `js/enhancements.js` - Additional UI enhancements

### Key Architectural Decisions

**1. Language System (`js/language.js`)**
- `LanguageManager` class manages translations and persistence
- Two-way binding via `data-i18n` attributes on HTML elements
- Language preference stored in `localStorage`
- Browser language auto-detection on first visit
- Translation keys structured hierarchically (e.g., `hero.subtitle`, `modules.orderflow.title`)

**2. Module System**
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

**Four-layer styling system:**
1. `css/style.css` - Base styles, layout, components
2. `css/responsive.css` - Breakpoint-specific overrides
3. `css/animations.css` - Keyframes and transitions
4. `css/enhancements.css` - Visual polish and effects

**CSS Custom Properties** used extensively for theming:
- Colors: `--ai-cyan`, `--dark-bg`, `--card-bg`
- Spacing and typography variables
- Responsive breakpoints at 768px (tablet) and 480px (mobile)

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

## Content Structure

The page follows this section order:
1. **Hero** - Value proposition with comparison chart
2. **Live Stats** - Animated counters (total profits, active traders, etc.)
3. **Testimonials** - Customer reviews carousel
4. **Calculator** - Interactive profit comparison tool
5. **AI System Intro** - Institutional technology comparison
6. **AI Modules** - Tabbed interface for 5 AI modules
7. **How It Works** - 3-step process
8. **Pricing** - Two pricing plans with limited offer
9. **FAQ** - Accordion-style questions
10. **Marquee** - Animated scrolling brand mentions
11. **Risk Warning** - Regulatory disclaimer
12. **Footer** - Links and institutional logos

## Key Files Reference

- `index.html:89-159` - Hero section with dual headline and chart
- `index.html:475-826` - AI modules tabbed interface
- `js/language.js:5-603` - Complete translation dictionaries
- `js/calculator.js` - Profit calculator logic (not shown but referenced)
- `js/main.js:375-401` - Module tab switching system
- `js/main.js:149-203` - FAQ accordion implementation

## Development Notes

### Adding New Sections
1. Add HTML structure to `index.html`
2. Style in appropriate CSS file (`style.css` for layout, `animations.css` for motion)
3. Add interactivity in `main.js` or create new JS module
4. Add translations to both languages in `language.js`
5. Test responsive behavior at 1440px, 768px, 480px breakpoints

### Modifying Translations
Both language objects must be kept in sync. The structure is:
```javascript
'section.component.property': 'Translation text'
```

### Working with the Calculator
Calculator currency display automatically switches between KRW (₩) and USD ($) based on language. Exchange rate is hardcoded at `0.00075` in `language.js:707`.

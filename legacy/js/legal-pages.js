// ===================================
// PIANO - Legal Pages JavaScript
// Table of Contents & Language Support
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // Table of Contents - Scroll Spy
    // ===================================
    const tocLinks = document.querySelectorAll('.legal-toc a');
    const sections = document.querySelectorAll('.legal-content h2[id]');

    function highlightTOC() {
        let scrollPos = window.scrollY + 150;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                tocLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.legal-toc a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll event listener
    window.addEventListener('scroll', highlightTOC);
    highlightTOC(); // Initial call

    // ===================================
    // Language Toggle
    // ===================================
    const langButtons = document.querySelectorAll('.legal-lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');

            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Change language using LanguageManager if available
            if (window.LanguageAPI) {
                window.LanguageAPI.setLanguage(lang);
            }
        });
    });

    // Set initial active state based on current language
    if (window.LanguageAPI) {
        const currentLang = window.LanguageAPI.getCurrentLanguage();
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ===================================
    // Mobile Tab Navigation Toggle
    // ===================================
    const tabsContainer = document.querySelector('.legal-tabs');

    if (window.innerWidth < 1200 && tabsContainer) {
        // Create toggle button for mobile
        const toggleButton = document.createElement('button');
        toggleButton.className = 'legal-tabs-toggle';
        toggleButton.innerHTML = '<span class="material-symbols-outlined">menu</span> <span data-i18n="legal.nav.title">법적 고지</span>';
        toggleButton.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: var(--legal-primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 16px;
        `;

        const navLinks = tabsContainer.querySelector('h3').nextElementSibling;
        const linksContainer = document.createElement('div');
        linksContainer.className = 'legal-tabs-links';
        linksContainer.style.display = 'none';

        // Move all links to container
        while (navLinks) {
            const next = navLinks.nextElementSibling;
            linksContainer.appendChild(navLinks);
            if (!next || next.tagName !== 'A') break;
        }

        toggleButton.addEventListener('click', function() {
            const isOpen = linksContainer.style.display === 'block';
            linksContainer.style.display = isOpen ? 'none' : 'block';
            this.querySelector('.material-symbols-outlined').textContent = isOpen ? 'menu' : 'close';
        });

        tabsContainer.appendChild(toggleButton);
        tabsContainer.appendChild(linksContainer);
    }

    // ===================================
    // Print Button (Optional)
    // ===================================
    const addPrintButton = false; // Set to true if needed

    if (addPrintButton) {
        const printButton = document.createElement('button');
        printButton.className = 'btn-print';
        printButton.innerHTML = '<span class="material-symbols-outlined">print</span> <span data-i18n="legal.btn.print">인쇄</span>';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: var(--legal-primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: var(--legal-shadow-lg);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;

        printButton.addEventListener('click', function() {
            window.print();
        });

        printButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        printButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        document.body.appendChild(printButton);
    }

    // ===================================
    // Accessibility: Keyboard Navigation
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Press 'T' to focus on TOC
        if (e.key === 't' || e.key === 'T') {
            const firstTocLink = document.querySelector('.legal-toc a');
            if (firstTocLink) {
                firstTocLink.focus();
            }
        }

        // Press 'H' to go home
        if (e.key === 'h' || e.key === 'H') {
            const homeButton = document.querySelector('.btn-home');
            if (homeButton) {
                window.location.href = homeButton.getAttribute('href');
            }
        }
    });

    console.log('Legal pages script loaded successfully');
});

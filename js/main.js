// ===================================
// PIANO - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = this.querySelector('.material-symbols-outlined');
            icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
        });
        
        // Close mobile menu when clicking links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target) && 
                mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
            }
        });
    }
    
    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');
    const stickyBanner = document.getElementById('stickyBanner');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show sticky banner after scrolling past hero section (approx 400px)
        if (stickyBanner) {
            if (scrollTop > 400) {
                stickyBanner.classList.add('visible');
            } else {
                stickyBanner.classList.remove('visible');
            }
        }

        lastScrollTop = scrollTop;
    });
    
    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // If clicking logo (#), scroll to top
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // Chart Animation on Load
    // ===================================
    function animateCharts() {
        const chartBars = document.querySelectorAll('.chart-bar');
        
        chartBars.forEach((bar, index) => {
            const barFill = bar.querySelector('.bar-fill');
            const value = parseFloat(bar.dataset.value);
            
            // Set initial height to 0
            barFill.style.height = '0%';
            barFill.style.transition = 'none';
            
            // Force browser reflow
            barFill.offsetHeight;
            
            // Enable transition and animate
            setTimeout(() => {
                barFill.style.transition = 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Calculate relative height based on max value (42.58%)
                const relativeHeight = (value / 42.58) * 100;
                barFill.style.height = `${relativeHeight}%`;
            }, 300 + (index * 200));
        });
    }
    
    // Start chart animation when page loads or becomes visible
    window.addEventListener('load', () => {
        setTimeout(animateCharts, 500);
    });
    
    // Re-animate when scrolling to hero section
    const heroChart = document.querySelector('.hero-chart');
    if (heroChart) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCharts();
                }
            });
        }, { threshold: 0.5 });
        
        chartObserver.observe(heroChart);
    }
    
    // ===================================
    // FAQ Accordion
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Set initial state
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            answer.style.opacity = '0';
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.opacity = '0';
                        }
                        const otherIcon = otherItem.querySelector('.material-symbols-outlined');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                    const icon = question.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    const icon = question.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                        icon.style.transition = 'transform 0.3s ease';
                    }
                }
            });
        }
    });
    
    // ===================================
    // Scroll Animation Observer
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add scroll animation classes to elements
    const sections = document.querySelectorAll('.calculator-card, .step-card, .pricing-card');
    sections.forEach(section => {
        section.classList.add('scroll-fade');
        observer.observe(section);
    });
    
    // ===================================
    // CTA Button Click Handlers
    // ===================================
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        if (!button.classList.contains('mobile-menu-toggle')) {
            button.addEventListener('click', function(e) {
                if (this.textContent.includes('Start Trading') || 
                    this.textContent.includes('거래 시작')) {
                    e.preventDefault();
                    // Show signup modal or redirect to signup page
                    handleSignup();
                }
            });
        }
    });
    
    function handleSignup() {
        // In production, this would open a modal or redirect to signup
        alert('Sign up functionality would be implemented here');
    }
    
    // ===================================
    // Number Counter Animation
    // ===================================
    function animateValue(element, start, end, duration) {
        const startTimestamp = Date.now();
        const step = () => {
            const timestamp = Date.now();
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = formatCurrency(value);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function formatCurrency(value) {
        return '₩' + value.toLocaleString('ko-KR');
    }
    
    // ===================================
    // Parallax Effect for Hero Section - Subtle Effect
    // ===================================
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;

            // Only apply parallax when scrolled is less than 600px to prevent overlap
            if (scrolled < 600) {
                const parallax = scrolled * 0.15;  // Very subtle effect (0.15)
                heroSection.style.transform = `translateY(${parallax}px)`;
            } else {
                // Remove parallax after scrolling past hero section
                heroSection.style.transform = `translateY(90px)`;  // Lock at max parallax value
            }
        });
    }
    
    // ===================================
    // Form Validation (for future implementation)
    // ===================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateForm(formData) {
        const errors = {};
        
        if (!formData.email || !validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!formData.amount || formData.amount < 500000) {
            errors.amount = 'Minimum investment is ₩500,000';
        }
        
        return errors;
    }
    
    // ===================================
    // Performance Monitoring
    // ===================================
    window.addEventListener('load', function() {
        // Log page load performance
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page Load Time: ${pageLoadTime}ms`);
        }
    });
    
    // ===================================
    // Error Handling
    // ===================================
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.message);
        // In production, send to error tracking service
    });
    
});

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// AI Modules Tab System
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const moduleTabs = document.querySelectorAll('.module-tab');
    const modulePanels = document.querySelectorAll('.module-panel');

    moduleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.dataset.tab;

            // Remove active class from all tabs
            moduleTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all panels
            modulePanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Show target panel
            const activePanel = document.querySelector(`[data-panel="${targetPanel}"]`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
});

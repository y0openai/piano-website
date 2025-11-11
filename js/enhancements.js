// ===================================
// PIANO - Enhancement Scripts
// Stats Counter, Calculator, Countdown
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // Animated Counter for Stats
    // ===================================
    function animateCounter(element, target, duration = 2000, hasSuffix = false) {
        if (!element || isNaN(target)) {
            console.error('Invalid counter:', element, target);
            return;
        }

        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number based on size
            if (target >= 1000000) {
                element.textContent = '$' + (current / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }

    // Initialize stats counters
    function initStatsCounters() {
        const statItems = document.querySelectorAll('.stat-item[data-animate="counter"]');

        statItems.forEach(stat => {
            const numberElement = stat.querySelector('.stat-number');
            const suffixElement = stat.querySelector('.stat-suffix');
            const target = numberElement ? parseFloat(numberElement.getAttribute('data-target')) : NaN;

            if (numberElement && !isNaN(target)) {
                console.log('Found stat to animate:', target);
                animateCounter(numberElement, target, 2000, !!suffixElement);
            } else {
                console.warn('Stat item missing data:', stat, 'target:', target);
            }
        });
    }

    // Trigger counters when live-stats section comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Live stats section in view, starting animation');
                initStatsCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const liveStats = document.querySelector('.live-stats');
    if (liveStats) {
        statsObserver.observe(liveStats);

        // Fallback: Also trigger immediately if already in viewport
        setTimeout(() => {
            const rect = liveStats.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInViewport) {
                console.log('Stats already in viewport, animating immediately');
                initStatsCounters();
            }
        }, 500);
    } else {
        console.warn('Live stats section not found');
    }

    // ===================================
    // Calculator Scenario Switcher
    // ===================================
    const scenarioTabs = document.querySelectorAll('.scenario-tab');
    const investmentSlider = document.getElementById('investmentSlider');
    let currentScenario = 'balanced';  // Default

    const scenarioRates = {
        conservative: 0.02,  // 2% monthly
        balanced: 0.03,      // 3% monthly
        aggressive: 0.04     // 4% monthly
    };

    scenarioTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            scenarioTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update current scenario
            currentScenario = this.dataset.scenario;

            // Recalculate
            if (investmentSlider) {
                updateCalculator(parseFloat(investmentSlider.value));
            }
        });
    });

    function updateCalculator(investment) {
        const rate = scenarioRates[currentScenario];

        // Timeline calculations
        const months3 = investment * Math.pow(1 + rate, 3);
        const months6 = investment * Math.pow(1 + rate, 6);
        const months12 = investment * Math.pow(1 + rate, 12);

        // Update timeline values
        const timeline3m = document.getElementById('timeline3m');
        const timeline6m = document.getElementById('timeline6m');
        const timeline1y = document.getElementById('timeline1y');
        const profit3m = document.getElementById('profit3m');
        const profit6m = document.getElementById('profit6m');
        const profit1y = document.getElementById('profit1y');

        if (timeline3m) timeline3m.textContent = '₩' + Math.floor(months3).toLocaleString();
        if (timeline6m) timeline6m.textContent = '₩' + Math.floor(months6).toLocaleString();
        if (timeline1y) timeline1y.textContent = '₩' + Math.floor(months12).toLocaleString();

        if (profit3m) profit3m.textContent = '+₩' + Math.floor(months3 - investment).toLocaleString();
        if (profit6m) profit6m.textContent = '+₩' + Math.floor(months6 - investment).toLocaleString();
        if (profit1y) {
            const profit = Math.floor(months12 - investment);
            profit1y.textContent = '+₩' + profit.toLocaleString() + ' 🎉';
        }
    }

    // Connect to existing calculator slider
    if (investmentSlider) {
        investmentSlider.addEventListener('input', function() {
            updateCalculator(parseFloat(this.value));
        });

        // Initial calculation
        updateCalculator(parseFloat(investmentSlider.value));
    }

    // ===================================
    // Countdown Timer for Limited Offer
    // ===================================
    function startCountdown() {
        const hoursElement = document.getElementById('timeLeft');
        if (!hoursElement) return;

        let totalSeconds = 4 * 3600 + 23 * 60 + 15;  // 4:23:15

        setInterval(() => {
            totalSeconds--;

            if (totalSeconds < 0) {
                totalSeconds = 24 * 3600;  // Reset to 24 hours
            }

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            hoursElement.textContent =
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
        }, 1000);
    }

    startCountdown();

    // ===================================
    // Simulate Decreasing Slots
    // ===================================
    function updateSlots() {
        const slotsElement = document.getElementById('slotsLeft');
        if (!slotsElement) return;

        let slots = 23;

        setInterval(() => {
            // Random chance to decrease
            if (Math.random() < 0.3) {
                slots = Math.max(5, slots - 1);
                slotsElement.textContent = slots;

                // Add pulse animation
                slotsElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    slotsElement.style.transform = 'scale(1)';
                }, 300);
            }
        }, 15000);  // Check every 15 seconds
    }

    updateSlots();

    // ===================================
    // Enhanced CTA Click Handlers
    // ===================================
    const calculatorCTA = document.getElementById('calculatorCTA');
    if (calculatorCTA) {
        calculatorCTA.addEventListener('click', function(e) {
            e.preventDefault();

            // Show email capture modal (placeholder)
            const investment = investmentSlider ? investmentSlider.value : 5000000;
            const rate = scenarioRates[currentScenario];
            const annualReturn = Math.floor(investment * Math.pow(1 + rate, 12));

            alert(`예상 연간 수익: ₩${annualReturn.toLocaleString()}\\n\\n이메일 캡처 기능은 실제 구현 시 연동됩니다.`);
        });
    }

    // Hero CTA buttons
    const demoCTA = document.querySelector('[data-i18n="hero.cta.demo"]');
    const videoCTA = document.querySelector('[data-i18n="hero.cta.video"]');

    if (demoCTA) {
        demoCTA.addEventListener('click', function(e) {
            e.preventDefault();
            alert('무료 데모 페이지로 이동합니다.\\n(실제 구현 시 연동)');
        });
    }

    if (videoCTA) {
        videoCTA.addEventListener('click', function(e) {
            e.preventDefault();
            alert('AI 작동 영상 모달을 표시합니다.\\n(실제 구현 시 연동)');
        });
    }

    // ===================================
    // Testimonial Carousel Auto-rotate
    // ===================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
        let currentIndex = 0;

        setInterval(() => {
            // Remove highlight from current
            testimonialCards[currentIndex].style.transform = '';

            // Move to next
            currentIndex = (currentIndex + 1) % testimonialCards.length;

            // Add subtle highlight to next
            testimonialCards[currentIndex].style.transform = 'translateY(-5px) scale(1.02)';

            setTimeout(() => {
                testimonialCards[currentIndex].style.transform = '';
            }, 3000);
        }, 5000);
    }

    // ===================================
    // Technical Details Toggle for AI Modules
    // ===================================
    const techDetailsToggles = document.querySelectorAll('.tech-details-toggle');

    techDetailsToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const moduleId = this.dataset.module;
            const detailsContent = document.querySelector(`[data-details="${moduleId}"]`);
            const toggleText = this.querySelector('[data-i18n^="modules.techDetails"]');

            if (!detailsContent) return;

            // Toggle display
            if (detailsContent.style.display === 'none' || !detailsContent.style.display) {
                detailsContent.style.display = 'block';
                this.classList.add('active');

                // Update button text (for non-i18n fallback)
                if (toggleText && !toggleText.dataset.i18n) {
                    toggleText.textContent = '🔬 접기';
                }
            } else {
                detailsContent.style.display = 'none';
                this.classList.remove('active');

                // Update button text (for non-i18n fallback)
                if (toggleText && !toggleText.dataset.i18n) {
                    toggleText.textContent = '🔬 자세히 보기 (전문 기술)';
                }
            }
        });
    });

    console.log('PIANO Enhancements loaded successfully');
});

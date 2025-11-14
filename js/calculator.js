// ===================================
// PIANO - Profit Calculator
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Calculator Configuration
    // ===================================
    const config = {
        minInvestment: 500000,        // ₩500,000 / $375
        maxInvestment: 100000000,     // ₩100,000,000 / $75,000 (1억)
        defaultInvestment: 5000000,   // ₩5,000,000 / $3,750
        bankRate: 0.04,               // 4% annual
        kospiRate: 0.066,             // 6.6% annual
        pianoMonthlyRate: {
            conservative: 0.02,        // 2% monthly
            balanced: 0.03,            // 3% monthly
            aggressive: 0.04           // 4% monthly
        },
        defaultRiskLevel: 'balanced',
        bankTaxRate: 0.154,           // 15.4% (14% income tax + 1.4% local tax)
        cryptoTaxRate: 0,             // 0% (tax-free for crypto futures)
        exchangeRate: 0.00075,        // KRW to USD conversion rate (1 KRW ≈ $0.00075)
        currency: '₩',                // Current currency symbol
        locale: 'ko-KR'               // Current locale for number formatting
    };
    
    // ===================================
    // DOM Elements
    // ===================================
    const slider = document.getElementById('investmentSlider');
    const sliderFill = document.getElementById('sliderFill');
    const investmentDisplay = document.getElementById('investmentDisplay');
    const bankPrincipal = document.getElementById('bankPrincipal');
    const bankInterest = document.getElementById('bankInterest');
    const bankTax = document.getElementById('bankTax');
    const bankReturn = document.getElementById('bankReturn');
    const pianoPrincipal = document.getElementById('pianoPrincipal');
    const pianoProfit = document.getElementById('pianoProfit');
    const pianoTax = document.getElementById('pianoTax');
    const pianoReturn = document.getElementById('pianoReturn');
    
    // ===================================
    // Initialize Calculator
    // ===================================

    // Debug: Check if elements exist
    console.log('Calculator elements:', {
        slider: !!slider,
        sliderFill: !!sliderFill,
        investmentDisplay: !!investmentDisplay,
        bankPrincipal: !!bankPrincipal,
        bankInterest: !!bankInterest,
        bankReturn: !!bankReturn,
        pianoPrincipal: !!pianoPrincipal,
        pianoProfit: !!pianoProfit,
        pianoReturn: !!pianoReturn
    });

    if (slider) {
        // Set initial currency based on current language
        const currentLang = window.LanguageAPI ? window.LanguageAPI.getCurrentLanguage() : 'ko';
        if (currentLang === 'en') {
            config.currency = '$';
            config.locale = 'en-US';
        }

        // Set initial values
        slider.min = config.minInvestment;
        slider.max = config.maxInvestment;
        slider.value = config.defaultInvestment;

        // Initial calculation
        updateCalculator();
        
        // Add event listeners for real-time update
        slider.addEventListener('input', function() {
            updateCalculator();
        });
        
        // For mobile devices
        slider.addEventListener('touchmove', function() {
            updateCalculator();
        });
        
        // Mouse events for smooth dragging
        let isDragging = false;
        
        slider.addEventListener('mousedown', function() {
            isDragging = true;
        });
        
        slider.addEventListener('mousemove', function() {
            if (isDragging) {
                updateCalculator();
            }
        });
        
        slider.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
    
    // Store animation frame IDs to cancel ongoing animations
    let animationFrames = new Map();

    // ===================================
    // Update Calculator Function
    // ===================================
    function updateCalculator() {
        const investment = parseFloat(slider.value);

        // Update slider fill
        updateSliderFill();

        // Update display value immediately (no animation to prevent mismatch)
        if (investmentDisplay) {
            investmentDisplay.textContent = formatCurrency(investment);
        }

        // Calculate returns
        const bankResult = calculateBankReturn(investment);
        const pianoResult = calculatePianoReturn(investment, config.defaultRiskLevel);

        // Update principal displays immediately
        if (bankPrincipal) {
            bankPrincipal.textContent = formatCurrency(investment);
        }
        if (pianoPrincipal) {
            pianoPrincipal.textContent = formatCurrency(investment);
        }

        // Update bank interest/tax displays immediately
        if (bankInterest) {
            bankInterest.textContent = '+' + formatCurrency(bankResult.grossInterest);
        }

        if (bankTax) {
            bankTax.textContent = '-' + formatCurrency(bankResult.tax);
        }

        // Update PIANO profit displays immediately
        if (pianoProfit) {
            pianoProfit.textContent = '+' + formatCurrency(pianoResult.profit);
        }

        // Update total return displays immediately
        if (bankReturn) {
            bankReturn.textContent = formatCurrency(bankResult.total);
        }

        if (pianoReturn) {
            pianoReturn.textContent = formatCurrency(pianoResult.total);
        }

        // Update comparison metrics
        updateComparisonMetrics(investment, bankResult.total, pianoResult.total);

        // Update timeline projection
        updateTimelineProjection(investment, config.defaultRiskLevel);
    }
    
    // ===================================
    // Calculation Functions
    // ===================================
    function calculateBankReturn(principal) {
        // Calculate gross interest
        const grossInterest = principal * config.bankRate;
        // Calculate tax on interest
        const tax = grossInterest * config.bankTaxRate;
        // Calculate net interest (after tax)
        const netInterest = grossInterest - tax;
        // Return breakdown
        return {
            principal: Math.round(principal),
            grossInterest: Math.round(grossInterest),
            tax: Math.round(tax),
            netInterest: Math.round(netInterest),
            total: Math.round(principal + netInterest)
        };
    }

    function calculatePianoReturn(principal, riskLevel) {
        // Compound interest for PIANO (monthly compounding)
        const monthlyRate = config.pianoMonthlyRate[riskLevel];
        const months = 12;
        const total = principal * Math.pow(1 + monthlyRate, months);
        const profit = total - principal;
        // Crypto futures are tax-free
        const tax = 0;

        return {
            principal: Math.round(principal),
            profit: Math.round(profit),
            tax: tax,
            total: Math.round(total)
        };
    }
    
    function calculateMonthlyReturn(principal, riskLevel) {
        const monthlyRate = config.pianoMonthlyRate[riskLevel];
        return Math.round(principal * monthlyRate);
    }

    function calculateTimelineReturns(principal, riskLevel, months) {
        const monthlyRate = config.pianoMonthlyRate[riskLevel];
        const total = principal * Math.pow(1 + monthlyRate, months);
        const profit = total - principal;
        return {
            total: Math.round(total),
            profit: Math.round(profit)
        };
    }

    // ===================================
    // UI Update Functions
    // ===================================
    function updateSliderFill() {
        if (!sliderFill) return;
        const value = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((value - min) / (max - min)) * 100;
        sliderFill.style.width = percentage + '%';
    }
    
    function updateComparisonMetrics(investment, bankReturn, pianoReturn) {
        const difference = pianoReturn - bankReturn;
        const percentageGain = ((pianoReturn / bankReturn) - 1) * 100;

        // Update any comparison displays
        const comparisonElements = document.querySelectorAll('[data-comparison]');
        comparisonElements.forEach(element => {
            const type = element.dataset.comparison;
            switch(type) {
                case 'difference':
                    element.textContent = formatCurrency(difference);
                    break;
                case 'percentage':
                    element.textContent = `${percentageGain.toFixed(1)}% more`;
                    break;
                case 'multiple':
                    element.textContent = `${(pianoReturn / bankReturn).toFixed(1)}x`;
                    break;
            }
        });
    }

    function updateTimelineProjection(investment, riskLevel) {
        // Calculate returns for different time periods
        const threeMonths = calculateTimelineReturns(investment, riskLevel, 3);
        const sixMonths = calculateTimelineReturns(investment, riskLevel, 6);
        const oneYear = calculateTimelineReturns(investment, riskLevel, 12);

        // Update 3-month projection
        const timeline3m = document.getElementById('timeline3m');
        const profit3m = document.getElementById('profit3m');
        if (timeline3m) timeline3m.textContent = formatCurrency(threeMonths.total);
        if (profit3m) profit3m.textContent = '+' + formatCurrency(threeMonths.profit).replace('₩', '₩');

        // Update 6-month projection
        const timeline6m = document.getElementById('timeline6m');
        const profit6m = document.getElementById('profit6m');
        if (timeline6m) timeline6m.textContent = formatCurrency(sixMonths.total);
        if (profit6m) profit6m.textContent = '+' + formatCurrency(sixMonths.profit).replace('₩', '₩');

        // Update 1-year projection
        const timeline1y = document.getElementById('timeline1y');
        const profit1y = document.getElementById('profit1y');
        if (timeline1y) timeline1y.textContent = formatCurrency(oneYear.total);
        if (profit1y) profit1y.textContent = '+' + formatCurrency(oneYear.profit).replace('₩', '₩') + ' 🎉';
    }
    
    // ===================================
    // Animation Functions
    // ===================================
    function animateValue(element, start, end, duration, prefix = '') {
        if (!element) return;

        // Handle both element and value scenarios
        if (typeof element === 'object' && element.textContent !== undefined) {
            const startTimestamp = Date.now();
            const step = () => {
                const timestamp = Date.now();
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = prefix + formatCurrency(value);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        } else if (typeof element === 'object') {
            // If it's the investmentDisplay element
            const startTimestamp = Date.now();
            const step = () => {
                const timestamp = Date.now();
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = prefix + formatCurrency(value);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }
    
    // ===================================
    // Formatting Functions
    // ===================================
    function formatCurrency(value, currency = null) {
        // Use config currency if not specified
        const currencySymbol = currency || config.currency;
        const locale = config.locale;

        // Format based on currency
        if (currencySymbol === '$') {
            // For USD, show 2 decimal places for cents
            return currencySymbol + value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else {
            // For KRW, no decimal places
            return currencySymbol + value.toLocaleString(locale);
        }
    }
    
    function formatPercentage(value) {
        return value.toFixed(1) + '%';
    }
    
    // ===================================
    // Risk Level Selector (Future Enhancement)
    // ===================================
    const riskButtons = document.querySelectorAll('[data-risk-level]');
    
    riskButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            riskButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update risk level and recalculate
            const riskLevel = this.dataset.riskLevel;
            config.defaultRiskLevel = riskLevel;
            updateCalculator();
        });
    });
    
    // ===================================
    // Advanced Calculator Modal (Future Enhancement)
    // ===================================
    function openAdvancedCalculator() {
        // This would open a modal with more detailed calculations
        // Including:
        // - Monthly breakdown
        // - Risk scenarios
        // - Historical performance comparison
        // - Tax implications
        console.log('Advanced calculator would open here');
    }
    
    // ===================================
    // Export Calculation Results
    // ===================================
    function exportResults() {
        const investment = parseFloat(slider.value);
        const results = {
            investment: investment,
            bankReturn: calculateBankReturn(investment),
            pianoReturn: calculatePianoReturn(investment, config.defaultRiskLevel),
            riskLevel: config.defaultRiskLevel,
            timestamp: new Date().toISOString()
        };
        
        // In production, this could generate a PDF or send to email
        console.log('Export results:', results);
        return results;
    }
    
    // ===================================
    // Calculator Presets
    // ===================================
    const presetButtons = document.querySelectorAll('[data-preset-amount]');
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseFloat(this.dataset.presetAmount);
            slider.value = amount;
            updateCalculator();
        });
    });
    
    // ===================================
    // Keyboard Support
    // ===================================
    if (slider) {
        slider.addEventListener('keydown', function(e) {
            // Dynamic step based on currency (₩100,000 for KRW, $50 for USD)
            const step = config.currency === '$' ? 50 : 100000;
            let newValue = parseFloat(this.value);
            const minValue = parseFloat(this.min);
            const maxValue = parseFloat(this.max);

            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowDown':
                    newValue = Math.max(minValue, newValue - step);
                    break;
                case 'ArrowRight':
                case 'ArrowUp':
                    newValue = Math.min(maxValue, newValue + step);
                    break;
                case 'Home':
                    newValue = minValue;
                    break;
                case 'End':
                    newValue = maxValue;
                    break;
            }

            if (newValue !== parseFloat(this.value)) {
                this.value = newValue;
                updateCalculator();
            }
        });
    }
    
    // ===================================
    // Currency Conversion Functions
    // ===================================
    function setCurrency(language) {
        if (language === 'en') {
            config.currency = '$';
            config.locale = 'en-US';
        } else {
            config.currency = '₩';
            config.locale = 'ko-KR';
        }

        // Update calculator display
        if (slider) {
            updateCalculator();
        }
    }

    // ===================================
    // Public API
    // ===================================
    window.PianoCalculator = {
        updateCalculator,
        calculateBankReturn,
        calculatePianoReturn,
        calculateMonthlyReturn,
        exportResults,
        formatCurrency,
        setCurrency,
        config
    };
    
});

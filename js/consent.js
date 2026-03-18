// ===================================
// PIANO - Consent Gate System
// ===================================

(function () {
    'use strict';

    // ⚠️ Google Apps Script URL — 설정 후 아래 URL을 교체하세요
    // 설정 방법은 CONSENT-SETUP.md 참고
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzaO5ZhKXlOZ9Nnnk4dPCE5qpjl2NyPVd3JeRelIbevN0Tg50DfdWAncsioJ1YeBcypnQ/exec';

    const CONSENT_KEY = 'piano_consent_agreed';
    const overlay = document.getElementById('consentOverlay');

    // 이미 동의한 사용자 → 게이트 스킵
    if (localStorage.getItem(CONSENT_KEY)) {
        if (overlay) overlay.classList.add('hidden');
        return;
    }

    // 동의 안 한 사용자 → 게이트 표시, 페이지 스크롤 막기
    if (overlay) {
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // 모든 체크박스 & 입력 필드 감시 → 제출 버튼 활성화
    const checkboxes = overlay.querySelectorAll('input[type="checkbox"]');
    const nameInput = overlay.querySelector('#consentName');
    const phoneInput = overlay.querySelector('#consentPhone');
    const emailInput = overlay.querySelector('#consentEmail');
    const submitBtn = overlay.querySelector('#consentSubmit');
    const errorEl = overlay.querySelector('#consentError');
    const formEl = overlay.querySelector('#consentForm');
    const successEl = overlay.querySelector('#consentSuccess');

    function validateForm() {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const nameOk = nameInput.value.trim().length >= 2;
        const phoneOk = /^[\d\-+() ]{8,}$/.test(phoneInput.value.trim());
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        submitBtn.disabled = !(allChecked && nameOk && phoneOk && emailOk);
    }

    checkboxes.forEach(cb => cb.addEventListener('change', validateForm));
    [nameInput, phoneInput, emailInput].forEach(el => {
        el.addEventListener('input', validateForm);
    });

    // IP 가져오기
    async function getIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    // 폼 제출
    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        if (submitBtn.disabled) return;

        submitBtn.classList.add('loading');
        submitBtn.textContent = '처리 중...';
        errorEl.classList.remove('visible');

        const ip = await getIP();
        const timestamp = new Date().toISOString();

        const payload = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            ip: ip,
            timestamp: timestamp,
            user_agent: navigator.userAgent,
            consents: Array.from(checkboxes).map(cb => ({
                id: cb.id,
                label: cb.dataset.label,
                checked: cb.checked
            }))
        };

        // Google Sheets 전송 (form 방식 — no-cors 호환)
        if (GOOGLE_SCRIPT_URL) {
            try {
                const form = new FormData();
                form.append('data', JSON.stringify(payload));
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: form
                });
            } catch (err) {
                console.warn('Consent record failed:', err);
                // 전송 실패해도 동의는 진행 (사용자 경험 우선)
            }
        } else {
            // URL 미설정 시 콘솔에 기록 (개발용)
            console.log('📋 Consent record (Google Script URL not configured):', payload);
        }

        // 동의 저장 & 게이트 해제
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            timestamp: timestamp,
            name: nameInput.value.trim(),
            email: emailInput.value.trim()
        }));

        // 성공 표시 후 페이드 아웃
        formEl.style.display = 'none';
        successEl.classList.add('visible');

        setTimeout(function () {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(function () {
                overlay.classList.add('hidden');
                overlay.style.opacity = '';
                document.body.style.overflow = '';
            }, 500);
        }, 1200);
    });
})();

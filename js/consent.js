// ===================================
// PIANO - Consent Gate System
// Supabase: piano-website 프로젝트 (OnlyGens와 별도)
// ===================================

(function () {
    'use strict';

    // ⚠️ Supabase 설정 — piano-website 프로젝트 전용
    const SUPABASE_URL = 'https://ayddhappfdyqyiaqyjst.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZGRoYXBwZmR5cXlpYXF5anN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTc2ODQsImV4cCI6MjA4OTM5MzY4NH0.BAExCK5d-xgBSLsoWpVnt88BhawjTvwjdvlM3L76jZI';

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

        const consentData = Array.from(checkboxes).map(cb => ({
            id: cb.id,
            label: cb.dataset.label,
            checked: cb.checked
        }));

        // Supabase에 동의 기록 저장
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            try {
                const res = await fetch(SUPABASE_URL + '/rest/v1/piano_consents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        email: emailInput.value.trim(),
                        ip: ip,
                        user_agent: navigator.userAgent,
                        consents: consentData
                    })
                });

                if (!res.ok) {
                    console.warn('Supabase insert failed:', res.status);
                }
            } catch (err) {
                console.warn('Supabase connection failed:', err);
            }
        } else {
            console.log('📋 Consent record (Supabase not configured):', consentData);
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

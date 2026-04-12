/* ═══ Authentication — Login, Signup, Session Management ═══ */
/* Replace localStorage calls with Supabase for real backend */

(function initHeroAuth() {

    /* ── TAB SWITCH ── */
    window.heroSwitchTab = function (tab) {
        var loginForm = document.getElementById('heroLoginForm');
        var signupForm = document.getElementById('heroSignupForm');
        var tabLogin = document.getElementById('tabLogin');
        var tabSignup = document.getElementById('tabSignup');
        var ind = document.getElementById('authTabInd');

        if (!loginForm || !signupForm) return;

        if (tab === 'login') {
            loginForm.style.display = '';
            signupForm.style.display = 'none';
            loginForm.style.animation = 'formPanelIn 0.28s cubic-bezier(0.16,1,0.3,1) both';
            if (tabLogin) tabLogin.classList.add('active');
            if (tabSignup) tabSignup.classList.remove('active');
            positionAuthIndicator('login');
        } else {
            signupForm.style.display = '';
            loginForm.style.display = 'none';
            signupForm.style.animation = 'formPanelIn 0.28s cubic-bezier(0.16,1,0.3,1) both';
            if (tabSignup) tabSignup.classList.add('active');
            if (tabLogin) tabLogin.classList.remove('active');
            positionAuthIndicator('signup');
        }
    };

    function positionAuthIndicator(tab) {
        var ind = document.getElementById('authTabInd');
        var btn = document.getElementById(tab === 'login' ? 'tabLogin' : 'tabSignup');
        var tabsEl = document.querySelector('.auth-tabs');
        if (!ind || !btn || !tabsEl) return;
        var tabsRect = tabsEl.getBoundingClientRect();
        var btnRect = btn.getBoundingClientRect();
        ind.style.left = (btnRect.left - tabsRect.left + 6) + 'px';
        ind.style.width = (btnRect.width - 12) + 'px';
    }

    /* Position indicator on load */
    setTimeout(function () { positionAuthIndicator('login'); }, 100);
    window.addEventListener('resize', function () {
        var activeTab = document.querySelector('.auth-tab.active');
        if (activeTab) positionAuthIndicator(activeTab.id === 'tabLogin' ? 'login' : 'signup');
    });

    /* ── PASSWORD TOGGLE ── */
    window.heroTogglePw = function (id, btn) {
        var inp = document.getElementById(id);
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.style.color = inp.type === 'text' ? '#ffffff' : '';
    };

    /* ── FORM SUBMIT ── */
    /* ════════════════════════════════════════════════════════════
       AUTH STATE SYSTEM
       isAuthed flag + localStorage persistence
    ════════════════════════════════════════════════════════════ */

    /* ── STATE ── */
    /* ── STATE ── */
    var isAuthed = false;
    var authedUser = { name: 'User', initial: 'U' };

    /* ── RESTORE FROM SUPABASE SESSION ── */
    (async function restoreAuth() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                var u = session.user;
                authedUser = {
                    name: u.user_metadata?.name || u.email.split('@')[0],
                    initial: (u.user_metadata?.name || u.email)[0].toUpperCase()
                };
                isAuthed = true;
                applyAuthUI(false);
            }
        } catch (e) { console.log('Auth restore error:', e); }
    })();

    /* ── APPLY AUTH UI ── */
    function applyAuthUI(animate) {
        var navGuest = document.getElementById('navGuest');
        var navSignInBtn = document.getElementById('navAuthBtnsWrap');
        var navAuthLinks = document.getElementById('navAuthLinks');
        var navProfileWrap = document.getElementById('navProfileWrap');
        var navPub = document.getElementById('navPublicLinks');

        if (isAuthed) {
            /* ── HIDE public nav FIRST ── */
            if (navPub) navPub.style.display = 'none';
            /* Show full nav */
            if (navSignInBtn) { navSignInBtn.style.display = 'none'; }
            if (navAuthLinks) {
                navAuthLinks.style.display = 'flex';
                if (animate) {
                    navAuthLinks.classList.remove('auth-revealed');
                    void navAuthLinks.offsetWidth; /* reflow */
                    navAuthLinks.classList.add('auth-revealed');
                }
            }
            if (navProfileWrap) {
                navProfileWrap.style.display = 'flex';
                if (animate) {
                    navProfileWrap.classList.remove('auth-revealed');
                    void navProfileWrap.offsetWidth;
                    navProfileWrap.classList.add('auth-revealed');
                }
            }
            /* Update avatar with online dot */
            var av = navProfileWrap ? navProfileWrap.querySelector('.av') : null;
            if (av) {
                av.textContent = authedUser.initial || 'S';
                av.classList.add('av-online');
            }
            /* Update avatar + name — no duplication */
            var navAv = document.getElementById('navAvatar');
            var navNm = document.getElementById('pbtnName');
            if (navAv) navAv.textContent = authedUser.initial || 'S';
            if (navNm) navNm.textContent = authedUser.name || 'User';

            /* Toggle home: dashboard vs landing */
            var dashboard = document.getElementById('homeDashboard');
            var landing = document.getElementById('homeLanding');
            if (dashboard) dashboard.style.display = 'block';
            if (landing) landing.style.display = 'none';
            var dashName = document.getElementById('dashUserName');
            if (dashName) dashName.textContent = authedUser.name || 'User';
            var h = new Date().getHours();
            var timeLabel = document.getElementById('dashTimeLabel');
            if (timeLabel) {
                if (h < 12) timeLabel.innerHTML = '&#9728;&#65039; Good Morning';
                else if (h < 17) timeLabel.innerHTML = '&#127780;&#65039; Good Afternoon';
                else timeLabel.innerHTML = '&#127769; Good Evening';
            }
        } else {
            /* ── SHOW public nav, HIDE auth nav ── */
            if (navPub) navPub.style.display = 'flex';
            if (navSignInBtn) { navSignInBtn.style.display = ''; }
            if (navAuthLinks) { navAuthLinks.style.display = 'none'; }
            if (navProfileWrap) { navProfileWrap.style.display = 'none'; }

            /* Toggle home: landing vs dashboard */
            var dashboard2 = document.getElementById('homeDashboard');
            var landing2 = document.getElementById('homeLanding');
            if (dashboard2) dashboard2.style.display = 'none';
            if (landing2) landing2.style.display = '';
        }
    }

    /* ── LEARNING DROPDOWN CLOSE ── */
    window.closeLearnDropdown = function () {
        var wrap = document.querySelector('.nl-dropdown-wrap');
        if (wrap) {
            wrap.style.pointerEvents = 'none';
            setTimeout(function () { wrap.style.pointerEvents = ''; }, 300);
        }
    };
    function showAuthToast(name) {
        var toast = document.getElementById('authWelcomeToast');
        var msg = document.getElementById('authWelcomeMsg');
        if (!toast) return;
        if (msg) msg.textContent = 'Welcome, ' + name + '! Platform unlocked.';
        toast.classList.add('visible');
        setTimeout(function () { toast.classList.remove('visible'); }, 3200);
    }

    /* ── LOGIN / SIGNUP ACTION ── */
    window.heroAuthSubmit = async function (type) {
        var emailEl, pwEl, nameEl;

        if (type === 'login') {
            var card = document.getElementById('pg-login');
            emailEl = card?.querySelector('input[type="email"]');
            pwEl = card?.querySelector('input[type="password"]');
        } else {
            var card = document.getElementById('pg-signup');
            nameEl = card?.querySelector('input[type="text"]');
            emailEl = card?.querySelector('input[type="email"]');
            pwEl = card?.querySelector('input[type="password"]');
        }

        var email = emailEl?.value.trim();
        var password = pwEl?.value;
        if (!email || !password) { alert('Please fill all fields'); return; }

        if (type === 'signup') {
            var name = nameEl?.value.trim() || 'User';
            const { data, error } = await supabase.auth.signUp({
                email, password,
                options: { data: { name: name } }
            });
            if (error) { alert(error.message); return; }
            authedUser = { name: name, initial: name[0].toUpperCase() };
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            });
            if (error) { alert(error.message); return; }
            authedUser = {
                name: data.user.user_metadata?.name || email.split('@')[0],
                initial: (data.user.user_metadata?.name || email)[0].toUpperCase()
            };
        }

        isAuthed = true;
        applyAuthUI(true);
        showAuthToast(authedUser.name);
        go('home');
    };

    /* ── SOCIAL LOGIN (Google / GitHub) ── */
    window.heroSocialLogin = async function (provider) {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,  // 'google' or 'github'
            options: { redirectTo: window.location.origin }
        });
        if (error) alert(error.message);
    };

    /* Visual loading feedback on the clicked button */
    if (btn) {
        var origHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Connecting...';
        btn.style.opacity = '0.75';
        btn.disabled = true;
        /* Also disable the other social button */
        var row = btn.closest('.auth-social-row');
        if (row) row.querySelectorAll('.auth-social-btn').forEach(function (b) { if (b !== btn) b.disabled = true; b.style.opacity = '0.5'; });
    }

    setTimeout(function () {
        /* Pick a demo name based on provider */
        var demoNames = { google: 'Shrey', github: 'Dev' };
        var displayName = demoNames[provider] || 'User';

        /* Authenticate */
        isAuthed = true;
        authedUser = { name: displayName, initial: displayName.charAt(0).toUpperCase(), provider: provider };

        try {
            localStorage.setItem('cr_auth', 'true');
            localStorage.setItem('cr_user', JSON.stringify(authedUser));
        } catch (e) { }

        /* Update UI */
        applyAuthUI(true);

        /* Dismiss hero auth card */
        var heroCard = document.getElementById('heroAuthCard');
        if (heroCard) {
            heroCard.classList.add('dismissing');
            setTimeout(function () { heroCard.style.display = 'none'; }, 500);
        }

        /* Show welcome toast */
        showAuthToast(displayName);

        /* Navigate to platform */
        setTimeout(function () {
            if (typeof go === 'function') go('home');
        }, 600);

    }, 1200);
};

/* ── SCROLL / FOCUS HERO AUTH FORM ── */
window.authScrollToForm = function () {
    var card = document.getElementById('heroAuthCard');
    if (card) {
        card.style.display = '';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        /* Pulse border */
        card.style.borderColor = 'rgba(255,255,255,0.5)';
        card.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.9)';
        setTimeout(function () {
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }, 1200);
        /* Focus first input */
        var firstInput = card.querySelector('input');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 400);
    } else {
        if (typeof go === 'function') go('home');
    }
};

/* ── LOGOUT ── */
window.authLogout = async function () {
    await supabase.auth.signOut();
    isAuthed = false;
    applyAuthUI(false);
    go('home');
    /* Restore hero auth card */
    var heroCard = document.getElementById('heroAuthCard');
    if (heroCard) {
        heroCard.classList.remove('dismissing');
        heroCard.style.display = '';
        heroCard.style.animation = 'authCardReveal 0.5s cubic-bezier(0.16,1,0.3,1) both';
    }
    closeProfileDropdown();
};

/* ══════════════════════════════════════════
   SEMESTER SELECTOR
══════════════════════════════════════════ */
var semesterData = {
    1: { label: 'Semester 1 — Foundations', rec: { title: 'Python Fundamentals', desc: 'Start with the most beginner-friendly language and build your coding base.' },


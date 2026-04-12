/* ═══ Features Page Animations, Contact Form, Gated Pages ═══ */


/* Highlight public nav on page change */
var _goPublicBase = window.go;
window.go = function (p) {
    document.querySelectorAll('.nl-pub').forEach(function (b) { b.classList.remove('act'); });
    var pub = document.getElementById('nl-' + p);
    if (pub && pub.classList.contains('nl-pub')) pub.classList.add('act');
    if (typeof _goPublicBase === 'function') _goPublicBase(p);
    /* Trigger scroll animations for features page */
    if (p === 'features') {
        setTimeout(initFeatureScrollObserver, 100);
        setTimeout(animateProgRings, 400);
        setTimeout(startAiTypingDemo, 600);
    }
};

/* ── FEATURES: Scroll reveal ── */
function initFeatureScrollObserver() {
    var items = document.querySelectorAll('.feat-scroll-item');
    if (!items.length) return;
    /* Immediately show first one */
    if (items[0]) items[0].classList.add('visible');
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    items.forEach(function (el) { obs.observe(el); });
}

/* ── FEATURES: Semester mockup click ── */
var semMockData = [
    { icon: '🐍', title: 'Python Basics', bar: '37%', lessons: '18 / 48 lessons' },
    { icon: '☕', title: 'Java OOP', bar: '20%', lessons: '8 / 40 lessons' },
    { icon: '🌲', title: 'Data Structures', bar: '11%', lessons: '3 / 28 lessons' },
    { icon: '🧮', title: 'Algorithms', bar: '32%', lessons: '8 / 25 lessons' },
    { icon: '🏗️', title: 'System Design', bar: '10%', lessons: '2 / 20 lessons' },
    { icon: '💼', title: 'Interview Patterns', bar: '45%', lessons: '9 / 20 lessons' },
    { icon: '🤖', title: 'Machine Learning', bar: '8%', lessons: '2 / 28 lessons' },
    { icon: '🚀', title: 'Capstone Project', bar: '0%', lessons: '0 / 10 lessons' }
];
window.semMockClick = function (el) {
    document.querySelectorAll('.sem-mock-card').forEach(function (c) { c.classList.remove('active'); });
    el.classList.add('active');
    var idx = Array.from(el.parentElement.children).indexOf(el);
    var d = semMockData[idx] || semMockData[0];
    var ic = document.getElementById('semMockIcon');
    var ti = document.getElementById('semMockTitle');
    var ba = document.getElementById('semMockBar');
    var le = document.getElementById('semMockLessons');
    if (ic) ic.textContent = d.icon;
    if (ti) ti.textContent = d.title;
    if (ba) ba.style.width = d.bar;
    if (le) le.textContent = d.lessons;
};

/* ── FEATURES: AI typing demo ── */
var aiTypingFull = 'DP = optimal substructure + overlapping subproblems. Break the problem, cache each result, never solve the same subproblem twice.';
var aiTypingIdx = 0;
var aiTypingTimer = null;
function startAiTypingDemo() {
    var bub = document.getElementById('aiTypingBub');
    if (!bub) return;
    aiTypingIdx = 0;
    bub.innerHTML = '<span class="type-cursor"></span>';
    clearInterval(aiTypingTimer);
    aiTypingTimer = setInterval(function () {
        if (aiTypingIdx >= aiTypingFull.length) { clearInterval(aiTypingTimer); return; }
        bub.innerHTML = aiTypingFull.substring(0, ++aiTypingIdx) + '<span class="type-cursor"></span>';
    }, 36);
}

/* ── FEATURES: Progress ring animation ── */
function animateProgRings() {
    var rings = [
        { id: 'ring1', offset: 126 },
        { id: 'ring2', offset: 160 },
        { id: 'ring3', offset: 169 }
    ];
    rings.forEach(function (r) {
        var el = document.getElementById(r.id);
        if (!el) return;
        el.style.strokeDashoffset = '201';
        setTimeout(function () { el.style.strokeDashoffset = r.offset; }, 200);
    });
}

/* ── CONTACT: form submit ── */
window.cfSubmit = async function () {
    var first = document.getElementById('cfFirst');
    var email = document.getElementById('cfEmail');
    var msg = document.getElementById('cfMessage');
    if (!first?.value.trim() || !email?.value.trim() || !msg?.value.trim()) {
        [first, email, msg].forEach(function (el) {
            if (el && !el.value.trim()) {
                el.style.borderColor = 'var(--danger)';
                setTimeout(function () { el.style.borderColor = ''; }, 2000);
            }
        });
        return;
    }

    // Save to Supabase
    const { error } = await supabase.from('contact_messages').insert({
        name: first.value.trim(),
        email: email.value.trim(),
        message: msg.value.trim()
    });

    if (error) { alert('Error sending message. Please try again.'); return; }

    var form = document.getElementById('cfForm');
    var succ = document.getElementById('cfSuccess');
    if (form) form.style.display = 'none';
    if (succ) succ.style.display = 'block';
};

/* ── PLATFORM GATE (block inner pages when not authed) ── */
var GATED_PAGES = {
    learn: 1, practice: 1, rank: 1, leaderboard: 1, profile: 1, settings: 1,
    course: 1, lesson: 1, coding: 1, results: 1, ranksession: 1, rankresults: 1, onboarding: 1, aichat: 1
};

window.gateGoToAuth = function () {
    gateClose();
    authScrollToForm();
    if (typeof go === 'function') go('home');
};
window.gateClose = function () {
    var gate = document.getElementById('platformGate');
    if (gate) gate.classList.remove('active');
    /* If on a gated page and not authed, redirect home */
    if (!isAuthed) {
        setTimeout(function () { if (typeof go === 'function') go('home'); }, 200);
    }
};

/* Patch go() to enforce gate */
var _gatedBase = window.go;
window.go = function (page) {
    if (!isAuthed && GATED_PAGES[page]) {
        /* Show gate overlay instead */
        var gate = document.getElementById('platformGate');
        if (gate) gate.classList.add('active');
        return;
    }
    _gatedBase(page);
};

/* ── UPDATE PROFILE DROPDOWN to include Logout ── */
(function patchDropdown() {
    var pd = document.getElementById('profileDropdown');
    if (!pd) return;
    /* Add logout option */
    var logoutDiv = document.createElement('div');
    logoutDiv.className = 'pd-item';
    logoutDiv.innerHTML = '&#x1F6AA; &nbsp;Sign Out';
    logoutDiv.onclick = function () { closeProfileDropdown(); authLogout(); };
    logoutDiv.style.color = '#aaaaaa';
    var divider = document.createElement('div');
    divider.className = 'pd-divider';
    pd.appendChild(divider);
    pd.appendChild(logoutDiv);
})();


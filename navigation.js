/* ═══ Navigation, Theme & Page Routing ═══ */

        var isDark = true, obStep = 0;
        var thinkInterval = null, codeInterval = null;
        var thinkSecs = 154, codeSecs = 0, codingStarted = false;
        var rankThinkSecs = 72, rankCodeSecs = 0, rankCodingStarted = false;
        var rankThinkInterval = null, rankCodeInterval = null;
        var rankScore = 1840, rankPUs = { freeze: 2, skip: 1, kill: 1, hint: 1 };
        var moreOpen = false;

        function go(p) {
            document.querySelectorAll('.pg').forEach(x => x.classList.remove('on'));
            document.querySelectorAll('.page-btn').forEach(x => x.classList.remove('on'));
            document.querySelectorAll('.nl').forEach(x => x.classList.remove('act'));
            var pg = document.getElementById('pg-' + p);
            var nb = document.getElementById('nb-' + p);
            var nl = document.getElementById('nl-' + p);
            if (pg) pg.classList.add('on');
            if (nb) nb.classList.add('on');
            if (nl) nl.classList.add('act');
            // For sub-pages, highlight parent nav item
            var parentMap = { course: 'learn', lesson: 'learn', coding: 'learn', results: 'learn', practice: 'learn', rank: 'learn', ranksession: 'learn', rankresults: 'learn', leaderboard: 'learn', profile: 'home', settings: 'home', onboarding: 'home', login: 'home', signup: 'home' };
            if (parentMap[p]) {
                var parentNl = document.getElementById('nl-' + parentMap[p]);
                if (parentNl) parentNl.classList.add('act');
            }
            // Smart bottom nav: NEVER show on home page
            var nav = document.getElementById('pageNav');
            if (nav) {
                if (p === 'home') {
                    nav.classList.add('hidden');
                } else {
                    nav.classList.remove('hidden');
                }
            }
            // Close more panel
            closeMore();
            window.scrollTo(0, 0);
            // Show/hide light pillar based on current page
            var lp = document.getElementById('lightPillarHome');
            var pillarPages = { home:1, login:1, signup:1, about:1, features:1, contact:1 };
            if (lp) lp.style.display = pillarPages[p] ? '' : 'none';
            if (p === 'results') animateScore();
            if (p === 'coding') startThinkTimer();
            if (p === 'ranksession') startRankTimers();
            if (p === 'rankresults') { animateRankScore(); fireConfetti(); }
        }

        /* ── MORE PANEL ── */
        function toggleMore(e) {
            e.stopPropagation();
            moreOpen = !moreOpen;
            var panel = document.getElementById('navMorePanel');
            var btn = document.getElementById('navMoreBtn');
            if (moreOpen) {
                if (panel) panel.classList.add('open');
                if (btn) btn.classList.add('open');
            } else {
                if (panel) panel.classList.remove('open');
                if (btn) btn.classList.remove('open');
            }
        }
        function closeMore() {
            moreOpen = false;
            var panel = document.getElementById('navMorePanel');
            var btn = document.getElementById('navMoreBtn');
            if (panel) panel.classList.remove('open');
            if (btn) btn.classList.remove('open');
        }
        document.addEventListener('click', function (e) {
            if (moreOpen && !e.target.closest('.nav-more-wrap')) closeMore();
        });

        function toggleTheme() {
            isDark = !isDark;
            document.body.setAttribute('data-theme', isDark ? '' : 'light');
            document.documentElement.setAttribute('data-theme', isDark ? '' : 'light');
            document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
        }

        // Alias so both go() and goTo() work
        function goTo(pageId) { go(pageId); }

        function tp(id) {

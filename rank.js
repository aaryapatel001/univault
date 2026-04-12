/* ═══ Rank Mode — Timers, Scoring, Sessions ═══ */

            if (rankThinkInterval) clearInterval(rankThinkInterval);
            rankThinkSecs = 72; rankCodeSecs = 0; rankCodingStarted = false;
            updateRankTimers();
            rankThinkInterval = setInterval(function () {
                rankThinkSecs++;
                updateRankTimers();
                var d = document.getElementById('rthinkTimer');
                if (d) d.className = rankThinkSecs > 150 ? 'timer-digits danger' : rankThinkSecs > 100 ? 'timer-digits warn' : 'timer-digits';
            }, 1000);
        }

        function updateRankTimers() {
            var t = document.getElementById('rthinkTimer'), c = document.getElementById('rcodeTimer');
            if (t) t.textContent = fmt(rankThinkSecs);
            if (c) c.textContent = fmt(rankCodeSecs);
        }

        function rankRun() {
            if (!rankCodingStarted) {
                rankCodingStarted = true;
                clearInterval(rankThinkInterval);
                var tb = document.getElementById('rthinkBox'), cb = document.getElementById('rcodeBox');
                if (tb) tb.classList.add('inactive');
                if (cb) cb.classList.remove('inactive');
                rankCodeInterval = setInterval(function () {
                    rankCodeSecs++;
                    updateRankTimers();
                    var d = document.getElementById('rcodeTimer');
                    if (d) d.className = rankCodeSecs > 200 ? 'timer-digits danger' : rankCodeSecs > 120 ? 'timer-digits warn' : 'timer-digits';
                }, 1000);
            }
            var c = document.getElementById('rankConsole');
            c.style.color = 'var(--muted)'; c.textContent = 'Executing...';
            setTimeout(function () {
                c.style.color = 'var(--secondary)';
                c.textContent = '✓ "()"  → true  PASS\n✓ "()[]{}"  → true  PASS\n✓ "(]"  → false  PASS\n✓ "([)]"  → false  PASS\n\nAll 4 test cases passed! Runtime: 38ms';
            }, 600);
        }

        function rankSubmit() {
            clearInterval(rankThinkInterval); clearInterval(rankCodeInterval);
            // Show set transition overlay
            var overlay = document.getElementById('setTransition');
            overlay.classList.add('show');
            setTimeout(function () { document.getElementById('setTransBar').style.width = '100%'; }, 100);
            setTimeout(function () {
                overlay.classList.remove('show');
                go('rankresults');
            }, 3000);
        }

        function rankPU(type) {
            var penalties = { freeze: 0, skip: 100, kill: 200, hint: 50 };
            var badge = document.getElementById('pu' + type.charAt(0).toUpperCase() + type.slice(1));
            var cur = parseInt(badge.textContent);
            if (cur <= 0) return;
            badge.textContent = cur - 1;
            if (cur - 1 === 0) badge.style.opacity = '0.4';
            // Deduct score
            rankScore = Math.max(0, rankScore - penalties[type]);
            var el = document.getElementById('rankScoreLive');
            if (el) el.textContent = rankScore.toLocaleString() + ' pts';
            // Show penalty toast
            if (penalties[type] > 0) showPenalty('-' + penalties[type] + ' pts');
            // Show hint
            if (type === 'hint') {
                var rhc = document.getElementById('rankHintContent');
                var rhb = document.getElementById('rankHintBtn');
                if (rhc) rhc.classList.add('show');
                if (rhb) rhb.style.opacity = '0.5';
            }
        }

        function rankHint() {
            var h = document.getElementById('rankHintContent');
            h.classList.toggle('show');
        }

        function showPenalty(msg) {
            var t = document.getElementById('penaltyToast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(function () { t.classList.remove('show'); }, 1800);
        }

        /* ── RESULTS ── */
        function animateScore() {
            var el = document.getElementById('finalScore');
            if (!el) return;
            var target = 840, cur = 0;
            var step = target / (1600 / 16);
            var t = setInterval(function () {
                cur = Math.min(cur + step, target);
                el.textContent = Math.floor(cur);
                if (cur >= target) clearInterval(t);
            }, 16);
        }

        function animateRankScore() {
            var el = document.getElementById('rankFinalScore');
            var el2 = document.getElementById('rankResultScore');
            if (!el) return;
            var target = 2190, cur = 0;
            var step = target / (2000 / 16);
            var t = setInterval(function () {
                cur = Math.min(cur + step, target);
                var v = Math.floor(cur).toLocaleString();
                el.textContent = v;
                if (el2) el2.textContent = v;
                if (cur >= target) clearInterval(t);
            }, 16);
        }

        function fireConfetti() {
            var canvas = document.getElementById('confettiCanvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            var pieces = [];
            var colors = ['#6c63ff', '#00e5a0', '#38bdf8', '#f59e0b', '#ec4899', '#ffffff'];
            for (var i = 0; i < 120; i++) {
                pieces.push({
                    x: Math.random() * canvas.width,
                    y: -20 - Math.random() * 200,
                    w: 6 + Math.random() * 8,
                    h: 8 + Math.random() * 6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 3,
                    vy: 2 + Math.random() * 4,
                    rot: Math.random() * 360,
                    vr: (Math.random() - 0.5) * 8,
                    alpha: 1
                });
            }
            var frame = 0;
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pieces.forEach(function (p) {
                    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
                    if (frame > 80) p.alpha -= 0.015;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot * Math.PI / 180);
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                });
                frame++;
                if (frame < 180) requestAnimationFrame(draw);
                else ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            draw();
        }

        function setLbTab(el) {
            document.querySelectorAll('.lb-tab').forEach(x => x.classList.remove('active'));
            el.classList.add('active');
        }

        /* ── SETTINGS ── */
        function setAccent(color, glow, el) {
            document.documentElement.style.setProperty('--primary', color);
            document.documentElement.style.setProperty('--primary-g', glow);
            document.querySelectorAll('.accent-dot').forEach(x => x.classList.remove('active'));
            el.classList.add('active');
        }

        // Rank countdown timer
        function updateCountdown() {
            var el = document.getElementById('rankCountdown');
            if (!el) return;
            var now = new Date(), midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            var diff = Math.floor((midnight - now) / 1000);
            var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
            el.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();
        /* SCROLL ANIMATION */
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.feat-card, .course-card, .topic-card').forEach(el => {
            el.classList.add('fade-in');
            revealObserver.observe(el);
        });
        document.querySelectorAll('.stat-item, .how-step, .profile-stat').forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });

        /* RIPPLE EFFECT - applied to all clickable buttons */
        function addRipple(e) {
            const btn = e.currentTarget;
            const circle = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            circle.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                background:rgba(255,255,255,0.25);
                border-radius:50%;
                transform:scale(0);
                animation:ripple 0.55s linear;
                pointer-events:none;
            `;
            btn.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        }

        document.querySelectorAll('.bp, .bs, .bp-full, .ca-btn, .topic-btn, .danger-btn').forEach(btn => {
            btn.addEventListener('click', addRipple);
        });

        /* ── PROFILE DROPDOWN ── */
        function toggleProfileDropdown(e) {
            e.stopPropagation();
            var pd = document.getElementById('profileDropdown');
            if (pd) pd.classList.toggle('open');
        }
        function closeProfileDropdown() {
            var dd = document.getElementById('profileDropdown');
            if (dd) dd.classList.remove('open');
        }
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.pbtn-wrap')) closeProfileDropdown();
        });

        /* ── TOAST SYSTEM ── */
        function showToast(msg, type, duration) {
            var container = document.getElementById('toastContainer');
            if (!container) return;
            var toast = document.createElement('div');
            toast.className = 'toast' + (type ? ' ' + type : '');
            toast.textContent = msg;
            container.appendChild(toast);
            var d = duration || 2400;
            setTimeout(function() {
                toast.style.animation = 'toastOut 0.3s ease forwards';
                setTimeout(function() { toast.remove(); }, 300);
            }, d);
        }

        /* Show toast on key navigation actions */
        var origGo = go;
        // Enhance go() with toast feedback for certain transitions
        function goWithFeedback(p) {
            var toastMap = {
                'learn':       ['📚 Learning Hub', ''],
                'practice':    ['⚙️ Practice Mode', ''],
                'rank':        ['🏆 Rank Mode', ''],
                'leaderboard': ['🥇 Leaderboard', ''],
                'profile':     ['👤 Your Profile', ''],
                'settings':    ['⚙️ Settings', ''],
                'aichat':      ['✦ AI Chat', ''],
                'results':     ['📊 Session Complete!', 'success'],
                'rankresults': ['🎖️ Rank Battle Complete!', 'success'],
            };
            go(p);
            if (toastMap[p]) showToast(toastMap[p][0], toastMap[p][1], 1800);
        }

        /* ── KEYBOARD SHORTCUTS ── */
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd+Enter = run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                var activePg = document.querySelector('.pg.on');
                if (!activePg) return;
                var id = activePg.id;
                if (id === 'pg-lesson') { runCode(); showToast('▶ Running code...', '', 1200); }
                if (id === 'pg-coding') { startCoding(); }
                if (id === 'pg-ranksession') { rankRun(); }
            }
            // Escape = go back to home
            if (e.key === 'Escape') {
                var overlay = document.getElementById('navMorePanel');
                if (overlay && overlay.classList.contains('open')) { closeMore(); return; }
                closeProfileDropdown();
            }
        });

        /* ── SETTINGS: font size slider wires to editors ── */
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('settings-slider')) {
                var fs = e.target.value + 'px';
                var fsel = document.getElementById('fsval');
                if (fsel) fsel.textContent = fs;
                var editors = document.querySelectorAll('#codeEditor, #userCode, .editor-area textarea');
                editors.forEach(function(ed) { ed.style.fontSize = fs; });
            }
        });

        /* ── AUTO-HIGHLIGHT active nav on load ── */
        (function() {
            var firstPage = document.querySelector('.pg.on');
            if (firstPage) {
                var pid = firstPage.id.replace('pg-', '');
                var nlEl = document.getElementById('nl-' + pid);
                if (nlEl) {
                    document.querySelectorAll('.nl').forEach(function(x) { x.classList.remove('act'); });
                    nlEl.classList.add('act');
                }
            }
        })();

        /* ── RIPPLE @keyframes injection ── */
        (function() {
            var style = document.createElement('style');
            style.textContent = '@keyframes ripple { to { transform: scale(30); opacity: 0; } }';
            document.head.appendChild(style);
        })();


        /* ════════════════════════════════════════════════════════════
           FINAL CLEAN JS — Single authoritative block
           Replaces all previous injected overrides
        ════════════════════════════════════════════════════════════ */
        (function() {

            /* ── 1. SCRAPBOOK THEME — set once, done ── */
            document.documentElement.setAttribute('data-theme', 'scrapbook');
            document.body.setAttribute('data-theme', 'scrapbook');
            window.toggleTheme = function() {};

            /* ── 2. RIPPLE KEYFRAMES ── */

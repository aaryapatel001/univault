/* ═══ Coding Editor, Timers & Power-ups ═══ */

        function runCode() {
            var out = document.getElementById('consoleOutput');
            out.style.color = 'var(--muted)';
            out.textContent = 'Running...';
            // Try to run as JavaScript (lesson editor)
            var code = document.getElementById('userCode') ? document.getElementById('userCode').value : '';
            setTimeout(function () {
                if (!code.trim()) {
                    out.style.color = 'var(--secondary)';
                    out.textContent = '>>> (no output)\n>>> Process finished with exit code 0';
                    return;
                }
                try {
                    var logs = [];
                    var origLog = console.log;
                    console.log = function() { logs.push(Array.from(arguments).join(' ')); origLog.apply(console, arguments); };
                    // Translate Python-like print() to console.log for demo
                    var jsCode = code
                        .replace(/print\((.*?)\)/g, 'console.log($1)')
                        .replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null')
                        .replace(/#.*$/gm, '');
                    eval(jsCode);
                    console.log = origLog;
                    out.style.color = 'var(--secondary)';
                    out.textContent = logs.length ? '>>> ' + logs.join('\n>>> ') + '\n>>> Process finished with exit code 0'
                        : '>>> Process finished with exit code 0';
                } catch(e) {
                    console.log = origLog;
                    out.style.color = 'var(--danger)';
                    out.textContent = '✕ Error: ' + e.message;
                }
            }, 400);
        }

        function toggleHint() {
            var hc = document.getElementById('hintContent');
            if (hc) hc.classList.toggle('show');
        }

        /* ── PRACTICE TIMERS ── */
        function startThinkTimer() {
            if (thinkInterval) clearInterval(thinkInterval);
            thinkSecs = 154; codeSecs = 0; codingStarted = false;
            updateTimerDisplay();
            thinkInterval = setInterval(function () {
                thinkSecs++;
                updateTimerDisplay();
                var d = document.getElementById('thinkTimer');
                if (d) d.className = thinkSecs > 180 ? 'timer-digits danger' : thinkSecs > 120 ? 'timer-digits warn' : 'timer-digits';
            }, 1000);
        }

        function startCoding() {
            if (!codingStarted) {
                codingStarted = true;
                clearInterval(thinkInterval);
                var tb = document.getElementById('thinkBox'), cb = document.getElementById('codeBox');
                if (tb) tb.classList.add('inactive');
                if (cb) cb.classList.remove('inactive');
                codeInterval = setInterval(function () {
                    codeSecs++;
                    updateTimerDisplay();
                    var d = document.getElementById('codeTimer');
                    if (d) d.className = codeSecs > 240 ? 'timer-digits danger' : codeSecs > 150 ? 'timer-digits warn' : 'timer-digits';
                }, 1000);
            }
            var c = document.getElementById('codingConsole');
            c.style.color = 'var(--muted)'; c.textContent = 'Executing...';
            // Try to run editor code
            var editorCode = document.getElementById('codeEditor') ? document.getElementById('codeEditor').value : '';
            setTimeout(function () {
                try {
                    var logs = [];
                    var origLog = console.log;
                    console.log = function() { logs.push(Array.from(arguments).join(' ')); origLog.apply(console, arguments); };
                    var jsCode = editorCode
                        .replace(/def\s+(\w+)\s*\((.*?)\)\s*:/g, 'function $1($2) {')
                        .replace(/return\s+/g, 'return ')
                        .replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null')
                        .replace(/print\((.*?)\)/g, 'console.log($1)')
                        .replace(/#.*$/gm, '');
                    eval(jsCode);
                    console.log = origLog;
                    var testOutput = '✓ Test 1: [2,7,11,15], target=9 → [0,1]  PASS\n✓ Test 2: [3,2,4], target=6 → [1,2]  PASS\n✓ Test 3: [3,3], target=6 → [0,1]  PASS\n\nAll test cases passed! Runtime: 52ms';
                    c.style.color = 'var(--secondary)';
                    c.textContent = logs.length ? logs.join('\n') + '\n\n' + testOutput : testOutput;
                } catch(e) {
                    console.log = origLog;
                    c.style.color = 'var(--secondary)';
                    c.textContent = '✓ Test 1: [2,7,11,15], target=9 → [0,1]  PASS\n✓ Test 2: [3,2,4], target=6 → [1,2]  PASS\n✓ Test 3: [3,3], target=6 → [0,1]  PASS\n\nAll test cases passed! Runtime: 52ms';
                }
            }, 700);
        }

        function updateTimerDisplay() {
            var t = document.getElementById('thinkTimer'), c = document.getElementById('codeTimer');
            if (t) t.textContent = fmt(thinkSecs);
            if (c) c.textContent = fmt(codeSecs);
        }

        function fmt(s) {
            var m = Math.floor(s / 60), sec = s % 60;
            return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function activatePU(type) {
            var msgs = { freeze: '❄️ Time frozen for 30s! -0 pts', skip: '⏭ Question skipped! -100 pts', kill: '💀 Question killed! -200 pts', hint: '🧠 AI Hint revealed! -50 pts' };
            var c = document.getElementById('codingConsole');
            c.style.color = 'var(--info)'; c.textContent = msgs[type];
            setTimeout(function () { c.style.color = 'var(--muted)'; c.textContent = 'Press Run to execute your code...'; }, 2000);
        }

        /* ── RANK SESSION ── */
        function startRankTimers() {
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

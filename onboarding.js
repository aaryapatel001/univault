/* ═══ Onboarding Flow ═══ */

            var e = document.getElementById(id);
            e.type = e.type === 'password' ? 'text' : 'password';
        }

        function updateStrength(v) {
            var s = 0;
            if (v.length >= 8) s++;
            if (/[A-Z]/.test(v)) s++;
            if (/[0-9]/.test(v)) s++;
            if (/[^A-Za-z0-9]/.test(v)) s++;
            var c = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
            var l = ['Weak', 'Fair', 'Good', 'Strong'];
            for (var i = 1; i <= 4; i++) {
                document.getElementById('sg' + i).style.background = i <= s ? c[s - 1] : 'rgba(255,255,255,0.08)';
            }
            var lb = document.getElementById('slb');
            if (!v.length) { lb.textContent = 'Enter a password'; lb.style.color = ''; }
            else { lb.textContent = l[s - 1] || 'Weak'; lb.style.color = c[s - 1] || '#ef4444'; }
        }

        function obNext() {
            if (obStep < 3) {
                document.getElementById('oc' + obStep).classList.remove('active');
                document.getElementById('os' + obStep).classList.remove('active');
                document.getElementById('os' + obStep).classList.add('done');
                obStep++;
                document.getElementById('oc' + obStep).classList.add('active');
                document.getElementById('os' + obStep).classList.add('active');
                document.getElementById('obpf').style.width = ((obStep + 1) * 25) + '%';
            }
        }
        function obBack() {
            if (obStep > 0) {
                document.getElementById('oc' + obStep).classList.remove('active');
                document.getElementById('os' + obStep).classList.remove('active');
                obStep--;
                document.getElementById('oc' + obStep).classList.add('active');
                document.getElementById('os' + obStep).classList.remove('done');
                document.getElementById('os' + obStep).classList.add('active');
                document.getElementById('obpf').style.width = ((obStep + 1) * 25) + '%';
            }
        }
        function selLang(el) { document.querySelectorAll('.lang-card').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); }
        function selLevel(el) { document.querySelectorAll('.level-card').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); }
        function selGoal(el) { document.querySelectorAll('.goal-card').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); }

        function completeOB() {
            var ov = document.getElementById('sov');
            ov.classList.add('show');
            setTimeout(function () { document.getElementById('sbf').style.width = '100%'; }, 100);
            setTimeout(function () { ov.classList.remove('show'); go('learn'); obStep = 0; }, 2600);
        }

        function setDiff(el, type) {
            document.querySelectorAll('.diff-toggle').forEach(x => x.className = 'diff-toggle');
            el.classList.add('active-' + type);
        }

        function switchEditorTab(btn, showId, hideId) {
            document.querySelectorAll('.editor-tab').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(showId).style.display = 'block';
            document.getElementById(hideId).style.display = 'none';
        }


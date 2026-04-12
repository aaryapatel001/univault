/* ═══ Fusion Orbital Timeline ═══ */
        /* ════ FUSION Orbital Timeline + Mockup JS ════ */
        (function initFusionOrbit() {
            var timelineData = [
                { id:1, title:'Onboarding', date:'Day 1',     content:'Complete skill assessment, choose your language and set your learning goals.', status:'completed',  energy:100, icon:'🧭', relatedIds:[2] },
                { id:2, title:'Learning',   date:'Week 1-4',  content:'Work through adaptive lessons with AI-powered explanations and an interactive code editor.', status:'in-progress', energy:74, icon:'📚', relatedIds:[1,3] },
                { id:3, title:'Practice',   date:'Week 2+',   content:'Solve curated problems by difficulty, track weak topics, and build problem-solving speed.', status:'in-progress', energy:55, icon:'⚡', relatedIds:[2,4] },
                { id:4, title:'Rank Mode',  date:'Daily',     content:'Compete in timed daily challenges: 4 sets × 5 questions with a global leaderboard.', status:'pending', energy:30, icon:'🏆', relatedIds:[3,5] },
                { id:5, title:'Top Coder',  date:'Month 2+',  content:'Reach top 100 global rank, unlock badges, mentor others and dominate the leaderboard.', status:'pending', energy:10, icon:'🌟', relatedIds:[4] }
            ];
            var nodesEl = document.getElementById('foNodes');
            var detailCard = document.getElementById('foDetailCard');
            if (!nodesEl) return;

            var rotAngle = 0, autoRot = true, activeId = null;
            var RADIUS = 130;

            /* Build nodes */
            timelineData.forEach(function(item) {
                var n = document.createElement('div');
                n.className = 'fo-node';
                n.id = 'fo-node-' + item.id;
                n.innerHTML = '<div class="fo-node-dot">' + item.icon + '</div><div class="fo-node-label">' + item.title + '</div>';
                n.addEventListener('click', function(e) { e.stopPropagation(); foToggleNode(item.id); });
                nodesEl.appendChild(n);
            });

            function updatePos() {
                var cont = document.getElementById('fusionOrbit');
                if (!cont) return;
                var cx = cont.offsetWidth / 2, cy = cont.offsetHeight / 2;
                timelineData.forEach(function(item, idx) {
                    var n = document.getElementById('fo-node-' + item.id);
                    if (!n) return;
                    var ang = ((idx / timelineData.length) * 360 + rotAngle) % 360;
                    var rad = ang * Math.PI / 180;
                    n.style.left = (cx + RADIUS * Math.cos(rad)) + 'px';
                    n.style.top  = (cy + RADIUS * Math.sin(rad)) + 'px';
                    n.style.opacity = activeId ? '1' : Math.max(0.35, 0.35 + 0.65 * ((1 + Math.sin(rad)) / 2)).toFixed(2);
                    n.style.zIndex = Math.round(20 + 15 * Math.cos(rad));
                });
            }

            (function tick() {
                if (autoRot) { rotAngle = (rotAngle + 0.35) % 360; updatePos(); }
                requestAnimationFrame(tick);
            })();

            function foToggleNode(id) {
                if (activeId === id) { foCloseDetailFn(); return; }
                activeId = id; autoRot = false;
                var item = timelineData.find(function(d) { return d.id === id; });
                timelineData.forEach(function(d) {
                    var n = document.getElementById('fo-node-' + d.id);
                    if (!n) return;
                    n.classList.remove('fo-active','fo-related');
                    if (d.id === id) n.classList.add('fo-active');
                    else if (item && item.relatedIds.indexOf(d.id) >= 0) n.classList.add('fo-related');
                });
                var idx = timelineData.findIndex(function(d) { return d.id === id; });
                rotAngle = (270 - (idx / timelineData.length) * 360 + 360) % 360;
                updatePos();
                if (item) {
                    document.getElementById('foDetailTitle').textContent = item.title;
                    document.getElementById('foDetailDate').textContent  = item.date;
                    document.getElementById('foDetailDesc').textContent  = item.content;
                    document.getElementById('foDetailEnergy').textContent = item.energy + '%';
                    document.getElementById('foDetailBarFill').style.width = item.energy + '%';
                    var st = document.getElementById('foDetailStatus');
                    st.textContent = item.status === 'completed' ? 'Complete' : item.status === 'in-progress' ? 'In Progress' : 'Pending';
                    st.className = 'fo-detail-status ' + item.status;
                    detailCard.style.display = 'block';
                    detailCard.style.animation = 'foCardIn 0.25s cubic-bezier(0.16,1,0.3,1) both';
                }
            }
            function foCloseDetailFn() {
                activeId = null; autoRot = true;
                detailCard.style.display = 'none';
                timelineData.forEach(function(d) {
                    var n = document.getElementById('fo-node-' + d.id);
                    if (n) n.classList.remove('fo-active','fo-related');
                });
            }
            window.foCloseDetail = foCloseDetailFn;

            /* Section With Mockup scroll reveal */
            var mockObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
                });
            }, { threshold: 0.12 });
            document.querySelectorAll('.fusion-feature-block').forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(32px)';
                el.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
                mockObs.observe(el);
            });
        })();


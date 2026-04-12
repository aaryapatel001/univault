/* ═══ Hello World Hero Animation ═══ */

        })();


        /* ════════════════════════════════════════════════════════════
           HERO HEADING v17 — "Hello World." Interactive system
        ════════════════════════════════════════════════════════════ */
        (function buildHelloWorld() {

            var el = document.getElementById('bubbleHeading');
            if (!el) return;

            /* Clear anything the old buildBubbleH1 might have inserted */
            el.innerHTML = '';
            el.classList.add('hw-heading-root');

            /* ── BUILD STRUCTURE ── */
            var wrap = document.createElement('div');
            wrap.className = 'hw-wrap';

            /* Ghost layer (depth blur) */
            var ghost = document.createElement('div');
            ghost.className = 'hw-ghost';
            ghost.setAttribute('aria-hidden', 'true');

            /* Main layer */
            var main = document.createElement('div');
            main.className = 'hw-main';

            /* Mouse reactive light */
            var mouseLight = document.createElement('div');
            mouseLight.className = 'hw-mouse-light';
            mouseLight.setAttribute('aria-hidden', 'true');

            /* Shimmer layer */
            var shimmer = document.createElement('div');
            shimmer.className = 'hw-shimmer-layer';
            shimmer.setAttribute('aria-hidden', 'true');

            /* ── "Hello" word ── */
            function makeWord(text, cls) {
                var w = document.createElement('span');
                w.className = 'hw-word';
                var inner = document.createElement('span');
                inner.className = cls;
                inner.textContent = text;
                w.appendChild(inner);
                return w;
            }

            var wordHello = makeWord('Hello', 'hw-word-hello');
            var wordWorld = makeWord('World.', 'hw-word-world');

            /* Assemble main layer */
            main.appendChild(wordHello.cloneNode(true));
            main.appendChild(wordWorld.cloneNode(true));
            main.appendChild(shimmer);

            /* Ghost (duplicate for depth) */
            ghost.appendChild(wordHello.cloneNode(true));
            ghost.appendChild(wordWorld.cloneNode(true));

            /* Assemble wrap */
            wrap.appendChild(ghost);
            wrap.appendChild(mouseLight);
            wrap.appendChild(main);

            el.appendChild(wrap);

            /* ── MOUSE REACTIVE LIGHT ── */
            var ticking = false;
            var mx = -200, my = 0;
            var curMx = -200, curMy = 0;

            function lerp(a, b, t) { return a + (b - a) * t; }

            function updateLight() {
                curMx = lerp(curMx, mx, 0.12);
                curMy = lerp(curMy, my, 0.12);
                mouseLight.style.setProperty('--mx', curMx.toFixed(1) + 'px');
                mouseLight.style.setProperty('--my', curMy.toFixed(1) + 'px');
                requestAnimationFrame(updateLight);
            }
            updateLight();

            var heroSection = el.closest('.hero') || el.closest('#heroSection') || el.parentElement;
            if (heroSection) {
                heroSection.addEventListener('mousemove', function(e) {
                    var rect = el.getBoundingClientRect();
                    mx = e.clientX - rect.left;
                    my = e.clientY - rect.top;
                }, { passive: true });

                heroSection.addEventListener('mouseleave', function() {
                    mx = -300;
                    my = -300;
                }, { passive: true });
            }

            /* ── WORD HOVER EFFECT (micro interaction) ── */
            var worldSpan = el.querySelector('.hw-word-world');
            var helloSpan = el.querySelector('.hw-word-hello');

            if (worldSpan) {
                worldSpan.addEventListener('mouseenter', function() {
                    var isFocus = document.documentElement.getAttribute('data-theme') === 'focus';
                    var glowColor = isFocus ? 'rgba(79,140,255,0.4)' : 'rgba(255,106,61,0.45)';
                    worldSpan.style.filter = 'drop-shadow(0 0 28px ' + glowColor + ')';
                    worldSpan.style.transform = 'scale(1.02) translateY(-2px)';
                    worldSpan.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease';
                });
                worldSpan.addEventListener('mouseleave', function() {
                    worldSpan.style.filter = '';
                    worldSpan.style.transform = '';
                });
            }
            if (helloSpan) {
                helloSpan.addEventListener('mouseenter', function() {
                    helloSpan.style.filter = 'brightness(1.15)';
                    helloSpan.style.transition = 'filter 0.25s ease';
                });
                helloSpan.addEventListener('mouseleave', function() {
                    helloSpan.style.filter = '';
                });
            }

        })();

        /* Patch: override old buildBubbleH1 to be a no-op since we replaced it */
        function buildBubbleH1() { /* replaced by buildHelloWorld */ }


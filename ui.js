/* ═══ UI Effects — Scroll, Dashboard, Navbar, Animations ═══ */

            var rippleStyle = document.createElement('style');
            rippleStyle.textContent = '@keyframes ripple { to { transform: scale(30); opacity: 0; } }';
            document.head.appendChild(rippleStyle);

            /* ── 3. INNER PAGES — center nav hide/show ── */
            var TOPBAR_PAGES = { 'coding': 1, 'lesson': 1, 'ranksession': 1 };

            /* ── 4. SINGLE go() WRAPPER — one and only ── */
            var _baseGo = window.go;
            window.go = function(page) {
                /* Call original base go() */
                if (typeof _baseGo === 'function') _baseGo(page);

                /* Update fnav-center active link */
                document.querySelectorAll('.fnav-center .nl').forEach(function(b) { b.classList.remove('act'); });
                var nl = document.getElementById('nl-' + page);
                if (nl) nl.classList.add('act');

                /* Close dropdown */
                var dd = document.getElementById('profileDropdown');
                if (dd) dd.classList.remove('open');

                /* Body class for page tracking */
                var bodyClasses = document.body.className.split(' ').filter(function(c) { return !c.startsWith('page-'); });
                bodyClasses.push('page-' + page);
                document.body.className = bodyClasses.join(' ');

                /* Center nav: hide on topbar pages */
                var navCenter = document.getElementById('navCenter');
                if (navCenter) {
                    if (TOPBAR_PAGES[page]) {
                        navCenter.style.opacity = '0';
                        navCenter.style.transform = 'translateX(-50%) translateY(-10px)';
                        navCenter.style.pointerEvents = 'none';
                    } else {
                        /* Only restore if not scrolled */
                        if (window.scrollY <= 50) {
                            navCenter.style.opacity = '1';
                            navCenter.style.transform = 'translateX(-50%)';
                            navCenter.style.pointerEvents = 'auto';
                        }
                    }
                }

                /* Home button: hide on home, show elsewhere */
                var hfb = document.getElementById('homeFloatingBtn');
                if (hfb) {
                    if (page === 'home') {
                        hfb.style.opacity = '0';
                        hfb.style.pointerEvents = 'none';
                    } else {
                        if (window.scrollY <= 50) {
                            hfb.style.opacity = '1';
                            hfb.style.transform = 'translateX(-50%)';
                            hfb.style.pointerEvents = 'auto';
                        }
                    }
                }

                /* Toast feedback */
                var toastMap = {
                    'learn':       ['Learning Hub', ''],
                    'practice':    ['Practice Mode', ''],
                    'rank':        ['Rank Mode', ''],
                    'leaderboard': ['Leaderboard', ''],
                    'profile':     ['Your Profile', ''],
                    'settings':    ['Settings', ''],
                    'aichat':      ['AI Chat', ''],
                    'results':     ['Session Complete!', 'success'],
                    'rankresults': ['Rank Battle Complete!', 'success'],
                };
                if (toastMap[page] && typeof showToast === 'function') {
                    showToast(toastMap[page][0], toastMap[page][1], 1600);
                }
            };

            /* ── 5. UNIFIED SCROLL HANDLER — navbar hide/show + center nav + HFB ── */
            var lastScrollY = 0;
            var scrollTicking = false;
            var NAV_HIDE_THRESHOLD = 80;  /* px before hiding begins */
            var NAV_HYSTERESIS    = 12;  /* minimum scroll delta before reacting */

            function applyNavbarScrollState(sy) {
                var navUnified = document.getElementById('navUnified');
                var hfb = document.getElementById('homeFloatingBtn');
                var si  = document.getElementById('scrollIndicator');

                var scrollingDown = sy > lastScrollY;
                var delta = Math.abs(sy - lastScrollY);
                var atTop = sy < 50;

                /* ── NAVBAR SHOW/HIDE ── */
                if (navUnified) {
                    if (atTop) {
                        navUnified.classList.remove('nav-scrolled-hidden', 'nav-scrolled');
                    } else if (delta > NAV_HYSTERESIS) {
                        if (scrollingDown && sy > NAV_HIDE_THRESHOLD) {
                            navUnified.classList.add('nav-scrolled-hidden');
                        } else {
                            navUnified.classList.remove('nav-scrolled-hidden');
                            if (sy > 80) navUnified.classList.add('nav-scrolled');
                            else navUnified.classList.remove('nav-scrolled');
                        }
                    }
                }

                /* Also handle old IDs if any JS refs them */
                var navLeft   = document.getElementById('navLeft');
                var navCenter = document.getElementById('navCenter');
                var navRight  = document.getElementById('navRight');
                var bodyHasTopbar = TOPBAR_PAGES[document.body.className.match(/page-\S+/)?.[0]?.replace('page-','')];

                var scrollingDown = sy > lastScrollY;
                var delta = Math.abs(sy - lastScrollY);
                var atTop = sy < 50;

                /* ── NAVBAR SHOW/HIDE ── */
                if (atTop) {
                    /* Always visible at top */
                    if (navLeft)   { navLeft.classList.remove('nav-scrolled-hidden',   'nav-scrolled'); }
                    if (navRight)  { navRight.classList.remove('nav-scrolled-hidden',  'nav-scrolled'); }
                    if (navCenter && !bodyHasTopbar) {
                        navCenter.classList.remove('nav-scrolled-hidden', 'nav-scrolled');
                        navCenter.style.opacity = '1';
                        navCenter.style.transform = 'translateX(-50%)';
                        navCenter.style.pointerEvents = 'auto';
                    }
                } else if (delta > NAV_HYSTERESIS) {
                    if (scrollingDown && sy > NAV_HIDE_THRESHOLD) {
                        /* SCROLLING DOWN → hide all three segments */
                        if (navLeft)  navLeft.classList.add('nav-scrolled-hidden');
                        if (navRight) navRight.classList.add('nav-scrolled-hidden');
                        if (navCenter && !bodyHasTopbar) {
                            navCenter.classList.add('nav-scrolled-hidden');
                        }
                    } else {
                        /* SCROLLING UP → show all, apply scrolled style */
                        if (navLeft)   { navLeft.classList.remove('nav-scrolled-hidden');  navLeft.classList.add('nav-scrolled'); }
                        if (navRight)  { navRight.classList.remove('nav-scrolled-hidden'); navRight.classList.add('nav-scrolled'); }
                        if (navCenter && !bodyHasTopbar) {
                            navCenter.classList.remove('nav-scrolled-hidden');
                            navCenter.classList.add('nav-scrolled');
                            navCenter.style.opacity = '1';
                            navCenter.style.transform = 'translateX(-50%)';
                            navCenter.style.pointerEvents = 'auto';
                        }
                        /* Remove scrolled style when near top */
                        if (sy < 80) {
                            if (navLeft)  navLeft.classList.remove('nav-scrolled');
                            if (navRight) navRight.classList.remove('nav-scrolled');
                            if (navCenter) navCenter.classList.remove('nav-scrolled');
                        }
                    }
                }

                /* ── CENTER NAV FADE (for inner topbar pages — unchanged) ── */
                if (navCenter && bodyHasTopbar) {
                    navCenter.style.opacity = '0';
                    navCenter.style.transform = 'translateX(-50%) translateY(-10px)';
                    navCenter.style.pointerEvents = 'none';
                }

                /* ── HOME FLOATING BUTTON ── */
                if (hfb) {
                    var isHome = document.body.classList.contains('page-home');
                    if (sy > 50 || isHome) {
                        hfb.style.opacity = '0';
                        hfb.style.transform = 'translateX(-50%) translateY(10px)';
                        hfb.style.pointerEvents = 'none';
                    } else {
                        hfb.style.opacity = '1';
                        hfb.style.transform = 'translateX(-50%)';
                        hfb.style.pointerEvents = 'auto';
                    }
                }

                /* ── SCROLL INDICATOR IN HERO ── */
                if (si) si.style.opacity = sy > 60 ? '0' : '1';

                lastScrollY = sy;
            }

            window.addEventListener('scroll', function() {
                if (!scrollTicking) {
                    requestAnimationFrame(function() {
                        applyNavbarScrollState(window.scrollY);
                        scrollTicking = false;
                    });
                    scrollTicking = true;
                }
            }, { passive: true });

            /* ── 6. PROFILE DROPDOWN ── */
            window.toggleProfileDropdown = function(e) {
                if (e) e.stopPropagation();
                var dd = document.getElementById('profileDropdown');
                if (dd) dd.classList.toggle('open');
            };
            window.closeProfileDropdown = function() {
                var dd = document.getElementById('profileDropdown');
                if (dd) dd.classList.remove('open');
            };
            document.addEventListener('click', function(e) {
                var dd = document.getElementById('profileDropdown');
                var pb = document.querySelector('.fnav-right .pbtn');
                if (dd && !dd.contains(e.target) && pb && !pb.contains(e.target)) {
                    dd.classList.remove('open');
                }
            });

            /* ── 7. BUBBLE TEXT H1 ── */
            (function buildBubbleH1() {
                var el = document.getElementById('bubbleHeading');
                if (!el) return;
                var line1 = 'Master Coding.';
                var line2 = 'Rank Every Day.';
                var allSpans = [];
                function addLine(text) {
                    for (var i = 0; i < text.length; i++) {
                        var ch = text[i];
                        var span = document.createElement('span');
                        if (ch === ' ') {
                            span.className = 'bubble-char bubble-space';
                            span.innerHTML = '\u00A0';
                        } else {
                            span.className = 'bubble-char';
                            span.textContent = ch;
                        }
                        span.dataset.idx = allSpans.length;
                        el.appendChild(span);
                        allSpans.push(span);
                    }
                }
                addLine(line1);
                var br = document.createElement('span');
                br.className = 'bubble-char bubble-br';
                el.appendChild(br);
                addLine(line2);
                var hovIdx = null;
                function applyBubble(h) {
                    hovIdx = h;
                    allSpans.forEach(function(sp, i) {
                        sp.classList.remove('bubble-char-d0','bubble-char-d1','bubble-char-d2','bubble-char-far');
                        if (h === null) return;
                        var d = Math.abs(i - h);
                        if      (d === 0) sp.classList.add('bubble-char-d0');
                        else if (d === 1) sp.classList.add('bubble-char-d1');
                        else if (d === 2) sp.classList.add('bubble-char-d2');
                        else              sp.classList.add('bubble-char-far');
                    });
                }
                allSpans.forEach(function(sp, i) {
                    sp.addEventListener('mouseenter', function() { applyBubble(i); });
                });
                el.addEventListener('mouseleave', function() { applyBubble(null); });
            })();

            /* ── 8. TYPEWRITER ── */
            (function initTypewriter() {
                var el = document.getElementById('typewriterEl');
                if (!el) return;
                var words = [
                    'Practice smarter with AI-adaptive questions.',
                    'Real-time rank battles with developers worldwide.',
                    'Personalized learning paths built for your goals.',
                    'Master coding one challenge at a time.'
                ];
                var speed = 45, deleteSpeed = 22, delay = 2200;
                var wordIdx = 0, charIdx = 0, deleting = false;
                function tick() {
                    var cur = words[wordIdx];
                    if (!deleting) {
                        if (charIdx < cur.length) {
                            el.textContent = cur.substring(0, charIdx + 1);
                            charIdx++;
                            setTimeout(tick, speed);
                        } else {
                            setTimeout(function() { deleting = true; tick(); }, delay);
                        }
                    } else {
                        if (charIdx > 0) {
                            el.textContent = cur.substring(0, charIdx - 1);
                            charIdx--;
                            setTimeout(tick, deleteSpeed);
                        } else {
                            deleting = false;
                            wordIdx = (wordIdx + 1) % words.length;
                            setTimeout(tick, 300);
                        }
                    }
                }
                tick();
            })();

            /* ── 9. 3D TILT ON CARDS (capped at 4deg) ── */
            document.querySelectorAll('.tilt-card').forEach(function(card) {
                card.addEventListener('mousemove', function(e) {
                    var r = card.getBoundingClientRect();
                    var rx = ((e.clientY - (r.top + r.height/2)) / (r.height/2)) * -4;
                    var ry = ((e.clientX - (r.left + r.width/2))  / (r.width/2))  *  4;
                    card.style.transform = 'rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-4px) scale(1.01)';
                });
                card.addEventListener('mouseleave', function() { card.style.transform = ''; });
            });

            /* ── 10. MAGNETIC BUTTONS (subtle 0.12 factor) ── */
            document.querySelectorAll('.magnetic').forEach(function(el) {
                el.addEventListener('mousemove', function(e) {
                    var r = el.getBoundingClientRect();
                    var dx = (e.clientX - (r.left + r.width/2))  * 0.12;
                    var dy = (e.clientY - (r.top  + r.height/2)) * 0.12;
                    el.style.transform = 'translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px)';
                });
                el.addEventListener('mouseleave', function() { el.style.transform = ''; });
            });

            /* ── 11. SCROLL REVEAL ── */
            var revealObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (!e.isIntersecting) return;
                    var delay = parseInt(e.target.dataset.delay) || 0;
                    setTimeout(function() { e.target.classList.add('show'); }, delay);
                    revealObs.unobserve(e.target);
                });
            }, { threshold: 0.12 });
            document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

            /* ── 12. STAGGER ENTRY ── */
            var staggerObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (!e.isIntersecting) return;
                    var siblings = Array.from(e.target.parentElement.querySelectorAll('.stagger-entry'));
                    var idx = siblings.indexOf(e.target);
                    setTimeout(function() { e.target.classList.add('in'); }, idx * 80);
                    staggerObs.unobserve(e.target);
                });
            }, { threshold: 0.15 });
            document.querySelectorAll('.sec-head, .step, .stat-item').forEach(function(el) {
                el.classList.add('stagger-entry');
                staggerObs.observe(el);
            });

            /* ── 13. GLOWING CARD BORDER (cursor follow) ── */
            document.addEventListener('mousemove', function(e) {
                document.querySelectorAll('.feat-card').forEach(function(card) {
                    var r = card.getBoundingClientRect();
                    card.style.setProperty('--glow-x', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
                    card.style.setProperty('--glow-y', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
                });
            });
            document.querySelectorAll('.feat-card').forEach(function(card) {
                card.addEventListener('mouseenter', function() { card.style.setProperty('--glow-opacity','1'); });
                card.addEventListener('mouseleave', function() { card.style.setProperty('--glow-opacity','0'); });
            });

            /* ── 14. FEATURE GRID FOCUS MODE ── */
            var fg = document.querySelector('.feat-grid');
            if (fg) {
                fg.addEventListener('mouseenter', function() { fg.classList.add('focus-active'); });
                fg.addEventListener('mouseleave', function() { fg.classList.remove('focus-active'); });
            }

            /* ── 15. BUTTON RIPPLE ── */
            document.addEventListener('click', function(e) {
                var btn = e.target.closest('.bp, .bs');
                if (!btn) return;
                var r = btn.getBoundingClientRect();
                var rp = document.createElement('span');
                rp.className = 'btn-ripple';
                var sz = Math.max(r.width, r.height);
                rp.style.cssText = 'width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';
                btn.appendChild(rp);
                setTimeout(function() { rp.remove(); }, 700);
            });

            /* ── 16. METEORS ── */
            function spawnMeteor() {
                var m = document.createElement('div');
                m.className = 'meteor';
                var dist = Math.random() * 300 + 200;
                var dur  = Math.random() * 0.4 + 0.55;
                m.style.cssText = 'left:'+(Math.random()*window.innerWidth*1.2)+'px;top:'+(Math.random()*window.innerHeight*0.4)+'px;width:'+(Math.random()*120+60)+'px;--md:'+dur+'s;--dist:'+dist+'px';
                document.body.appendChild(m);
                setTimeout(function() { m.remove(); }, (dur+0.1)*1000);
                setTimeout(spawnMeteor, Math.random()*6000+3000);
            }
            setTimeout(spawnMeteor, 3000);

            /* ── 17. NAV LINK INDICATOR (fluid pill) ── */
            var navLinks = document.querySelector('.fnav-center .nav-links');
            if (navLinks) {
                var ind = document.createElement('div');
                ind.className = 'nl-indicator';
                navLinks.appendChild(ind);
                document.querySelectorAll('.fnav-center .nl').forEach(function(btn) {
                    btn.addEventListener('mouseenter', function() {
                        var nr = navLinks.getBoundingClientRect();
                        var br = btn.getBoundingClientRect();
                        ind.style.left   = (br.left - nr.left) + 'px';
                        ind.style.width  = br.width + 'px';
                        ind.style.top    = (br.top - nr.top) + 'px';
                        ind.style.height = br.height + 'px';
                        ind.style.opacity = '1';
                    });
                });
                navLinks.addEventListener('mouseleave', function() { ind.style.opacity = '0'; });
            }

            /* ── 18. MARQUEE DUPLICATE FOR SEAMLESS LOOP ── */
            var track = document.getElementById('marqueeTrack');
            if (track && !track.dataset.duped) {
                track.innerHTML += track.innerHTML;
                track.dataset.duped = '1';
            }

            /* ── 19. INITIAL STATE ── */
            /* Set body.page-home on load (home is default) */
            document.body.classList.add('page-home');
            /* Home button starts hidden (we're on home) */
            var hfb = document.getElementById('homeFloatingBtn');
            if (hfb) { hfb.style.opacity = '0'; hfb.style.pointerEvents = 'none'; }
            /* Active nav highlight */
            var firstPg = document.querySelector('.pg.on');
            if (firstPg) {
                var pid = firstPg.id.replace('pg-', '');
                var nlEl = document.getElementById('nl-' + pid);
                if (nlEl) {
                    document.querySelectorAll('.fnav-center .nl').forEach(function(x) { x.classList.remove('act'); });
                    nlEl.classList.add('act');
                }
            }

            /* ── 20. toggleMore / closeMore — no-ops (nav removed) ── */
            window.toggleMore = function(e) { if (e) e.stopPropagation(); };
            window.closeMore  = function() {};

        })();


        /* ════════════════════════════════════════════════════════════
           V14 MOTION JS — Interactions & Animations
        ════════════════════════════════════════════════════════════ */
        (function initMotion() {

            /* ── 1. PROGRESS BAR ANIMATION ── */
            /* Store real widths, start at 0, animate on IntersectionObserver */
            function initProgressBars() {
                document.querySelectorAll('.prog-fill').forEach(function(bar) {
                    var realWidth = bar.style.width || bar.getAttribute('data-width') || '0%';
                    bar.setAttribute('data-real-width', realWidth);
                    bar.style.width = '0%';
                    bar.style.transition = 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
                });
            }

            function animateProgressBars(container) {
                var bars = (container || document).querySelectorAll('.prog-fill[data-real-width]');
                bars.forEach(function(bar, i) {
                    setTimeout(function() {
                        bar.style.width = bar.getAttribute('data-real-width');
                    }, i * 80);
                });
            }

            initProgressBars();

            /* Observe learn page — animate bars when visible */
            var learnPgObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) {
                        animateProgressBars(e.target);
                    }
                });
            }, { threshold: 0.1 });
            var learnPg = document.getElementById('pg-learn');
            if (learnPg) learnPgObs.observe(learnPg);

            /* Re-animate on page visit */
            var origGo14 = window.go;
            window.go = function(page) {
                origGo14(page);
                if (page === 'learn') {
                    setTimeout(function() { animateProgressBars(); }, 200);
                }
                /* Reset + re-trigger animations for repeated visits */
                var pgEl = document.getElementById('pg-' + page);
                if (pgEl) {
                    /* Force animation restart by removing/adding .on class effect */
                    pgEl.style.animation = 'none';
                    pgEl.offsetHeight; /* reflow */
                    pgEl.style.animation = '';
                }
            };

            /* ── 2. RUN BUTTON PRESS ANIMATION ── */
            function hookRunButton() {
                var runBtns = document.querySelectorAll('.ca-btn[onclick*="startCoding"], .ca-btn[onclick*="rankRun"]');
                runBtns.forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        /* Press animation */
                        btn.style.transform = 'scale(0.88)';
                        btn.style.transition = 'transform 60ms ease';
                        setTimeout(function() {
                            btn.style.transform = '';
                            btn.style.transition = '';
                            /* Animate output panel */
                            var console_el = document.getElementById('codingConsole');
                            if (console_el) {
                                console_el.classList.remove('result-shown');
                                void console_el.offsetWidth;
                                setTimeout(function() {
                                    console_el.classList.add('result-shown');
                                }, 400);
                            }
                        }, 120);
                    });
                });
            }
            hookRunButton();

            /* ── 3. TIMER DIGIT TICK ANIMATION ── */
            /* Wrap timer update to add tick animation */
            function hookTimerTick() {
                var timerEls = document.querySelectorAll('.timer-digits');
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(m) {
                        if (m.type === 'characterData' || m.type === 'childList') {
                            var el = m.target.nodeType === 1 ? m.target : m.target.parentElement;
                            if (el && el.classList.contains('timer-digits')) {
                                el.classList.remove('ticked');
                                void el.offsetWidth;
                                el.classList.add('ticked');
                                setTimeout(function() { el.classList.remove('ticked'); }, 300);
                            }
                        }
                    });
                });
                timerEls.forEach(function(el) {
                    observer.observe(el, { characterData: true, childList: true, subtree: true });
                });
            }
            hookTimerTick();

            /* ── 4. LEADERBOARD ROW HOVER DEPTH ── */
            document.querySelectorAll('.lb-row').forEach(function(row, i) {
                /* Already animated by CSS — add mouse parallax for premium feel */
                row.addEventListener('mousemove', function(e) {
                    var r = row.getBoundingClientRect();
                    var relX = ((e.clientX - r.left) / r.width - 0.5) * 4;
                    row.style.transform = 'translateY(-3px) rotateY(' + relX.toFixed(1) + 'deg)';
                });
                row.addEventListener('mouseleave', function() {
                    row.style.transform = '';
                });
            });

            /* ── 5. SCROLL REVEAL (enhanced — once only) ── */
            var revealObsMotion = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    var delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(function() {
                        entry.target.classList.add('show');
                    }, delay);
                    revealObsMotion.unobserve(entry.target);
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            document.querySelectorAll('.reveal').forEach(function(el) {
                revealObsMotion.observe(el);
            });

            /* ── 6. COURSE CARD HOVER — light glow follow ── */
            document.querySelectorAll('.course-card').forEach(function(card) {
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.addEventListener('mousemove', function(e) {
                    var r = card.getBoundingClientRect();
                    var x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
                    var y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
                    card.style.setProperty('--cx', x + '%');
                    card.style.setProperty('--cy', y + '%');
                    card.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(233,79,55,0.06), transparent 60%), rgba(35,28,22,0.9)';
                });
                card.addEventListener('mouseleave', function() {
                    card.style.background = '';
                });
            });

            /* ── 7. BUTTON ACTIVE STATE GLOBAL ── */
            document.addEventListener('mousedown', function(e) {
                var btn = e.target.closest('.bp, .bp-full');
                if (!btn) return;
                btn.style.transform = 'scale(0.96) translateY(0)';
                btn.style.transition = 'transform 70ms ease';
            });
            document.addEventListener('mouseup', function(e) {
                var btn = e.target.closest('.bp, .bp-full');
                if (!btn) return;
                btn.style.transform = '';
                btn.style.transition = '';
            });

            /* ── 8. INLINE POWERUP BUTTONS ANIMATION ── */
            document.querySelectorAll('.pu-inline-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    btn.style.transform = 'scale(0.88)';
                    btn.style.transition = 'transform 70ms ease';
                    setTimeout(function() {
                        btn.style.transform = '';
                        btn.style.transition = '';
                    }, 150);
                });
            });

            /* ── 9. PROFILE DROPDOWN ANIMATION ── */
            var pd = document.getElementById('profileDropdown');
            if (pd) {
                /* Override open class to animate */
                var style = document.createElement('style');
                style.textContent = `
                    .profile-dropdown.open {
                        animation: dropdownReveal 0.22s cubic-bezier(0.16,1,0.3,1) both;
                    }
                    @keyframes dropdownReveal {
                        from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }

            /* ── 10. SECTION TITLE REVEAL ── */
            var sectionObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (!e.isIntersecting) return;
                    var el = e.target;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    sectionObs.unobserve(el);
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

            document.querySelectorAll('.sec-head, .reveal-detail-h, .reveal-list-label').forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
                sectionObs.observe(el);
            });

            /* ── 11. HOME BUTTON SPRING ENTRANCE (when first shown) ── */
            var hfbShown = false;
            var hfbObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(m) {
                    var hfb = document.getElementById('homeFloatingBtn');
                    if (hfb && !hfbShown && parseFloat(hfb.style.opacity) > 0) {
                        hfbShown = true;
                        hfb.style.transition = 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease';
                    }
                });
            });
            var hfb = document.getElementById('homeFloatingBtn');
            if (hfb) hfbObserver.observe(hfb, { attributes: true, attributeFilter: ['style'] });

        })();


        /* ====== AI ASSISTANT JS ====== */
        (function initAI() {
            var aiOpen = false, aiMode = null, aiLoading = false;

            window.aiToggle = function() {
                aiOpen = !aiOpen;
                var a = document.getElementById('aiAssistant');
                if (!a) return;
                a.classList[aiOpen ? 'add' : 'remove']('open');
                if (aiOpen) setTimeout(function() { var inp = document.getElementById('aiInput'); if (inp) inp.focus(); }, 360);
            };

            window.aiToggleMode = function(mode) {
                var sb = document.getElementById('aiModeSearch');
                var tb = document.getElementById('aiModeThink');
                var inp = document.getElementById('aiInput');
                aiMode = (aiMode === mode) ? null : mode;
                if (sb) sb.className = 'ai-mode-btn' + (aiMode === 'search' ? ' active-search' : '');
                if (tb) tb.className = 'ai-mode-btn' + (aiMode === 'think'  ? ' active-think'  : '');
                if (inp) {
                    inp.placeholder =
                        aiMode === 'search' ? 'Search the web...' :
                        aiMode === 'think'  ? 'Think deeply...' :
                        'Ask anything about coding...';
                }
            };

            window.aiAutoResize = function(el) {
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
                var s = document.getElementById('aiSendBtn');
                if (s) s.disabled = el.value.trim() === '';
            };

            window.aiKeydown = function(e) {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aiSend(); }
                if (e.key === 'Escape') aiToggle();
            };

            window.aiChipClick = function(text) {
                var inp = document.getElementById('aiInput');
                if (!inp) return;
                inp.value = text;
                inp.focus();
                aiAutoResize(inp);
            };

            window.aiSend = function() {
                if (aiLoading) return;
                var inp = document.getElementById('aiInput');
                if (!inp || inp.value.trim() === '') return;
                var text = inp.value.trim();
                inp.value = '';
                aiAutoResize(inp);
                aiAddMessage('user', text);
                aiSetLoading(true);
                var delay = aiMode === 'think' ? 2200 : 1200;
                setTimeout(function() {
                    aiSetLoading(false);
                    aiAddMessage('bot', aiGetResponse(text, aiMode));
                }, delay);
            };

            function aiAddMessage(role, text) {
                var msgs = document.getElementById('aiMessages');
                if (!msgs) return;
                var chips = document.getElementById('aiChips');
                if (chips && role === 'user') chips.style.display = 'none';
                var row = document.createElement('div');
                row.className = 'ai-msg ai-msg-' + (role === 'user' ? 'user' : 'bot');
                var bubble = document.createElement('div');
                bubble.className = 'ai-msg-bubble';
                if (role === 'bot') {
                    var av = document.createElement('div');
                    av.className = 'ai-msg-avatar';
                    av.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="currentColor"/></svg>';
                    row.appendChild(av);
                    bubble.innerHTML = aiFormat(text);
                } else {
                    bubble.textContent = text;
                }
                row.appendChild(bubble);
                msgs.appendChild(row);
                msgs.scrollTop = msgs.scrollHeight;
            }

            function aiFormat(t) {
                return '<p>' + t
                    .replace(/```([\s\S]*?)```/g, '</p><pre><code>$1</code></pre><p>')
                    .replace(/`([^`]+)`/g, '<code>$1</code>')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br>') + '</p>';
            }

            function aiSetLoading(on) {
                aiLoading = on;
                var th = document.getElementById('aiThinking');
                var sb = document.getElementById('aiSendBtn');
                var inp = document.getElementById('aiInput');
                if (th)  th.style.display = on ? 'flex' : 'none';
                if (sb)  sb.disabled = on;
                if (inp) inp.disabled = on;
            }

            function aiGetResponse(q, mode) {
                var ql = q.toLowerCase();

                if (mode === 'think') {
                    return 'Let me think through this carefully..\n\n**Deep Analysis:**\n\nFor \u201c' + q + '\u201d, the key insight is to break it down into smaller subproblems.\n\n```\n1. Understand the constraints\n2. Think about edge cases\n3. Choose the right data structure\n```\n\nThis approach usually leads to O(n) or O(n log n). Which step would you like me to elaborate on?';
                }
                if (mode === 'search') {
                    return 'Based on a web search for **\u201c' + q + '\u201d**:\n\nThe latest resources suggest focusing on:\n- Time complexity analysis\n- Space optimization techniques\n- Common algorithmic patterns\n\nWould you like me to go deeper on any of these?';
                }
                if (ql.includes('two sum') || ql.includes('twosum')) {
                    return '**Two Sum \u2014 Hash Map Approach:**\n\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n```\n\n**Why this works:** We store each number\u2019s index in a hash map. For each new number, we check if its complement already exists \u2014 giving us O(n) time and O(n) space. Much better than the O(n\u00b2) brute force!';
                }
                if (ql.includes('debug') || ql.includes('error') || ql.includes('fix')) {
                    return '**Debug Checklist:**\n\n1. Check for **off-by-one errors** in loops\n2. Verify **edge cases**: empty input, single element, duplicates\n3. Print intermediate values to trace the bug\n4. Check **data types** \u2014 int vs float, mutable vs immutable\n\nPaste your code and I\u2019ll spot the issue for you!';
                }
                if (ql.includes('hint')) {
                    return '**Hint Strategy:**\n\nBefore I give you a hint, ask yourself:\n- What\u2019s the **brute force** approach?\n- What\u2019s the **bottleneck** (what makes it slow)?\n- What data structure could eliminate that bottleneck?\n\nCommon patterns: **Hash Map** (O(1) lookup), **Two Pointers** (sorted arrays), **Sliding Window** (subarray problems). Which problem are you working on?';
                }
                if (ql.includes('dynamic programming') || ql.includes(' dp')) {
                    return '**Dynamic Programming in a nutshell:**\n\n```\n1. Define the subproblem\n2. Write the recurrence relation\n3. Identify base cases\n4. Choose: top-down (memo) or bottom-up (table)\n```\n\n```python\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n```\n\nWhat specific DP problem are you tackling?';
                }
                if (ql.includes('best practice') || ql.includes('improve')) {
                    return '**Code Quality Best Practices:**\n\n- **Naming:** use descriptive names like getUserById()\n- **Functions:** one purpose each, under 20 lines\n- **Comments:** explain WHY, not WHAT\n- **Edge cases:** always handle empty, null, overflow\n\nPaste your code and I can give you specific feedback!';
                }
                if (ql.includes('explain') || ql.includes('algorithm')) {
                    return 'I\u2019d be happy to explain! To give you the most helpful answer:\n\n1. **Which algorithm** are you studying?\n2. **What part** is confusing \u2014 the concept, code, or complexity?\n3. **Your level** \u2014 beginner, intermediate, or competitive?\n\nI can walk you through it step-by-step!';
                }
                return 'Great question about **\u201c' + q + '\u201d**!\n\nI can help you with:\n- Understanding the problem requirements\n- Choosing the right approach\n- Walking through the solution step by step\n\nCould you share more context? Paste your code or describe where you\u2019re stuck!';
            }

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && aiOpen) aiToggle();
            });

            /* Close on rank page navigation */
            var _aiBase = window.go;
            if (typeof _aiBase === 'function') {
                window.go = function(page) {
                    _aiBase(page);
                    if (page === 'rank' || page === 'ranksession' || page === 'rankresults') {
                        if (aiOpen) {
                            aiOpen = false;
                            var a = document.getElementById('aiAssistant');
                            if (a) a.classList.remove('open');
                        }
                    }
                };
            }

        })();


        /* ====== HERO AUTH FORM JS ====== */

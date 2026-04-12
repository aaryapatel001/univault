/* ═══ AI Chat — Message Handling & Responses ═══ */

                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); acSendPage(); }
            };
            window.acAutoResize = function(el) {
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 160) + 'px';
                var btn = document.getElementById('acSendBtn');
                if (btn) btn.disabled = !el.value.trim() || acLoading;
            };
            window.acToggleMode = function(mode) {
                var key = mode.charAt(0).toUpperCase() + mode.slice(1);
                var btn = document.getElementById('acMode' + key);
                if (acMode === mode) {
                    acMode = 'default';
                    if (btn) btn.classList.remove('active');
                } else {
                    document.querySelectorAll('.aichat-mode-btn').forEach(function(b){ b.classList.remove('active'); });
                    acMode = mode;
                    if (btn) btn.classList.add('active');
                }
            };

            function acAddMessage(role, text) {
                var msgs = document.getElementById('acMessages');
                if (!msgs) return;
                var row = document.createElement('div');
                row.className = 'achat-msg achat-msg-' + role;
                var av = document.createElement('div');
                av.className = 'achat-avatar achat-avatar-' + (role === 'ai' ? 'ai' : 'user');
                av.innerHTML = role === 'ai'
                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="currentColor"/></svg>'
                    : 'S';
                var bubble = document.createElement('div');
                bubble.className = 'achat-bubble';
                if (role === 'ai') {
                    bubble.innerHTML = '<p>' + text
                        .replace(/```([\s\S]*?)```/g,'</p><pre><code>$1</code></pre><p>')
                        .replace(/`([^`]+)`/g,'<code>$1</code>')
                        .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
                        .replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>') + '</p>';
                } else {
                    bubble.textContent = text;
                }
                row.appendChild(av); row.appendChild(bubble);
                msgs.appendChild(row);
                msgs.scrollTop = msgs.scrollHeight;
            }

            function acSetLoading(on) {
                acLoading = on;
                var th = document.getElementById('acThinking');
                var sb = document.getElementById('acSendBtn');
                var inp = document.getElementById('acInput');
                if (th)  th.style.display = on ? 'flex' : 'none';
                if (sb)  sb.disabled = on;
                if (inp) inp.disabled = on;
            }

            function acGetResponse(q) {
                var ql = q.toLowerCase();
                if (acMode === 'think') return 'Let me think through this carefully..\n\n**Deep Analysis of "' + q + '":**\n\nBreaking it into subproblems:\n\n```\n1. Understand the constraints and edge cases\n2. Identify the algorithmic pattern\n3. Choose optimal data structure\n4. Analyze time / space complexity\n```\n\nThe key insight is to eliminate repeated work. This usually leads to O(n log n) or better. Which step would you like me to expand on?';
                if (acMode === 'search') return 'Based on current resources for **"' + q + '"**:\n\nTop findings:\n- Modern best practices favour clear naming and single-responsibility\n- Time complexity analysis is essential before optimising\n- Most interview platforms test 14 core patterns\n\nWould you like me to go deeper on any aspect?';
                if (ql.includes('dynamic programming') || ql.includes(' dp') || ql.includes('memoiz')) return '**Dynamic Programming** = optimal substructure + overlapping subproblems.\n\n```python\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef solve(state):\n    if is_base_case(state): return base_value\n    return min(solve(s) for s in transitions(state))\n```\n\n**Classic problems:** Fibonacci, Coin Change, LCS, 0/1 Knapsack.\n\nWhat specific DP problem are you working on?';
                if (ql.includes('bfs') || ql.includes('dfs') || ql.includes('graph')) return '**BFS** (queue) → layer by layer → shortest path.\n**DFS** (stack/recursion) → depth first → cycle detection & all paths.\n\n```python\nfrom collections import deque\n\ndef bfs(graph, start):\n    q, visited = deque([start]), {start}\n    while q:\n        node = q.popleft()\n        for nb in graph[node]:\n            if nb not in visited:\n                visited.add(nb); q.append(nb)\n    return visited\n```\n\nNeed a specific graph problem solved?';
                if (ql.includes('debug') || ql.includes('error') || ql.includes('fix') || ql.includes('bug')) return '**Debug Checklist:**\n\n1. **Off-by-one** — check loop bounds\n2. **Edge cases** — empty input, single element\n3. **Type errors** — int vs float\n4. **Scope issues** — local vs global\n\n```python\nfor i, val in enumerate(arr):\n    print(f"i={i}, val={val}")  # trace\n```\n\nPaste your code and I\'ll find the exact bug!';
                if (ql.includes('sort')) return '| Algorithm | Best | Avg | Worst | Space |\n|---|---|---|---|---|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |\n\nPython\'s `sorted()` uses **Timsort** — O(n log n) worst, O(n) best. Best choice for interviews unless asked to implement from scratch.';
                if (ql.includes('clean') || ql.includes('best practice')) return '**Clean Code Principles:**\n\n- **Naming:** `getUserById()` not `getU()`\n- **SRP:** each function does ONE thing\n- **DRY:** extract repeated logic\n- **Comments:** explain WHY not WHAT\n\n```python\n# Bad\ndef p(x, y): return x * y * 0.07\n\n# Good\ndef calculate_tax(price: float, rate: float) -> float:\n    """Calculate tax for a given price and rate."""\n    return price * rate\n```\n\nPaste your code for specific feedback!';
                return 'Great question about **"' + q + '"**!\n\nI can help you:\n- Understand the concept step by step\n- Walk through code examples\n- Analyse time & space complexity\n- Spot bugs or suggest improvements\n\nCould you share more context — paste your code or tell me where you\'re stuck?';
            }

            window.acSend = window.acSendPage = function() {
                if (acLoading) return;
                var inp = document.getElementById('acInput');
                if (!inp || !inp.value.trim()) return;
                var text = inp.value.trim();
                inp.value = ''; acAutoResize(inp);
                var welcome = document.getElementById('acWelcome');
                if (welcome) welcome.style.display = 'none';
                acAddMessage('user', text);
                acSetLoading(true);
                setTimeout(function(){
                    acSetLoading(false);
                    acAddMessage('ai', acGetResponse(text));
                }, acMode === 'think' ? 2200 : 1400);
            };

            window.acSuggest = function(text) {
                var inp = document.getElementById('acInput');
                if (inp) { inp.value = text; acAutoResize(inp); }
                acSendPage();
            };

            window.acNewChat = function() {
                document.querySelectorAll('.aichat-hist-item').forEach(function(i){ i.classList.remove('active'); });
                var msgs = document.getElementById('acMessages');
                if (!msgs) return;
                msgs.innerHTML = buildAcWelcome();
                acLoading = false; acMode = 'default';
                document.querySelectorAll('.aichat-mode-btn').forEach(function(b){ b.classList.remove('active'); });
            };

            window.acClearChat = function() {
                var msgs = document.getElementById('acMessages');
                if (msgs) { msgs.innerHTML = buildAcWelcome(); }
            };

            window.acLoadHistory = function(el, topic) {
                document.querySelectorAll('.aichat-hist-item').forEach(function(i){ i.classList.remove('active'); });
                el.classList.add('active');
                var msgs = document.getElementById('acMessages');
                if (!msgs) return;
                msgs.innerHTML = '';
                var map = {
                    dp:    ['Explain memoization in Dynamic Programming', 'DP caches subproblem results to avoid recomputation.\n\n```python\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n```\n\n**Top-down** (memoization) vs **bottom-up** (tabulation) — both valid. Want a classic problem walkthrough?'],
                    debug: ['My code has an IndexError in a loop', '**IndexError** = accessing an index that doesn\'t exist.\n\n```python\n# Bug\nfor i in range(len(arr) + 1):  # +1 is wrong!\n    print(arr[i])\n# Fix\nfor i in range(len(arr)):\n    print(arr[i])\n```\n\nPaste your code and I\'ll find the exact issue!'],
                    bfs:   ['When should I use BFS vs DFS?', '**BFS** — shortest path, level traversal, solution near root.\n**DFS** — all paths, cycle detection, topological sort.\n\n```python\nfrom collections import deque\ndef bfs(graph, start):\n    q, vis = deque([start]), {start}\n    while q:\n        n = q.popleft()\n        for nb in graph[n]:\n            if nb not in vis:\n                vis.add(nb); q.append(nb)\n    return vis\n```'],
                    sort:  ['Compare time complexity of sorting algorithms', '| Algo | Best | Avg | Worst |\n|---|---|---|---|\n| Merge | O(n log n) | O(n log n) | O(n log n) |\n| Quick | O(n log n) | O(n log n) | O(n²) |\n| Heap  | O(n log n) | O(n log n) | O(n log n) |\n\nPython\'s built-in uses **Timsort** (O(n log n) worst, O(n) best) — best for most cases!']
                };
                var p = map[topic];
                if (p) {
                    acAddMessage('user', p[0]);
                    setTimeout(function(){ acAddMessage('ai', p[1]); }, 300);
                }
            };

            function buildAcWelcome() {
                return '<div class="aichat-welcome" id="acWelcome">' +
                    '<div class="aichat-welcome-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="currentColor"/></svg></div>' +
                    '<h2 class="aichat-welcome-title">How can I help you today?</h2>' +
                    '<p class="aichat-welcome-sub">Ask me anything about coding, algorithms, debugging, or CS concepts.</p>' +
                    '<div class="aichat-suggest-grid">' +
                    '<div class="aichat-suggest-card" onclick="acSuggest(\'Explain Dynamic Programming with examples\')"><div class="aichat-suggest-icon">🧮</div><div class="aichat-suggest-text">Explain Dynamic Programming</div></div>' +
                    '<div class="aichat-suggest-card" onclick="acSuggest(\'How do I debug a RecursionError in Python?\')"><div class="aichat-suggest-icon">🐛</div><div class="aichat-suggest-text">Debug a RecursionError</div></div>' +
                    '<div class="aichat-suggest-card" onclick="acSuggest(\'Compare BFS and DFS with code examples\')"><div class="aichat-suggest-icon">🌲</div><div class="aichat-suggest-text">BFS vs DFS comparison</div></div>' +
                    '<div class="aichat-suggest-card" onclick="acSuggest(\'What are the best practices for writing clean code?\')"><div class="aichat-suggest-icon">✨</div><div class="aichat-suggest-text">Clean code practices</div></div>' +
                    '</div></div>';
            }

            /* ══════════════════════════════════════════
               ABOUT / FEATURES / CONTACT PAGE JS
            ══════════════════════════════════════════ */

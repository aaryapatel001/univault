/* ═══ Static Starfield Background ═══ */

    
    (function initStarfield() {
        var canvas = document.getElementById('starfieldBg');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var stars = [];
        var NUM_STARS = 450;
        var dpr = window.devicePixelRatio || 1;

        function resize() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createStars() {
            stars = [];
            var w = window.innerWidth;
            var h = window.innerHeight;
            for (var i = 0; i < NUM_STARS; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.0 + 0.3,          /* radius 0.3 - 1.3 */
                    baseAlpha: Math.random() * 0.3 + 0.55,  /* base opacity 0.55 - 0.85 */
                    twinkleSpeed: Math.random() * 0.008 + 0.002, /* very slow twinkle */
                    twinkleOffset: Math.random() * Math.PI * 2
                });
            }
        }

        var frame = 0;
        function draw() {
            frame++;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            var t = frame * 0.016; /* ~60fps time */

            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                /* Subtle twinkle: slow sine wave oscillation */
                var twinkle = Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
                var alpha = s.ba
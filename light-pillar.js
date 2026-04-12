/* ═══ Three.js Light Pillar Effect ═══ */

    
    (function initLightPillar() {
        var container = document.getElementById('lightPillarHome');
        if (!container) return;

        /* Check WebGL support */
        var testCanvas = document.createElement('canvas');
        var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) return;

        var width = container.clientWidth || window.innerWidth;
        var height = container.clientHeight || window.innerHeight;

        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power', stencil: false, depth: false });
        } catch(e) { return; }

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        /* Colors */
        var topCol = new THREE.Color('#5227FF');
        var botCol = new THREE.Color('#FF9FFC');

        /* Shaders */
        var vertexShader = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }';

        var fragmentShader = [
            'precision mediump float;',
            'uniform float uTime;',
            'uniform vec2 uResolution;',
            'uniform vec3 uTopColor;',
            'uniform vec3 uBottomColor;',
            'uniform float uRotCos;',
            'uniform float uRotSin;',
            'uniform float uWaveSin;',
            'uniform float uWaveCos;',
            'varying vec2 vUv;',
            '',
            'void main(){',
            '  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);',
            '  vec3 ro = vec3(0.0, 0.0, -10.0);',
            '  vec3 rd = normalize(vec3(uv, 1.0));',
            '  vec3 col = vec3(0.0);',
            '  float t = 0.1;',
            '  for(int i = 0; i < 40; i++){',
            '    vec3 p = ro + rd * t;',
            '    p.xz = vec2(uRotCos * p.x - uRotSin * p.z, uRotSin * p.x + uRotCos * p.z);',
            '    vec3 q = p;',
            '    q.y = p.y * 0.4 + uTime;',
            '    float freq = 1.0;',
            '    float amp = 1.0;',
            '    for(int j = 0; j < 2; j++){',
            '      q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);',
            '      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;',
            '      freq *= 2.0;',
            '      amp *= 0.5;',
            '    }',
            '    float d = length(cos(q.xz)) - 0.2;',
            '    float bound = length(p.xz) - 3.0;',
            '    float k = 4.0;',
            '    float h = max(k - abs(d - bound), 0.0);',
            '    d = max(d, bound) + h * h * 0.0625 / k;',
            '    d = abs(d) * 0.15 + 0.01;',
            '    float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);',
            '    col += mix(uBottomColor, uTopColor, grad) / d;',
            '    t += d * 1.2;',
            '    if(t > 50.0) break;',
            '  }',
            '  col = tanh(col * 0.0018 / 1.0);',
            '  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * 0.5;',
            '  gl_FragColor = vec4(col * 0.55, 1.0);',
            '}'
        ].join('\n');

        var waveSin = Math.sin(0.4);
        var waveCos = Math.cos(0.4);

        var material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uTopColor: { value: new THREE.Vector3(topCol.r, topCol.g, topCol.b) },
                uBottomColor: { value: new THREE.Vector3(botCol.r, botCol.g, botCol.b) },
                uRotCos: { value: 1.0 },
                uRotSin: { value: 0.0 },
                uWaveSin: { value: waveSin },
                uWaveCos: { value: waveCos }
            },
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        var geometry = new THREE.PlaneGeometry(2, 2);
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        var time = 0;
        var lastFrame = performance.now();
        var rotSpeed = 0.3;

        function animate(now) {
            var delta = now - lastFrame;
            if (delta >= 16) { /* ~60fps cap */
                time += 0.016 * rotSpeed;
                material.uniforms.uTime.value = time;
                material.uniforms.uRotCos.value = Math.cos(time * 0.3);
                material.uniforms.uRotSin.value = Math.sin(time * 0.3);
                renderer.render(scene, camera);
                lastFrame = now - (delta % 16);
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        /* Resize */
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (!container) return;
                var w = container.clientWidth;
                var h = container.clientHeight;
                renderer.setSize(w, h);
                material.uniforms.uResolution.value.set(w, h);
            }, 150);
        }, { passive: true });
    })();

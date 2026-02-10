/* ============================================
   A-One WaterArts - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Remove White Background from Logo ----
    function removeWhiteBG(imgEl, threshold = 240) {
        // Wait for the image to fully load before processing
        const process = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            ctx.drawImage(imgEl, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // If pixel is white or near-white, make it transparent
                if (r >= threshold && g >= threshold && b >= threshold) {
                    data[i + 3] = 0; // Set alpha to 0
                }
                // Soft edge: fade semi-white pixels for smoother edges
                else if (r >= threshold - 30 && g >= threshold - 30 && b >= threshold - 30) {
                    const avg = (r + g + b) / 3;
                    const fade = Math.max(0, (avg - (threshold - 30)) / 30);
                    data[i + 3] = Math.round(data[i + 3] * (1 - fade));
                }
            }

            ctx.putImageData(imageData, 0, 0);
            imgEl.src = canvas.toDataURL('image/png');
            imgEl.classList.add('bg-removed');
        };

        if (imgEl.complete && imgEl.naturalWidth > 0) {
            process();
        } else {
            imgEl.addEventListener('load', process);
        }
    }

    // Apply to all logo images on the page
    document.querySelectorAll('.logo-icon img, .loader-logo, .insta-avatar img').forEach(img => {
        removeWhiteBG(img, 235);
    });


    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 1500);
    });
    // Fallback in case load event already fired
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 3000);


    // ---- Custom Cursor ----
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX - 4 + 'px';
            cursor.style.top = mouseY - 4 + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.left = followerX - 17.5 + 'px';
            follower.style.top = followerY - 17.5 + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .product-card, .service-card, .gallery-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('cursor-hover');
            });
        });
    }


    // ---- Navbar Scroll & Top Bar Hide ----
    const navbar = document.getElementById('navbar');
    const topBar = document.getElementById('top-bar');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Hide top bar on scroll
        if (topBar) {
            if (scrollY > 50) {
                topBar.style.marginTop = '-40px';
                topBar.style.opacity = '0';
                topBar.style.pointerEvents = 'none';
            } else {
                topBar.style.marginTop = '0';
                topBar.style.opacity = '1';
                topBar.style.pointerEvents = 'auto';
            }
        }

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ---- Mobile Navigation ----
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ---- Swimming Pool Water Canvas ----
    const canvas = document.getElementById('water-canvas');
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ---- Flowing water surface renderer ----
    // Multiple wave layers create the endless flowing pool effect
    const waterLayers = [
        { amp: 18,  freq: 0.008, speed: 0.018, yOff: 0,    color: [0, 140, 220], alpha: 0.06 },
        { amp: 12,  freq: 0.012, speed: -0.012, yOff: 0.1,  color: [0, 180, 255], alpha: 0.05 },
        { amp: 25,  freq: 0.005, speed: 0.008,  yOff: 0.2,  color: [0, 100, 200], alpha: 0.07 },
        { amp: 8,   freq: 0.02,  speed: 0.025,  yOff: 0.35, color: [0, 200, 255], alpha: 0.04 },
        { amp: 15,  freq: 0.007, speed: -0.015, yOff: 0.5,  color: [0, 160, 240], alpha: 0.06 },
        { amp: 20,  freq: 0.009, speed: 0.01,   yOff: 0.65, color: [0, 120, 210], alpha: 0.05 },
        { amp: 10,  freq: 0.015, speed: -0.02,  yOff: 0.8,  color: [0, 190, 255], alpha: 0.04 },
    ];

    // Light shimmer spots that move across the pool surface
    const shimmers = [];
    for (let i = 0; i < 20; i++) {
        shimmers.push({
            x: Math.random(),
            y: Math.random(),
            size: 30 + Math.random() * 80,
            speedX: (Math.random() - 0.5) * 0.0003,
            speedY: (Math.random() - 0.5) * 0.0002,
            phase: Math.random() * Math.PI * 2,
            brightness: 0.02 + Math.random() * 0.04,
        });
    }

    // Flowing highlight streaks (like light on water surface)
    const streaks = [];
    for (let i = 0; i < 8; i++) {
        streaks.push({
            x: Math.random(),
            y: Math.random(),
            length: 100 + Math.random() * 250,
            width: 1 + Math.random() * 2,
            speed: 0.0005 + Math.random() * 0.001,
            angle: Math.PI * 0.15 + Math.random() * 0.3,
            alpha: 0.02 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2,
        });
    }

    function drawFlowingWater() {
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // -- Layer 1: Deep pool gradient base --
        const baseGrad = ctx.createLinearGradient(0, 0, 0, H);
        baseGrad.addColorStop(0,    'rgba(0, 50, 100, 0.3)');
        baseGrad.addColorStop(0.3,  'rgba(0, 60, 120, 0.35)');
        baseGrad.addColorStop(0.6,  'rgba(0, 45, 95, 0.4)');
        baseGrad.addColorStop(1,    'rgba(0, 30, 70, 0.45)');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, W, H);

        // -- Layer 2: Flowing wave bands --
        waterLayers.forEach(layer => {
            ctx.beginPath();
            const baseY = H * layer.yOff;

            ctx.moveTo(-10, baseY);
            for (let x = -10; x <= W + 10; x += 4) {
                const y = baseY +
                    Math.sin(x * layer.freq + time * layer.speed) * layer.amp +
                    Math.sin(x * layer.freq * 1.8 + time * layer.speed * 0.7 + 1.5) * layer.amp * 0.4 +
                    Math.cos(x * layer.freq * 0.5 + time * layer.speed * 1.3 + 3) * layer.amp * 0.3;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W + 10, H + 10);
            ctx.lineTo(-10, H + 10);
            ctx.closePath();

            const [r, g, b] = layer.color;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${layer.alpha})`;
            ctx.fill();
        });

        // -- Layer 3: Shimmer light spots --
        shimmers.forEach(s => {
            s.x += s.speedX;
            s.y += s.speedY;
            if (s.x < -0.1) s.x = 1.1;
            if (s.x > 1.1) s.x = -0.1;
            if (s.y < -0.1) s.y = 1.1;
            if (s.y > 1.1) s.y = -0.1;

            const pulse = Math.sin(time * 0.02 + s.phase) * 0.5 + 0.5;
            const grad = ctx.createRadialGradient(
                s.x * W, s.y * H, 0,
                s.x * W, s.y * H, s.size
            );
            grad.addColorStop(0, `rgba(150, 230, 255, ${s.brightness * pulse})`);
            grad.addColorStop(0.5, `rgba(100, 210, 255, ${s.brightness * pulse * 0.3})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(s.x * W - s.size, s.y * H - s.size, s.size * 2, s.size * 2);
        });

        // -- Layer 4: Flowing light streaks (surface reflections) --
        ctx.save();
        streaks.forEach(s => {
            s.x += s.speed;
            if (s.x > 1.3) s.x = -0.3;

            const pulse = Math.sin(time * 0.015 + s.phase) * 0.5 + 0.5;
            const sx = s.x * W;
            const sy = s.y * H;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(s.angle);
            ctx.beginPath();

            // Tapered streak shape
            ctx.moveTo(-s.length / 2, 0);
            ctx.quadraticCurveTo(-s.length / 4, -s.width * 2, 0, -s.width);
            ctx.quadraticCurveTo(s.length / 4, 0, s.length / 2, 0);
            ctx.quadraticCurveTo(s.length / 4, 0, 0, s.width);
            ctx.quadraticCurveTo(-s.length / 4, s.width * 2, -s.length / 2, 0);
            ctx.closePath();

            ctx.fillStyle = `rgba(180, 240, 255, ${s.alpha * pulse})`;
            ctx.fill();
            ctx.restore();
        });
        ctx.restore();

        // -- Layer 5: Horizontal flowing highlight bands --
        for (let i = 0; i < 5; i++) {
            const bandY = H * (0.15 + i * 0.18) + Math.sin(time * 0.01 + i * 1.2) * 30;
            const bandGrad = ctx.createLinearGradient(0, bandY - 15, 0, bandY + 15);
            bandGrad.addColorStop(0, 'transparent');
            bandGrad.addColorStop(0.5, `rgba(0, 200, 255, ${0.015 + Math.sin(time * 0.008 + i) * 0.01})`);
            bandGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = bandGrad;
            ctx.fillRect(0, bandY - 15, W, 30);
        }

        // -- Layer 6: Subtle surface sparkles --
        const sparkleCount = Math.min(15, Math.floor(W / 100));
        for (let i = 0; i < sparkleCount; i++) {
            const sx = (Math.sin(time * 0.005 + i * 3.7) * 0.5 + 0.5) * W;
            const sy = (Math.cos(time * 0.007 + i * 2.3) * 0.5 + 0.5) * H;
            const sparkleAlpha = Math.max(0, Math.sin(time * 0.03 + i * 5) * 0.5 + 0.2);
            const sparkleSize = 1 + Math.sin(time * 0.02 + i * 4) * 0.8;

            if (sparkleAlpha > 0.1) {
                ctx.beginPath();
                ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 245, 255, ${sparkleAlpha * 0.4})`;
                ctx.fill();

                // Cross-shaped glint
                ctx.strokeStyle = `rgba(220, 250, 255, ${sparkleAlpha * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(sx - 4, sy);
                ctx.lineTo(sx + 4, sy);
                ctx.moveTo(sx, sy - 4);
                ctx.lineTo(sx, sy + 4);
                ctx.stroke();
            }
        }

        time++;
        animationId = requestAnimationFrame(drawFlowingWater);
    }

    drawFlowingWater();

    // Pause animation when hero is not visible
    const heroSection = document.getElementById('home');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) drawFlowingWater();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);


    // ---- Interactive Swimming Pool ----
    const poolWater = document.getElementById('pool-water');
    const poolCanvas = document.getElementById('pool-canvas');
    const poolSplash = document.getElementById('pool-splash');

    if (poolCanvas && poolWater) {
        const pCtx = poolCanvas.getContext('2d');
        let poolAnimId = null;

        function resizePoolCanvas() {
            poolCanvas.width = poolWater.offsetWidth;
            poolCanvas.height = poolWater.offsetHeight;
        }
        resizePoolCanvas();
        window.addEventListener('resize', resizePoolCanvas);

        // Ripple physics system
        const ripples = [];

        class Ripple {
            constructor(x, y, maxRadius, lineWidth) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = maxRadius || 100 + Math.random() * 60;
                this.lineWidth = lineWidth || 2;
                this.opacity = 0.6;
                this.speed = 1.5 + Math.random() * 1;
                this.active = true;
            }

            update() {
                this.radius += this.speed;
                this.opacity = 0.6 * (1 - this.radius / this.maxRadius);
                if (this.radius >= this.maxRadius) {
                    this.active = false;
                }
            }

            draw(ctx) {
                if (!this.active) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 210, 255, ${this.opacity})`;
                ctx.lineWidth = this.lineWidth * (1 - this.radius / this.maxRadius);
                ctx.stroke();

                // Inner highlight ring
                if (this.radius > 5) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(100, 230, 255, ${this.opacity * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Ambient ripples (auto-generated)
        function createAmbientRipple() {
            const x = Math.random() * poolCanvas.width;
            const y = Math.random() * poolCanvas.height;
            ripples.push(new Ripple(x, y, 60 + Math.random() * 40, 1.5));
        }

        let ambientInterval = setInterval(createAmbientRipple, 2000);

        // Mouse interaction
        let poolMouseActive = false;
        let lastRippleTime = 0;

        poolWater.addEventListener('mouseenter', () => {
            poolMouseActive = true;
            poolWater.style.cursor = 'none';
        });

        poolWater.addEventListener('mouseleave', () => {
            poolMouseActive = false;
            poolWater.style.cursor = 'default';
        });

        poolWater.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastRippleTime < 80) return; // throttle
            lastRippleTime = now;

            const rect = poolWater.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripples.push(new Ripple(x, y, 40 + Math.random() * 30, 1));
        });

        poolWater.addEventListener('click', (e) => {
            const rect = poolWater.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Big splash ripples
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    ripples.push(new Ripple(
                        x + (Math.random() - 0.5) * 10,
                        y + (Math.random() - 0.5) * 10,
                        80 + i * 30,
                        2.5 - i * 0.4
                    ));
                }, i * 80);
            }

            // DOM splash effects
            createSplashEffect(x, y);
        });

        // Touch support
        poolWater.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastRippleTime < 100) return;
            lastRippleTime = now;

            const rect = poolWater.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            ripples.push(new Ripple(x, y, 50, 1.5));
        }, { passive: false });

        poolWater.addEventListener('touchstart', (e) => {
            const rect = poolWater.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    ripples.push(new Ripple(x, y, 60 + i * 25, 2));
                }, i * 60);
            }
            createSplashEffect(x, y);
        });

        function createSplashEffect(x, y) {
            // Ring
            const ring = document.createElement('div');
            ring.className = 'splash-ring';
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            poolSplash.appendChild(ring);
            setTimeout(() => ring.remove(), 1000);

            // Droplets
            for (let i = 0; i < 8; i++) {
                const drop = document.createElement('div');
                drop.className = 'splash-drop';
                const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
                const dist = 30 + Math.random() * 40;
                drop.style.left = x + 'px';
                drop.style.top = y + 'px';
                drop.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
                drop.style.setProperty('--dy', (Math.sin(angle) * dist - 20) + 'px');
                poolSplash.appendChild(drop);
                setTimeout(() => drop.remove(), 800);
            }
        }

        // Pool animation loop
        function animatePool() {
            pCtx.clearRect(0, 0, poolCanvas.width, poolCanvas.height);

            // Update & draw ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].update();
                ripples[i].draw(pCtx);
                if (!ripples[i].active) {
                    ripples.splice(i, 1);
                }
            }

            // Subtle water surface shimmer
            const time = Date.now() * 0.001;
            for (let i = 0; i < 3; i++) {
                const sx = Math.sin(time * 0.5 + i * 2) * poolCanvas.width * 0.3 + poolCanvas.width * 0.5;
                const sy = Math.cos(time * 0.7 + i * 1.5) * poolCanvas.height * 0.3 + poolCanvas.height * 0.5;
                const shimmerGrad = pCtx.createRadialGradient(sx, sy, 0, sx, sy, 80);
                shimmerGrad.addColorStop(0, 'rgba(0, 220, 255, 0.04)');
                shimmerGrad.addColorStop(1, 'transparent');
                pCtx.fillStyle = shimmerGrad;
                pCtx.fillRect(0, 0, poolCanvas.width, poolCanvas.height);
            }

            poolAnimId = requestAnimationFrame(animatePool);
        }

        // Only animate when visible
        const poolObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!poolAnimId) animatePool();
                    if (!ambientInterval) ambientInterval = setInterval(createAmbientRipple, 2000);
                } else {
                    if (poolAnimId) {
                        cancelAnimationFrame(poolAnimId);
                        poolAnimId = null;
                    }
                    if (ambientInterval) {
                        clearInterval(ambientInterval);
                        ambientInterval = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        poolObserver.observe(poolWater);
    }


    // ---- Floating Particles in Hero ----
    const heroParticles = document.getElementById('hero-particles');
    
    function createHeroParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.6), transparent);
            border-radius: 50%;
            left: ${startX}%;
            bottom: -10px;
            pointer-events: none;
            animation: particleRise ${duration}s linear forwards;
        `;
        
        heroParticles.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Add particle rise keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleRise {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    setInterval(createHeroParticle, 400);


    // ---- Scroll Animations ----
    function initAnimations() {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }


    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    const duration = 2000;
                    const start = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Easing function
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(easeOutQuart * target);
                        entry.target.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    animateCounters();


    // ---- Product Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach((card, index) => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeInUp animation
    const filterStyle = document.createElement('style');
    filterStyle.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(filterStyle);


    // ---- Instagram Embed Handler ----
    // Handle iframe load errors - show placeholder when embed fails
    const instaCards = document.querySelectorAll('.insta-embed-card');
    
    instaCards.forEach(card => {
        const iframe = card.querySelector('iframe');
        const placeholder = card.querySelector('.insta-embed-placeholder');
        
        if (iframe && placeholder) {
            // Show placeholder by default, hide if iframe loads successfully
            placeholder.style.display = 'flex';
            
            iframe.addEventListener('load', () => {
                // Check if content loaded (might still be error page from Instagram)
                try {
                    // If the iframe loaded successfully, show it
                    setTimeout(() => {
                        iframe.style.opacity = '1';
                    }, 500);
                } catch(e) {
                    // Cross-origin, we can't check - show both
                }
            });

            iframe.addEventListener('error', () => {
                iframe.style.display = 'none';
                placeholder.style.display = 'flex';
            });
        }
    });

    // Re-process Instagram embeds when they become visible
    const instaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.instgrm) {
                window.instgrm.Embeds.process();
                instaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const instaSection = document.querySelector('.instagram-section');
    if (instaSection) {
        instaObserver.observe(instaSection);
    }

    // Lightbox (kept for potential future use)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active') && e.key === 'Escape') {
            closeLightbox();
        }
    });


    // ---- Testimonial Slider ----
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testPrev = document.getElementById('test-prev');
    const testNext = document.getElementById('test-next');
    const testDots = document.getElementById('test-dots');
    let currentTestimonial = 0;
    const totalTestimonials = testimonialCards.length;

    // Create dots
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        testDots.appendChild(dot);
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.testimonial-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    testNext.addEventListener('click', () => {
        goToTestimonial((currentTestimonial + 1) % totalTestimonials);
    });

    testPrev.addEventListener('click', () => {
        goToTestimonial((currentTestimonial - 1 + totalTestimonials) % totalTestimonials);
    });

    // Auto-slide testimonials
    let testimonialInterval = setInterval(() => {
        goToTestimonial((currentTestimonial + 1) % totalTestimonials);
    }, 5000);

    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            goToTestimonial((currentTestimonial + 1) % totalTestimonials);
        }, 5000);
    });


    // ---- More Products Toggle ----
    const moreToggle = document.getElementById('more-products-toggle');
    const moreList = document.getElementById('more-products-list');

    if (moreToggle && moreList) {
        moreToggle.addEventListener('click', () => {
            const isExpanded = moreList.classList.contains('expanded');
            moreList.classList.toggle('expanded');
            moreToggle.classList.toggle('active');

            if (!isExpanded) {
                moreToggle.querySelector('span').innerHTML = '<i class="fas fa-minus-circle"></i> Hide Extra Products';
            } else {
                moreToggle.querySelector('span').innerHTML = '<i class="fas fa-plus-circle"></i> View 8 More Products';
            }
        });
    }


    // ---- Inline Video Player ----
    const videoPlayBtn = document.getElementById('video-play-btn');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoIframe = document.getElementById('video-iframe');

    if (videoPlayBtn && videoThumbnail && videoIframe) {
        // Click play button or anywhere on thumbnail
        videoThumbnail.addEventListener('click', () => {
            // Load and autoplay the YouTube video inline
            videoIframe.src = 'https://www.youtube.com/embed/98Ane0XjM4w?autoplay=1&rel=0&modestbranding=1';
            // Hide thumbnail to reveal the iframe underneath
            videoThumbnail.classList.add('hidden');
        });

        // Pause video when scrolled out of view
        const videoSection = document.getElementById('video');
        if (videoSection) {
            const videoVisObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && videoIframe.src.includes('youtube')) {
                        // When scrolled away, pause by removing autoplay
                        videoIframe.src = videoIframe.src.replace('autoplay=1', 'autoplay=0');
                    }
                });
            }, { threshold: 0.1 });
            videoVisObserver.observe(videoSection);
        }
    }


    // ---- Contact Form ----
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });


    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ---- Parallax Effect on Scroll ----
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
        }
    });


    // ---- Tilt Effect on Product Cards (Desktop) ----
    if (window.innerWidth > 992) {
        const cards = document.querySelectorAll('.product-card, .service-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    // ---- Typing Effect for Hero (optional enhancement) ----
    // The text is already set, but we add a subtle class after load
    setTimeout(() => {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 1800);

});

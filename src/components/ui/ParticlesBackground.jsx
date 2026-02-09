import { useEffect, useRef } from "react";

const getParticleCount = (width, height) => {
    const area = width * height;
    return Math.max(18, Math.min(64, Math.floor(area / 36000)));
};

const hasFinePointer = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const getQualityMultiplier = () => {
    if (typeof navigator === "undefined") {
        return 1;
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveDataEnabled = Boolean(connection && connection.saveData);
    const lowCoreDevice =
        typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;

    return saveDataEnabled || lowCoreDevice ? 0.68 : 1;
};

const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return undefined;
        }

        const particles = [];
        let animationFrameId = 0;
        let lastFrameAt = 0;
        let drawConnectionsOnThisFrame = true;
        let resizeTimerId = 0;
        let width = window.innerWidth;
        let height = window.innerHeight;
        const qualityMultiplier = getQualityMultiplier();
        const finePointerEnabled = hasFinePointer();

        const mouse = {
            x: null,
            y: null,
            radius: 150,
        };

        const setCanvasSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const createParticle = (x, y, directionX, directionY, size, color) => ({
            x,
            y,
            directionX,
            directionY,
            size,
            color,
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            },
            update() {
                if (this.x > width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > height || this.y < 0) this.directionY = -this.directionY;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const maxDistance = mouse.radius + this.size;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < maxDistance * maxDistance) {
                        if (mouse.x < this.x && this.x < width - this.size * 10) this.x += 2;
                        if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                        if (mouse.y < this.y && this.y < height - this.size * 10) this.y += 2;
                        if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            },
        });

        const init = () => {
            particles.length = 0;
            const numberOfParticles = Math.max(
                16,
                Math.round(getParticleCount(width, height) * qualityMultiplier)
            );

            for (let i = 0; i < numberOfParticles; i += 1) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (width - size * 4) + size * 2;
                const y = Math.random() * (height - size * 4) + size * 2;
                const directionX = Math.random() * 0.4 - 0.2;
                const directionY = Math.random() * 0.4 - 0.2;

                particles.push(createParticle(x, y, directionX, directionY, size, "#ffffff"));
            }
        };

        const connect = () => {
            if (width < 640) {
                return;
            }
            const maxDistance = Math.min(180, width * 0.12);
            const maxDistanceSq = maxDistance * maxDistance;

            for (let a = 0; a < particles.length; a += 1) {
                for (let b = a + 1; b < particles.length; b += 1) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < maxDistanceSq) {
                        const opacity = 1 - distanceSq / maxDistanceSq;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.16})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = (timestamp) => {
            if (document.hidden) {
                animationFrameId = 0;
                return;
            }

            if (timestamp - lastFrameAt < FRAME_INTERVAL_MS) {
                animationFrameId = window.requestAnimationFrame(animate);
                return;
            }

            lastFrameAt = timestamp;
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i += 1) {
                particles[i].update();
            }
            drawConnectionsOnThisFrame = !drawConnectionsOnThisFrame;
            if (drawConnectionsOnThisFrame) {
                connect();
            }
            animationFrameId = window.requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (!animationFrameId) {
                lastFrameAt = 0;
                animationFrameId = window.requestAnimationFrame(animate);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId);
                    animationFrameId = 0;
                }
                return;
            }

            startAnimation();
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleResize = () => {
            if (resizeTimerId) {
                window.clearTimeout(resizeTimerId);
            }
            resizeTimerId = window.setTimeout(() => {
                resizeTimerId = 0;
                setCanvasSize();
                init();
                startAnimation();
            }, 250);
        };

        setCanvasSize();
        init();
        startAnimation();

        if (finePointerEnabled) {
            window.addEventListener("mousemove", handleMouseMove, { passive: true });
        }
        window.addEventListener("resize", handleResize);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (finePointerEnabled) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
            if (resizeTimerId) {
                window.clearTimeout(resizeTimerId);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" style={{ willChange: 'transform' }} />;
};

export default ParticlesBackground;

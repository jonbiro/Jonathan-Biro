import { useEffect, useRef } from "react";

const getParticleCount = (width, height) => {
    const area = width * height;
    return Math.max(12, Math.min(50, Math.floor(area / 48000)));
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

const ParticlesBackground = ({ paused = false }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameIdRef = useRef(0);
    const lastFrameAtRef = useRef(0);
    const drawConnectionsOnThisFrameRef = useRef(true);
    const widthRef = useRef(window.innerWidth);
    const heightRef = useRef(window.innerHeight);
    const mouseRef = useRef({ x: null, y: null, radius: 150 });

    // Initialize canvas and context once
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        contextRef.current = canvas.getContext("2d");

        const handleResize = () => {
            widthRef.current = window.innerWidth;
            heightRef.current = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(widthRef.current * dpr);
            canvas.height = Math.floor(heightRef.current * dpr);
            canvas.style.width = `${widthRef.current}px`;
            canvas.style.height = `${heightRef.current}px`;
            if (contextRef.current) {
                contextRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            initParticles();
        };

        const initParticles = () => {
            const width = widthRef.current;
            const height = heightRef.current;
            const qualityMultiplier = getQualityMultiplier();
            const numberOfParticles = Math.max(16, Math.round(getParticleCount(width, height) * qualityMultiplier));

            particlesRef.current = [];
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (width - size * 4) + size * 2;
                const y = Math.random() * (height - size * 4) + size * 2;
                const directionX = Math.random() * 0.4 - 0.2;
                const directionY = Math.random() * 0.4 - 0.2;
                particlesRef.current.push({ x, y, directionX, directionY, size, color: "#ffffff" });
            }
        };

        const handleMouseMove = (event) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };

        if (hasFinePointer()) {
            window.addEventListener("mousemove", handleMouseMove, { passive: true });
        }
        window.addEventListener("resize", handleResize);

        // Initial setup
        handleResize();

        return () => {
            if (hasFinePointer()) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    // Handle animation loop
    useEffect(() => {
        const ctx = contextRef.current;
        if (!ctx) return;

        const animate = (timestamp) => {
            if (paused || document.hidden) {
                animationFrameIdRef.current = 0;
                return;
            }

            if (timestamp - lastFrameAtRef.current < FRAME_INTERVAL_MS) {
                animationFrameIdRef.current = window.requestAnimationFrame(animate);
                return;
            }

            lastFrameAtRef.current = timestamp;
            const width = widthRef.current;
            const height = heightRef.current;
            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                if (p.x > width || p.x < 0) p.directionX = -p.directionX;
                if (p.y > height || p.y < 0) p.directionY = -p.directionY;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const maxDistance = mouse.radius + p.size;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < maxDistance * maxDistance) {
                        if (mouse.x < p.x && p.x < width - p.size * 10) p.x += 2;
                        if (mouse.x > p.x && p.x > p.size * 10) p.x -= 2;
                        if (mouse.y < p.y && p.y < height - p.size * 10) p.y += 2;
                        if (mouse.y > p.y && p.y > p.size * 10) p.y -= 2;
                    }
                }

                p.x += p.directionX;
                p.y += p.directionY;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            // Draw connections
            drawConnectionsOnThisFrameRef.current = !drawConnectionsOnThisFrameRef.current;
            if (drawConnectionsOnThisFrameRef.current && width >= 640) {
                const maxDistance = Math.min(150, width * 0.1);
                const maxDistanceSq = maxDistance * maxDistance;

                for (let a = 0; a < particles.length; a++) {
                    for (let b = a + 1; b < particles.length; b++) {
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
            }

            animationFrameIdRef.current = window.requestAnimationFrame(animate);
        };

        if (!paused) {
            animationFrameIdRef.current = window.requestAnimationFrame(animate);
        } else if (animationFrameIdRef.current) {
            window.cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = 0;
        }

        const handleVisibilityChange = () => {
            if (document.hidden && animationFrameIdRef.current) {
                window.cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = 0;
            } else if (!document.hidden && !paused) {
                animationFrameIdRef.current = window.requestAnimationFrame(animate);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (animationFrameIdRef.current) {
                window.cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [paused]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

export default ParticlesBackground;

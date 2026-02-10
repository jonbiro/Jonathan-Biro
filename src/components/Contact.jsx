import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin, FaArrowUp } from "react-icons/fa";
import SITE_CONFIG from "../config/site";

const Contact = ({ motionEnabled = true }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        let timeoutId = 0;
        const handleScroll = () => {
            if (timeoutId) return;
            timeoutId = window.setTimeout(() => {
                setShowScrollTop(window.scrollY > 400);
                timeoutId = 0;
            }, 100);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, []);

    const handleConfetti = useCallback(async () => {
        if (!motionEnabled) {
            return;
        }

        let confetti;
        try {
            ({ default: confetti } = await import("canvas-confetti"));
        } catch {
            return;
        }

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, [motionEnabled]);

    return (
        <section id="contact" className="py-20 px-4 max-w-4xl mx-auto text-center relative" style={{ contentVisibility: 'auto' }}>
            <motion.div
                initial={motionEnabled ? { opacity: 0, scale: 0.9 } : false}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: motionEnabled ? 0.8 : 0 }}
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-12 rounded-3xl backdrop-blur-sm"
            >
                <div className="mb-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-white block mb-2">Let's Connect</h2>
                </div>
                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                    I'm always open to discussing new opportunities, creative ideas, or just having a chat.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        onClick={handleConfetti}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-dark font-bold rounded-full hover:bg-white transition-colors"
                    >
                        <FaEnvelope /> {SITE_CONFIG.email}
                    </a>
                    <a
                        href={SITE_CONFIG.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 border border-primary/50 text-primary font-semibold rounded-full hover:bg-primary hover:text-dark transition-all"
                    >
                        View Resume
                    </a>
                </div>

                <div className="flex gap-6 justify-center text-3xl text-gray-400">
                    <a href={SITE_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="hover:text-white hover:scale-110 transition-all"><FaGithub /></a>
                    <a href={SITE_CONFIG.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-white hover:scale-110 transition-all"><FaLinkedin /></a>
                </div>
            </motion.div>

            <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Jonathan Biro. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <span>Built with React & Tailwind</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span>Deployed on Vercel</span>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: motionEnabled ? "smooth" : "auto" })}
                    className={`fixed bottom-6 right-6 p-3 bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full hover:bg-primary transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            </footer>
        </section>
    );
};

export default Contact;

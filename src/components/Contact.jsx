import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaCopy, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import SITE_CONFIG from "../config/site";

const Contact = ({ motionEnabled = true, onCopyEmail, onScrollTop }) => {
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
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, []);

    return (
        <section id="contact" tabIndex={-1} className="relative mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
            <motion.div
                initial={motionEnabled ? { opacity: 0, scale: 0.9 } : false}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: motionEnabled ? 0.8 : 0 }}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-7 backdrop-blur-sm sm:p-12"
            >
                <p className="section-eyebrow">Let&apos;s connect</p>
                <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">Have a quality engineering role in mind?</h2>
                <p className="mx-auto mb-8 mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                    Tell me what your team is shipping, where it feels fragile, or what you want to automate.
                </p>

                <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                    <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-dark transition-colors hover:bg-white"
                    >
                        <FaEnvelope aria-hidden="true" /> Email me
                    </a>
                    <button
                        type="button"
                        onClick={onCopyEmail}
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                        <FaCopy aria-hidden="true" /> Copy email
                    </button>
                    <a
                        href={SITE_CONFIG.linkedinUrl}
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="inline-flex min-h-12 items-center rounded-full border border-primary/50 px-7 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-dark"
                    >
                        View LinkedIn
                        <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                </div>

                <p className="-mt-7 mb-8 text-sm text-zinc-400">
                    <a className="rounded underline decoration-white/25 underline-offset-4 hover:text-white" href={`mailto:${SITE_CONFIG.email}`}>
                        {SITE_CONFIG.email}
                    </a>
                </p>

                <div className="flex justify-center gap-2 text-2xl text-zinc-400">
                    <a href={SITE_CONFIG.githubUrl} target="_blank" rel="me noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/5 hover:text-white"><FaGithub aria-hidden="true" /></a>
                    <a href={SITE_CONFIG.linkedinUrl} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/5 hover:text-white"><FaLinkedin aria-hidden="true" /></a>
                </div>
            </motion.div>

            <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-zinc-400 md:flex-row">
                <p>&copy; {new Date().getFullYear()} Jonathan Biro. All rights reserved.</p>
                <span>Built, tested, and maintained with care.</span>
                {showScrollTop && (
                    <button
                        type="button"
                        onClick={
                            onScrollTop ||
                            (() => window.scrollTo({ top: 0, behavior: motionEnabled ? "smooth" : "auto" }))
                        }
                        className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/95 text-dark shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-white"
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp aria-hidden="true" />
                    </button>
                )}
            </footer>
        </section>
    );
};

export default Contact;

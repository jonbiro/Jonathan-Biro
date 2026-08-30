import { memo } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa";

import HackerText from "./ui/HackerText";
import MagneticButton from "./ui/MagneticButton";
import SITE_CONFIG from "../config/site";

const shouldInterceptInPageNavigation = (event) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

const Hero = ({ motionEnabled = true, pointerEffectsEnabled = true, onNavigate }) => {
    const motionProps = {
        initial: motionEnabled ? { opacity: 0, y: 20 } : false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: motionEnabled ? 0.75 : 0, ease: "easeOut" },
    };

    return (
        <section
            id="top"
            tabIndex={-1}
            className="relative flex min-h-[92dvh] flex-col items-center overflow-hidden px-4 pb-10 pt-28 sm:pt-32"
        >
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <div className={`absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] ${motionEnabled ? "animate-pulse" : ""}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px] ${motionEnabled ? "animate-pulse delay-1000" : ""}`} />
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:52px_52px]" />
                <div className="absolute bottom-0 left-0 z-[1] h-[32%] w-full bg-gradient-to-t from-[#050505] to-transparent" />
            </div>

            <div className="z-10 flex w-full max-w-5xl flex-grow flex-col items-center justify-center text-center">
                <motion.div {...motionProps}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
                        <FaMapMarkerAlt className="text-primary" aria-hidden="true" />
                        Based in {SITE_CONFIG.location}
                    </span>
                </motion.div>

                <div className="mt-6 overflow-hidden">
                    <HackerText
                        text={SITE_CONFIG.fullName}
                        as="h1"
                        animate={motionEnabled}
                        interactive={pointerEffectsEnabled}
                        className={`hero-name block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-5xl font-black tracking-[-0.045em] text-transparent [background-size:300%_300%] sm:text-6xl md:text-8xl lg:text-9xl ${motionEnabled ? "animate-gradient" : ""} ${pointerEffectsEnabled ? "cursor-crosshair" : ""}`}
                    />
                </div>

                <motion.div
                    initial={motionEnabled ? { opacity: 0, y: 16 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: motionEnabled ? 0.35 : 0, duration: motionEnabled ? 0.65 : 0 }}
                    className="mt-6 max-w-3xl"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary sm:text-base">
                        QA Automation Engineer <span className="text-zinc-600">·</span> SDET
                    </p>
                    <h2 className="mt-5 text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                        I turn product risk into release signal teams can trust.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
                        I design UI, API, and end-to-end checks with Playwright and TypeScript, then
                        connect them to CI so failures are fast to diagnose and safe to act on.
                    </p>

                    <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Core quality engineering strengths">
                        {["Playwright + TypeScript", "UI + API coverage", "CI release gates", "Accessibility checks"].map((strength) => (
                            <li key={strength} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                                {strength}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={motionEnabled ? { opacity: 0, y: 18 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: motionEnabled ? 0.7 : 0, duration: motionEnabled ? 0.55 : 0 }}
                    className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <a
                            href={`mailto:${SITE_CONFIG.email}`}
                            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-dark shadow-lg shadow-white/10 transition-colors hover:bg-primary"
                        >
                            <FaEnvelope aria-hidden="true" /> Email me
                        </a>
                    </MagneticButton>
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <a
                            href="#work"
                            onClick={(event) => {
                                if (onNavigate && shouldInterceptInPageNavigation(event)) {
                                    event.preventDefault();
                                    onNavigate("work");
                                }
                            }}
                            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            View selected work <FaArrowRight aria-hidden="true" />
                        </a>
                    </MagneticButton>
                </motion.div>

                <motion.nav
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: motionEnabled ? 1 : 0, duration: motionEnabled ? 0.6 : 0 }}
                    className="mt-9 flex items-center justify-center gap-2"
                    aria-label="Social and contact links"
                >
                    <SocialLink href={SITE_CONFIG.githubUrl} icon={<FaGithub />} label="GitHub profile (opens in a new tab)" />
                    <SocialLink href={SITE_CONFIG.linkedinUrl} icon={<FaLinkedin />} label="LinkedIn profile (opens in a new tab)" />
                    <SocialLink href={`mailto:${SITE_CONFIG.email}`} icon={<FaEnvelope />} label="Email Jonathan Biro" />
                </motion.nav>
            </div>

            <motion.a
                initial={motionEnabled ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: motionEnabled ? 1.25 : 0, duration: motionEnabled ? 0.6 : 0 }}
                href="#work"
                onClick={(event) => {
                    if (onNavigate && shouldInterceptInPageNavigation(event)) {
                        event.preventDefault();
                        onNavigate("work");
                    }
                }}
                className="z-20 mt-8 inline-flex min-h-11 items-center gap-3 rounded-full px-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
                Scroll to the work
                <span className="h-px w-10 bg-zinc-700" aria-hidden="true" />
            </motion.a>
        </section>
    );
};

const SocialLink = memo(({ href, icon, label }) => {
    const isExternal = href.startsWith("http");

    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "me noopener noreferrer" : undefined}
            aria-label={label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-xl text-zinc-400 transition-all duration-300 hover:scale-110 hover:bg-white/5 hover:text-white"
        >
            {icon}
        </a>
    );
});

SocialLink.displayName = "SocialLink";

export default Hero;

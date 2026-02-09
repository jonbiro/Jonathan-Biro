import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin, FaChevronDown, FaTerminal } from "react-icons/fa";

import HackerText from "./ui/HackerText";
import MagneticButton from "./ui/MagneticButton";
import RotatingRoles from "./ui/RotatingRoles";
import SITE_CONFIG from "../config/site";

const ROTATING_ROLES = [
    "QA Automation Engineer",
    "SDET",
    "Full-Stack Developer",
    "Tech Enthusiast",
];

const Hero = ({
    motionEnabled = true,
    pointerEffectsEnabled = true,
    onOpenCommandPalette,
    onLaunchChallenge,
}) => {
    const motionProps = {
        initial: motionEnabled ? { opacity: 0, y: 20 } : false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: motionEnabled ? 0.8 : 0, ease: "easeOut" },
    };

    const fadeProps = {
        initial: motionEnabled ? { opacity: 0 } : false,
        animate: { opacity: 1 },
        transition: { delay: motionEnabled ? 0.5 : 0, duration: motionEnabled ? 0.8 : 0 },
    };

    return (
        <section className="min-h-[100dvh] flex flex-col items-center relative overflow-hidden px-4 py-8 md:py-0">
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center w-full max-w-4xl z-10">
                <motion.div {...motionProps}>
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 mb-6 backdrop-blur-sm">
                        Hello, I'm
                    </span>
                </motion.div>

                <div className="mb-6 overflow-hidden text-center">
                    <HackerText
                        text={SITE_CONFIG.fullName}
                        as="h1"
                        animate={motionEnabled}
                        interactive={pointerEffectsEnabled}
                        className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient bg-300% block ${pointerEffectsEnabled ? "cursor-crosshair" : ""}`}
                    />
                </div>

                <motion.div {...fadeProps} className="mb-8 min-h-[4rem] text-center">
                    <h2 className="text-2xl md:text-4xl font-light text-gray-300">
                        <RotatingRoles
                            roles={ROTATING_ROLES}
                            enabled={motionEnabled}
                            className="font-semibold text-secondary"
                        />
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg">
                        Based in {SITE_CONFIG.location}
                    </p>
                </motion.div>
                <motion.div
                    initial={motionEnabled ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: motionEnabled ? 0.8 : 0, duration: motionEnabled ? 0.6 : 0 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <a
                            href="#contact"
                            className="px-8 py-3 rounded-full bg-white text-dark font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 block"
                        >
                            Contact Me
                        </a>
                    </MagneticButton>
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <a
                            href={SITE_CONFIG.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors block"
                        >
                            View Resume
                        </a>
                    </MagneticButton>
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <button
                            type="button"
                            onClick={onLaunchChallenge}
                            className="px-6 py-3 rounded-full border border-primary/40 text-primary font-semibold hover:bg-primary/15 transition-colors block"
                        >
                            QA Challenge
                        </button>
                    </MagneticButton>
                    <MagneticButton enabled={pointerEffectsEnabled}>
                        <button
                            type="button"
                            onClick={onOpenCommandPalette}
                            aria-label="Open command menu (Ctrl+K)"
                            title="Command Menu (Ctrl+K)"
                            className="p-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all block"
                        >
                            <FaTerminal className="text-lg" />
                        </button>
                    </MagneticButton>
                </motion.div>

                <motion.div
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: motionEnabled ? 1.2 : 0, duration: motionEnabled ? 1 : 0 }}
                    className="mt-12 flex gap-6 justify-center"
                >
                    <SocialLink href={SITE_CONFIG.githubUrl} icon={<FaGithub />} label="GitHub Profile" />
                    <SocialLink href={SITE_CONFIG.linkedinUrl} icon={<FaLinkedin />} label="LinkedIn Profile" />
                    <SocialLink href={`mailto:${SITE_CONFIG.email}`} icon={<FaEnvelope />} label="Email Me" />
                </motion.div>
            </div>

            {/* Scroll Down Indicator - Now part of flex flow to avoid overlap */}
            <motion.div
                initial={motionEnabled ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: motionEnabled ? 1.5 : 0, duration: motionEnabled ? 0.8 : 0 }}
                className="w-full flex justify-center pb-8 z-10"
            >
                <a
                    href="#about"
                    aria-label="Scroll to about section"
                    className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={motionEnabled ? { y: [0, 8, 0] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <FaChevronDown className="text-lg group-hover:text-primary transition-colors" />
                    </motion.div>
                </a>
            </motion.div>
        </section>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="text-2xl text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
    >
        {icon}
    </a>
);

export default Hero;

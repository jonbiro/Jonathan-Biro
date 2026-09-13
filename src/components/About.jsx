import { motion } from "framer-motion";
import headshot from "../assets/headshot.jpg";
import headshotWebp from "../assets/headshot.webp";
import MagneticButton from "./ui/MagneticButton";
import SITE_CONFIG from "../config/site";

const CAPABILITIES = [
    {
        title: "Test architecture",
        description: "Put each risk at the right testing layer.",
        tools: ["Playwright", "TypeScript", "UI + API coverage"],
    },
    {
        title: "Reliable delivery",
        description: "Turn checks into useful release gates.",
        tools: ["GitHub Actions", "Build validation", "Lighthouse CI"],
    },
    {
        title: "Experience quality",
        description: "Protect the paths real users depend on.",
        tools: ["Accessibility", "Responsive behavior", "Cross-browser checks"],
    },
];

const About = ({ motionEnabled = true, pointerEffectsEnabled = true }) => {
    const leftRevealProps = {
        initial: motionEnabled ? { opacity: 0, x: -36 } : false,
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: motionEnabled ? 0.65 : 0 },
    };

    const rightRevealProps = {
        initial: motionEnabled ? { opacity: 0, x: 36 } : false,
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: motionEnabled ? 0.65 : 0 },
    };

    return (
        <section id="about" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <div className="flex flex-col items-center gap-12 md:flex-row md:gap-20">
                <motion.div {...leftRevealProps} className="flex w-full justify-center md:w-5/12 md:justify-end">
                    <div className="group relative">
                        <picture>
                            <source srcSet={headshotWebp} type="image/webp" />
                            <img
                                src={headshot}
                                alt="Jonathan Biro"
                                loading="lazy"
                                decoding="async"
                                className="relative h-72 w-72 rounded-lg border border-slate-200 object-cover md:h-80 md:w-80"
                                width="320"
                                height="320"
                            />
                        </picture>
                    </div>
                </motion.div>

                <motion.div {...rightRevealProps} className="w-full md:w-7/12">
                    <p className="section-eyebrow">About</p>
                    <h2 className="section-title mt-4">Engineering with a user focus</h2>

                    <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
                        <p>
                            I&apos;m {SITE_CONFIG.fullName}, a QA Automation Engineer and SDET in Los Angeles.
                            My work connects reproducible defect investigation with automated coverage
                            and practical release validation.
                        </p>
                        <p>
                            Building interfaces alongside their tests helps me evaluate both implementation
                            details and real user behavior, including accessibility, state transitions,
                            and error recovery.
                        </p>
                    </div>

                    <div className="mt-9 grid gap-3 sm:grid-cols-3">
                        {CAPABILITIES.map((capability) => (
                            <article key={capability.title} className="rounded-2xl border border-slate-200 bg-sky-50 p-4">
                                <h3 className="font-bold text-slate-900">{capability.title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{capability.description}</p>
                                <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                                    {capability.tools.map((tool) => (
                                        <li key={tool}>{tool}</li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>

                    <MagneticButton enabled={pointerEffectsEnabled} className="mt-8 inline-block">
                        <a
                            href={SITE_CONFIG.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-primary hover:text-dark"
                        >
                            View professional profile
                            <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    );
};

export default About;

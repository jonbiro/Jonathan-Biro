import { motion } from "framer-motion";
import { FaArrowRight, FaCheck, FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const FEATURED_WORK = [
    {
        eyebrow: "Public build · Healthcare",
        title: "BiroMD",
        context: "Independent production build",
        focus: "Quality engineering + frontend delivery",
        description:
            "A live medical-practice site built with Next.js and a static export, with browser checks and an allowlisted clinical-gallery pipeline.",
        stack: ["Next.js", "TypeScript", "Playwright", "GitHub Actions"],
        highlights: [
            "Route, sitemap, internal-link, and responsive image validation",
            "Browser coverage for mobile layout, contrast, navigation, and scheduling flows",
            "Allowlisted clinical asset pipeline with metadata-safe public derivatives",
        ],
        proof:
            "Playwright and export checks cover the high-risk paths that content-heavy healthcare releases can quietly break.",
        liveUrl: "https://biromd.com",
        sourceUrl: "https://github.com/jonbiro/BiroMD",
        sourceLabel: "View BiroMD source",
        featured: true,
    },
    {
        eyebrow: "Public build · Portfolio",
        title: "QA Portfolio",
        context: "Independent portfolio build",
        focus: "Accessible product design + engineering",
        description:
            "This single-page portfolio turns quality engineering principles into a recruiter-friendly, keyboard-ready product experience.",
        stack: ["React", "Vite", "Accessibility", "Lighthouse CI"],
        highlights: [
            "Keyboard-first quick actions and focus-managed dialogs",
            "System-aware motion controls and touch-sized interactions",
            "Coverage-gated behavior tests, Lighthouse budgets, and dependency checks in CI",
        ],
        proof:
            "The portfolio doubles as its own QA sample: usability, delivery safeguards, and interactive edge cases are visible in the product.",
        isCurrentSite: true,
    },
    {
        eyebrow: "Side project · Canvas game",
        title: "Puppy Quest 1989",
        context: "DogeQuest-1989 repository",
        focus: "Interaction state + input edge cases",
        description:
            "A retro Canvas platformer exploring collision, input timing, mobile controls, and state transitions—the edge cases that make interactive products hard to verify.",
        stack: ["JavaScript", "Canvas", "Game logic"],
        highlights: [
            "Double-jump, dash, coyote-time, and jump-buffer input behavior",
            "Class-based game loop, collision logic, camera movement, and audio",
            "Keyboard and mobile support across a state-heavy interface",
        ],
        proof:
            "A compact demonstration of reasoning through timing, physics, input, and rendering behavior beyond standard form-based UI.",
        liveUrl: "https://jonbiro.github.io/DogeQuest-1989/",
        sourceUrl: "https://github.com/jonbiro/DogeQuest-1989",
        sourceLabel: "View DogeQuest source",
    },
];

const revealProps = (motionEnabled, delay = 0) => ({
    initial: motionEnabled ? { opacity: 0, y: 24 } : false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: motionEnabled ? 0.55 : 0, delay: motionEnabled ? delay : 0 },
});

const ProjectLinks = ({ project }) => (
    <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
            <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-dark transition-colors hover:bg-primary"
            >
                View {project.title} live <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
            </a>
        )}
        {project.sourceUrl && (
            <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/10"
            >
                <FaGithub aria-hidden="true" /> {project.sourceLabel}
                <span className="sr-only"> (opens in a new tab)</span>
            </a>
        )}
        {project.isCurrentSite && (
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-2 text-sm font-semibold text-primary">
                <FaCheck aria-hidden="true" /> You&apos;re viewing this project
            </span>
        )}
    </div>
);

const Work = ({ motionEnabled = true }) => (
    <section id="work" tabIndex={-1} className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.div {...revealProps(motionEnabled)} className="max-w-3xl">
            <p className="section-eyebrow">Selected public work</p>
            <h2 className="section-title mt-4">Proof lives in the details.</h2>
            <p className="section-intro mt-5">
                Public builds that show how I approach product risk, release validation, and the
                interaction edge cases that quietly break real user journeys.
            </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {FEATURED_WORK.map((project, index) => (
                <motion.article
                    key={project.title}
                    {...revealProps(motionEnabled, index * 0.08)}
                    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-white/20 md:p-8 ${project.featured ? "lg:row-span-2" : ""}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            {project.eyebrow}
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">{project.title}</h3>
                        <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">{project.description}</p>

                        <dl className="mt-6 grid gap-3 border-y border-white/10 py-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Context</dt>
                                <dd className="mt-1 text-sm font-semibold text-white">{project.context}</dd>
                            </div>
                            <div>
                                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Focus</dt>
                                <dd className="mt-1 text-sm font-semibold text-white">{project.focus}</dd>
                            </div>
                        </dl>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {project.stack.map((item) => (
                                <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-300">
                                    {item}
                                </span>
                            ))}
                        </div>

                        {project.highlights && (
                            <ul className="mt-7 space-y-3" aria-label={`${project.title} quality highlights`}>
                                {project.highlights.map((highlight) => (
                                    <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">
                                            <FaCheck aria-hidden="true" />
                                        </span>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/[0.06] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Why it matters</p>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{project.proof}</p>
                        </div>

                        <ProjectLinks project={project} />
                    </div>
                </motion.article>
            ))}
        </div>

        <motion.a
            {...revealProps(motionEnabled)}
            href="https://github.com/jonbiro?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
        >
            Explore more work on GitHub <FaArrowRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
        </motion.a>
    </section>
);

export default Work;

import { motion } from "framer-motion";
import { FaBug, FaCodeBranch, FaRoute, FaSignal } from "react-icons/fa";

const PRINCIPLES = [
    {
        number: "01",
        icon: FaRoute,
        title: "Map the real risk",
        description:
            "Start with critical user journeys, failure modes, and release decisions—not a blanket goal of automating everything.",
        practice: "Example: BiroMD prioritizes scheduling, navigation, public routes, and authorized clinical content.",
    },
    {
        number: "02",
        icon: FaCodeBranch,
        title: "Engineer reliable signal",
        description:
            "Use the right layer for each check, deterministic data, resilient selectors, and failures that explain what broke.",
        practice: "Practice: validate routes, links, images, and content at build time; reserve browsers for real user behavior.",
    },
    {
        number: "03",
        icon: FaSignal,
        title: "Keep feedback useful",
        description:
            "Place fast checks close to the change, reserve deeper coverage for the right stage, and keep unstable checks out of the release signal.",
        practice: "Practice: quarantine, diagnose, and retire flaky checks instead of teaching teams to ignore red builds.",
    },
];

const Approach = ({ motionEnabled = true, onLaunchChallenge }) => (
    <section id="approach" tabIndex={-1} className="border-y border-white/5 bg-white/[0.02] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
            <motion.div
                initial={motionEnabled ? { opacity: 0, y: 24 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: motionEnabled ? 0.55 : 0 }}
                className="max-w-3xl"
            >
                <p className="section-eyebrow">How I work</p>
                <h2 className="section-title mt-4">Automation should earn trust.</h2>
                <p className="section-intro mt-5">
                    The goal is not more tests. It is faster, clearer decisions about whether the
                    product is ready to ship.
                </p>
            </motion.div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
                {PRINCIPLES.map((principle, index) => {
                    const Icon = principle.icon;
                    return (
                        <motion.article
                            key={principle.title}
                            initial={motionEnabled ? { opacity: 0, y: 24 } : false}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: motionEnabled ? 0.5 : 0, delay: motionEnabled ? index * 0.08 : 0 }}
                            className="rounded-3xl border border-white/10 bg-[#080b10] p-6"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Icon aria-hidden="true" />
                                </span>
                                <span className="font-mono text-sm text-zinc-500" aria-hidden="true">{principle.number}</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">{principle.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{principle.description}</p>
                            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-zinc-300">
                                {principle.practice}
                            </p>
                        </motion.article>
                    );
                })}
            </div>

            <motion.div
                initial={motionEnabled ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: motionEnabled ? 0.5 : 0 }}
                className="mt-8 flex flex-col gap-5 rounded-3xl border border-secondary/20 bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                        <FaBug aria-hidden="true" />
                    </span>
                    <div>
                        <h3 className="font-bold text-white">Prefer something interactive?</h3>
                        <p className="mt-1 text-sm text-zinc-400">Try the 25-second bug hunt and see how many escape.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onLaunchChallenge}
                    className="min-h-11 shrink-0 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-dark transition-colors hover:bg-white"
                >
                    Launch QA challenge
                </button>
            </motion.div>
        </div>
    </section>
);

export default Approach;

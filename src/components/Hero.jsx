import { FaArrowRight, FaEnvelope, FaFileDownload, FaGithub, FaLinkedin } from "react-icons/fa";
import SITE_CONFIG from "../config/site";

const Hero = ({ onNavigate }) => (
    <section id="top" tabIndex={-1} className="relative mx-auto max-w-7xl px-4 pb-10 pt-28 sm:pb-14 sm:pt-32">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_280px]">
            <div>
                <p className="section-eyebrow">QA Automation Engineer / SDET · Los Angeles</p>
                <h1 className="mt-5 text-5xl font-bold tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">Jonathan Biro</h1>
                <h2 className="mt-5 max-w-3xl text-balance text-2xl font-medium leading-snug text-zinc-200 sm:text-3xl">
                    I build automated checks that help teams ship with confidence.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                    Playwright, TypeScript, and a practical eye for the details that break user journeys.
                    Explore the products, the defects, and the decisions behind my work.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                    <a href="#work" onClick={(event) => {
                        if (onNavigate && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                            event.preventDefault(); onNavigate("work");
                        }
                    }} className="action-primary">View selected work <FaArrowRight aria-hidden="true" /></a>
                    <a href={`${import.meta.env.BASE_URL}Jonathan-Biro-Resume.pdf`} download className="action-secondary"><FaFileDownload aria-hidden="true" /> Project résumé</a>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-zinc-300 hover:text-white"><FaEnvelope aria-hidden="true" /> Email me</a>
                </div>
            </div>
            <aside className="hidden border-l-2 border-primary/50 pl-5 lg:block">
                <p className="text-xs uppercase tracking-widest text-zinc-500">What you can explore</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-300">
                    <li>A healthcare release case study</li>
                    <li>Real regression-test examples</li>
                    <li>A hands-on defect investigation</li>
                </ul>
                <nav aria-label="Professional profiles" className="mt-5 flex gap-4">
                    <a href={SITE_CONFIG.githubUrl} target="_blank" rel="me noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-400 hover:text-white"><FaGithub aria-hidden="true" /> GitHub</a>
                    <a href={SITE_CONFIG.linkedinUrl} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-400 hover:text-white"><FaLinkedin aria-hidden="true" /> LinkedIn</a>
                </nav>
            </aside>
        </div>
    </section>
);
export default Hero;

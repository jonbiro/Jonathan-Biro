import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const repo = "https://github.com/jonbiro/BiroMD";
const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="action-secondary">{children}<FaExternalLinkAlt aria-hidden="true" className="text-xs" /><span className="sr-only"> (opens in a new tab)</span></a>;

const Work = () => (
    <section id="work" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-8">
            <div><p className="section-eyebrow">Portfolio</p><h2 className="section-title mt-3">Selected projects</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">Independent projects, with the decisions and source evidence behind them.</p>
        </div>

        <article className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-[#101114]">
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
                <figure className="border-b border-white/10 bg-[#e8edf0] lg:border-b-0 lg:border-r">
                    <img src={`${import.meta.env.BASE_URL}projects/biromd.jpg`} width="1440" height="1000" loading="lazy" decoding="async" alt="BiroMD homepage with physician introduction, consultation action, and patient navigation" className="aspect-[1.44] w-full object-cover object-top" />
                    <figcaption className="flex justify-between gap-3 bg-[#101722] px-5 py-3 text-xs text-zinc-400"><span>BiroMD · Live homepage</span><span>Captured September 2026</span></figcaption>
                </figure>
                <div className="p-6 sm:p-8">
                    <p className="section-eyebrow">Featured case study / Healthcare</p>
                    <h3 className="mt-3 text-3xl font-bold">BiroMD</h3>
                    <p className="mt-4 text-base leading-relaxed text-zinc-300">A medical-practice website with automated validation of patient navigation, consultation links, and accessible interface states.</p>
                    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div><dt className="text-zinc-500">Contribution</dt><dd className="mt-1 text-zinc-200">Frontend delivery and quality engineering</dd></div>
                        <div><dt className="text-zinc-500">Project type</dt><dd className="mt-1 text-zinc-200">Independent medical-practice website</dd></div>
                    </dl>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="BiroMD technologies">{["Next.js", "TypeScript", "Playwright", "GitHub Actions"].map(x => <li className="tech-tag" key={x}>{x}</li>)}</ul>
                    <div className="mt-6 flex flex-wrap gap-3"><External href="https://biromd.com">View BiroMD live</External><External href={repo}><FaGithub aria-hidden="true" /> Source</External></div>
                </div>
            </div>

            <div className="grid gap-6 border-t border-white/10 p-6 sm:p-8 md:grid-cols-3">
                <div><p className="case-label">01 / The problem</p><h4 className="mt-2 text-lg font-semibold">A working link is only part of the journey.</h4><p className="case-copy">Patients need readable consultation actions, usable mobile navigation, and the correct office destination. Content changes can break any of those without a compiler error.</p></div>
                <div><p className="case-label">02 / The decision</p><h4 className="mt-2 text-lg font-semibold">Test each risk at the right layer.</h4><p className="case-copy">Check routes, links, and image exports at build time. Use a real browser for theme contrast, mobile overflow, keyboard behavior, and consultation links.</p></div>
                <div><p className="case-label">03 / The outcome</p><h4 className="mt-2 text-lg font-semibold">Repeatable release checks.</h4><p className="case-copy">The repository includes an export verifier and browser regressions for these paths. Clinical images require an explicit case allowlist before public derivatives are generated.</p></div>
            </div>
            <details className="case-details">
                <summary>Inside a real fix: the consultation button in dark mode <span aria-hidden="true">+</span></summary>
                <div className="grid gap-6 pb-7 pt-3 lg:grid-cols-2">
                    <div>
                        <h4 className="text-xl font-semibold">Protect the action patients came to take.</h4>
                        <p className="case-copy">The project history records consultation-button contrast changes on February 10, 2026, including an explicit dark-mode foreground correction. The current browser test checks the action in both themes and requires at least a 4.5:1 text-contrast ratio.</p>
                        <p className="case-copy">A screenshot captures one state. This regression checks the actual foreground and background colors after the theme changes.</p>
                        <div className="mt-5 flex flex-wrap gap-3"><External href={`${repo}/commit/3427224bcca966b8de74a6c5f038ef811783af24`}>Inspect the fix</External><External href={`${repo}/blob/main/tests/site.spec.ts`}>Read browser tests</External></div>
                    </div>
                    <div className="min-w-0">
                        <p className="case-label mb-3">Excerpt / Existing Playwright test</p>
                        <pre className="code-sample"><code>{`const cta = page.getByRole("link", {
  name: "Request a Consultation"
}).first();

await expect(cta).toBeVisible();
expect(await textContrast(cta))
  .toBeGreaterThanOrEqual(4.5);

await page.getByRole("button", {
  name: "Switch to dark mode"
}).click();

expect(await textContrast(cta))
  .toBeGreaterThanOrEqual(4.5);`}</code></pre>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400">Repository test excerpt. Live deployment results may vary by revision.</p>
                    </div>
                </div>
            </details>
            <details className="case-details">
                <summary>Explore the release-check workflow <span aria-hidden="true">+</span></summary>
                <ol className="grid gap-4 pb-7 pt-3 sm:grid-cols-3">
                    {[["Build", "Generate the static site and authorized public image derivatives."], ["Verify", "Check required routes, sitemap entries, internal links, and image budgets."], ["Exercise", "Run browser scenarios for consultation, navigation, themes, and gallery behavior."]].map(([title,body],i)=><li key={title} className="rounded-xl bg-white/[0.04] p-4"><span className="text-sm text-primary">0{i+1}</span><h4 className="mt-2 font-semibold">{title}</h4><p className="case-copy">{body}</p></li>)}
                </ol>
                <div className="pb-6"><External href={`${repo}/actions`}>View workflow runs</External></div>
            </details>
        </article>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
                <img src={`${import.meta.env.BASE_URL}projects/portfolio.jpg`} width="1440" height="1000" loading="lazy" decoding="async" alt="Jonathan Biro portfolio with selected work and direct contact links" className="aspect-video w-full border-b border-white/10 object-cover object-top" />
                <div className="p-6"><p className="case-label">Accessibility / Interaction design</p><h3 className="mt-2 text-2xl font-bold">QA Portfolio</h3><p className="case-copy">A portfolio where keyboard access, reduced motion, and recoverable interaction states are part of the product.</p><details className="mt-5"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-primary">What I tested</summary><p className="case-copy">Dialog focus and return, navigation, game timers, score persistence, and background-tab pausing. Coverage gates and production builds run in CI.</p><a href="#lab" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary">Try the defect investigation →</a></details></div>
            </article>
            <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
                <img src={`${import.meta.env.BASE_URL}projects/puppy-quest.jpg`} width="1440" height="1000" loading="lazy" decoding="async" alt="Puppy Quest browser game showing its illustrated adventure start screen" className="aspect-video w-full border-b border-white/10 object-cover object-top" />
                <div className="p-6"><p className="case-label">Game development / Input and state</p><h3 className="mt-2 text-2xl font-bold">Puppy Quest</h3><p className="case-copy">A browser adventure that makes input timing, collision, checkpoints, and saved progress tangible engineering problems.</p><details className="mt-5"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-primary">Explore the engineering</summary><p className="case-copy">Keyboard and touch inputs share the same game rules. Checkpoints, retries, and local progress create useful cases for testing state transitions and recovery.</p><div className="mt-4 flex flex-wrap gap-3"><External href="https://jonbiro.github.io/DogeQuest-1989/">Play the game</External><External href="https://github.com/jonbiro/DogeQuest-1989">Read the source</External></div></details></div>
            </article>
        </div>
    </section>
);
export default Work;

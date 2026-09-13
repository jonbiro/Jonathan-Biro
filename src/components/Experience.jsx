import SITE_CONFIG from "../config/site";
export default function Experience() {
    return <section id="experience" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div><p className="section-eyebrow">Experience</p><h2 className="section-title mt-3">Engineering in practice.</h2><p className="mt-5 text-base leading-relaxed text-slate-600">Selected independent work, from patient-facing websites to interactive products.</p><a href={`${import.meta.env.BASE_URL}Jonathan-Biro-Resume.pdf`} download className="action-secondary mt-6">Download project résumé (PDF)</a><p className="mt-3 text-xs leading-relaxed text-slate-500">A concise summary of the work shown here.</p></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
                {[["BiroMD", "Healthcare website · Frontend and QA", "Built patient-facing routes and consultation paths, with browser regressions and static-export validation."], ["QA Portfolio", "Portfolio · Product and accessibility", "Implemented keyboard navigation, focus-managed dialogs, reduced-motion support, and automated behavior checks."], ["Puppy Quest", "Browser game · Interaction engineering", "Developed input, collision, checkpoints, and persistence across keyboard and touch interactions."]].map(([title,scope,body])=><article key={title} className="py-6"><p className="text-sm text-sky-700">{scope}</p><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-2 text-base leading-relaxed text-slate-600">{body}</p></article>)}
            </div>
        </div>
        <p className="mt-6 text-sm text-slate-600">For professional background and connections, visit <a className="underline underline-offset-4 hover:text-slate-900" href={SITE_CONFIG.linkedinUrl} target="_blank" rel="me noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>.</p>
    </section>;
}

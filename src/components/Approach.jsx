const Approach = () => (
    <section id="approach" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <p className="section-eyebrow">How I work</p>
        <h2 className="section-title mt-3">A systematic approach to quality</h2>
        <ol className="mt-8 grid gap-7 md:grid-cols-3">
            {[["Reproduce precisely", "Capture the smallest sequence, the environment, and the expected result. Make the failure something another person can repeat."], ["Find the boundary", "Trace where the behavior changes: UI to API, local time to UTC, one device to another. Test the assumption at that boundary."], ["Keep it fixed", "Add the smallest useful regression at the right layer, then check the complete user journey and document the remaining limits."]].map(([title,body],i)=><li key={title} className="border-t border-slate-200 pt-5"><span className="font-mono text-sm text-sky-700">0{i+1}</span><h3 className="mt-3 text-xl font-semibold">{title}</h3><p className="mt-3 text-base leading-relaxed text-slate-600">{body}</p></li>)}
        </ol>
    </section>
);
export default Approach;

import { useState } from "react";

const options = [
    { id: "timezone", label: "The confirmation uses the UTC calendar date", detail: "Correct. The timestamp is the same instant, but slicing the ISO string discards the appointment's local timezone." },
    { id: "cache", label: "The confirmation is showing a cached appointment", detail: "The returned timestamp matches this selection. The discrepancy appears when that timestamp is formatted into a calendar date." },
    { id: "api", label: "The API returned the wrong appointment time", detail: "02:30 UTC on January 16 is 6:30 PM on January 15 in Los Angeles. The API preserved the instant correctly." },
];

const startsAt = "2026-01-16T02:30:00Z";
const localDate = (date, timeZone) => new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "long", day: "numeric",
}).format(date);
const brokenDate = localDate(new Date(`${startsAt.slice(0, 10)}T00:00:00Z`), "UTC");
const correctedDate = localDate(new Date(startsAt), "America/Los_Angeles");

export default function QALab({ onLaunchChallenge }) {
    const [reproduced, setReproduced] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [fixed, setFixed] = useState(false);
    const selected = options.find(option => option.id === diagnosis);
    const reset = () => { setReproduced(false); setDiagnosis(""); setFixed(false); };

    return (
        <section id="lab" tabIndex={-1} className="border-y border-white/10 bg-[#0a1019] px-4 py-14 md:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl"><p className="section-eyebrow">Interactive QA lab / About 2 minutes</p><h2 className="section-title mt-3">The appointment moved a day. Why?</h2><p className="mt-5 text-base leading-relaxed text-zinc-400">Reproduce the defect, examine the evidence, and choose a diagnosis. This fictional scheduling example runs locally; it creates no appointment.</p></div>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#070c13] p-5 sm:p-7">
                        <p className="case-label">01 / Reproduce</p><h3 className="mt-3 text-xl font-semibold">Appointment preview</h3>
                        <dl className="mt-5 space-y-3 text-base"><div className="flex justify-between gap-4"><dt className="text-zinc-400">Selected date</dt><dd>January 15, 2026</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-400">Selected time</dt><dd>6:30 PM</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-400">Timezone</dt><dd>America/Los_Angeles</dd></div></dl>
                        <button type="button" className="action-primary mt-6" onClick={() => setReproduced(true)} disabled={reproduced}>{reproduced ? "Preview generated" : "Generate confirmation"}</button>
                        <div role="status" aria-live="polite" className="mt-5">
                            {reproduced && <div className={`rounded-xl border p-4 ${fixed ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-300/30 bg-amber-300/5"}`}><p className="text-sm text-zinc-400">{fixed ? "Corrected confirmation" : "Observed confirmation"}</p><p className="mt-2 text-lg font-semibold">{fixed ? correctedDate : brokenDate} · 6:30 PM</p><p className="mt-2 text-sm text-zinc-300">{fixed ? "The date and time now use the appointment timezone." : "Expected January 15. The confirmation shows January 16."}</p></div>}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-5 sm:p-7">
                        <p className="case-label">02 / Investigate</p><h3 className="mt-3 text-xl font-semibold">Follow the timestamp</h3>
                        {reproduced ? <>
                            <pre className="code-sample mt-5"><code>{`API response
startsAt: "2026-01-16T02:30:00Z"
timeZone: "America/Los_Angeles"

Confirmation date formatter
startsAt.slice(0, 10)`}</code></pre>
                            <fieldset className="mt-5"><legend className="text-base font-semibold">Which explanation fits the evidence?</legend><div className="mt-3 space-y-2">{options.map(option=><label key={option.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3 text-sm leading-relaxed hover:bg-white/5"><input type="radio" name="diagnosis" value={option.id} checked={diagnosis===option.id} onChange={()=>{setDiagnosis(option.id);setFixed(false);}} className="mt-1 accent-blue-400" />{option.label}</label>)}</div></fieldset>
                            <p role="status" className="mt-4 text-sm leading-relaxed text-zinc-300">{selected?.detail}</p>
                            {diagnosis==="timezone" && <button type="button" onClick={()=>setFixed(true)} className="action-primary mt-5" disabled={fixed}>{fixed ? "Correction applied" : "Apply timezone-aware formatting"}</button>}
                        </> : <p className="mt-5 text-base leading-relaxed text-zinc-400">Generate the confirmation to reveal the API response and the formatter behind it.</p>}
                    </div>
                </div>
                {fixed && <div className="mt-6 rounded-2xl border border-primary/25 p-6">
                    <p className="case-label">03 / Prevent a regression</p><h3 className="mt-3 text-xl font-semibold">Assert the user's date, not just the timestamp.</h3>
                    <div className="mt-4 grid gap-6 lg:grid-cols-2"><pre className="code-sample"><code>{`new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  dateStyle: "long",
  timeStyle: "short"
}).format(new Date(startsAt));`}</code></pre><div><p className="text-base leading-relaxed text-zinc-300">Start with a unit test for this midnight boundary. Add cases for UTC-positive zones and daylight-saving transitions, then verify the selected slot and confirmation agree in the browser.</p><p className="mt-3 text-sm leading-relaxed text-zinc-400">This corrects display formatting. Availability rules, duplicate bookings, and timezone selection need their own tests.</p></div></div>
                </div>}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button className="action-secondary" type="button" onClick={reset}>Reset investigation</button><button className="min-h-11 rounded-lg px-3 text-sm text-zinc-400 underline underline-offset-4 hover:text-white" type="button" onClick={onLaunchChallenge}>Just for fun: play the bug hunt</button></div>
            </div>
        </section>
    );
}

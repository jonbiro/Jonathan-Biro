import { useEffect, useMemo, useState } from "react";

const TIMEZONE = "America/Los_Angeles";

const LiveStatusCard = ({ motionEnabled = true }) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    const formattedTime = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                timeZone: TIMEZONE,
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(now),
        [now]
    );

    const formattedDate = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                timeZone: TIMEZONE,
                weekday: "long",
                month: "short",
                day: "numeric",
            }).format(now),
        [now]
    );

    return (
        <div className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Live Status</p>
                    <p className="mt-1 text-lg font-semibold text-white">{formattedTime} PT</p>
                    <p className="text-sm text-zinc-400">{formattedDate}</p>
                </div>
                <div className="text-right">
                    <p className="flex items-center justify-end gap-2 text-sm text-emerald-300">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full bg-emerald-300 ${motionEnabled ? "animate-pulse" : ""}`} />
                        Available
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">Usually replies within 24h</p>
                </div>
            </div>
        </div>
    );
};

export default LiveStatusCard;

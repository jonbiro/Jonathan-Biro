import { useEffect, useMemo, useState } from "react";

const DEFAULT_INTERVAL = 2200;

const RotatingRoles = ({ roles, intervalMs = DEFAULT_INTERVAL, enabled = true, className = "" }) => {
    const safeRoles = useMemo(
        () => (Array.isArray(roles) && roles.length ? roles : ["QA Automation Engineer"]),
        [roles]
    );
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        if (!enabled || safeRoles.length <= 1) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setRoleIndex((currentIndex) => (currentIndex + 1) % safeRoles.length);
        }, intervalMs);

        return () => window.clearInterval(intervalId);
    }, [enabled, intervalMs, safeRoles.length]);

    return <span className={className}>{safeRoles[roleIndex]}</span>;
};

export default RotatingRoles;

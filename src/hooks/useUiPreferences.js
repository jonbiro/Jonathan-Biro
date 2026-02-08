import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const MOTION_PREFERENCE_STORAGE_KEY = "jb-motion-preference";

const normalizeMotionPreference = (value) => {
    if (value === "on" || value === "off" || value === "auto") {
        return value;
    }
    return "auto";
};

const getStoredMotionPreference = () => {
    if (typeof window === "undefined") {
        return "auto";
    }

    try {
        const preference = window.localStorage.getItem(MOTION_PREFERENCE_STORAGE_KEY);
        return normalizeMotionPreference(preference);
    } catch {
        return "auto";
    }
};

const getUiPreferences = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return { reduceMotion: false, hasFinePointer: true, motionPreference: "auto" };
    }

    return {
        reduceMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
        hasFinePointer: window.matchMedia(FINE_POINTER_QUERY).matches,
        motionPreference: getStoredMotionPreference(),
    };
};

const useUiPreferences = () => {
    const [preferences, setPreferences] = useState(getUiPreferences);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return undefined;
        }

        const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
        const finePointerMedia = window.matchMedia(FINE_POINTER_QUERY);

        const updatePreferences = () => {
            setPreferences((currentPreferences) => ({
                ...currentPreferences,
                reduceMotion: reducedMotionMedia.matches,
                hasFinePointer: finePointerMedia.matches,
            }));
        };

        updatePreferences();
        reducedMotionMedia.addEventListener("change", updatePreferences);
        finePointerMedia.addEventListener("change", updatePreferences);

        return () => {
            reducedMotionMedia.removeEventListener("change", updatePreferences);
            finePointerMedia.removeEventListener("change", updatePreferences);
        };
    }, []);

    const setMotionPreference = (nextPreference) => {
        const normalizedPreference = normalizeMotionPreference(nextPreference);

        setPreferences((currentPreferences) => ({
            ...currentPreferences,
            motionPreference: normalizedPreference,
        }));

        if (typeof window === "undefined") {
            return;
        }

        try {
            if (normalizedPreference === "auto") {
                window.localStorage.removeItem(MOTION_PREFERENCE_STORAGE_KEY);
            } else {
                window.localStorage.setItem(MOTION_PREFERENCE_STORAGE_KEY, normalizedPreference);
            }
        } catch {
            // no-op: preference still applies for current session
        }
    };

    const motionEnabled =
        preferences.motionPreference === "on"
            ? true
            : preferences.motionPreference === "off"
              ? false
              : !preferences.reduceMotion;

    return {
        ...preferences,
        motionEnabled,
        setMotionPreference,
        pointerEffectsEnabled: motionEnabled && preferences.hasFinePointer,
    };
};

export default useUiPreferences;

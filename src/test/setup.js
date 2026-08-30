import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const animationFrameTimers = new Set();

afterEach(() => {
    cleanup();
    if (typeof window !== "undefined") {
        animationFrameTimers.forEach((timerId) => window.clearTimeout(timerId));
        animationFrameTimers.clear();
        window.localStorage.clear();
        window.history.replaceState(null, "", "/");
    }
});

if (typeof window !== "undefined") {
    window.requestAnimationFrame = (callback) => {
        const frameId = window.setTimeout(() => {
            animationFrameTimers.delete(frameId);
            if (typeof document !== "undefined") {
                callback(window.performance.now());
            }
        }, 16);
        animationFrameTimers.add(frameId);
        return frameId;
    };
    window.cancelAnimationFrame = (frameId) => {
        animationFrameTimers.delete(frameId);
        window.clearTimeout(frameId);
    };
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();

    if (!window.matchMedia) {
        window.matchMedia = vi.fn().mockImplementation(() => ({
            matches: false,
            media: "",
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
    }

    if (!window.IntersectionObserver) {
        window.IntersectionObserver = class IntersectionObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    }
}

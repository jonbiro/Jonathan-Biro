import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import useUiPreferences from "./useUiPreferences";

beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
});

it("follows system motion settings and persists a manual override", () => {
    const { result } = renderHook(() => useUiPreferences());

    expect(result.current.motionEnabled).toBe(false);
    expect(result.current.pointerEffectsEnabled).toBe(false);

    act(() => result.current.setMotionPreference("on"));

    expect(result.current.motionEnabled).toBe(true);
    expect(window.localStorage.getItem("jb-motion-preference")).toBe("on");
});

it("supports legacy MediaQueryList listeners", () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes("pointer: fine"),
        media: query,
        addListener,
        removeListener,
    }));

    const { unmount } = renderHook(() => useUiPreferences());

    expect(addListener).toHaveBeenCalledTimes(2);
    unmount();
    expect(removeListener).toHaveBeenCalledTimes(2);
});

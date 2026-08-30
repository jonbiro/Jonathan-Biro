import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QAChallengeModal from "./QAChallengeModal";

beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
});

afterEach(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    vi.useRealTimers();
});

it("uses the bonus-aware timer range and lets players pause time", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    expect(screen.getByRole("progressbar", { name: /time remaining/i })).toHaveAttribute(
        "aria-valuemax",
        "35"
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));
    fireEvent.click(screen.getByRole("button", { name: /pause game/i }));

    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByText("25.0s")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resume game/i })).toBeInTheDocument();
});

it("keeps the progressbar's accessible and visual scales aligned", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    const progressbar = screen.getByRole("progressbar", { name: /time remaining/i });
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "35");
    expect(progressbar).toHaveAttribute("aria-valuenow", "25");
    expect(progressbar.firstElementChild).toHaveStyle({
        width: `${(25 / 35) * 100}%`,
    });
});

it("moves focus into the arena when the start control unmounts", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));

    act(() => vi.advanceTimersByTime(16));

    const arena = screen.getByRole("group", { name: /bug hunt arena/i });
    const firstBug = arena.querySelector("[data-bug-button='true']");
    expect(firstBug || arena).toHaveFocus();
});

it("offers a keyboard route from the arena to an active bug", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));
    const arena = screen.getByRole("group", { name: /bug hunt arena/i });
    arena.focus();
    fireEvent.keyDown(arena, { key: "Enter" });

    expect(arena.querySelector("[data-bug-button='true']")).toHaveFocus();
});

it("pauses automatically when the page is hidden", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(1500));

    expect(screen.getByRole("button", { name: /resume game/i })).toBeInTheDocument();
    expect(screen.getByText("25.0s")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/paused automatically/i);
});

it("finishes on time and persists a scored run", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));
    const firstBug = screen
        .getByRole("group", { name: /bug hunt arena/i })
        .querySelector("[data-bug-button='true']");
    fireEvent.keyDown(firstBug, { key: "Enter" });
    act(() => vi.advanceTimersByTime(35_100));

    expect(screen.getByText("Final Result")).toBeInTheDocument();
    expect(Number(window.localStorage.getItem("qa-bug-hunt-best-score"))).toBeGreaterThan(0);
});

it("keeps live announcements focused on meaningful milestones", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    fireEvent.click(screen.getByRole("button", { name: /start smashing/i }));
    const status = screen.getByRole("status");
    const startedMessage = "Hunt started. Twenty-five seconds remaining.";
    expect(status).toHaveTextContent(startedMessage);

    const arena = screen.getByRole("group", { name: /bug hunt arena/i });
    const firstBug = arena.querySelector("[data-bug-button='true']");
    fireEvent.pointerDown(firstBug, { pointerType: "mouse", button: 0 });
    fireEvent.pointerDown(arena, { pointerType: "mouse", button: 0 });

    expect(status).toHaveTextContent(startedMessage);
});

it("exposes sound preference state as a pressed control", () => {
    render(
        <QAChallengeModal
            isOpen
            onClose={vi.fn()}
            motionEnabled={false}
        />
    );

    const soundButton = screen.getByRole("button", { name: /sound on/i });
    expect(soundButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(soundButton);

    expect(screen.getByRole("button", { name: /sound off/i })).toHaveAttribute(
        "aria-pressed",
        "false"
    );
});

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import HackerText from "./HackerText";

it("keeps a stable accessible heading name while the visual text changes", async () => {
    const user = userEvent.setup();

    render(<HackerText text="Jonathan Biro" as="h1" animate interactive />);

    const heading = screen.getByRole("heading", { name: "Jonathan Biro" });
    await user.hover(heading);

    expect(heading).toHaveAccessibleName("Jonathan Biro");
});

afterEach(() => {
    vi.useRealTimers();
});

it("stops scrambling and restores the original text when motion is disabled", () => {
    vi.useFakeTimers();
    const { rerender } = render(<HackerText text="Jonathan Biro" as="h1" animate interactive />);
    const heading = screen.getByRole("heading", { name: "Jonathan Biro" });

    act(() => heading.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true })));
    act(() => vi.advanceTimersByTime(90));
    rerender(<HackerText text="Jonathan Biro" as="h1" animate={false} interactive={false} />);

    expect(heading).toHaveTextContent("Jonathan Biro");
});

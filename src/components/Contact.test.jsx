import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Contact from "./Contact";

afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});

it("reveals a focus-aware return control after scrolling", async () => {
    vi.useFakeTimers();
    const onScrollTop = vi.fn();
    render(<Contact motionEnabled={false} onCopyEmail={vi.fn()} onScrollTop={onScrollTop} />);

    Object.defineProperty(window, "scrollY", { configurable: true, value: 600 });
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(120));

    const scrollTopButton = screen.getByRole("button", { name: /scroll to top/i });
    fireEvent.click(scrollTopButton);

    expect(onScrollTop).toHaveBeenCalledOnce();
});

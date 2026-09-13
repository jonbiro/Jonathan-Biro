import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import SiteHeader from "./SiteHeader";

const renderHeader = (props = {}) => {
    const onOpenCommandPalette = vi.fn();
    const onLaunchChallenge = vi.fn();

    render(
        <SiteHeader
            onOpenCommandPalette={onOpenCommandPalette}
            onLaunchChallenge={onLaunchChallenge}
            {...props}
        />
    );

    return { onOpenCommandPalette, onLaunchChallenge };
};

describe("SiteHeader", () => {
    afterEach(() => {
        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            value: 1024,
        });
    });

    it("closes the mobile menu before opening quick actions", async () => {
        const user = userEvent.setup();
        const { onOpenCommandPalette } = renderHeader();

        await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
        expect(screen.getByText("Try the QA challenge")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /open quick actions/i }));

        expect(onOpenCommandPalette).toHaveBeenCalledOnce();
        expect(screen.queryByText("Try the QA challenge")).not.toBeInTheDocument();
    });

    it("closes the mobile menu before launching the challenge", async () => {
        const user = userEvent.setup();
        const { onLaunchChallenge } = renderHeader();

        await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
        const challengeButtons = screen.getAllByRole("button", { name: /launch qa challenge/i });
        await user.click(challengeButtons[challengeButtons.length - 1]);

        expect(onLaunchChallenge).toHaveBeenCalledOnce();
        expect(screen.queryByText("Try the QA challenge")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /open navigation menu/i })).toHaveFocus();
    });

    it("returns focus to the menu toggle on Escape", async () => {
        const user = userEvent.setup();
        renderHeader();

        const menuToggle = screen.getByRole("button", { name: /open navigation menu/i });
        await user.click(menuToggle);
        const workLinks = screen.getAllByRole("link", { name: "Work" });
        workLinks[workLinks.length - 1].focus();
        await user.keyboard("{Escape}");

        expect(screen.getByRole("button", { name: /open navigation menu/i })).toHaveFocus();
    });

    it("keeps focus on an in-page link when the menu closes from navigation", async () => {
        const user = userEvent.setup();
        renderHeader();

        await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
        const workLinks = screen.getAllByRole("link", { name: "Work" });
        const mobileWorkLink = workLinks[workLinks.length - 1];
        await user.click(mobileWorkLink);

        expect(screen.getByRole("button", { name: /open navigation menu/i })).not.toHaveFocus();
        expect(screen.queryByText("Try the QA challenge")).not.toBeInTheDocument();
    });

    it("resets the mobile menu when the viewport reaches the desktop breakpoint", async () => {
        const user = userEvent.setup();
        renderHeader();

        await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
        expect(screen.getByText("Try the QA challenge")).toBeInTheDocument();

        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            value: 768,
        });
        fireEvent(window, new Event("resize"));

        expect(screen.queryByText("Try the QA challenge")).not.toBeInTheDocument();
    });

    it("marks the visible section and delegates focus-aware navigation", async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();
        renderHeader({ activeSection: "work", onNavigate });

        const workLink = screen.getByRole("link", { name: "Work" });
        expect(workLink).toHaveAttribute("aria-current", "location");
        await user.click(workLink);

        expect(onNavigate).toHaveBeenCalledWith("work");
    });

    it("preserves the browser's modified-click behavior for section links", () => {
        const onNavigate = vi.fn();
        renderHeader({ onNavigate });

        fireEvent.click(screen.getByRole("link", { name: "Work" }), { metaKey: true });

        expect(onNavigate).not.toHaveBeenCalled();
    });

    it("warms interactive panels when their controls receive focus", () => {
        const onPrepareCommandPalette = vi.fn();
        const onPrepareChallenge = vi.fn();
        renderHeader({ onPrepareCommandPalette, onPrepareChallenge });

        screen.getByRole("button", { name: /open quick actions/i }).focus();
        fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
        screen.getAllByRole("button", { name: /launch qa challenge/i })[0].focus();

        expect(onPrepareCommandPalette).toHaveBeenCalled();
        expect(onPrepareChallenge).toHaveBeenCalled();
    });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CommandPalette from "./CommandPalette";

const createActions = () => [
    {
        id: "work",
        label: "Jump to work",
        description: "See selected projects.",
        keywords: ["portfolio"],
        icon: <span aria-hidden="true">W</span>,
        onSelect: vi.fn(),
    },
    {
        id: "contact",
        label: "Jump to contact",
        description: "Open contact options.",
        keywords: ["email"],
        icon: <span aria-hidden="true">C</span>,
        onSelect: vi.fn(),
    },
];

describe("CommandPalette", () => {
    it("filters actions and runs the highlighted result from the search field", async () => {
        const user = userEvent.setup();
        const actions = createActions();
        const onClose = vi.fn();

        render(
            <CommandPalette
                isOpen
                onClose={onClose}
                actions={actions}
                motionEnabled={false}
            />
        );

        const search = screen.getByRole("combobox", { name: /search quick actions/i });
        await user.type(search, "email");
        expect(screen.getByRole("option", { name: /jump to contact/i })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /jump to work/i })).not.toBeInTheDocument();

        await user.keyboard("{Enter}");
        expect(actions[1].onSelect).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("announces and exposes the arrow-key selection", async () => {
        const user = userEvent.setup();
        const actions = createActions();

        render(
            <CommandPalette
                isOpen
                onClose={vi.fn()}
                actions={actions}
                motionEnabled={false}
            />
        );

        const search = screen.getByRole("combobox", { name: /search quick actions/i });
        const options = screen.getAllByRole("option");
        expect(options[0]).toHaveAttribute("aria-selected", "true");

        await user.type(search, "{ArrowDown}");

        expect(options[1]).toHaveAttribute("aria-selected", "true");
        expect(search).toHaveAttribute("aria-activedescendant", options[1].id);
        expect(screen.getByText(/selected jump to contact/i)).toBeInTheDocument();
    });

    it("closes without running an action when the close button is activated", async () => {
        const user = userEvent.setup();
        const actions = createActions();
        const onClose = vi.fn();

        render(
            <CommandPalette
                isOpen
                onClose={onClose}
                actions={actions}
                motionEnabled={false}
            />
        );

        await user.click(screen.getByRole("button", { name: /close quick actions/i }));
        expect(onClose).toHaveBeenCalledOnce();
        expect(actions[0].onSelect).not.toHaveBeenCalled();
        expect(actions[1].onSelect).not.toHaveBeenCalled();
    });
});

import { useRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import useDialogFocus from "./useDialogFocus";

const FocusHarness = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null);
    const firstButtonRef = useRef(null);

    useDialogFocus({
        isOpen,
        dialogRef,
        initialFocusRef: firstButtonRef,
        onClose: () => setIsOpen(false),
    });

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>Open dialog</button>
            {isOpen && (
                <div ref={dialogRef} role="dialog" aria-label="Test dialog" tabIndex={-1}>
                    <button ref={firstButtonRef} type="button">First</button>
                    <button type="button">Last</button>
                    <button type="button" tabIndex={-1}>Programmatic only</button>
                </div>
            )}
        </>
    );
};

it("traps focus and restores it to the opener", async () => {
    const user = userEvent.setup();
    render(<FocusHarness />);

    const opener = screen.getByRole("button", { name: "Open dialog" });
    await user.click(opener);

    await waitFor(() => expect(screen.getByRole("button", { name: "First" })).toHaveFocus());
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
});

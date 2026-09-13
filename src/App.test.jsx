import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "./App";

it("offers a direct recruiter path and manages quick-action modal state", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "Jonathan Biro", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /email me/i })[0]).toHaveAttribute(
        "href",
        "mailto:jonathan@biro.dev"
    );
    expect(screen.getByRole("link", { name: "Project résumé" })).toHaveAttribute("download");

    await user.click(screen.getByRole("link", { name: /view selected work/i }));
    expect(document.getElementById("work")).toHaveFocus();
    expect(window.location.hash).toBe("#work");

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog", { name: /quick actions/i })).toBeInTheDocument();
    expect(document.querySelector("[inert]")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: /close quick actions/i }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /quick actions/i })).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
});

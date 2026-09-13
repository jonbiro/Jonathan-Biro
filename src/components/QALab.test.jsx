import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import QALab from "./QALab";

it("reproduces the date defect, explains a wrong diagnosis, and verifies a correction", () => {
    render(<QALab onLaunchChallenge={vi.fn()} />);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Generate confirmation" }));
    expect(screen.getByText("January 16, 2026 · 6:30 PM")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "The API returned the wrong appointment time" }));
    expect(screen.getByText(/API preserved the instant correctly/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Apply timezone-aware formatting" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "The confirmation uses the UTC calendar date" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply timezone-aware formatting" }));
    expect(screen.getByText("January 15, 2026 · 6:30 PM")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Assert the user's date, not just the timestamp." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset investigation" }));
    expect(screen.queryByText("Corrected confirmation")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate confirmation" })).toBeEnabled();
});

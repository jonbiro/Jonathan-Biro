import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = () => {
    throw new Error("Expected test error");
};

beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});

it("announces a useful recovery path when the app fails", () => {
    render(
        <ErrorBoundary>
            <BrokenComponent />
        </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toHaveFocus();
    expect(screen.getByRole("button", { name: /refresh page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email jonathan/i })).toHaveAttribute(
        "href",
        "mailto:jonathan@biro.dev"
    );
});

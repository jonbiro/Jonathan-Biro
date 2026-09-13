import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "./App";

it("shows only engineering work and focuses the selected section", async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole("heading", { name: "Jonathan Biro", level: 1 })).toBeInTheDocument();
  expect(screen.queryByText(/puppy quest|bug hunt|QA Portfolio/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /generate confirmation|quick actions/i })).not.toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "View engineering work" }));
  expect(document.getElementById("work")).toHaveFocus();
  expect(window.location.hash).toBe("#work");
  await user.click(screen.getByText("Technical example: preventing a dark-mode contrast regression"));
  expect(document.querySelector("details")).toHaveAttribute("open");
});
it("copies the professional contact address", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Copy email" }));
  expect(screen.getByRole("status")).toHaveTextContent("Email copied.");
  expect(await navigator.clipboard.readText()).toBe("jonathan@biro.dev");
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

it("shows only engineering work and focuses the selected section", async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole("heading", { name: "Jonathan Biro", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "DocMagic" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Priceline" })).toBeInTheDocument();
  expect(screen.getByText("2019–2022 · 3 years, 1 month")).toBeInTheDocument();
  expect(screen.getByText("August 2022")).toHaveAttribute("datetime", "2022-08");
  expect(document.getElementById("experience").compareDocumentPosition(document.getElementById("work")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByAltText("Illustrated portrait of Jonathan Biro")).toHaveAttribute(
    "sizes",
    "(max-width: 640px) 96px, (max-width: 900px) 220px, 320px"
  );
  expect(
    screen.getByAltText(/BiroMD interface/).getAttribute("srcset")
  ).toContain("/projects/biromd-480.webp 480w");
  expect(
    screen.getByAltText(/BiroMD interface/).getAttribute("srcset")
  ).toContain("/projects/biromd-640.webp 640w");
  await user.click(screen.getByRole("link", { name: "Experience", exact: true }));
  expect(document.getElementById("experience")).toHaveFocus();
  expect(screen.queryByText(/puppy quest|bug hunt|QA Portfolio/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /generate confirmation|quick actions/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /public GitHub source/i })).toHaveAttribute("href", "https://github.com/jonbiro/Jonathan-Biro");
  expect(screen.getByRole("link", { name: /automated quality checks/i })).toHaveAttribute("href", "https://github.com/jonbiro/Jonathan-Biro/actions");

  for (const [name, id] of [["Work", "work"], ["Background", "about"], ["Contact", "contact"]]) {
    await user.click(screen.getByRole("link", { name, exact: true }));
    expect(document.getElementById(id)).toHaveFocus();
    expect(window.location.hash).toBe(`#${id}`);
  }

  await user.click(screen.getByRole("link", { name: "Jonathan Biro" }));
  expect(document.getElementById("top")).toHaveFocus();
  await user.click(screen.getByRole("link", { name: "View engineering work" }));
  expect(document.getElementById("work")).toHaveFocus();
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

it("keeps the email address usable when clipboard access fails", async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("Clipboard unavailable"));
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Copy email" }));

  expect(screen.getByRole("status")).toHaveTextContent(
    "Copy unavailable. Use the email link or select the address below."
  );
  expect(screen.getByRole("link", { name: "jonathan@biro.dev" })).toHaveAttribute(
    "href",
    "mailto:jonathan@biro.dev"
  );
});

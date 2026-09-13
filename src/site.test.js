import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initializePortfolio } from "./site";

const indexHtml = await readFile(path.join(cwd(), "index.html"), "utf8");
const bodyHtml = indexHtml.match(/<body>([\s\S]*?)<\/body>/)?.[1]
    .replace(/<script[\s\S]*?<\/script>/g, "");

let stopPortfolio;
let writeText;

beforeEach(() => {
    document.body.innerHTML = bodyHtml;
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
    });
    stopPortfolio = initializePortfolio();
});

afterEach(() => {
    stopPortfolio();
    vi.restoreAllMocks();
});

describe("portfolio experience", () => {
    it("ships the full engineering story as usable HTML", () => {
        expect(document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim()).toBe("Jonathan Biro");
        expect(document.querySelector("#experience")?.textContent).toContain("DocMagic");
        expect(document.querySelector("#experience")?.textContent).toContain("Priceline");
        expect(document.querySelector(".eng-summary")?.textContent).toContain("7+ years");
        expect(document.querySelector("#experience")?.textContent).toContain("present · 4+ years");
        expect(document.querySelector("#work")?.textContent).toContain("BiroMD");
        expect(document.querySelector("#work")?.textContent).not.toMatch(/puppy quest|bug hunt|QA Portfolio/i);
        expect(document.querySelector("#about")?.textContent).toContain("automation that catches real regressions");
        expect(document.querySelector('time[datetime="2022-08"]')?.textContent).toBe("August 2022");
        expect(document.querySelector("[data-copy-email]")?.hidden).toBe(false);
    });

    it("moves focus to each selected section without disrupting modified clicks", () => {
        for (const id of ["experience", "work", "about", "contact", "top"]) {
            const link = document.querySelector(`[data-section-link="${id}"]`);
            const click = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
            link.dispatchEvent(click);

            expect(click.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(document.getElementById(id));
            expect(window.location.hash).toBe(`#${id}`);
        }

        const workLink = document.querySelector('[data-section-link="work"]');
        const modifiedClick = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            button: 0,
            ctrlKey: true,
        });
        workLink.dispatchEvent(modifiedClick);
        expect(modifiedClick.defaultPrevented).toBe(false);
    });

    it("keeps external links explicit and isolated", () => {
        const externalLinks = [...document.querySelectorAll('a[target="_blank"]')];
        expect(externalLinks.length).toBeGreaterThan(0);

        for (const link of externalLinks) {
            expect(link.relList.contains("noopener")).toBe(true);
            expect(link.relList.contains("noreferrer")).toBe(true);
            expect(link.querySelector(".sr-only")?.textContent).toContain("opens in a new tab");
        }
        expect(document.querySelector('a[href="https://github.com/jonbiro"]')?.relList.contains("me")).toBe(true);
        expect(document.querySelector('a[href="https://www.linkedin.com/in/jonathanbiro/"]')?.relList.contains("me")).toBe(true);
    });

    it("copies the professional contact address", async () => {
        document.querySelector("[data-copy-email]").click();

        await vi.waitFor(() => expect(document.querySelector("[data-copy-status]")?.textContent).toBe("Email copied."));
        expect(writeText).toHaveBeenCalledWith("jonathan@biro.dev");
    });

    it("keeps the email link useful when clipboard access fails", async () => {
        writeText.mockRejectedValueOnce(new Error("Clipboard unavailable"));
        document.querySelector("[data-copy-email]").click();

        await vi.waitFor(() => {
            expect(document.querySelector("[data-copy-status]")?.textContent).toBe(
                "Copy unavailable. Use the email link or select the address below."
            );
        });
        expect(document.querySelector('a[href="mailto:jonathan@biro.dev"]')?.textContent).toBe("jonathan@biro.dev");
    });

    it("uses responsive, dimensioned images and a native technical disclosure", () => {
        const portrait = document.querySelector('img[alt="Illustrated portrait of Jonathan Biro"]');
        const project = document.querySelector('img[alt^="BiroMD interface"]');
        expect(portrait?.getAttribute("sizes")).toBe("(max-width: 640px) 96px, (max-width: 900px) 220px, 320px");
        expect(project?.getAttribute("srcset")).toContain("%BASE_URL%projects/biromd-480.webp 480w");
        expect(project?.getAttribute("width")).toBe("1440");
        expect(project?.getAttribute("height")).toBe("1000");

        const disclosure = document.querySelector("details");
        disclosure.querySelector("summary").click();
        expect(disclosure.open).toBe(true);
    });
});

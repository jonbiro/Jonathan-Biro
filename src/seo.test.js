// @vitest-environment node

import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const readProjectFile = (fileName) => readFile(new URL(`../${fileName}`, import.meta.url), "utf8");

describe("portfolio metadata", () => {
    it("keeps social metadata, static proof, and structured data aligned", async () => {
        const html = await readProjectFile("index.html");
        const structuredDataSource = html.match(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
        )?.[1];

        expect(html).toContain("og-portfolio.jpg");
        expect(html).toContain('property="og:image:width" content="1200"');
        expect(html).toContain('property="og:image:height" content="630"');
        expect(html).toContain("Selected engineering work");
        expect(html).toContain("BiroMD");
        expect(html).not.toMatch(/Puppy Quest|QA Portfolio|DogeQuest/);
        expect(html).not.toMatch(/kickresume|view résumé/i);
        expect(structuredDataSource).toBeTruthy();

        const structuredData = JSON.parse(
            structuredDataSource.replaceAll("%VITE_SITE_URL%", "https://portfolio.example")
        );
        expect(structuredData["@graph"]).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ "@type": "Person", name: "Jonathan Biro" }),
                expect.objectContaining({ "@type": "WebSite" }),
                expect.objectContaining({ "@type": "ItemList" }),
            ])
        );
    });

    it("ships a valid installable manifest", async () => {
        const manifest = JSON.parse(await readProjectFile("public/manifest.json"));

        expect(manifest.id).toBe("./");
        expect(manifest.icons).toEqual(
            expect.arrayContaining([expect.objectContaining({ sizes: "192x192" })])
        );
    });
});

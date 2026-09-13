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
        const [manifestSource, html] = await Promise.all([
            readProjectFile("public/manifest.json"),
            readProjectFile("index.html"),
        ]);
        const manifest = JSON.parse(manifestSource);
        const documentThemeColor = html.match(/<meta name="theme-color" content="([^"]+)"/)?.[1];

        expect(manifest.id).toBe("./");
        expect(manifest.background_color).toBe(documentThemeColor);
        expect(manifest.theme_color).toBe(documentThemeColor);
        expect(manifest.icons).toEqual(
            expect.arrayContaining([expect.objectContaining({ sizes: "192x192" })])
        );
    });

    it("uses a branded, index-safe 404 instead of a soft homepage fallback", async () => {
        const [notFoundHtml, netlifyConfig] = await Promise.all([
            readProjectFile("public/404.html"),
            readProjectFile("netlify.toml"),
        ]);

        expect(notFoundHtml).toContain('content="noindex,follow"');
        expect(notFoundHtml).toContain('href="https://jonathanbiro.com/"');
        expect(notFoundHtml).toContain("https://github.com/jonbiro/Jonathan-Biro");
        expect(notFoundHtml).not.toContain("__SITE_BASE_PATH__");
        expect(netlifyConfig).not.toMatch(/\[\[redirects\]\][\s\S]*?status\s*=\s*200/);
    });

    it("keeps checked-in discovery files on the production domain", async () => {
        const [robots, sitemap] = await Promise.all([
            readProjectFile("public/robots.txt"),
            readProjectFile("public/sitemap.xml"),
        ]);

        expect(robots).toContain("Sitemap: https://jonathanbiro.com/sitemap.xml");
        expect(sitemap).toContain("<loc>https://jonathanbiro.com/</loc>");
        expect(`${robots}\n${sitemap}`).not.toContain("https://biro.dev");
    });

    it("applies Lighthouse's indexability score to the indexable page", async () => {
        const lighthouseConfig = JSON.parse(await readProjectFile(".lighthouserc.json"));

        expect(lighthouseConfig.ci.collect.staticDistDir).toBe("./dist/client");
        expect(lighthouseConfig.ci.collect.url).toEqual(["http://localhost/"]);
    });
});

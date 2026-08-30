import { describe, expect, it, vi } from "vitest";
import worker from "./index";

const createEnvironment = () => ({
    ASSETS: {
        fetch: vi.fn(async () =>
            new Response("asset", {
                headers: { "Content-Type": "application/javascript" },
            })
        ),
    },
});

const createHtmlEnvironment = () => ({
    ASSETS: {
        fetch: vi.fn(async () =>
            new Response("<html></html>", {
                headers: { "Content-Type": "text/html; charset=utf-8" },
            })
        ),
    },
});

const getScriptDirective = (policy) =>
    policy
        .split(";")
        .map((directive) => directive.trim())
        .find((directive) => directive.startsWith("script-src "));

describe("portfolio worker", () => {
    it("adds security and immutable cache headers to fingerprinted assets", async () => {
        const environment = createEnvironment();
        const response = await worker.fetch(
            new Request("https://example.com/assets/app-ABC123.js"),
            environment
        );

        expect(response.headers.get("x-content-type-options")).toBe("nosniff");
        expect(response.headers.get("x-frame-options")).toBe("DENY");
        expect(response.headers.get("permissions-policy")).toContain("camera=()");
        expect(
            getScriptDirective(response.headers.get("content-security-policy"))
        ).not.toContain("unsafe-inline");
        expect(response.headers.get("cross-origin-opener-policy")).toBe("same-origin");
        expect(response.headers.get("cache-control")).toBe(
            "public, max-age=31536000, immutable"
        );
    });

    it("uses a shorter cache window for public images", async () => {
        const environment = createEnvironment();
        const response = await worker.fetch(
            new Request("https://example.com/og-portfolio.jpg"),
            environment
        );

        expect(response.headers.get("cache-control")).toBe(
            "public, max-age=604800, stale-while-revalidate=86400"
        );
    });

    it("requires HTML to revalidate after a deployment", async () => {
        const response = await worker.fetch(
            new Request("https://example.com/"),
            createHtmlEnvironment()
        );

        expect(response.headers.get("cache-control")).toBe("no-cache, must-revalidate");
        expect(
            getScriptDirective(response.headers.get("content-security-policy"))
        ).not.toContain("unsafe-inline");
    });

    it("allows only the exact inline scripts present in HTML", async () => {
        const environment = {
            ASSETS: {
                fetch: vi.fn(async () =>
                    new Response('<html><script type="application/ld+json">{"name":"Jonathan"}</script></html>', {
                        headers: { "Content-Type": "text/html; charset=utf-8" },
                    })
                ),
            },
        };

        const response = await worker.fetch(new Request("https://example.com/"), environment);
        const policy = response.headers.get("content-security-policy");

        expect(policy).toMatch(/script-src 'self' 'sha256-[^']+'/);
        expect(policy).toContain("script-src-attr 'none'");
        expect(await response.text()).toContain('{"name":"Jonathan"}');
    });
});

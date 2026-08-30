import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SITE_URL = "https://biro.dev";
const SITE_URL = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
const normalizeBasePath = (value) => {
    if (!value || value.trim() === "/") return "/";
    const trimmed = value.trim();
    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};
const SITE_BASE_PATH = normalizeBasePath(
    process.env.VITE_BASE_PATH || process.env.BASE_PATH || "/"
);
const projectRoot = process.cwd();
const outputDir = path.resolve(projectRoot, process.argv[2] || "dist/client");
const robotsPath = path.join(outputDir, "robots.txt");
const sitemapPath = path.join(outputDir, "sitemap.xml");
const headersPath = path.join(outputDir, "_headers");

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
`;

await mkdir(outputDir, { recursive: true });
await writeFile(robotsPath, robotsContent, "utf8");
await writeFile(sitemapPath, sitemapContent, "utf8");

const findHtmlFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(
        entries.map(async (entry) => {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) return findHtmlFiles(entryPath);
            return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
        })
    );
    return nestedFiles.flat();
};

const htmlFilePaths = await findHtmlFiles(outputDir);
const inlineScriptHashes = new Set();

for (const htmlFilePath of htmlFilePaths) {
    const sourceHtml = await readFile(htmlFilePath, "utf8");
    const html = sourceHtml.replaceAll("__SITE_BASE_PATH__", SITE_BASE_PATH);
    if (html !== sourceHtml) {
        await writeFile(htmlFilePath, html, "utf8");
    }
    for (const match of html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)) {
        if (match[1]) {
            inlineScriptHashes.add(createHash("sha256").update(match[1]).digest("base64"));
        }
    }
}

const scriptSources = ["'self'", ...Array.from(inlineScriptHashes, (hash) => `'sha256-${hash}'`)].join(" ");
const headersContent = await readFile(headersPath, "utf8");
const hardenedHeadersContent = headersContent.replace(
    "script-src 'self' 'unsafe-inline'",
    `script-src ${scriptSources}`
);
if (
    hardenedHeadersContent === headersContent ||
    hardenedHeadersContent.includes("script-src 'self' 'unsafe-inline'")
) {
    throw new Error("Could not replace the inline-script CSP placeholder in the built headers.");
}
await writeFile(headersPath, hardenedHeadersContent, "utf8");

console.log(
    `Generated SEO files and hardened ${inlineScriptHashes.size} inline script${inlineScriptHashes.size === 1 ? "" : "s"} for ${SITE_URL} in ${path.relative(projectRoot, outputDir)}`
);

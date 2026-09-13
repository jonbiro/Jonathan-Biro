import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const DEFAULT_SITE_URL = "https://jonathanbiro.com";
const SITE_URL = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
const normalizeBasePath = (value) => {
    if (!value || value.trim() === "/") return "/";
    const trimmed = value.trim();
    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};
const BASE_PATH = normalizeBasePath(process.env.VITE_BASE_PATH || process.env.BASE_PATH || "/");
const projectRoot = process.cwd();
const outputDir = path.resolve(projectRoot, process.argv[2] || "dist/client");
const siteOrigin = new URL(SITE_URL).origin;
const siteBasePath = normalizeBasePath(new URL(SITE_URL).pathname);
const errors = [];

const assert = (condition, message) => {
    if (!condition) errors.push(message);
};
const formatKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const toPosix = (value) => value.split(path.sep).join("/");

const walkFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    }));
    return files.flat();
};

let absoluteFiles;
try {
    absoluteFiles = await walkFiles(outputDir);
} catch (error) {
    console.error(`Build verification failed: could not read ${path.relative(projectRoot, outputDir) || outputDir}.`);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}

const relativeFiles = absoluteFiles.map((filePath) => toPosix(path.relative(outputDir, filePath)));
const fileSet = new Set(relativeFiles);
const requiredFiles = [
    "index.html",
    "404.html",
    "_headers",
    "robots.txt",
    "sitemap.xml",
    "manifest.json",
];
for (const requiredFile of requiredFiles) {
    assert(fileSet.has(requiredFile), `Missing required release file: ${requiredFile}`);
}

const readOutput = async (relativePath) => readFile(path.join(outputDir, relativePath), "utf8");
const [indexHtml, notFoundHtml, headers, robots, sitemap, manifestSource] = await Promise.all(
    requiredFiles.map(async (relativePath) => fileSet.has(relativePath) ? readOutput(relativePath) : "")
);

const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml", ""]);
const unresolvedTokenPattern = /%(?:BASE_URL|VITE_[A-Z0-9_]+)%|__SITE_[A-Z0-9_]+__/g;
for (const [absolutePath, relativePath] of absoluteFiles.map((filePath, index) => [filePath, relativeFiles[index]])) {
    if (!textExtensions.has(path.extname(relativePath))) continue;
    const source = await readFile(absolutePath, "utf8");
    const unresolvedTokens = source.match(unresolvedTokenPattern) || [];
    assert(unresolvedTokens.length === 0, `${relativePath} contains unresolved build token(s): ${[...new Set(unresolvedTokens)].join(", ")}`);
}

const canonicalUrl = indexHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
assert(siteBasePath === BASE_PATH, `VITE_SITE_URL path ${siteBasePath} does not match configured base path ${BASE_PATH}.`);
assert(canonicalUrl === `${SITE_URL}/`, `Canonical URL must be ${SITE_URL}/ (found ${canonicalUrl || "none"}).`);
assert(indexHtml.includes('<meta name="robots" content="index,follow"'), "index.html must remain indexable.");
assert(notFoundHtml.includes('<meta name="robots" content="noindex,follow"'), "404.html must be excluded from search indexing.");
assert(notFoundHtml.includes(`href="${SITE_URL}/"`), "404.html home links are not aligned with VITE_SITE_URL.");
assert(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), "robots.txt sitemap URL is not aligned with VITE_SITE_URL.");
assert(sitemap.includes(`<loc>${SITE_URL}/</loc>`), "sitemap.xml canonical location is not aligned with VITE_SITE_URL.");
assert(indexHtml.includes(`content="${SITE_URL}/og-portfolio.jpg"`), "Social preview URL is not aligned with VITE_SITE_URL.");

const structuredDataSource = indexHtml.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i)?.[1];
if (!structuredDataSource) {
    errors.push("index.html is missing JSON-LD structured data.");
} else {
    try {
        const structuredData = JSON.parse(structuredDataSource);
        const graphTypes = new Set((structuredData["@graph"] || []).map((item) => item["@type"]));
        for (const requiredType of ["Person", "WebSite", "ItemList"]) {
            assert(graphTypes.has(requiredType), `JSON-LD graph is missing ${requiredType}.`);
        }
    } catch (error) {
        errors.push(`JSON-LD is invalid JSON: ${error instanceof Error ? error.message : error}`);
    }
}

let manifest = {};
try {
    manifest = JSON.parse(manifestSource);
} catch (error) {
    errors.push(`manifest.json is invalid JSON: ${error instanceof Error ? error.message : error}`);
}
const documentThemeColor = indexHtml.match(/<meta\s+name=["']theme-color["']\s+content=["']([^"']+)["']/i)?.[1];
assert(Boolean(documentThemeColor), "index.html is missing a theme color.");
assert(manifest.theme_color === documentThemeColor, "manifest.json theme_color must match index.html.");
assert(manifest.background_color === documentThemeColor, "manifest.json background_color must match index.html.");
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "manifest.json must include both application icons.");

const inlineScriptHashes = [];
for (const html of [indexHtml, notFoundHtml]) {
    for (const match of html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)) {
        if (match[1]) inlineScriptHashes.push(createHash("sha256").update(match[1]).digest("base64"));
    }
}
assert(!headers.includes("script-src 'self' 'unsafe-inline'"), "Built CSP still allows unsafe-inline scripts.");
assert(headers.includes("script-src-attr 'none'"), "Built CSP must block inline script attributes.");
assert(headers.includes("frame-ancestors 'none'"), "Built CSP must block framing.");
for (const hash of inlineScriptHashes) {
    assert(headers.includes(`'sha256-${hash}'`), `Built CSP is missing the hash for an inline script: sha256-${hash}`);
}

const assetExtensions = "avif|css|gif|ico|jpe?g|json|js|pdf|png|svg|webp|woff2?|xml";
const assetExtensionPattern = new RegExp(`\\.(?:${assetExtensions})(?:[?#].*)?$`, "i");
const localReferences = new Map();
const registerReference = (rawReference, sourceFile, barePathsFromRoot = false) => {
    const candidate = rawReference.trim().replace(/^['"]|['"]$/g, "");
    if (!candidate || candidate.startsWith("data:") || candidate.startsWith("mailto:") || candidate.startsWith("#")) return;

    let pathname = candidate;
    if (/^https?:\/\//i.test(candidate)) {
        let url;
        try { url = new URL(candidate); } catch { return; }
        if (url.origin !== siteOrigin) return;
        pathname = url.pathname;
    }
    pathname = pathname.split(/[?#]/, 1)[0];
    if (!assetExtensionPattern.test(pathname)) return;

    let relativeTarget;
    if (pathname.startsWith("/")) {
        if (BASE_PATH !== "/" && !pathname.startsWith(BASE_PATH)) {
            errors.push(`${sourceFile} references ${pathname} outside configured base path ${BASE_PATH}.`);
            return;
        }
        relativeTarget = BASE_PATH === "/" ? pathname.slice(1) : pathname.slice(BASE_PATH.length);
    } else if (barePathsFromRoot && !pathname.startsWith(".")) {
        relativeTarget = pathname;
    } else {
        relativeTarget = path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), pathname));
    }
    try { relativeTarget = decodeURIComponent(relativeTarget); } catch { /* Keep the raw path for a useful failure. */ }
    localReferences.set(`${sourceFile} -> ${candidate}`, relativeTarget);
};

const scanTextForReferences = (source, sourceFile) => {
    for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) registerReference(match[1], sourceFile);
    for (const match of source.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
        for (const entry of match[1].split(",")) registerReference(entry.trim().split(/\s+/, 1)[0], sourceFile);
    }
    for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) registerReference(match[1], sourceFile);
    const embeddedPathPattern = new RegExp(
        "(?:^|[^:/A-Za-z0-9_.-])((?:\\.{1,2}\\/|\\/|[A-Za-z0-9_.-]+\\/)[A-Za-z0-9_@./-]+?\\.(?:" + assetExtensions + ")(?:[?#][^\\s,\"'`(){}]*)?)",
        "gi"
    );
    for (const match of source.matchAll(embeddedPathPattern)) {
        registerReference(match[1], sourceFile, path.extname(sourceFile) === ".js");
    }
};

for (const [absolutePath, relativePath] of absoluteFiles.map((filePath, index) => [filePath, relativeFiles[index]])) {
    if (![".css", ".html", ".js"].includes(path.extname(relativePath))) continue;
    scanTextForReferences(await readFile(absolutePath, "utf8"), relativePath);
}
for (const icon of manifest.icons || []) registerReference(icon.src || "", "manifest.json");
for (const [context, relativeTarget] of localReferences) {
    assert(fileSet.has(relativeTarget), `Missing local asset ${relativeTarget} referenced by ${context}.`);
}

const entryAssetUrls = [];
for (const match of indexHtml.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    if (assetExtensionPattern.test(match[1])) entryAssetUrls.push(match[1]);
}
for (const match of indexHtml.matchAll(/<link\b[^>]*>/gi)) {
    const relationship = match[0].match(/\brel=["']([^"']+)["']/i)?.[1] || "";
    if (!relationship.split(/\s+/).some((value) => ["modulepreload", "stylesheet"].includes(value))) continue;
    const reference = match[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (reference && assetExtensionPattern.test(reference)) entryAssetUrls.push(reference);
}
const resolveEntryAsset = (reference) => {
    const pathname = reference.split(/[?#]/, 1)[0];
    if (!pathname.startsWith("/")) return path.posix.normalize(pathname);
    return BASE_PATH === "/" ? pathname.slice(1) : pathname.slice(BASE_PATH.length);
};
const entryAssets = [...new Set(entryAssetUrls.map(resolveEntryAsset).filter((file) => fileSet.has(file)))];
let entryRawBytes = 0;
let entryGzipBytes = 0;
for (const relativePath of entryAssets) {
    const source = await readFile(path.join(outputDir, relativePath));
    entryRawBytes += source.byteLength;
    entryGzipBytes += gzipSync(source).byteLength;
}
assert(entryRawBytes <= 25_000, `Entry code exceeds the 25 KB raw budget (${formatKiB(entryRawBytes)}).`);
assert(entryGzipBytes <= 10_000, `Entry code exceeds the 10 KB gzip budget (${formatKiB(entryGzipBytes)}).`);

let totalBytes = 0;
for (const absolutePath of absoluteFiles) totalBytes += (await stat(absolutePath)).size;
assert(totalBytes <= 1_000_000, `Release artifact exceeds the 1 MB budget (${formatKiB(totalBytes)}).`);
for (const relativePath of relativeFiles.filter((file) => /\.(?:avif|gif|jpe?g|png|webp)$/i.test(file))) {
    const imageBytes = (await stat(path.join(outputDir, relativePath))).size;
    assert(imageBytes <= 250_000, `${relativePath} exceeds the 250 KB per-image budget (${formatKiB(imageBytes)}).`);
}

if (errors.length > 0) {
    console.error(`Build verification failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
}

console.log("Verified release artifact:");
console.log(`- ${requiredFiles.length} required release files`);
console.log(`- ${localReferences.size} local asset references resolve within ${BASE_PATH}`);
console.log(`- canonical, discovery, manifest, 404, and ${inlineScriptHashes.length} CSP hash${inlineScriptHashes.length === 1 ? "" : "es"} aligned to ${SITE_URL}`);
console.log(`- entry code ${formatKiB(entryRawBytes)} raw / ${formatKiB(entryGzipBytes)} gzip`);
console.log(`- complete artifact ${formatKiB(totalBytes)} / ${formatKiB(1_000_000)} budget`);

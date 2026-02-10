import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SITE_URL = "https://biro.dev";
const SITE_URL = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
const LAST_MODIFIED = new Date().toISOString().slice(0, 10);

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const robotsPath = path.join(publicDir, "robots.txt");
const sitemapPath = path.join(publicDir, "sitemap.xml");

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${LAST_MODIFIED}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
`;

await mkdir(publicDir, { recursive: true });
await writeFile(robotsPath, robotsContent, "utf8");
await writeFile(sitemapPath, sitemapContent, "utf8");

console.log(`Generated SEO files for ${SITE_URL}`);

const SECURITY_HEADERS = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
}

const createContentSecurityPolicy = (inlineScriptHashes = []) => {
  const scriptSources = ["'self'", ...inlineScriptHashes.map((hash) => `'sha256-${hash}'`)].join(" ")

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self' mailto:",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "object-src 'none'",
    `script-src ${scriptSources}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    "upgrade-insecure-requests",
  ].join("; ")
}

const getInlineScriptHashes = async (html) => {
  const inlineScripts = Array.from(
    html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi),
    (match) => match[1]
  ).filter(Boolean)

  return Promise.all(
    inlineScripts.map(async (scriptContent) => {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(scriptContent)
      )
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
    })
  )
}

export default {
  async fetch(request, environment) {
    const response = await environment.ASSETS.fetch(request)
    const headers = new Headers(response.headers)
    const { pathname } = new URL(request.url)
    const isHtml = headers.get("Content-Type")?.includes("text/html")
    let responseBody = response.body

    Object.entries(SECURITY_HEADERS).forEach(([name, value]) => headers.set(name, value))

    if (isHtml && request.method !== "HEAD") {
      const html = await response.text()
      responseBody = html
      headers.set(
        "Content-Security-Policy",
        createContentSecurityPolicy(await getInlineScriptHashes(html))
      )
    } else {
      headers.set("Content-Security-Policy", createContentSecurityPolicy())
    }

    // Vite can be configured with a non-root base path (for example
    // /portfolio/ on GitHub Pages), so match the assets directory by path
    // segment instead of assuming it is the first URL segment.
    if (/(?:^|\/)assets\//.test(pathname)) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable")
    } else if (/\.(?:avif|jpg|jpeg|png|webp|svg|woff2)$/i.test(pathname)) {
      headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400")
    } else if (isHtml) {
      headers.set("Cache-Control", "no-cache, must-revalidate")
    }

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}

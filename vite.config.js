import { defineConfig, loadEnv } from 'vite'
import { cwd } from 'node:process'

const normalizeBasePath = (value) => {
  if (!value) return '/'
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return '/'
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '')

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH ?? env.BASE_PATH ?? ''),
    build: {
      outDir: 'dist/client',
      assetsInlineLimit: 0,
    },
  }
})

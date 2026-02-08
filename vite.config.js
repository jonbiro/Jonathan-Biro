import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
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
    plugins: [react()],
    base: normalizeBasePath(env.VITE_BASE_PATH ?? env.BASE_PATH ?? ''),
  }
})

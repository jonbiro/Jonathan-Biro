import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import { sites } from '@openai/sites-vite-plugin'
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
  const staticDeploy = env.VITE_DEPLOY_TARGET === 'static'

  return {
    plugins: [react(), ...(staticDeploy ? [] : [sites(), cloudflare({ viteEnvironment: { name: 'server' } })])],
    base: normalizeBasePath(env.VITE_BASE_PATH ?? env.BASE_PATH ?? ''),
    build: {
      ...(staticDeploy ? { outDir: 'dist/client' } : {}),
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined
            }

            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('node_modules/framer-motion/')) {
              return 'vendor-motion'
            }
            if (id.includes('node_modules/react-icons/')) {
              return 'vendor-icons'
            }
            if (id.includes('node_modules/canvas-confetti/')) {
              return 'vendor-confetti'
            }

            return 'vendor'
          },
        },
      },
    },
  }
})

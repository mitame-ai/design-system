import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

/* 依存は利用側で解決させる : react / radix-ui / recharts などを dist に焼き込まない（サブパスも含む） */
const deps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
const external = (id: string) => deps.some((d) => id === d || id.startsWith(`${d}/`))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/stories/**'],
      tsconfigPath: './tsconfig.json',
      compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true },
    }),
  ],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external,
      output: {
        assetFileNames: (info) =>
          info.names?.some((n) => n.endsWith('.css')) ? 'tezawari.css' : '[name][extname]',
      },
    },
  },
})

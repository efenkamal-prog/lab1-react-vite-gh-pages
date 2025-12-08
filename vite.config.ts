import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig as defineVitestConfig } from 'vitest/config' // ← импортируем из vitest

export default defineConfig({
  plugins: [react()],
  base: '/lab1-react-vite-gh-pages',
  test: { // ← теперь TypeScript знает, что test — это валидное поле
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
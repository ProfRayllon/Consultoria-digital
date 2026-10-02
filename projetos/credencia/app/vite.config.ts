import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Caminhos relativos: permite abrir o build de qualquer subpasta
  // (ex.: portfolio/projetos/orbit-journey-analytics/app/dist/index.html).
  base: './',
  plugins: [react()],
})

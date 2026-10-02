import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './state/store'
import { modoVitrine } from './lib/env'

// Tema claro (branco e azul); o menu lateral usa .tema-escuro.
document.documentElement.dataset.theme = 'light'
// Dentro da vitrine da home não há barras de rolagem: a tela só desliza.
if (modoVitrine) document.documentElement.classList.add('vitrine')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)

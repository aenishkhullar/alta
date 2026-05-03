import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

import Lenis from 'lenis'
import gsap from 'gsap'

// ─── Global Lenis smooth scroll ────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,          // scroll duration multiplier
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
})

// Expose globally so any component can access it (e.g. for scrollTo)
window.lenis = lenis

// ─── Connect Lenis to GSAP ticker for frame-perfect sync ───────────────────
gsap.ticker.add((time) => {
  lenis.raf(time * 1000) // GSAP time is in seconds; Lenis expects ms
})

// Disable GSAP's built-in lag smoothing so Lenis drives timing exclusively
gsap.ticker.lagSmoothing(0)

// ───────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

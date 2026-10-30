import { useCallback, useEffect, useRef, useState } from 'react'
import { FORTUNES } from './data/fortunes.js'
import { useShake } from './hooks/useShake.js'
import SakuraBackground from './components/SakuraBackground.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import ShakeAnimation from './components/ShakeAnimation.jsx'
import FortuneScroll from './components/FortuneScroll.jsx'

const SHAKE_MS = 1500

// Picks a random fortune and never repeats the previous one.
function pickFortune(previousId) {
  const pool = FORTUNES.filter((fortune) => fortune.id !== previousId)
  return pool[Math.floor(Math.random() * pool.length)]
}

const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern)
  }
}

export default function App() {
  // phase: 'welcome' | 'shaking' | 'revealed'
  const [phase, setPhase] = useState('welcome')
  const [fortune, setFortune] = useState(null)
  const timerRef = useRef(null)
  const busyRef = useRef(false)

  // Cancel a pending draw if the screen is left mid-animation.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Every new phase starts at the top, so the scroll is always fully visible.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [phase])

  const drawFortune = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    clearTimeout(timerRef.current)

    vibrate([60, 40, 60, 40, 60])
    setPhase('shaking')
    timerRef.current = setTimeout(() => {
      setFortune((previous) => pickFortune(previous?.id))
      setPhase('revealed')
      busyRef.current = false
    }, SHAKE_MS)
  }, [])

  const restart = useCallback(() => {
    clearTimeout(timerRef.current)
    busyRef.current = false
    setPhase('welcome')
  }, [])

  // The phone shake is the main trigger; tapping is the accessible fallback.
  const motion = useShake({ enabled: phase === 'welcome', onShake: drawFortune })

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-col overflow-x-hidden bg-parchment shadow-[0_0_80px_rgba(42,26,21,0.22)]">
      <SakuraBackground />

      <div key={phase} className="relative z-10 flex flex-1 animate-fade-in flex-col">
        {phase === 'welcome' && <WelcomeScreen onDraw={drawFortune} motion={motion} />}
        {phase === 'shaking' && <ShakeAnimation />}
        {phase === 'revealed' && fortune && (
          <FortuneScroll
            key={`${fortune.id}-${fortune.number}`}
            fortune={fortune}
            onReset={restart}
          />
        )}
      </div>
    </main>
  )
}

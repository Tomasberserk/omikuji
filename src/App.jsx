import { useCallback, useEffect, useRef, useState } from 'react'
import { FORTUNES } from './data/fortunes.js'
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

export default function App() {
  // phase: 'welcome' | 'shaking' | 'revealed'
  const [phase, setPhase] = useState('welcome')
  const [fortune, setFortune] = useState(null)
  const timerRef = useRef(null)

  // Cancel a pending draw if the screen is left mid-animation.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Every new phase starts at the top, so the scroll is always fully visible.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [phase])

  const drawFortune = useCallback(() => {
    clearTimeout(timerRef.current)

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([60, 40, 60, 40, 60])
    }

    setPhase('shaking')
    timerRef.current = setTimeout(() => {
      setFortune((previous) => pickFortune(previous?.id))
      setPhase('revealed')
    }, SHAKE_MS)
  }, [])

  const restart = useCallback(() => {
    clearTimeout(timerRef.current)
    setPhase('welcome')
  }, [])

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-col overflow-x-hidden bg-parchment shadow-[0_0_80px_rgba(42,26,21,0.22)]">
      <SakuraBackground />

      <div key={phase} className="relative z-10 flex flex-1 animate-fade-in flex-col">
        {phase === 'welcome' && <WelcomeScreen onStart={drawFortune} />}
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

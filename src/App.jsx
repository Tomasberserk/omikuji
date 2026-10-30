import { useCallback, useEffect, useRef, useState } from 'react'
import { FORTUNES } from './data/fortunes.js'
import { pickFortune } from './lib/pickFortune.js'
import { audio } from './lib/audio.js'
import { useShake } from './hooks/useShake.js'
import SakuraBackground from './components/SakuraBackground.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import ShakeAnimation from './components/ShakeAnimation.jsx'
import FortuneScroll from './components/FortuneScroll.jsx'

const SHAKE_MS = 1500

const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern)
  }
}

export default function App() {
  // phase: 'welcome' | 'shaking' | 'revealed'
  const [phase, setPhase] = useState('welcome')
  const [fortune, setFortune] = useState(null)
  const [muted, setMuted] = useState(false)
  const timerRef = useRef(null)
  const busyRef = useRef(false)

  // Cancel a pending draw if the screen is left mid-animation.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Browsers only allow audio after a gesture. The first tap or key press
  // unlocks the context and starts the ambient music.
  useEffect(() => {
    const unlockAudio = (event) => {
      if (event.target?.closest?.('[data-sound-toggle]')) return
      audio.unlock()
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }

    window.addEventListener('pointerdown', unlockAudio)
    window.addEventListener('keydown', unlockAudio)
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  // If the visitor switches apps or locks the phone while the cylinder is
  // shaking, the reveal would happen off-screen. Cancel, silence and start over.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (phase === 'shaking') {
          clearTimeout(timerRef.current)
          busyRef.current = false
          setPhase('welcome')
        }
        audio.panic()
        audio.suspend()
      } else {
        audio.resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [phase])

  // Every new phase starts at the top, so the scroll is always fully visible.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [phase])

  const drawFortune = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    clearTimeout(timerRef.current)

    vibrate([60, 40, 60, 40, 60])
    audio.playTension(SHAKE_MS / 1000)
    setPhase('shaking')

    timerRef.current = setTimeout(() => {
      setFortune((previous) => pickFortune(FORTUNES, previous?.id))
      setPhase('revealed')
      audio.playReveal()
      busyRef.current = false
    }, SHAKE_MS)
  }, [])

  const restart = useCallback(() => {
    clearTimeout(timerRef.current)
    busyRef.current = false
    audio.playTap()
    setPhase('welcome')
  }, [])

  const toggleSound = useCallback(() => {
    const next = !muted
    setMuted(next)
    if (next) audio.mute()
    else audio.unmute()
  }, [muted])

  // The phone shake is the main trigger; tapping is the accessible fallback.
  const motion = useShake({ enabled: phase === 'welcome', onShake: drawFortune })

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-col overflow-x-hidden bg-parchment shadow-[0_0_80px_rgba(42,26,21,0.22)]">
      <SakuraBackground />
      <SoundToggle muted={muted} onToggle={toggleSound} />

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

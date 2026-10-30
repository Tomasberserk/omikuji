import { useEffect, useRef } from 'react'
import { Smartphone, Sparkles } from 'lucide-react'

const PRIMARY =
  'mt-6 inline-flex min-h-[56px] w-full max-w-xs items-center justify-center gap-2.5 rounded-full border-2 border-gold bg-vermilion px-5 py-4 font-display text-base font-bold text-white shadow-[0_12px_26px_-8px_rgba(158,35,24,0.65)] transition-transform duration-150 active:scale-[0.97] sm:text-lg'

const LINK =
  'mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full px-4 text-sm font-semibold text-vermilion-dark underline decoration-gold decoration-2 underline-offset-4'

function PhoneBadge({ wiggle = false }) {
  return (
    <div
      className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/70 bg-parchment-deep ${
        wiggle ? 'animate-wiggle' : ''
      }`}
    >
      <Smartphone aria-hidden="true" className="h-7 w-7 text-vermilion" strokeWidth={1.8} />
    </div>
  )
}

export default function WelcomeScreen({ onDraw, motion }) {
  const { status, noSignal, requestPermission } = motion
  const needsPermission = status === 'needs-permission'
  const noMotion = status === 'denied' || status === 'unsupported'
  const headingRef = useRef(null)

  // Moving focus to the heading keeps keyboard and screen-reader users oriented
  // when this screen replaces the previous one.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section className="screen relative flex flex-col items-center justify-center px-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-8 text-center">
      {/* Vertical shrine-style label, purely decorative */}
      <span
        aria-hidden="true"
        lang="ja"
        className="writing-vertical absolute right-3 top-8 select-none font-display text-xs font-bold tracking-[0.4em] text-vermilion-dark/85"
      >
        おみくじ
      </span>

      <div className="relative mb-5">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-gold/20 blur-2xl"
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-gold bg-vermilion shadow-[0_14px_32px_-10px_rgba(158,35,24,0.7)] sm:h-20 sm:w-20">
          <span
            lang="ja"
            className="font-display text-3xl font-extrabold leading-none text-parchment sm:text-4xl"
          >
            籤
          </span>
        </div>
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[1.85rem] font-extrabold leading-[1.12] text-vermilion-dark focus:outline-none sm:text-5xl"
      >
        Japanese Omikuji
        <span className="mt-1.5 block text-[1.25rem] font-bold tracking-wide text-ink sm:text-3xl">
          Fortune &amp; Destiny
        </span>
      </h1>

      <p className="mt-3 max-w-[19rem] text-[0.95rem] leading-relaxed text-ink/80 sm:mt-4 sm:text-base">
        Scan, shake your luck, and discover your fortune!
      </p>

      {needsPermission && (
        <>
          <div className="mt-6">
            <PhoneBadge />
          </div>
          <p className="mt-3 max-w-[17rem] text-sm leading-snug text-ink/80">
            Your phone will ask for motion access. Then you can shake it to draw.
          </p>
          <button type="button" onClick={requestPermission} className={PRIMARY}>
            <Smartphone aria-hidden="true" className="h-5 w-5 shrink-0" />
            Enable Shake
          </button>
          <button type="button" onClick={onDraw} className={LINK}>
            Tap to draw instead
          </button>
        </>
      )}

      {noMotion && (
        <>
          <div className="mt-6">
            <PhoneBadge />
          </div>
          <p className="mt-3 max-w-[17rem] text-sm leading-snug text-ink/70">
            {status === 'denied'
              ? 'Motion is off. You can still tap to draw. To turn it on, allow Motion & Orientation in your browser settings.'
              : "This device can't detect motion. You can still draw by tapping."}
          </p>
          <button type="button" onClick={onDraw} className={PRIMARY}>
            <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-light" />
            Tap to Draw Your Fortune
          </button>
        </>
      )}

      {!needsPermission && !noMotion && (
        <>
          <div className="mt-6 sm:mt-7">
            <PhoneBadge wiggle />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-vermilion-dark">
            Shake your phone
          </h2>
          <p className="mt-1 max-w-[16rem] text-sm leading-snug text-ink/75">
            Move it side to side, like a real omikuji cylinder.
          </p>

          {noSignal ? (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-vermilion-dark">
                No motion detected
              </p>
              <button type="button" onClick={onDraw} className={PRIMARY}>
                <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-light" />
                Tap to Draw Your Fortune
              </button>
            </>
          ) : (
            <button type="button" onClick={onDraw} className={LINK}>
              No motion? Tap to draw
            </button>
          )}
        </>
      )}
    </section>
  )
}

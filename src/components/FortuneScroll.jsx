import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Lightbulb } from 'lucide-react'

function Rod() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 mx-auto h-4 w-[104%] -translate-x-[2%] rounded-full bg-[linear-gradient(180deg,#E0745F_0%,#D63A2A_38%,#9E2318_72%,#7C1A11_100%)] shadow-[0_4px_10px_-2px_rgba(42,26,21,0.45)]"
    >
      <span className="absolute inset-x-6 top-1 h-px bg-white/25" />
      <span className="absolute -left-1.5 top-1/2 h-8 w-3.5 -translate-y-1/2 rounded-full border border-gold-dark/60 bg-[linear-gradient(180deg,#E8CB84,#C79B3B_60%,#9A7325)]" />
      <span className="absolute -right-1.5 top-1/2 h-8 w-3.5 -translate-y-1/2 rounded-full border border-gold-dark/60 bg-[linear-gradient(180deg,#E8CB84,#C79B3B_60%,#9A7325)]" />
    </div>
  )
}

export default function FortuneScroll({ fortune, onReset }) {
  // `open` flips on the next frame so the unroll transition actually plays.
  const [open, setOpen] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOpen(true)
      headingRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const { Icon } = fortune

  return (
    <section
      role="status"
      aria-live="polite"
      className="screen relative flex flex-col items-center justify-center px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-5"
    >
      <div className="mb-3 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-7 bg-gold/70" />
        <p className="font-display text-base font-bold tracking-wide text-vermilion-dark">
          Fortune #{fortune.number}
        </p>
        <span aria-hidden="true" className="h-px w-7 bg-gold/70" />
      </div>

      <div className="w-full max-w-sm">
        <Rod />

        {/* The paper unrolls by animating grid rows from 0fr to 1fr. */}
        <div
          className="grid transition-[grid-template-rows] duration-[1100ms] ease-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <article className="washi relative mx-1 border-x-2 border-gold/70 px-5 pb-6 pt-5 text-center shadow-[0_24px_40px_-18px_rgba(42,26,21,0.5)]">
              <div
                aria-hidden="true"
                className="seigaiha pointer-events-none absolute inset-x-0 bottom-0 h-14 opacity-70"
              />

              <div
                className="relative mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full border-4 border-gold bg-[radial-gradient(circle_at_32%_26%,#E85B45,#D63A2A_55%,#9E2318_100%)] text-parchment shadow-[0_14px_26px_-10px_rgba(158,35,24,0.8)]"
                style={{ animationDelay: '0.8s' }}
              >
                <Icon aria-hidden="true" className="h-10 w-10" strokeWidth={1.7} />
              </div>
              <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-ink/70">
                {fortune.theme}
              </p>

              <p
                lang="ja"
                className="mt-2.5 font-display text-[2.6rem] font-extrabold leading-none text-vermilion"
              >
                {fortune.kanji}
              </p>

              <h2
                ref={headingRef}
                tabIndex={-1}
                className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink focus:outline-none"
              >
                {fortune.typeEn}
              </h2>
              <p className="font-display text-base font-medium text-vermilion-dark">
                ({fortune.typeJp})
              </p>

              <div className="mx-auto my-3 flex items-center justify-center gap-2">
                <span aria-hidden="true" className="h-px w-16 bg-gold/70" />
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold" />
                <span aria-hidden="true" className="h-px w-16 bg-gold/70" />
              </div>

              <p className="text-base leading-relaxed text-ink">{fortune.message}</p>

              <div className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-gold/60 bg-parchment-deep/70 p-3 text-left">
                <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-vermilion" />
                <p className="text-sm font-medium leading-snug text-ink">
                  <span className="font-bold text-vermilion-dark">Advice:</span> {fortune.advice}
                </p>
              </div>
            </article>
          </div>
        </div>

        <Rod />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex min-h-[56px] w-full max-w-xs items-center justify-center gap-2.5 rounded-full border-2 border-gold bg-vermilion px-5 py-4 font-display text-base font-bold text-white shadow-[0_12px_26px_-8px_rgba(158,35,24,0.65)] transition-transform duration-150 active:scale-[0.97] sm:text-lg"
      >
        <RotateCcw aria-hidden="true" className="h-5 w-5 shrink-0" />
        Draw Another Fortune
      </button>
    </section>
  )
}

import { Sparkles } from 'lucide-react'

const STICKS = [
  { left: '16%', height: 88, delay: '0s', rotate: -12 },
  { left: '33%', height: 104, delay: '0.09s', rotate: -4 },
  { left: '50%', height: 94, delay: '0.17s', rotate: 3 },
  { left: '67%', height: 108, delay: '0.05s', rotate: 10 },
  { left: '82%', height: 84, delay: '0.13s', rotate: 15 },
]

const SPARKS = [
  { left: '6%', top: '22%', delay: '0s' },
  { left: '82%', top: '16%', delay: '0.35s' },
  { left: '24%', top: '2%', delay: '0.7s' },
  { left: '68%', top: '6%', delay: '0.95s' },
]

export default function ShakeAnimation() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="screen safe-b relative flex flex-col items-center justify-center px-6 pb-12 pt-10 text-center"
    >
      <div className="relative h-[21rem] w-60" aria-hidden="true">
        <span className="absolute bottom-[-10px] left-1/2 h-7 w-52 -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md" />

        {SPARKS.map((spark) => (
          <Sparkles
            key={spark.left}
            className="absolute h-6 w-6 animate-sparkle text-gold"
            style={{ left: spark.left, top: spark.top, animationDelay: spark.delay }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 top-8 origin-bottom animate-shake">
          {/* Fortune sticks rising out of the cylinder */}
          <div className="absolute inset-x-6 bottom-[9.4rem] top-0">
            {STICKS.map((stick) => (
              <span
                key={stick.left}
                className="absolute bottom-0 w-3 origin-bottom"
                style={{ left: stick.left, height: stick.height, transform: `rotate(${stick.rotate}deg)` }}
              >
                <span
                  className="block h-full w-full animate-stick rounded-t-full bg-[linear-gradient(90deg,#a97f2b,#E8CB84_38%,#C79B3B_72%,#8a6520)] shadow-[0_2px_6px_rgba(42,26,21,0.35)]"
                  style={{ animationDelay: stick.delay }}
                />
              </span>
            ))}
          </div>

          {/* Bamboo cylinder */}
          <div className="absolute inset-x-7 bottom-0 h-48">
            <div className="absolute inset-x-0 bottom-0 top-3 overflow-hidden rounded-b-[1.75rem] bg-[linear-gradient(90deg,#7C1A11_0%,#B32B1D_14%,#E85B45_38%,#D63A2A_58%,#A22317_82%,#6E150D_100%)] shadow-[0_22px_40px_-12px_rgba(42,26,21,0.6)]">
              <div className="absolute inset-x-0 top-5 h-2.5 rounded-sm bg-[linear-gradient(180deg,#E8CB84,#C79B3B_55%,#8a6520)] shadow-sm" />
              <div className="absolute inset-x-0 bottom-8 h-2.5 rounded-sm bg-[linear-gradient(180deg,#E8CB84,#C79B3B_55%,#8a6520)] shadow-sm" />
              <div className="absolute inset-y-6 left-4 w-4 bg-gradient-to-r from-white/25 to-transparent" />
              <div className="absolute inset-y-6 right-9 w-px bg-black/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  lang="ja"
                  className="writing-vertical pb-1 font-display text-[2rem] font-extrabold tracking-[0.26em] text-parchment drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
                >
                  御籤
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-8 rounded-b-[1.6rem] bg-black/15" />
            </div>

            {/* Open mouth of the cylinder */}
            <div className="absolute inset-x-0 top-0 h-7 rounded-[50%] border-[3px] border-vermilion-deep bg-[linear-gradient(180deg,#B32B1D,#8a1c12_60%,#5e120b)] shadow-[0_2px_0_rgba(232,203,132,0.35)]">
              <div className="absolute inset-x-2 inset-y-0.5 rounded-[50%] bg-[#3a0703] shadow-[inset_0_4px_8px_rgba(0,0,0,0.85)]" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 font-display text-2xl font-bold text-vermilion-dark">Shaking...</p>
      <p className="mt-2 max-w-[16rem] text-base leading-relaxed text-ink/70">
        Think of a wish. Your fortune is coming!
      </p>
    </section>
  )
}

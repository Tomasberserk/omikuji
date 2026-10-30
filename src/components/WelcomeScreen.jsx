import { Sparkles } from 'lucide-react'

export default function WelcomeScreen({ onStart }) {
  return (
    <section className="screen relative flex flex-col items-center justify-center px-6 pb-8 pt-10 text-center sm:pb-12 sm:pt-12">
      {/* Vertical shrine-style label, purely decorative */}
      <span
        aria-hidden="true"
        lang="ja"
        className="writing-vertical absolute right-3 top-8 select-none font-display text-xs font-bold tracking-[0.4em] text-vermilion-dark/85"
      >
        おみくじ
      </span>

      <div className="relative mb-6 sm:mb-7">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-gold/20 blur-2xl"
        />
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold bg-vermilion shadow-[0_14px_32px_-10px_rgba(158,35,24,0.7)] sm:h-24 sm:w-24">
          <span
            lang="ja"
            className="font-display text-4xl font-extrabold leading-none text-parchment sm:text-5xl"
          >
            籤
          </span>
        </div>
      </div>

      <h1 className="font-display text-[1.9rem] font-extrabold leading-[1.12] text-vermilion-dark sm:text-5xl">
        Japanese Omikuji
        <span className="mt-1.5 block text-[1.3rem] font-bold tracking-wide text-ink sm:text-3xl">
          Fortune &amp; Destiny
        </span>
      </h1>

      <p className="mt-4 max-w-[19rem] text-base leading-relaxed text-ink/80 sm:mt-5 sm:text-[1.05rem]">
        Scan, shake your luck, and discover your fortune!
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex min-h-[56px] w-full max-w-xs animate-breathe items-center justify-center gap-2 rounded-full border-2 border-gold bg-vermilion px-4 py-4 font-display text-[0.95rem] font-bold text-white transition-transform duration-150 active:scale-[0.97] sm:mt-10 sm:max-w-sm sm:gap-3 sm:px-7 sm:text-lg"
      >
        <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-light" />
        <span className="leading-tight">Shake &amp; Draw Your Fortune</span>
      </button>

      <p className="mt-6 max-w-[19rem] text-[0.8rem] leading-relaxed text-ink/70 sm:mt-8 sm:text-sm">
        Omikuji is a paper fortune from Japan. People get it at temples and shrines. Think of a
        wish before you start.
      </p>
    </section>
  )
}

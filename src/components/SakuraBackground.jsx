import { useMemo } from 'react'

// Deterministic petals: stable across re-renders, no layout thrash.
const COUNT = 11

function buildPetals(count) {
  return Array.from({ length: count }, (_, index) => {
    const seed = index * 37 + 11
    const wobble = ((seed * 13) % 9) - 4
    return {
      id: index,
      left: `${Math.min(96, (index / count) * 100 + wobble)}%`,
      size: 9 + ((seed * 7) % 9),
      delay: `${((seed * 17) % 140) / 10}s`,
      duration: `${13 + ((seed * 11) % 70) / 10}s`,
      tone: index % 3,
    }
  })
}

const TONES = ['bg-vermilion-soft', 'bg-gold-light/80', 'bg-vermilion-soft/80']

export default function SakuraBackground() {
  const petals = useMemo(() => buildPetals(COUNT), [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 mx-auto max-w-md overflow-hidden"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className={`absolute top-0 block animate-drift rounded-[62%_0_62%_0] ${TONES[petal.tone]}`}
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

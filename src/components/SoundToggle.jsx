import { Volume2, VolumeX } from 'lucide-react'

export default function SoundToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      data-sound-toggle
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Turn sound on' : 'Turn sound off'}
      className="absolute left-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-parchment/85 text-vermilion-dark shadow-sm backdrop-blur transition-colors hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {muted ? (
        <VolumeX aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Volume2 aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  )
}

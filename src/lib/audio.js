/**
 * Small Web Audio engine. Everything is synthesized here, so the project
 * stays dependency-free and there are no music licensing questions.
 *
 * - Ambient: slow koto-like plucks on a hirajoshi pentatonic scale over a drone.
 * - Tension: accelerating taiko hits plus a noise riser while the cylinder shakes.
 * - Reveal: a low gong and two chimes.
 * - UI: a soft woodblock tap and a paper unroll noise.
 *
 * Browsers only allow audio after a user gesture, so App calls unlock() on the
 * first pointer/key event.
 */

const SCALE = [0, 2, 3, 7, 8] // hirajoshi: A, B, C, E, F
const ROOT = 220 // A3
const STEP = 0.5 // seconds per melodic step
// Degree per step; negative means rest.
const PATTERN = [0, 4, 2, -1, 3, 2, 0, -1, 1, 2, 4, -1, 3, 0, -1, -1]

class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.ambient = null
    this.sfx = null
    this.noise = null
    this.drones = []
    this.droneStarted = false
    this.ambientPlaying = false
    this.timer = null
    this.step = 0
    this.nextNoteTime = 0
    this.revealTimer = null
    this.muted = false
    this.masterLevel = 0.85
    this.ambientLevel = 0.3
  }

  get supported() {
    return (
      typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext)
    )
  }

  ensure() {
    if (this.ctx) return this.ctx
    if (!this.supported) return null

    const Ctor = window.AudioContext || window.webkitAudioContext
    this.ctx = new Ctor()

    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : this.masterLevel
    this.master.connect(this.ctx.destination)

    this.ambient = this.ctx.createGain()
    this.ambient.gain.value = 0.0001
    this.ambient.connect(this.master)

    this.sfx = this.ctx.createGain()
    this.sfx.gain.value = 1
    this.sfx.connect(this.master)

    return this.ctx
  }

  async unlock() {
    const ctx = this.ensure()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        return
      }
    }
    if (!this.muted) this.startAmbient(2)
  }

  // ---- ambient ---------------------------------------------------------

  startDrone() {
    if (this.droneStarted || !this.ctx) return
    this.droneStarted = true
    const ctx = this.ctx

    const voices = [
      { freq: 110, level: 0.05, lfo: 0.05 },
      { freq: 164.81, level: 0.032, lfo: 0.08 },
    ]

    for (const voice of voices) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = voice.freq
      gain.gain.value = voice.level
      lfo.frequency.value = voice.lfo
      lfoGain.gain.value = voice.level * 0.35

      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      osc.connect(gain)
      gain.connect(this.ambient)

      osc.start()
      lfo.start()
      this.drones.push(osc, lfo)
    }
  }

  pluck(freq, when, level = 0.32) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const shimmer = ctx.createOscillator()
    const gain = ctx.createGain()
    const shimmerGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, when)
    shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(freq * 2.004, when)
    shimmerGain.gain.value = 0.18

    filter.type = 'lowpass'
    filter.Q.value = 0.7
    filter.frequency.setValueAtTime(Math.min(freq * 7, 5200), when)
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.6, 320), when + 0.5)

    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(level, when + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.3)

    osc.connect(gain)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(gain)
    gain.connect(filter)
    filter.connect(this.ambient)

    osc.start(when)
    shimmer.start(when)
    osc.stop(when + 1.4)
    shimmer.stop(when + 1.4)
  }

  schedule() {
    const ctx = this.ctx
    if (!ctx || !this.ambientPlaying) return
    if (this.nextNoteTime < ctx.currentTime) this.nextNoteTime = ctx.currentTime + 0.1

    while (this.nextNoteTime < ctx.currentTime + 0.6) {
      const degree = PATTERN[this.step % PATTERN.length]

      if (degree >= 0) {
        const octave = this.step % 8 === 5 ? 1 : 0
        const freq = ROOT * 2 ** (SCALE[degree] / 12) * 2 ** octave
        this.pluck(freq, this.nextNoteTime, this.step % 4 === 0 ? 0.42 : 0.3)
      }

      this.step += 1
      this.nextNoteTime += STEP
    }
  }

  startAmbient(fade = 2) {
    const ctx = this.ensure()
    if (!ctx || this.muted) return
    this.startDrone()

    const now = ctx.currentTime

    if (this.ambientPlaying) {
      this.ambient.gain.cancelScheduledValues(now)
      this.ambient.gain.setValueAtTime(this.ambient.gain.value, now)
      this.ambient.gain.linearRampToValueAtTime(this.ambientLevel, now + fade)
      return
    }

    this.ambientPlaying = true
    this.step = 0
    this.nextNoteTime = now + 0.2

    this.ambient.gain.cancelScheduledValues(now)
    this.ambient.gain.setValueAtTime(0.0001, now)
    this.ambient.gain.exponentialRampToValueAtTime(this.ambientLevel, now + fade)

    this.timer = setInterval(() => this.schedule(), 250)
  }

  stopAmbient(fade = 0.2) {
    if (!this.ctx) return
    this.ambientPlaying = false
    clearInterval(this.timer)
    this.timer = null

    const now = this.ctx.currentTime
    this.ambient.gain.cancelScheduledValues(now)
    this.ambient.gain.setValueAtTime(this.ambient.gain.value, now)
    this.ambient.gain.linearRampToValueAtTime(0.0001, now + fade)
  }

  // ---- sound effects ---------------------------------------------------

  getNoise() {
    if (this.noise) return this.noise
    const ctx = this.ctx
    const length = Math.floor(ctx.sampleRate)
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < length; index += 1) {
      data[index] = Math.random() * 2 - 1
    }
    this.noise = buffer
    return buffer
  }

  noiseBurst(when, duration, level, frequency) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    src.buffer = this.getNoise()
    filter.type = 'bandpass'
    filter.frequency.value = frequency
    filter.Q.value = 0.9

    gain.gain.setValueAtTime(level, when)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfx)

    src.start(when)
    src.stop(when + duration + 0.02)
  }

  taiko(when, level = 0.5) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, when)
    osc.frequency.exponentialRampToValueAtTime(52, when + 0.28)

    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(level, when + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.4)

    osc.connect(gain)
    gain.connect(this.sfx)
    osc.start(when)
    osc.stop(when + 0.42)

    this.noiseBurst(when, 0.09, level * 0.5, 800)
  }

  riser(when, duration) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    src.buffer = this.getNoise()
    src.loop = true
    filter.type = 'bandpass'
    filter.Q.value = 1.2
    filter.frequency.setValueAtTime(350, when)
    filter.frequency.exponentialRampToValueAtTime(2800, when + duration)

    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(0.09, when + duration * 0.85)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration + 0.08)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfx)

    src.start(when)
    src.stop(when + duration + 0.2)
  }

  chime(when, frequency, level = 0.15) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = frequency

    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(level, when + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.8)

    osc.connect(gain)
    gain.connect(this.sfx)
    osc.start(when)
    osc.stop(when + 1.9)
  }

  playTension(duration = 1.5) {
    const ctx = this.ctx
    if (!ctx || this.muted || ctx.state !== 'running') return

    clearTimeout(this.revealTimer)
    this.stopAmbient(0.12)

    const now = ctx.currentTime
    let time = now + 0.02
    let interval = 0.24

    while (time < now + duration - 0.08) {
      this.taiko(time)
      time += interval
      interval = Math.max(0.075, interval * 0.8)
    }

    this.riser(now, duration)
  }

  playReveal() {
    const ctx = this.ctx
    if (!ctx || this.muted || ctx.state !== 'running') return

    const now = ctx.currentTime

    for (const [index, frequency] of [110, 164.81, 220].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, now)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.28 / (index + 1), now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6)

      osc.connect(gain)
      gain.connect(this.sfx)
      osc.start(now)
      osc.stop(now + 2.7)
    }

    this.chime(now + 0.1, 880, 0.16)
    this.chime(now + 0.22, 1320, 0.08)

    clearTimeout(this.revealTimer)
    this.revealTimer = setTimeout(() => this.startAmbient(2.5), 1600)
  }

  playUnroll() {
    const ctx = this.ctx
    if (!ctx || this.muted || ctx.state !== 'running') return

    const now = ctx.currentTime
    const src = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    src.buffer = this.getNoise()
    src.loop = true
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(900, now)
    filter.frequency.linearRampToValueAtTime(2600, now + 0.9)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.035, now + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfx)

    src.start(now)
    src.stop(now + 1.2)
  }

  playTap() {
    const ctx = this.ctx
    if (!ctx || this.muted || ctx.state !== 'running') return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.05)

    gain.gain.setValueAtTime(0.09, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.sfx)
    osc.start(now)
    osc.stop(now + 0.1)
  }

  // ---- control ---------------------------------------------------------

  mute() {
    this.muted = true
    if (!this.ctx) return

    this.stopAmbient(0.15)
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.2)
  }

  async unmute() {
    this.muted = false
    const ctx = this.ensure()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        return
      }
    }

    const now = ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(this.masterLevel, now + 0.2)
    this.startAmbient(1.2)
  }

  /** Silences anything already scheduled (used when the tab is hidden). */
  panic() {
    if (!this.ctx) return
    clearTimeout(this.revealTimer)
    this.stopAmbient(0.05)

    this.sfx.disconnect()
    const bus = this.ctx.createGain()
    bus.gain.value = 1
    bus.connect(this.master)
    this.sfx = bus
  }

  suspend() {
    if (this.ctx?.state === 'running') this.ctx.suspend()
  }

  resume() {
    if (!this.ctx) return
    if (this.ctx.state === 'suspended' && !this.muted) this.ctx.resume()
    if (!this.muted) this.startAmbient(1.2)
  }
}

export const audio = new AudioEngine()

if (import.meta.env?.DEV && typeof window !== 'undefined') {
  window.__omikujiAudio = audio
}

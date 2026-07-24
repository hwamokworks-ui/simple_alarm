import { useRef } from "react"

export function useBeep() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beepTimerRef = useRef<number | null>(null)
  const unlockedRef = useRef(false)

  function ensureContext() {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      audioCtxRef.current = new AudioContextClass()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  function playBeep() {
    const ctx = ensureContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = 880
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(ctx.destination)

    const t = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02)
    gain.gain.linearRampToValueAtTime(0.0001, t + 0.35)

    osc.start(t)
    osc.stop(t + 0.4)
  }

  function startBeep() {
    ensureContext()
    playBeep()
    beepTimerRef.current = window.setInterval(playBeep, 700)
  }

  function stopBeep() {
    if (beepTimerRef.current) {
      clearInterval(beepTimerRef.current)
      beepTimerRef.current = null
    }
  }

  function unlockAudioContext() {
    if (unlockedRef.current) return false
    unlockedRef.current = true
    ensureContext()
    return true
  }

  return { startBeep, stopBeep, unlockAudioContext }
}

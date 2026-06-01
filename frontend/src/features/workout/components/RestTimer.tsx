import { useState, useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'

interface RestTimerProps {
  initialSeconds: number
  onFinish: () => void
  onSkip: () => void
}

export const RestTimer = ({ initialSeconds, onFinish, onSkip }: RestTimerProps) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds)
  const [remaining, setRemaining] = useState(initialSeconds)
  const onFinishRef = useRef(onFinish)

  // Manter ref atualizada sem recriar o effect
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    if (remaining <= 0) {
      onFinishRef.current()
      return
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining])

  const adjustTime = useCallback((delta: number) => {
    setTotalSeconds((t) => Math.max(5, t + delta))
    setRemaining((r) => Math.max(1, r + delta))
  }, [])

  const progress = totalSeconds > 0 ? (1 - remaining / totalSeconds) : 1
  const minutes = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-[60] flex items-end animate-fadeIn">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onSkip} />

      {/* bottom sheet */}
      <div className="relative w-full bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp"
        style={{ maxWidth: 393, margin: '0 auto' }}
      >
        {/* drag indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gj-text-secondary/30" />
        </div>

        <div className="relative h-9 mb-3">
          <h3 className="absolute inset-x-12 top-1/2 -translate-y-1/2 text-center text-base font-bold text-white">
            Timer de descanso
          </h3>
          <button
            onClick={onSkip}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gj-surface-elevated text-gj-text-secondary transition-colors hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 pb-6">

          {/* big timer */}
          <div className="text-5xl font-bold text-gj-accent text-center mb-4 tabular-nums tracking-tight">
            {display}
          </div>

          {/* progress bar */}
          <div className="w-full h-2 rounded-full bg-gj-surface-elevated mb-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #FF6B35, #FF8F5E)',
              }}
            />
          </div>

          {/* time adjust buttons */}
          <div className="flex justify-center gap-2 mb-5">
            {[-15, -5, 5, 15].map((delta) => (
              <button
                key={delta}
                onClick={() => adjustTime(delta)}
                className="h-9 px-4 rounded-gj-md bg-gj-surface-elevated border border-gj-border text-xs text-gj-text-secondary hover:text-white hover:border-gj-text-secondary transition-colors cursor-pointer"
              >
                {delta > 0 ? `+${delta}s` : `${delta}s`}
              </button>
            ))}
          </div>

          {/* skip */}
          <button
            onClick={onSkip}
            className="w-full h-12 rounded-gj-lg bg-gj-surface-elevated border border-gj-border text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Pular descanso
          </button>
        </div>
      </div>
    </div>
  )
}

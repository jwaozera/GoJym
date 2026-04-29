import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'

interface WeeklySeriesSheetProps {
  isOpen: boolean
  onClose: () => void
  data: {
    totalSeries: number
    totalSessions: number
    totalWeight: string
    totalTime: string
    activeDays: number
    avgSeriesPerSession: number
    mostFrequentWorkout: string
  }
}

export const WeeklySeriesSheet = ({ isOpen, onClose, data }: WeeklySeriesSheetProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showTooltip) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!tooltipRef.current?.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showTooltip])

  useEffect(() => {
    if (!isOpen) {
      setShowTooltip(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const rows = [
    { label: 'Total de séries', value: String(data.totalSeries) },
    { label: 'Total de sessões', value: String(data.totalSessions) },
    { label: 'Carga total', value: data.totalWeight },
    { label: 'Tempo total', value: data.totalTime },
    { label: 'Dias ativos', value: String(data.activeDays) },
    { label: 'Média séries/sessão', value: String(data.avgSeriesPerSession) },
    { label: 'Treino mais frequente', value: data.mostFrequentWorkout },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp"
      >
        {/* Drag handle */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gj-border" />
        </div>

        {/* Content */}
        <div className="flex flex-col px-5 pb-8">
          {/* Title */}
          <div className="relative mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Séries Semanais</h3>
            <div ref={tooltipRef} className="relative">
              <button
                type="button"
                onClick={() => setShowTooltip((value) => !value)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gj-text-secondary transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Mostrar explicação das comparações"
                aria-expanded={showTooltip}
              >
                <Info size={14} />
              </button>

              {showTooltip && (
                <div className="absolute left-1/2 top-8 z-[70] w-[224px] -translate-x-1/2 rounded-gj-md border border-gj-border bg-gj-surface-elevated p-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold text-white">
                    Comparação com a semana anterior
                  </p>
                  <div className="space-y-1 text-[11px] leading-[1.45] text-gj-text-secondary">
                    <p>↑ aumentou</p>
                    <p>↓ diminuiu</p>
                    <p>= sem variação relevante</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between py-2.5 ${
                i < rows.length - 1 ? 'border-b border-gj-border' : ''
              }`}
            >
              <span className="text-xs text-gj-text-secondary">{row.label}</span>
              <span className="text-sm font-semibold text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

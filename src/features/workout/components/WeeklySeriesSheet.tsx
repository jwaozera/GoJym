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
          <h3 className="text-base font-semibold text-white mb-4">Séries Semanais</h3>

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

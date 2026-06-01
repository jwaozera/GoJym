interface DailySeriesSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedWeek: 'current' | 'previous'
  onSelectWeek: (week: 'current' | 'previous') => void
}

export const DailySeriesSheet = ({
  isOpen,
  onClose,
  selectedWeek,
  onSelectWeek,
}: DailySeriesSheetProps) => {
  if (!isOpen) return null

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
          <h3 className="text-base font-semibold text-white mb-4">Séries por dia — Selecionar semana</h3>

          {/* Semana */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => { onSelectWeek('current'); onClose() }}
              className={`w-full py-3 px-4 rounded-gj-lg text-sm font-semibold text-left transition-all cursor-pointer ${
                selectedWeek === 'current'
                  ? 'bg-gj-accent/10 border border-gj-accent/30 text-gj-accent'
                  : 'bg-gj-surface-elevated border border-gj-border text-white hover:bg-white/10'
              }`}
            >
              Semana atual
            </button>
            <button
              onClick={() => { onSelectWeek('previous'); onClose() }}
              className={`w-full py-3 px-4 rounded-gj-lg text-sm text-left transition-all cursor-pointer ${
                selectedWeek === 'previous'
                  ? 'bg-gj-accent/10 border border-gj-accent/30 text-gj-accent font-semibold'
                  : 'bg-gj-surface-elevated border border-gj-border text-white font-normal hover:bg-white/10'
              }`}
            >
              Semana passada
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

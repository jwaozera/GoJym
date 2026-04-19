import { Check } from 'lucide-react'

interface SetInputRowProps {
  setNumber: number
  weight: string
  reps: string
  completed: boolean
  lastWeight?: number | null
  lastReps?: number | null
  isActive: boolean
  onWeightChange: (v: string) => void
  onRepsChange: (v: string) => void
  onToggleComplete: () => void
}

export const SetInputRow = ({
  setNumber,
  weight,
  reps,
  completed,
  // lastWeight,
  // lastReps,
  isActive,
  // onWeightChange,
  // onRepsChange,
  onToggleComplete,
}: SetInputRowProps) => {
  // completed state
  if (completed) {
    return (
      <button
        onClick={onToggleComplete}
        className="flex items-center justify-between h-12 px-3 rounded-gj-md bg-gj-success/8 border border-gj-success/20 cursor-pointer transition-colors hover:bg-gj-success/12"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-gj-success flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-sm font-medium text-gj-success">
            {weight}kg × {reps}
          </span>
        </div>
        <span className="text-[10px] text-gj-text-secondary">Toque para editar</span>
      </button>
    )
  }

  // active state (current set)
  if (isActive) {
    return (
      <div className="flex items-center gap-2 h-12 px-3 rounded-gj-md bg-gj-bg border-2 border-gj-accent">
        <div className="w-6 h-6 rounded-full bg-gj-accent flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-white">{setNumber}</span>
        </div>
        <span className="text-xs font-semibold text-white shrink-0">Série {setNumber}</span>
        <div className="flex-1" />
      </div>
    )
  }

  // pending state
  return (
    <div className="flex items-center gap-2 h-12 px-3 rounded-gj-md bg-gj-surface border border-gj-border opacity-50">
      <div className="w-6 h-6 rounded-full bg-gj-surface-elevated flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-gj-text-secondary">{setNumber}</span>
      </div>
      <span className="text-xs font-medium text-gj-text-secondary">Série {setNumber}</span>
    </div>
  )
}

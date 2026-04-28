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
  lastWeight,
  lastReps,
  isActive,
  onWeightChange,
  onRepsChange,
  onToggleComplete,
}: SetInputRowProps) => {
  // série concluída
  const borderClass = completed
    ? 'border border-gj-success/20'
    : isActive
      ? 'border-2 border-gj-accent'
      : 'border border-gj-border'

  const bgClass = completed
    ? 'bg-gj-success/8'
    : 'bg-gj-bg'

  const opacityClass = !completed && !isActive ? 'opacity-60' : ''

  const badgeBg = completed
    ? 'bg-gj-success'
    : isActive
      ? 'bg-gj-accent'
      : 'bg-gj-surface-elevated'

  const badgeText = completed || isActive
    ? 'text-white'
    : 'text-gj-text-secondary'

  const inputTextClass = completed
    ? 'text-gj-success'
    : 'text-white'

  return (
    <div className={`flex items-center gap-2 min-h-[48px] px-3 py-2 rounded-gj-md ${borderClass} ${bgClass} ${opacityClass} transition-all duration-200`}>
      {/* badge numérico — fixed size */}
      <div className={`w-6 h-6 min-w-[24px] rounded-full ${badgeBg} flex items-center justify-center shrink-0`}>
        <span className={`text-[10px] font-bold leading-none ${badgeText}`}>{setNumber}</span>
      </div>

      {/* peso input — flexible */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={e => onWeightChange(e.target.value)}
          placeholder={lastWeight?.toString() ?? '0'}
          className={`w-full min-w-0 text-center bg-transparent text-sm font-bold ${inputTextClass} outline-none placeholder:text-gj-text-secondary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        <span className={`text-[10px] shrink-0 ${completed ? 'text-gj-success/60' : 'text-gj-text-secondary'}`}>kg</span>
      </div>

      {/* Separator */}
      <span className={`text-sm shrink-0 ${completed ? 'text-gj-success/40' : 'text-gj-text-secondary/40'}`}>×</span>

      {/* Reps input — flexible */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        <input
          type="number"
          inputMode="numeric"
          value={reps}
          onChange={e => onRepsChange(e.target.value)}
          placeholder={lastReps?.toString() ?? '0'}
          className={`w-full min-w-0 text-center bg-transparent text-sm font-bold ${inputTextClass} outline-none placeholder:text-gj-text-secondary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        <span className={`text-[10px] shrink-0 ${completed ? 'text-gj-success/60' : 'text-gj-text-secondary'}`}>reps</span>
      </div>

      {/* botão de checkmark — fixed size, touch-friendly */}
      <button
        onClick={onToggleComplete}
        className={`w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
          completed
            ? 'bg-gj-success hover:bg-gj-success/80'
            : 'bg-gj-surface-elevated border border-gj-border hover:border-gj-accent hover:bg-gj-accent/10'
        }`}
        aria-label={completed ? 'Desmarcar série' : 'Confirmar série'}
      >
        <Check
          size={14}
          className={completed ? 'text-white' : 'text-gj-text-secondary'}
          strokeWidth={3}
        />
      </button>
    </div>
  )
}

import type { WorkoutSession } from '../../../types'
import { Dumbbell, Play, ChevronRight } from 'lucide-react'

interface WorkoutCardProps {
  session: WorkoutSession
  onPress: () => void
}

export const WorkoutCard = ({ session, onPress }: WorkoutCardProps) => {
  const exerciseCount = session.exercises.length
  const lastPerformedAt = session.completedAt ?? session.createdAt

  const dateStr = new Date(lastPerformedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <button
      onClick={onPress}
      className={`w-full text-left bg-gj-surface border rounded-gj-lg p-4 transition-all cursor-pointer hover:bg-gj-surface-elevated ${
        session.isActive
          ? 'border-gj-accent/40 shadow-sm shadow-gj-accent/10'
          : 'border-gj-border'
      }`}
    >
      {/* badge em andamento */}
      {session.isActive && (
        <span className="inline-block text-[10px] font-semibold text-gj-accent uppercase tracking-wider mb-2">
          Em andamento
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <span className="text-sm font-semibold text-white truncate">
            {session.name}
          </span>

          <div className="flex items-center gap-3 text-xs text-gj-text-secondary">
            <span className="flex items-center gap-1">
              <Dumbbell size={12} />
              {exerciseCount} exercício{exerciseCount !== 1 ? 's' : ''}
            </span>
            <span>{dateStr}</span>
          </div>
        </div>

        {session.isActive ? (
          <div className="flex items-center gap-1.5 h-8 px-3 rounded-gj-md bg-gj-accent text-white text-xs font-semibold shrink-0">
            <Play size={12} fill="white" />
            Retomar
          </div>
        ) : (
          <ChevronRight size={18} className="text-gj-text-secondary shrink-0" />
        )}
      </div>
    </button>
  )
}

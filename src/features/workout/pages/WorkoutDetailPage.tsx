import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../../store/workoutStore'
import { ArrowLeft, Clock, Pencil, Play, Timer } from 'lucide-react'

export const WorkoutDetailPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { sessions, fetchSessions, loading } = useWorkoutStore()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const session = sessions.find((s) => s.id === sessionId)

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <span className="text-sm text-gj-text-secondary">Carregando...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-3 px-5">
        <span className="text-lg font-bold text-white">Treino não encontrado</span>
        <button
          onClick={() => navigate('/workouts')}
          className="text-sm text-gj-accent hover:underline cursor-pointer"
        >
          Voltar para treinos
        </button>
      </div>
    )
  }

  // stats calculados
  const exerciseCount = session.exercises.length
  //const totalSets = session.exercises.reduce((acc, we) => acc + we.sets.length, 0)
  const estimatedMin = session.durationSeconds
    ? Math.round(session.durationSeconds / 60)
    : 55

  // categorias únicas dos exercícios
  const categories = [
    ...new Set(session.exercises.map((we) => we.exercise.category)),
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* ===== HEADER ===== */}
      <div className="px-5 pt-14 pb-4 border-b border-gj-border">
        {/* top row: back + edit */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/workouts')}
            className="w-9 h-9 rounded-gj-md bg-gj-surface-elevated flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => navigate(`/workouts/${session.id}/edit`)}
            className="w-9 h-9 rounded-gj-md bg-gj-surface-elevated flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* título */}
        <h1 className="text-xl font-bold text-white leading-[1.4] mb-1">
          {session.name}
        </h1>

        {/* subtítulo (categorias) */}
        <p className="text-xs text-gj-text-secondary mb-2">
          {categories.join(' · ')} · Hipertrofia
        </p>

        {/* stats */}
        <div className="flex items-center gap-3 text-xs text-gj-text-secondary">
          <span>{exerciseCount} exercícios</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            ~{estimatedMin} min
          </span>
        </div>
      </div>

      {/* ===== EXERCISE LIST ===== */}
      <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto">
        {session.exercises.map((we, index) => {
          const setsCount = we.sets.length
          // pegar range de reps (min-max)
          const repValues = we.sets
            .map((s) => s.reps)
            .filter((r): r is number => r !== null)
          const minReps = repValues.length > 0 ? Math.min(...repValues) : 0
          const maxReps = repValues.length > 0 ? Math.max(...repValues) : 0
          const repRange =
            minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`
          const restSec = we.restSeconds ?? 60

          return (
            <div
              key={we.id}
              className="bg-gj-surface border border-gj-border rounded-gj-lg p-4"
            >
              {/* top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  {/* number badge */}
                  <div className="w-7 h-7 rounded-[10px] bg-gj-accent-soft flex items-center justify-center">
                    <span className="text-xs font-bold text-gj-accent">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {we.exercise.name}
                    </span>
                    <span className="text-xs text-gj-text-secondary">
                      {setsCount}x{repRange}
                    </span>
                  </div>
                </div>

                {/* último treino */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gj-text-secondary">Último</span>
                  <span className="text-xs font-medium text-gj-text-secondary/60">
                    —
                  </span>
                </div>
              </div>

              {/* descanso */}
              <div className="flex items-center gap-1 text-xs text-gj-text-secondary mt-1">
                <Timer size={12} />
                Descanso: {restSec}s
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== BOTTOM ACTION ===== */}
      <div className="px-5 py-4 border-t border-gj-border bg-gj-bg">
        <button
          onClick={() => navigate(`/workout/execute/${session.id}`)}
          className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20"
        >
          <Play size={16} fill="white" />
          Começar sessão
        </button>
      </div>
    </div>
  )
}

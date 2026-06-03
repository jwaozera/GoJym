import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../../store/workoutStore'
import type { WorkoutSession } from '../../../types'
import { ArrowLeft, Pencil, Play, Timer } from 'lucide-react'

export const WorkoutDetailPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { getFullSession, startActiveSession } = useWorkoutStore()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      if (sessionId) {
        const fullSession = await getFullSession(sessionId)
        setSession(fullSession)
      }
      setLoading(false)
    }
    loadSession()
  }, [sessionId, getFullSession])

  if (loading) {
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

  const exerciseCount = session.qtdExercicios ?? session.exercicios?.length ?? 0

  const handleStartSession = async () => {
    if (!session?.id) return

    try {
      const started = await startActiveSession(session.id)
      if (started) {
        navigate(`/workout/execute/${session.id}`)
      }
    } catch (error) {
      console.error('Erro ao iniciar treino:', error)
    }
  }

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
          {session.nome}
        </h1>

        <p className="text-xs text-gj-text-secondary">
          {exerciseCount} exercício{exerciseCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ===== EXERCISE LIST ===== */}
      <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto">
        {session.exercicios?.map((ex, index) => {
          const repRange =
            ex.repeticoesMin === ex.repeticoesMax
              ? `${ex.repeticoesMin}`
              : `${ex.repeticoesMin}-${ex.repeticoesMax}`

          return (
            <div
              key={ex.id}
              className="bg-gj-surface border border-gj-border rounded-gj-lg p-4"
            >
              {/* top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  {/* number badge */}
                  <div className="w-7 h-7 rounded-[10px] bg-gj-accent-soft flex items-center justify-center">
                    <span className="text-xs font-bold text-gj-accent">
                      {ex.ordem}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {ex.exercicioNome}
                    </span>
                    <span className="text-xs text-gj-text-secondary">
                      {ex.numSeries}x{repRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* descanso */}
              <div className="flex items-center gap-1 text-xs text-gj-text-secondary mt-1">
                <Timer size={12} />
                Descanso: {ex.descanso}s
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== BOTTOM ACTION ===== */}
      <div className="px-5 py-4 border-t border-gj-border bg-gj-bg">
        <button
          onClick={handleStartSession}
          className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20"
        >
          <Play size={16} fill="white" />
          Começar sessão
        </button>
      </div>
    </div>
  )
}

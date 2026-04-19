import { useNavigate } from 'react-router-dom'
import { mockSessions } from '../../../mocks/data'
import { WorkoutCard } from '../components/WorkoutCard'
import { Plus, Dumbbell } from 'lucide-react'

export const WorkoutListPage = () => {
  const navigate = useNavigate()

  // separar sessão ativa das demais
  const activeSessions = mockSessions.filter((s) => s.isActive)
  const otherSessions = mockSessions.filter((s) => !s.isActive)

  const isEmpty = mockSessions.length === 0

  return (
    <div className="flex flex-col min-h-full px-5 pt-14 pb-4">
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-white leading-[1.4]">Treinos</h1>
        <button
          onClick={() => navigate('/workout/create')}
          className="flex items-center gap-1.5 h-9 px-4 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Novo treino
        </button>
      </div>

      {isEmpty ? (
        /* ===== ESTADO VAZIO ===== */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-16 h-16 rounded-full bg-gj-surface-elevated flex items-center justify-center">
            <Dumbbell size={28} className="text-gj-text-secondary" />
          </div>
          <div className="text-center">
            <span className="text-base font-semibold text-white block mb-1">
              Nenhum treino criado
            </span>
            <span className="text-sm text-gj-text-secondary">
              Crie seu primeiro treino para começar a registrar suas sessões.
            </span>
          </div>
          <button
            onClick={() => navigate('/workout/create')}
            className="mt-2 flex items-center gap-2 h-10 px-5 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Criar treino
          </button>
        </div>
      ) : (
        /* ===== LISTA ===== */
        <div className="flex flex-col gap-3">
          {/* sessões ativas primeiro */}
          {activeSessions.length > 0 && (
            <>
              <span className="text-[10px] font-semibold text-gj-accent uppercase tracking-wider">
                Sessão ativa
              </span>
              {activeSessions.map((s) => (
                <WorkoutCard
                  key={s.id}
                  session={s}
                  onPress={() => navigate(`/workout/execute/${s.id}`)}
                />
              ))}
              {otherSessions.length > 0 && (
                <div className="h-px bg-gj-border my-1" />
              )}
            </>
          )}

          {/* demais treinos */}
          {otherSessions.length > 0 && (
            <>
              <span className="text-[10px] font-semibold text-gj-text-secondary uppercase tracking-wider">
                Meus treinos
              </span>
              {otherSessions.map((s) => (
                <WorkoutCard
                  key={s.id}
                  session={s}
                  onPress={() => navigate(`/workouts/${s.id}`)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

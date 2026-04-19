import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '../../../store/authStore'
import { Card } from '../../../components/ui'
import {
  Bell,
  TrendingUp,
  Flame,
  Target,
  Timer,
  Dumbbell,
  ChevronRight,
  Moon,
  Play,
} from 'lucide-react'

// tipos para os 3 estados da Home
type HomeState = 'default' | 'in-progress' | 'rest-day'

// mock: trocar por store real nas próximas etapas
const MOCK_HOME_STATE = 'default' as HomeState

const WEEKLY_DATA = [
  { day: 'Seg', sets: 18, active: true },
  { day: 'Ter', sets: 24, active: true },
  { day: 'Qua', sets: 0, active: false },
  { day: 'Qui', sets: 15, active: true },
  { day: 'Sex', sets: 0, active: false },
  { day: 'Sáb', sets: 20, active: true },
  { day: 'Dom', sets: 0, active: false },
]

const MAX_SETS = Math.max(...WEEKLY_DATA.map((d) => d.sets), 1)

export const HomePage = () => {
  const dateString = useMemo(() => {
    const now = new Date()
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const weekNum = Math.ceil(
      (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
    )
    return `${weekDays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} • Semana ${weekNum}`
  }, [])

  return (
    <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-white leading-[1.4]">Início</h1>
          <p className="text-xs text-gj-text-secondary leading-[1.33]">{dateString}</p>
        </div>
        <button
          className="w-10 h-10 rounded-gj-lg bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary hover:text-white transition-colors cursor-pointer"
          aria-label="Notificações"
        >
          <Bell size={18} />
        </button>
      </div>

      {/* ===== WEEKLY STATS CARD ===== */}
      <div
        className="rounded-gj-lg border border-gj-border p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #141824 0%, #161A27 20%, #181D2A 40%, #1A1F2D 60%, #1C2230 80%, #1E2433 100%)',
        }}
      >
        {/* top row: label + value + flame icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gj-text-secondary leading-[1.33]">
              Séries Semanais
            </span>
            <span className="text-4xl font-bold text-white leading-none">92</span>
          </div>
          <div className="w-12 h-12 rounded-gj-lg bg-gj-accent-soft flex items-center justify-center">
            <Flame size={24} className="text-gj-accent" />
          </div>
        </div>

        {/* separator */}
        <div className="h-px bg-gj-border mb-4" />

        {/* 3-column stats */}
        <div className="flex items-start">
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <span className="text-xl font-bold text-white leading-[1.4]">4</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">Sessões</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5 border-x border-gj-border px-0.5">
            <span className="text-xl font-bold text-white leading-[1.4]">4:32</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">Tempo</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <span className="text-xl font-bold text-white leading-[1.4]">8.4t</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">Carga total</span>
          </div>
        </div>

        {/* trend */}
        <div className="flex items-center justify-center gap-1 mt-3">
          <span className="text-[10px] text-gj-text-secondary">+12% vs semana anterior</span>
          <TrendingUp size={12} className="text-gj-text-secondary" />
        </div>
      </div>

      {/* ===== MINI STAT CARDS ===== */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-center gap-3 !p-3.5">
          <div className="w-10 h-10 rounded-gj-lg bg-gj-accent-soft flex items-center justify-center shrink-0">
            <Target size={20} className="text-gj-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-tight">4</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">Dias ativos</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-3.5">
          <div className="w-10 h-10 rounded-gj-lg bg-gj-success-soft flex items-center justify-center shrink-0">
            <TrendingUp size={20} className="text-gj-success" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-tight">80%</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">Consistência</span>
          </div>
        </Card>
      </div>

      {/* ===== BAR CHART ===== */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white leading-[1.43]">Séries por dia</span>
          <TrendingUp size={16} className="text-gj-text-secondary" />
        </div>
        <span className="text-[10px] text-gj-text-secondary leading-[1.5] block mb-3">Semana atual</span>

        <div className="flex items-end justify-between gap-1.5 h-[100px]">
          {WEEKLY_DATA.map((d) => {
            const heightPct = d.sets > 0 ? Math.max((d.sets / MAX_SETS) * 100, 10) : 8
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <div
                    className={`w-full max-w-[28px] rounded-gj-sm transition-all duration-500 ${
                      d.active ? 'bg-gj-accent' : 'bg-gj-surface-elevated'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{d.day}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ===== NEXT SESSION ===== */}
      {MOCK_HOME_STATE === 'default' && <NextSessionDefault />}
      {MOCK_HOME_STATE === 'in-progress' && <NextSessionInProgress />}
      {MOCK_HOME_STATE === 'rest-day' && <NextSessionRestDay />}
    </div>
  )
}

/* ---------- Estado padrão ---------- */
const NextSessionDefault = () => {
  const navigate = useNavigate()

  return (
    <Card>
      <span className="text-[10px] font-normal text-gj-text-secondary leading-[1.5] tracking-wider uppercase">
        Próxima sessão
      </span>

      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white leading-[1.5]">
            Treino A — Push
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gj-text-secondary">
            <Dumbbell size={12} />
            <span>5 exercícios • ~55 min</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/workout/execute/1')}
          className="h-9 px-4 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
        >
          <Play size={14} fill="white" />
          Iniciar
        </button>
      </div>
    </Card>
  )
}

/* ---------- Treino em andamento ---------- */
const NextSessionInProgress = () => {
  const navigate = useNavigate()

  return (
    <Card className="!border-gj-accent/30">
      <span className="text-[10px] font-semibold text-gj-accent leading-[1.5] tracking-wider uppercase">
        Em andamento
      </span>

      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white leading-[1.5]">
            Treino A — Push
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gj-text-secondary">
            <Timer size={12} />
            <span>23:45 • 2/5 exercícios</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/workout/execute/1')}
          className="h-9 px-4 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
        >
          Continuar
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  )
}

/* ---------- Dia de descanso ---------- */
const NextSessionRestDay = () => {
  const navigate = useNavigate()

  return (
    <Card>
      <span className="text-[10px] font-normal text-gj-text-secondary leading-[1.5] tracking-wider uppercase">
        Próxima sessão
      </span>

      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-white leading-[1.5]">
            Dia de descanso
          </span>
          <span className="text-xs text-gj-text-secondary">
            Próximo: Treino B — Pull (amanhã)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gj-accent-soft flex items-center justify-center">
            <Moon size={16} className="text-gj-accent" />
          </div>
          <button
            onClick={() => navigate('/workouts')}
            className="h-9 px-4 rounded-gj-lg bg-gj-surface-elevated border border-gj-border text-gj-text-secondary text-xs font-semibold hover:text-white transition-colors cursor-pointer"
          >
            Ver próximo
          </button>
        </div>
      </div>
    </Card>
  )
}

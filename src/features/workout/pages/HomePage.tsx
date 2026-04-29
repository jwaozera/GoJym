import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../../store/workoutStore'
import { Card } from '../../../components/ui'
import { CalendarSheet } from '../components/CalendarSheet'
import { WeeklySeriesSheet } from '../components/WeeklySeriesSheet'
import { DailySeriesSheet } from '../components/DailySeriesSheet'
import {
  Calendar,
  TrendingUp,
  Flame,
  Timer,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Equal,
} from 'lucide-react'

/* ====== Mock data ====== */
const WEEKLY_DATA = [
  { day: 'Seg', sets: 10, active: true },
  { day: 'Ter', sets: 14, active: true },
  { day: 'Qua', sets: 0, active: false },
  { day: 'Qui', sets: 21, active: true },
  { day: 'Sex', sets: 17, active: true },
  { day: 'Sáb', sets: 12, active: true },
  { day: 'Dom', sets: 0, active: false },
]

const WEEKLY_DATA_PREV = [
  { day: 'Seg', sets: 16, active: true },
  { day: 'Ter', sets: 20, active: true },
  { day: 'Qua', sets: 12, active: true },
  { day: 'Qui', sets: 0, active: false },
  { day: 'Sex', sets: 18, active: true },
  { day: 'Sáb', sets: 0, active: false },
  { day: 'Dom', sets: 0, active: false },
]

const WEEKLY_STATS = {
  totalSeries: 92,
  totalSessions: 4,
  totalWeight: '8.4t',
  totalTime: '4h 32min',
  activeDays: 4,
  avgSeriesPerSession: 23,
  mostFrequentWorkout: 'Treino A — Push',
}

type ComparisonState = 'up' | 'down' | 'equal'

/* submetrica de trends (Sessões, Tempo, Carga total) */
const SUB_TRENDS: { label: string; value: string; comparison: ComparisonState }[] = [
  { label: 'Sessões', value: '4', comparison: 'down' },
  { label: 'Tempo', value: '4:32', comparison: 'up' },
  { label: 'Carga total', value: '8.4t', comparison: 'equal' },
]

const comparisonIconStyles: Record<ComparisonState, string> = {
  up: 'bg-[#1E2433] text-[#D1D5DB] border border-[#2A3142]',
  down: 'bg-[#1E2433] text-[#D1D5DB] border border-[#2A3142]',
  equal: 'bg-[#1E2433] text-[#D1D5DB] border border-[#2A3142]',
}

const ComparisonIcon = ({ state, size = 'sm' }: { state: ComparisonState; size?: 'sm' | 'md' }) => {
  const Icon = state === 'up' ? ArrowUp : state === 'down' ? ArrowDown : Equal
  const boxSize = size === 'md' ? 'w-6 h-[21px]' : 'w-6 h-[21px]'
  const iconSize = size === 'md' ? 13 : 12

  return (
    <div className={`${boxSize} rounded-full flex shrink-0 items-center justify-center self-center ${comparisonIconStyles[state]}`}>
      <Icon size={iconSize} strokeWidth={3} />
    </div>
  )
}

export const HomePage = () => {
  const navigate = useNavigate()
  const { activeExecution, clearActiveExecution, fetchSessions } = useWorkoutStore()

  const [showCalendar, setShowCalendar] = useState(false)
  const [showWeeklySheet, setShowWeeklySheet] = useState(false)
  const [showDailySheet, setShowDailySheet] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous'>('current')

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // auto descartar sessões (mais de 24h)
  useEffect(() => {
    if (activeExecution) {
      const started = new Date(activeExecution.startedAt).getTime()
      const now = Date.now()
      if (now - started > 24 * 60 * 60 * 1000) {
        clearActiveExecution()
      }
    }
  }, [activeExecution, clearActiveExecution])

  const dateString = useMemo(() => {
    const now = new Date()
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${weekDays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`
  }, [])

  // streak (mock: 21 semanas)
  const streakWeeks = 21

  // dados do grafico baseado na semana atual/passada
  const chartData = selectedWeek === 'current' ? WEEKLY_DATA : WEEKLY_DATA_PREV
  const maxSets = Math.max(...chartData.map((d) => d.sets), 1)

  return (
    <div className="mx-auto flex w-full max-w-[393px] flex-col gap-3 px-5 pt-14 pb-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-white leading-[1.4]">Início</h1>
          <p className="text-xs text-gj-text-secondary leading-[1.33]">{dateString}</p>
        </div>
        <button
          onClick={() => setShowCalendar(true)}
          className="w-10 h-10 rounded-gj-lg bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary hover:text-white hover:border-white/40 transition-colors cursor-pointer"
          aria-label="Calendário"
        >
          <Calendar size={18} />
        </button>
      </div>

      {/* ===== STATS SEMANAIS CARD (clicável) ===== */}
      <button
        onClick={() => setShowWeeklySheet(true)}
        className="h-[170px] rounded-gj-lg border border-gj-border bg-gj-surface relative overflow-hidden text-left w-full cursor-pointer hover:border-gj-accent/40 focus-visible:border-gj-accent/40 transition-colors"
      >
        <div className="absolute left-4 top-[14px] flex h-[21px] items-center rounded-full bg-white/[0.05] px-2">
          <span className="text-[10px] text-gj-text-secondary leading-[15px]">semana atual</span>
        </div>

        {/* Row 3: 3-column sub-metrics */}
        <div className="absolute left-3 top-14 flex h-[43px] w-[327px] items-start">
          {SUB_TRENDS.map((metric, i) => (
            <div
              key={metric.label}
              className={`flex-1 flex flex-col items-center gap-0 ${
                i === 1 ? 'border-x border-gj-border' : ''
              }`}
            >
              <div className="flex h-7 items-center justify-center gap-1.5">
                <span className="text-xl font-bold text-white leading-7">{metric.value}</span>
                <ComparisonIcon state={metric.comparison} />
              </div>
              <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="absolute left-[22px] top-[117px] h-px w-[309px] bg-gj-border" />

        <div className="absolute left-[21px] top-[132px] flex w-[309px] justify-center">
          <span className="text-center text-[11px] text-[#6b7280] leading-[16.5px] tracking-[0.2px]">
            comparação semana atual × semana passada
          </span>
        </div>
      </button>

      {/* ===== STREAK CARD ===== */}
      <Card className="!p-0 h-[129px] overflow-hidden relative">
        <div className="absolute left-[26px] top-[34px] w-14 h-14 rounded-gj-lg bg-gj-accent-soft flex items-center justify-center">
          <Flame size={29} className="text-gj-accent" />
        </div>
        <div className="absolute left-[98px] top-[33px] h-[55px] w-[181px]">
          <span className="absolute left-0 top-2 text-2xl font-bold text-white leading-9">{streakWeeks}</span>
          <span className="absolute left-[31px] top-[21px] text-[13px] font-semibold text-gj-accent leading-[19.5px]">semanas</span>
          <span className="absolute left-0 top-[39px] text-[11px] text-gj-text-secondary leading-4">Streak de semanas ativas</span>
        </div>
        <div className="absolute left-[98px] top-[97px] h-px w-[226px] bg-gj-border" />
      </Card>

      {/* ===== BAR CHART (clicável) ===== */}
      <button
        onClick={() => setShowDailySheet(true)}
        className="h-[199px] rounded-gj-lg bg-gj-surface border border-gj-border p-4 text-left w-full cursor-pointer hover:border-gj-accent/40 focus-visible:border-gj-accent/40 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white leading-[1.43]">Séries por dia</span>
          <TrendingUp size={16} className="text-gj-text-secondary" />
        </div>
        <span className="text-xs text-gj-text-secondary leading-[1.25] block mb-[23px]">
          {selectedWeek === 'current' ? 'Semana atual' : 'Semana passada'}
        </span>

        <div className="flex items-end justify-between h-[102px]">
          {chartData.map((d) => {
            const heightPx = d.sets > 0 ? Math.min(Math.round(16 + (d.sets / maxSets) * 48), 64) : 8
            return (
              <div key={d.day} className="flex w-[34.375px] flex-col items-center gap-1">
                {d.sets > 0 ? (
                  <span className="h-[15px] text-[10px] text-gj-text-secondary leading-[1.5]">
                    {d.sets}
                  </span>
                ) : (
                  <span className="h-[15px]" />
                )}
                <div className="w-[34.375px] flex items-end justify-center px-[3px]" style={{ height: '64px' }}>
                  <div
                    className="w-full max-w-[28px] transition-all duration-500"
                    style={{
                      height: `${heightPx}px`,
                      borderRadius: '10px',
                      background: d.active
                        ? 'linear-gradient(0deg, #FF6B35 0%, #FF8F5E 100%)'
                        : '#1E2433',
                    }}
                  />
                </div>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{d.day}</span>
              </div>
            )
          })}
        </div>
      </button>

      {/* ===== EM PROGRESSO SESSION (real) ===== */}
      {activeExecution && (
        <Card>
          <span className="text-[10px] font-semibold text-gj-accent leading-[1.5] tracking-wider uppercase">
            Em andamento
          </span>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-white leading-[1.5]">
                {activeExecution.sessionName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gj-text-secondary">
                <Timer size={12} />
                <span>
                  {Math.floor((Date.now() - new Date(activeExecution.startedAt).getTime()) / 60000)}min • {activeExecution.completedSets}/{activeExecution.totalSets} séries
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/workout/execute/${activeExecution.sessionId}`)}
              className="h-9 px-4 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
            >
              Continuar
              <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      )}

      {/* ===== SHEETS ===== */}
      <CalendarSheet isOpen={showCalendar} onClose={() => setShowCalendar(false)} />

      <WeeklySeriesSheet
        isOpen={showWeeklySheet}
        onClose={() => setShowWeeklySheet(false)}
        data={WEEKLY_STATS}
      />

      <DailySeriesSheet
        isOpen={showDailySheet}
        onClose={() => setShowDailySheet(false)}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />
    </div>
  )
}

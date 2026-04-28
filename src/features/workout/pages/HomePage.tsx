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
  TrendingDown,
  Flame,
  Timer,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Equal,
} from 'lucide-react'

/* ====== Mock data ====== */
const WEEKLY_DATA = [
  { day: 'Seg', sets: 18, active: true },
  { day: 'Ter', sets: 24, active: true },
  { day: 'Qua', sets: 0, active: false },
  { day: 'Qui', sets: 15, active: true },
  { day: 'Sex', sets: 0, active: false },
  { day: 'Sáb', sets: 20, active: true },
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

const TREND = { value: 12, positive: true } // +12%

/* submetrica de trends (Sessões, Tempo, Carga total) */
const SUB_TRENDS: { label: string; value: string; trend: 'down' | 'up' | 'neutral' }[] = [
  { label: 'Sessões', value: '4', trend: 'down' },
  { label: 'Tempo', value: '4:32', trend: 'down' },
  { label: 'Carga total', value: '8.4t', trend: 'neutral' },
]

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
    const weekNum = Math.ceil(
      (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
    )
    return `${weekDays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} • Semana ${weekNum}`
  }, [])

  // streak (mock: 21 semanas)
  const streakWeeks = 21

  // dados do grafico baseado na semana atual/passada
  const chartData = selectedWeek === 'current' ? WEEKLY_DATA : WEEKLY_DATA_PREV
  const maxSets = Math.max(...chartData.map((d) => d.sets), 1)

  return (
    <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-white leading-[1.4]">Início</h1>
          <p className="text-xs text-gj-text-secondary leading-[1.33]">{dateString}</p>
        </div>
        <button
          onClick={() => setShowCalendar(true)}
          className="w-10 h-10 rounded-gj-lg bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary hover:text-white transition-colors cursor-pointer"
          aria-label="Calendário"
        >
          <Calendar size={18} />
        </button>
      </div>

      {/* ===== STATS SEMANAIS CARD (clicável) ===== */}
      <button
        onClick={() => setShowWeeklySheet(true)}
        className="rounded-gj-lg border border-gj-border p-5 relative overflow-hidden text-left w-full cursor-pointer hover:border-gj-accent/30 transition-colors"
        style={{
          background: 'linear-gradient(135deg, #141824 0%, #161A27 20%, #181D2A 40%, #1A1F2D 60%, #1C2230 80%, #1E2433 100%)',
        }}
      >
        {/* Row 1: Title + badge + chart icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white leading-[1.43]">Séries Semanais</span>
            <span className="text-[10px] text-gj-text-secondary leading-[1.5]">semana atual</span>
          </div>
          <div className="w-10 h-10 rounded-gj-md bg-gj-accent-soft flex items-center justify-center">
            <TrendingUp size={20} className="text-gj-accent" />
          </div>
        </div>

        {/* Row 2: Big number + trend arrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-4xl font-bold text-white leading-none">
            {WEEKLY_STATS.totalSeries}
          </span>
          <div className="w-5 h-5 rounded-full bg-gj-success/20 flex items-center justify-center">
            <ArrowUp size={12} className="text-gj-success" strokeWidth={3} />
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gj-border mb-4" />

        {/* Row 3: 3-column sub-metrics */}
        <div className="flex items-start">
          {SUB_TRENDS.map((metric, i) => (
            <div
              key={metric.label}
              className={`flex-1 flex flex-col items-center gap-0.5 ${
                i === 1 ? 'border-x border-gj-border' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white leading-[1.4]">{metric.value}</span>
                {metric.trend === 'down' && (
                  <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <ArrowDown size={10} className="text-red-400" strokeWidth={3} />
                  </div>
                )}
                {metric.trend === 'up' && (
                  <div className="w-4 h-4 rounded-full bg-gj-success/20 flex items-center justify-center">
                    <ArrowUp size={10} className="text-gj-success" strokeWidth={3} />
                  </div>
                )}
                {metric.trend === 'neutral' && (
                  <div className="w-4 h-4 rounded-full bg-gj-text-secondary/20 flex items-center justify-center">
                    <Equal size={10} className="text-gj-text-secondary" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Row 4: Comparison footer */}
        <div className="flex items-center justify-center mt-4">
          <span className="text-[10px] text-gj-accent leading-[1.5]">
            comparação semana atual × semana passada
          </span>
        </div>
      </button>

      {/* ===== STREAK CARD ===== */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center gap-5 p-5">
          {/* Fire icon */}
          <div className="w-14 h-14 rounded-gj-lg bg-gj-accent-soft flex items-center justify-center shrink-0">
            <Flame size={26} className="text-gj-accent" />
          </div>
          {/* Text block */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-bold text-white leading-none">{streakWeeks}</span>
              <span className="text-[13px] font-semibold text-gj-accent leading-[1.5]">semanas</span>
            </div>
            <span className="text-xs text-gj-text-secondary mt-1">Streak de semanas ativas</span>
          </div>
        </div>
        {/* Divider at bottom */}
        <div className="h-px bg-gj-border mx-5" />
      </Card>

      {/* ===== BAR CHART (clicável) ===== */}
      <button
        onClick={() => setShowDailySheet(true)}
        className="rounded-gj-lg bg-gj-surface border border-gj-border p-4 text-left w-full cursor-pointer hover:border-gj-accent/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white leading-[1.43]">Séries por dia</span>
          <TrendingUp size={16} className="text-gj-text-secondary" />
        </div>
        <span className="text-[10px] text-gj-text-secondary leading-[1.5] block mb-3">
          {selectedWeek === 'current' ? 'Semana atual' : 'Semana passada'}
        </span>

        <div className="flex items-end justify-between gap-1.5 h-[100px]">
          {chartData.map((d) => {
            const heightPct = d.sets > 0 ? Math.max((d.sets / maxSets) * 100, 10) : 8
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <div
                    className="w-full max-w-[28px] transition-all duration-500"
                    style={{
                      height: `${heightPct}%`,
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
        <Card className="!border-gj-accent/30">
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

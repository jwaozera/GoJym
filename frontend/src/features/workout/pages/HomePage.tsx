import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../../store/workoutStore'
import { workoutService } from '../../../services/workoutService'
import type { WeekStats } from '../../../services/workoutApiService'
import { Card } from '../../../components/ui'
import { CalendarSheet } from '../components/CalendarSheet'
import { WeeklySeriesSheet } from '../components/WeeklySeriesSheet'
import { DailySeriesSheet } from '../components/DailySeriesSheet'
import { DATA_SOURCE } from '../../../services/api'
import {
  WEEKLY_DATA as MOCK_WEEKLY_DATA,
  WEEKLY_DATA_PREV as MOCK_WEEKLY_DATA_PREV,
  WEEKLY_STATS as MOCK_WEEKLY_STATS,
  STREAK_WEEKS as MOCK_STREAK_WEEKS,
} from '../../../mocks/data'
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

/* ====== API mode: neutral week data (empty) ====== */
/* ====== Mock mode: pre-loaded Vercel preview data ====== */
const WEEKLY_DATA = DATA_SOURCE === 'mock' ? MOCK_WEEKLY_DATA : [
  { day: 'Seg', sets: 0, active: false },
  { day: 'Ter', sets: 0, active: false },
  { day: 'Qua', sets: 0, active: false },
  { day: 'Qui', sets: 0, active: false },
  { day: 'Sex', sets: 0, active: false },
  { day: 'Sáb', sets: 0, active: false },
  { day: 'Dom', sets: 0, active: false },
]

const WEEKLY_DATA_PREV = DATA_SOURCE === 'mock' ? MOCK_WEEKLY_DATA_PREV : [
  { day: 'Seg', sets: 0, active: false },
  { day: 'Ter', sets: 0, active: false },
  { day: 'Qua', sets: 0, active: false },
  { day: 'Qui', sets: 0, active: false },
  { day: 'Sex', sets: 0, active: false },
  { day: 'Sáb', sets: 0, active: false },
  { day: 'Dom', sets: 0, active: false },
]

const WEEKLY_STATS = DATA_SOURCE === 'mock' ? MOCK_WEEKLY_STATS : {
  totalSeries: 0,
  totalSessions: 0,
  totalWeight: '0t',
  totalTime: '0h 0min',
  activeDays: 0,
  avgSeriesPerSession: 0,
  mostFrequentWorkout: '',
}

type WeeklyStatsDisplay = typeof WEEKLY_STATS

const EMPTY_WEEK_STATS: WeekStats = {
  totalSessions: 0,
  totalWeight: 0,
  totalTime: 0,
  totalSeries: 0,
  avgSeriesPerSession: 0,
  activeDays: 0,
}

const STREAK_WEEKS = DATA_SOURCE === 'mock' ? MOCK_STREAK_WEEKS : 0

type ComparisonState = 'up' | 'down' | 'equal'

/* submetrica de trends (Sessões, Tempo, Carga total) */
const MOCK_SUB_TRENDS: { label: string; value: string; comparison: ComparisonState }[] = DATA_SOURCE === 'mock' ? [
  { label: 'Sessões', value: '4', comparison: 'down' },
  { label: 'Tempo', value: '4:32', comparison: 'up' },
  { label: 'Carga total', value: '8.4t', comparison: 'equal' },
] : [
  { label: 'Sessões', value: '0', comparison: 'equal' },
  { label: 'Tempo', value: '0', comparison: 'equal' },
  { label: 'Carga total', value: '0', comparison: 'equal' },
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

const getDateParts = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
})

const compareMetric = (current: number, previous: number): ComparisonState => {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'equal'
}

const formatDurationShort = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

const formatDurationLong = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  return `${hours}h ${minutes}min`
}

const formatWeight = (weight: number) => {
  const safeWeight = Math.max(0, weight)
  if (safeWeight >= 1000) return `${(safeWeight / 1000).toFixed(1)}t`
  return `${Math.round(safeWeight)}kg`
}

const toWeeklyStatsDisplay = (stats: WeekStats): WeeklyStatsDisplay => ({
  totalSeries: stats.totalSeries,
  totalSessions: stats.totalSessions,
  totalWeight: formatWeight(stats.totalWeight),
  totalTime: formatDurationLong(stats.totalTime),
  activeDays: stats.activeDays,
  avgSeriesPerSession: Number(stats.avgSeriesPerSession.toFixed(1)),
  mostFrequentWorkout: '',
})

export const HomePage = () => {
  const navigate = useNavigate()
  const { activeExecution, clearActiveExecution, fetchSessions } = useWorkoutStore()

  const [showCalendar, setShowCalendar] = useState(false)
  const [showWeeklySheet, setShowWeeklySheet] = useState(false)
  const [showDailySheet, setShowDailySheet] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous'>('current')
  const [currentWeekSeries, setCurrentWeekSeries] = useState(WEEKLY_DATA)
  const [previousWeekSeries, setPreviousWeekSeries] = useState(WEEKLY_DATA_PREV)
  const [currentWeekStats, setCurrentWeekStats] = useState<WeekStats>(EMPTY_WEEK_STATS)
  const [previousWeekStats, setPreviousWeekStats] = useState<WeekStats>(EMPTY_WEEK_STATS)
  const [streakWeeks, setStreakWeeks] = useState(STREAK_WEEKS)

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  useEffect(() => {
    let cancelled = false

    const loadHomeData = async () => {
      const today = new Date()
      const previousWeek = new Date(today)
      previousWeek.setDate(today.getDate() - 7)

      const currentDate = getDateParts(today)
      const previousDate = getDateParts(previousWeek)

      const [
        currentSeries,
        previousSeries,
        currentStats,
        previousStats,
        weeklyStreak,
      ] = await Promise.all([
        workoutService.getLastWeekSeries({ semanaPassada: false }),
        workoutService.getLastWeekSeries({ semanaPassada: true }),
        workoutService.getWeekStats(currentDate.year, currentDate.month, currentDate.day),
        workoutService.getWeekStats(previousDate.year, previousDate.month, previousDate.day),
        workoutService.getWeeklyStreak(currentDate.year, currentDate.month, currentDate.day),
      ])

      if (!cancelled) {
        setCurrentWeekSeries(currentSeries)
        setPreviousWeekSeries(previousSeries)
        setCurrentWeekStats(currentStats)
        setPreviousWeekStats(previousStats)
        setStreakWeeks(weeklyStreak)
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

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

  // dados do grafico baseado na semana atual/passada
  const chartData = selectedWeek === 'current' ? currentWeekSeries : previousWeekSeries
  const maxSets = Math.max(...chartData.map((d) => d.sets), 1)
  const weeklyStats = useMemo<WeeklyStatsDisplay>(() => {
    if (DATA_SOURCE === 'mock') return WEEKLY_STATS
    return toWeeklyStatsDisplay(currentWeekStats)
  }, [currentWeekStats])

  const subTrends = useMemo(() => {
    if (DATA_SOURCE === 'mock') return MOCK_SUB_TRENDS

    return [
      {
        label: 'Sessões',
        value: String(currentWeekStats.totalSessions),
        comparison: compareMetric(currentWeekStats.totalSessions, previousWeekStats.totalSessions),
      },
      {
        label: 'Tempo',
        value: formatDurationShort(currentWeekStats.totalTime),
        comparison: compareMetric(currentWeekStats.totalTime, previousWeekStats.totalTime),
      },
      {
        label: 'Carga total',
        value: formatWeight(currentWeekStats.totalWeight),
        comparison: compareMetric(currentWeekStats.totalWeight, previousWeekStats.totalWeight),
      },
    ]
  }, [currentWeekStats, previousWeekStats])

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
          {subTrends.map((metric, i) => (
            <div
              key={metric.label}
              className={`flex-1 flex flex-col items-center gap-0 ${i === 1 ? 'border-x border-gj-border' : ''
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
        data={weeklyStats}
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

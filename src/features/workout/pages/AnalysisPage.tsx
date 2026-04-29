import { useMemo, useState } from 'react'
import { BarChart3, Check, ChevronDown, Medal, Search } from 'lucide-react'
import { Card } from '../../../components/ui'

type PeriodOption = 'Últimas 4 semanas' | 'Últimas 8 semanas' | 'Últimas 12 semanas' | 'Este mês'

interface ExerciseAnalysis {
  name: string
  category: string
  maxLoads: number[]
}

const periodOptions: PeriodOption[] = ['Últimas 4 semanas', 'Últimas 8 semanas', 'Últimas 12 semanas', 'Este mês']

const demoAnalysisConfig: { state: 'normal' | 'insufficient' | 'empty' } = {
  state: 'normal',
}

const exerciseOptions: ExerciseAnalysis[] = [
  { name: 'Supino reto', category: 'Peito', maxLoads: [60, 65, 62, 70, 72, 75, 78, 80, 82, 84, 86, 88] },
  { name: 'Desenvolvimento militar', category: 'Ombro', maxLoads: [30, 31, 32, 33, 34, 35, 36, 36, 37, 38, 39, 40] },
  { name: 'Tríceps corda', category: 'Tríceps', maxLoads: [25, 26, 26, 28, 29, 30, 31, 32, 32, 34, 35, 36] },
  { name: 'Puxada frente', category: 'Costas', maxLoads: [55, 56, 58, 60, 62, 63, 64, 66, 67, 68, 70, 72] },
]

const rhythmByWeek = [72, 85, 68, 80, 92, 88, 95, 102, 97, 108, 112, 118]

const periodMeta: Record<PeriodOption, { start: number; count: number; availableWeeks: number; sessions: number; minutes: number; totalLoad: number; activeDays: number; longestSession: number }> = {
  'Últimas 4 semanas': { start: 4, count: 4, availableWeeks: 4, sessions: 16, minutes: 780, totalLoad: 34.6, activeDays: 14, longestSession: 68 },
  'Últimas 8 semanas': { start: 0, count: 8, availableWeeks: 8, sessions: 32, minutes: 1574, totalLoad: 67.2, activeDays: 28, longestSession: 72 },
  'Últimas 12 semanas': { start: 0, count: 12, availableWeeks: 12, sessions: 48, minutes: 2388, totalLoad: 105.8, activeDays: 41, longestSession: 76 },
  'Este mês': { start: 8, count: 4, availableWeeks: 4, sessions: 17, minutes: 828, totalLoad: 38.6, activeDays: 15, longestSession: 76 },
}

const formatDuration = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}min`

const getPeriodValues = (values: number[], period: PeriodOption) => {
  const meta = periodMeta[period]
  const sliced = values.slice(meta.start, meta.start + meta.availableWeeks)

  if (period !== 'Últimas 12 semanas') {
    return sliced.map((value, index) => ({ label: `S${index + 1}`, value }))
  }

  return [0, 1, 2].map((monthIndex) => {
    const chunk = values.slice(monthIndex * 4, monthIndex * 4 + 4)
    return {
      label: `M${monthIndex + 1}`,
      value: Math.max(...chunk),
    }
  })
}

const getRhythmData = (period: PeriodOption) => {
  const meta = periodMeta[period]
  const sliced = rhythmByWeek.slice(meta.start, meta.start + meta.availableWeeks)

  if (period !== 'Últimas 12 semanas') {
    return sliced.map((sets, index) => ({ label: `S${index + 1}`, sets }))
  }

  return [0, 1, 2].map((monthIndex) => {
    const chunk = rhythmByWeek.slice(monthIndex * 4, monthIndex * 4 + 4)
    return {
      label: `M${monthIndex + 1}`,
      sets: chunk.reduce((total, sets) => total + sets, 0),
    }
  })
}

const getSummaryRows = (period: PeriodOption) => {
  const meta = periodMeta[period]
  const totalSets = getRhythmData(period).reduce((total, item) => total + item.sets, 0)
  const averageSets = meta.sessions > 0 ? totalSets / meta.sessions : 0

  return [
    { label: 'Sessões', value: String(meta.sessions) },
    { label: 'Tempo total', value: formatDuration(meta.minutes) },
    { label: 'Carga total', value: `${meta.totalLoad.toFixed(1)}t` },
    { label: 'Dias ativos', value: String(meta.activeDays) },
    { label: 'Média séries/sessão', value: averageSets.toFixed(1) },
    { label: 'Sessão mais longa', value: formatDuration(meta.longestSession) },
  ]
}

const getAnalysisStatus = (period: PeriodOption) => {
  if (demoAnalysisConfig.state === 'insufficient') return 'insufficient'
  if (demoAnalysisConfig.state === 'empty') return 'empty'

  const meta = periodMeta[period]
  if (meta.sessions === 0) return 'empty'
  if (meta.availableWeeks < 3) return 'insufficient'
  return 'ready'
}

const getEvolutionMetrics = (exercise: ExerciseAnalysis, period: PeriodOption) => {
  const data = getPeriodValues(exercise.maxLoads, period)
  const first = data[0]?.value ?? 0
  const last = data[data.length - 1]?.value ?? first
  const progress = first > 0 ? Math.round(((last - first) / first) * 100) : 0

  return {
    data,
    first,
    last,
    progress,
    range: `${first}kg → ${last}kg`,
  }
}

const getHighlights = (period: PeriodOption) =>
  exerciseOptions
    .map((exercise) => {
      const metrics = getEvolutionMetrics(exercise, period)
      return {
        name: exercise.name,
        range: metrics.range,
        progress: `+${metrics.progress}%`,
        progressValue: metrics.progress,
      }
    })
    .sort((a, b) => b.progressValue - a.progressValue)
    .slice(0, 3)

export const AnalysisPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Últimas 8 semanas')
  const [selectedExercise, setSelectedExercise] = useState(exerciseOptions[0])
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [showPeriodSheet, setShowPeriodSheet] = useState(false)
  const [showExerciseSheet, setShowExerciseSheet] = useState(false)
  const [showSummarySheet, setShowSummarySheet] = useState(false)

  const filteredExercises = useMemo(() => {
    const query = exerciseSearch.trim().toLowerCase()
    if (!query) return exerciseOptions
    return exerciseOptions.filter((exercise) =>
      `${exercise.name} ${exercise.category}`.toLowerCase().includes(query)
    )
  }, [exerciseSearch])

  const evolutionMetrics = useMemo(
    () => getEvolutionMetrics(selectedExercise, selectedPeriod),
    [selectedExercise, selectedPeriod]
  )
  const rhythmData = useMemo(() => getRhythmData(selectedPeriod), [selectedPeriod])
  const summaryRows = useMemo(() => getSummaryRows(selectedPeriod), [selectedPeriod])
  const highlights = useMemo(() => getHighlights(selectedPeriod), [selectedPeriod])
  const analysisStatus = useMemo(() => getAnalysisStatus(selectedPeriod), [selectedPeriod])
  const maxSets = Math.max(...rhythmData.map((item) => item.sets), 1)

  const evolutionValues = evolutionMetrics.data.map((point) => point.value)
  const minEvolutionValue = evolutionValues.length > 0 ? Math.min(...evolutionValues) : 0
  const maxEvolutionValue = evolutionValues.length > 0 ? Math.max(...evolutionValues) : 0
  const evolutionRange = Math.max(maxEvolutionValue - minEvolutionValue, 1)
  const xStep = evolutionMetrics.data.length > 1 ? 264 / (evolutionMetrics.data.length - 1) : 0

  const linePath = evolutionMetrics.data
    .map((point, index) => {
      const x = 18 + index * xStep
      const y = 100 - ((point.value - minEvolutionValue) / evolutionRange) * 80
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white leading-[1.4]">Análise</h1>
        <button
          type="button"
          onClick={() => setShowPeriodSheet(true)}
          className="h-10 px-3 rounded-gj-lg bg-gj-surface-elevated border border-gj-border flex items-center gap-1.5 text-white hover:border-white/30 hover:bg-white/5 focus:border-white/30 focus-visible:outline-white/40 transition-colors cursor-pointer"
          aria-label="Selecionar período"
        >
          <span className="text-xs font-semibold leading-[1.33]">{selectedPeriod}</span>
          <ChevronDown size={14} className="text-gj-text-secondary" />
        </button>
      </div>

      {analysisStatus === 'empty' ? (
        <Card className="!p-6 min-h-[360px] flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-gj-lg bg-gj-surface-elevated">
            <BarChart3 size={22} className="text-gj-text-secondary" />
          </div>
          <h2 className="text-base font-semibold text-white leading-[1.5]">Sem dados de análise</h2>
          <p className="mt-2 max-w-[260px] text-sm text-gj-text-secondary leading-[1.43]">
            Conclua pelo menos uma sessão para ver suas métricas de evolução.
          </p>
        </Card>
      ) : analysisStatus === 'insufficient' ? (
        <>
          <Card className="!p-4 h-[240px] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white leading-[1.43]">Dados insuficientes</h2>
              <p className="mt-1 text-[10px] text-gj-text-secondary leading-[1.5]">
                Poucos dados para mostrar tendências neste período.
              </p>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-gj-lg bg-gj-bg/50 px-6 text-center">
              <p className="text-sm text-gj-text-secondary leading-[1.43]">
                Registre mais sessões de {selectedExercise.name.toLowerCase()} para acompanhar a evolução de carga.
              </p>
            </div>
            <div className="text-[10px] text-gj-text-secondary leading-[1.5]">
              {evolutionMetrics.data.length} ponto(s) disponível(is)
            </div>
          </Card>

          <Card className="!p-4 h-[194px] flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white leading-[1.43]">Ritmo no período</h2>
              <BarChart3 size={16} className="text-gj-text-secondary" />
            </div>
            <div className="flex flex-1 items-center justify-center rounded-gj-lg bg-gj-bg/50 px-6 text-center">
              <p className="text-sm text-gj-text-secondary leading-[1.43]">
                Poucos dados para mostrar o ritmo completo neste período.
              </p>
            </div>
          </Card>

          <button
            type="button"
            onClick={() => setShowSummarySheet(true)}
            className="group w-full text-left cursor-pointer"
          >
            <Card className="!p-4 group-hover:border-gj-accent/30 group-focus-visible:border-gj-accent/30 transition-colors">
              <h2 className="mb-4 text-sm font-semibold text-white leading-[1.43]">Resumo do período</h2>
              <div className="grid grid-cols-3">
                {summaryRows.slice(0, 3).map((metric) => (
                  <div key={metric.label} className="flex flex-col items-center">
                    <span className="text-xl font-bold text-white leading-[1.4]">{metric.value}</span>
                    <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{metric.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </button>
        </>
      ) : (
        <>
      <button
        type="button"
        onClick={() => setShowExerciseSheet(true)}
        className="w-full text-left cursor-pointer"
      >
        <Card className="!p-4 h-[240px] hover:border-gj-accent/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white leading-[1.43]">
                {selectedExercise.name}
              </h2>
              <p className="text-[10px] text-gj-text-secondary leading-[1.5]">
                Evolução de carga máxima
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gj-success leading-[1.4]">
                +{evolutionMetrics.progress}%
              </div>
              <div className="text-[10px] text-gj-text-secondary leading-[1.5]">
                {evolutionMetrics.range}
              </div>
            </div>
          </div>

          <div className="h-[128px] rounded-gj-lg bg-gj-bg/50 px-3 py-2">
            <svg viewBox="0 0 300 112" className="h-full w-full overflow-visible" aria-hidden="true">
              <path d={linePath} fill="none" stroke="#FF6B35" strokeWidth="2" />
              {evolutionMetrics.data.map((point, index) => {
                const x = 18 + index * xStep
                const y = 100 - ((point.value - minEvolutionValue) / evolutionRange) * 80
                return (
                  <circle
                    key={point.label}
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#FF6B35"
                    stroke="#0A0E1A"
                    strokeWidth="3"
                  />
                )
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between px-1 pt-2">
            {evolutionMetrics.data.map((point) => (
              <span key={point.label} className="text-[10px] text-gj-text-secondary leading-[1.5]">
                {point.label}
              </span>
            ))}
          </div>
        </Card>
      </button>

      <Card className="!p-4 h-[194px]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white leading-[1.43]">Ritmo no período</h2>
            <BarChart3 size={16} className="text-gj-text-secondary" />
          </div>
          <p className="mb-3">
            <span className="text-xl font-bold text-white leading-[1.4]">
              {rhythmData.reduce((total, item) => total + item.sets, 0)}{' '}
            </span>
            <span className="text-xs text-gj-text-secondary leading-[1.33]">séries totais</span>
          </p>

          <div className="flex h-[102px] items-end justify-between gap-2">
            {rhythmData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.sets}</span>
                <div className="flex h-[64px] w-full items-end justify-center">
                  <div
                    className="w-full max-w-[28px] rounded-[10px]"
                    style={{
                      height: `${Math.max((item.sets / maxSets) * 64, 24)}px`,
                      background: 'linear-gradient(0deg, #FF6B35 0%, #FF8F5E 100%)',
                    }}
                  />
                </div>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

      <button
        type="button"
        onClick={() => setShowSummarySheet(true)}
        className="group w-full text-left cursor-pointer"
      >
        <Card className="!p-4 group-hover:border-gj-accent/30 group-focus-visible:border-gj-accent/30 transition-colors">
          <h2 className="mb-4 text-sm font-semibold text-white leading-[1.43]">Resumo do período</h2>
          <div className="grid grid-cols-3">
            {summaryRows.slice(0, 3).map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-white leading-[1.4]">{metric.value}</span>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{metric.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </button>

      <Card className="!p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white leading-[1.43]">Destaques do período</h2>
          <Medal size={16} className="text-gj-accent" />
        </div>

        <div className="flex flex-col gap-2">
          {highlights.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-gj-md bg-gj-surface-elevated px-3 py-3"
            >
              <div>
                <h3 className="text-sm font-normal text-white leading-[1.43]">{item.name}</h3>
                <p className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.range}</p>
              </div>
              <span className="text-sm font-semibold text-gj-success leading-[1.43]">
                {item.progress}
              </span>
            </div>
          ))}
        </div>
      </Card>
        </>
      )}

      {showPeriodSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowPeriodSheet(false)}
          />
          <div className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp">
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gj-border" />
            </div>
            <div className="flex flex-col px-5 pb-8">
              <h3 className="text-base font-semibold text-white mb-4">Selecionar período</h3>
              <div className="flex flex-col gap-2">
                {periodOptions.map((period) => {
                  const isSelected = selectedPeriod === period
                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(period)
                        setShowPeriodSheet(false)
                      }}
                      className={`flex h-12 items-center justify-between rounded-gj-lg border px-4 text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gj-accent-soft border-gj-accent text-gj-accent font-semibold'
                          : 'bg-gj-surface-elevated border-gj-border text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{period}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {analysisStatus === 'ready' && showExerciseSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowExerciseSheet(false)}
          />
          <div className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp">
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gj-border" />
            </div>
            <div className="flex flex-col gap-3 px-5 pb-6">
              <h3 className="text-base font-bold text-white leading-[1.5]">Selecionar exercício</h3>

              <div className="flex h-12 items-center gap-2 rounded-gj-lg bg-gj-surface-elevated border border-gj-accent/25 px-3">
                <Search size={16} className="text-gj-text-secondary shrink-0" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(event) => setExerciseSearch(event.target.value)}
                  placeholder="Buscar exercício..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-gj-text-secondary outline-none"
                />
              </div>

              <div className="flex max-h-[248px] flex-col gap-2 overflow-y-auto pr-1">
                {filteredExercises.map((exercise) => {
                  const isSelected = selectedExercise.name === exercise.name
                  return (
                    <button
                      key={exercise.name}
                      type="button"
                      onClick={() => {
                        setSelectedExercise(exercise)
                        setExerciseSearch('')
                        setShowExerciseSheet(false)
                      }}
                      className={`flex h-14 items-center justify-between rounded-gj-lg border px-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gj-accent-soft border-gj-accent'
                          : 'bg-gj-surface-elevated border-gj-border hover:bg-white/10'
                      }`}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className={`truncate text-sm font-semibold ${isSelected ? 'text-gj-accent' : 'text-white'}`}>
                          {exercise.name}
                        </span>
                        <span className="text-[11px] font-medium text-gj-text-secondary">
                          {exercise.category}
                        </span>
                      </span>
                      {isSelected && <Check size={16} className="text-gj-accent shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSummarySheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowSummarySheet(false)}
          />
          <div className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp">
            <div className="flex items-center justify-center pt-3 pb-3">
              <div className="w-10 h-1 rounded-full bg-gj-border" />
            </div>
            <div className="flex flex-col px-5 pb-8">
              <h3 className="text-base font-semibold text-white mb-4">Resumo do período</h3>
              <div className="flex flex-col">
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex h-[37px] items-center justify-between border-b border-gj-border py-2"
                  >
                    <span className="text-xs text-gj-text-secondary leading-[1.33]">{row.label}</span>
                    <span className="text-sm font-semibold text-white leading-[1.43]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

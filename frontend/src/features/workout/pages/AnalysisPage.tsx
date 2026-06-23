import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, Check, ChevronDown, Info, Medal, Search } from 'lucide-react'
import { Card } from '../../../components/ui'
import { analyticsService } from '../../../services/analyticsService'
import { exerciseService } from '../../../services/exerciseService'
import type {
  ExercicioCargaPorSemanaDTO,
  PeriodWeeks,
  RecordeSessaoLatestMap,
  SemanaEstatisticasDTO,
  SeriePorSemanaDTO,
} from '../../../types'

interface ExerciseAnalysis {
  id: number
  name: string
  category: string
}

type PeriodOption = 'Últimas 4 semanas' | 'Últimas 8 semanas' | 'Últimas 12 semanas'

const periodOptions: PeriodOption[] = ['Últimas 4 semanas', 'Últimas 8 semanas', 'Últimas 12 semanas']

const periodWeeks: Record<PeriodOption, PeriodWeeks> = {
  'Últimas 4 semanas': 4,
  'Últimas 8 semanas': 8,
  'Últimas 12 semanas': 12,
}

const emptyStats: SemanaEstatisticasDTO = {
  totalSessoes: 0,
  cargaTotal: 0,
  tempoTotal: 0,
  totalSeries: 0,
  mediaSeriesPorSessao: 0,
  diasAtivos: 0,
}

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  return `${hours}h ${minutes}min`
}

const formatWeight = (weight: number) =>
  weight >= 1000 ? `${(weight / 1000).toFixed(1)}t` : `${Math.round(weight)}kg`

const formatDate = (value?: string | null) => {
  if (!value) return 'Sem registro'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Sem registro' : date.toLocaleDateString('pt-BR')
}

const getEvolutionMetrics = (loads: ExercicioCargaPorSemanaDTO[]) => {
  const data = loads
    .filter((item): item is ExercicioCargaPorSemanaDTO & { maiorCarga: number } =>
      item.maiorCarga !== null
    )
    .map((item) => ({
      label: `S${item.semana}`,
      value: item.maiorCarga,
    }))
  const validValues = loads
    .map((item) => item.maiorCarga)
    .filter((value): value is number => value !== null)
  const first = validValues[0] ?? 0
  const last = validValues[validValues.length - 1] ?? first
  const progress = first > 0 ? Math.round(((last - first) / first) * 100) : 0

  return {
    data,
    first,
    last,
    progress,
    range: validValues.length > 0 ? `${first}kg → ${last}kg` : 'Sem dados',
  }
}

const getHighlights = (records: RecordeSessaoLatestMap) => [
  {
    name: 'Maior carga total',
    range: formatDate(records.MAIOR_CARGA_TOTAL?.updatedAt),
    progress: records.MAIOR_CARGA_TOTAL
      ? formatWeight(records.MAIOR_CARGA_TOTAL.valor)
      : '—',
  },
  {
    name: 'Mais séries',
    range: formatDate(records.MAIS_SERIES?.updatedAt),
    progress: records.MAIS_SERIES ? String(Math.round(records.MAIS_SERIES.valor)) : '—',
  },
  {
    name: 'Maior duração',
    range: formatDate(records.MAIOR_DURACAO?.updatedAt),
    progress: records.MAIOR_DURACAO
      ? formatDuration(records.MAIOR_DURACAO.valor)
      : '—',
  },
]

export const AnalysisPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Últimas 8 semanas')
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseAnalysis[]>([])
  const [selectedExercise, setSelectedExercise] = useState<ExerciseAnalysis | undefined>()
  const [periodStats, setPeriodStats] = useState<SemanaEstatisticasDTO>(emptyStats)
  const [seriesByWeek, setSeriesByWeek] = useState<SeriePorSemanaDTO[]>([])
  const [exerciseLoads, setExerciseLoads] = useState<ExercicioCargaPorSemanaDTO[]>([])
  const [latestRecords, setLatestRecords] = useState<RecordeSessaoLatestMap>({})
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [showPeriodSheet, setShowPeriodSheet] = useState(false)
  const [showExerciseSheet, setShowExerciseSheet] = useState(false)
  const [showSummarySheet, setShowSummarySheet] = useState(false)
  const [showPeriodTooltip, setShowPeriodTooltip] = useState(false)
  const periodTooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPeriodTooltip) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!periodTooltipRef.current?.contains(event.target as Node)) {
        setShowPeriodTooltip(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showPeriodTooltip])

  useEffect(() => {
    let cancelled = false

    const loadBaseData = async () => {
      const [exercises, records] = await Promise.all([
        exerciseService.getAll(),
        analyticsService.getLatestSessionRecords(),
      ])

      if (cancelled) return

      const mappedExercises = exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.nome,
        category: 'Exercício',
      }))
      setExerciseOptions(mappedExercises)
      setSelectedExercise((current) => current ?? mappedExercises[0])
      setLatestRecords(records)
    }

    loadBaseData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const weeks = periodWeeks[selectedPeriod]

    const loadAnalysis = async () => {
      setLoading(true)
      const [stats, weeklySeries, loads] = await Promise.all([
        analyticsService.getPeriodStats(weeks),
        analyticsService.getSeriesByPeriod(weeks),
        selectedExercise
          ? analyticsService.getExerciseMaxLoadByPeriod(selectedExercise.id, weeks)
          : Promise.resolve([]),
      ])

      if (cancelled) return

      setPeriodStats(stats)
      setSeriesByWeek([...weeklySeries].sort((a, b) => a.semana - b.semana))
      setExerciseLoads([...loads].sort((a, b) => a.semana - b.semana))
      setLoading(false)
      setHasLoaded(true)
    }

    loadAnalysis()

    return () => {
      cancelled = true
    }
  }, [selectedExercise, selectedPeriod])

  const filteredExercises = useMemo(() => {
    const query = exerciseSearch.trim().toLowerCase()
    if (!query) return exerciseOptions
    return exerciseOptions.filter((exercise) =>
      `${exercise.name} ${exercise.category}`.toLowerCase().includes(query)
    )
  }, [exerciseOptions, exerciseSearch])

  const evolutionMetrics = useMemo(() => getEvolutionMetrics(exerciseLoads), [exerciseLoads])
  const rhythmData = useMemo(
    () => seriesByWeek.map((item) => ({ label: `S${item.semana}`, sets: item.totalSeries })),
    [seriesByWeek]
  )
  const summaryRows = useMemo(() => [
    { label: 'Sessões', value: String(periodStats.totalSessoes) },
    { label: 'Tempo total', value: formatDuration(periodStats.tempoTotal) },
    { label: 'Carga total', value: formatWeight(periodStats.cargaTotal) },
    { label: 'Dias ativos', value: String(periodStats.diasAtivos) },
    { label: 'Média séries/sessão', value: periodStats.mediaSeriesPorSessao.toFixed(1) },
    { label: 'Total de séries', value: String(periodStats.totalSeries) },
  ], [periodStats])
  const highlights = useMemo(() => getHighlights(latestRecords), [latestRecords])
  const analysisStatus: 'empty' | 'insufficient' | 'ready' =
    periodStats.totalSessoes === 0
      ? 'empty'
      : rhythmData.length < 3
        ? 'insufficient'
        : 'ready'
  const maxSets = Math.max(...(rhythmData?.map((item) => item.sets) ?? []), 1)

  const evolutionValues = (evolutionMetrics?.data ?? []).map((point) => point.value)
  const minEvolutionValue = evolutionValues.length > 0 ? Math.min(...evolutionValues) : 0
  const maxEvolutionValue = evolutionValues.length > 0 ? Math.max(...evolutionValues) : 0
  const evolutionRange = Math.max(maxEvolutionValue - minEvolutionValue, 1)
  const xStep = (evolutionMetrics?.data?.length ?? 0) > 1 ? 264 / ((evolutionMetrics?.data?.length ?? 1) - 1) : 0

  const linePath = (evolutionMetrics?.data ?? [])
    .map((point, index) => {
      const x = 18 + index * xStep
      const y = 100 - ((point.value - minEvolutionValue) / evolutionRange) * 80
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  if (loading && !hasLoaded) {
    return (
      <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
        <Card className="!p-6 min-h-[360px] flex items-center justify-center">
          <span className="text-sm text-gj-text-secondary">Carregando análise...</span>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white leading-[1.4]">Análise</h1>
        <div className="flex items-center gap-2">
          <div ref={periodTooltipRef} className="relative">
            <button
              type="button"
              onClick={() => setShowPeriodTooltip((value) => !value)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-gj-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Explicar labels do período"
              aria-expanded={showPeriodTooltip}
            >
              <Info size={14} />
            </button>

            {showPeriodTooltip && (
              <div className="absolute left-1/2 top-11 z-[50] w-[min(254px,calc(100vw-40px))] -translate-x-1/2 rounded-gj-md border border-gj-border bg-gj-surface-elevated p-3 shadow-lg">
                <div className="space-y-2 text-[11px] leading-[1.45] text-gj-text-secondary">
                  <p>S1, S2, S3... = semanas do período selecionado</p>
                  <p>Os pontos sem carga registrada não aparecem no gráfico</p>
                </div>
              </div>
            )}
          </div>

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
      </div>

      {analysisStatus === 'empty' ? (
        <Card className="!p-6 min-h-[360px] flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-gj-lg bg-gj-surface-elevated">
            <BarChart3 size={22} className="text-gj-text-secondary" />
          </div>
          <h2 className="text-base font-semibold text-white leading-[1.5]">Sem dados suficientes</h2>
          <p className="mt-2 max-w-[260px] text-sm text-gj-text-secondary leading-[1.43]">
            Não há dados reais disponíveis no backend para exibir análise.
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
                Registre mais sessões de {selectedExercise?.name?.toLowerCase() ?? 'exercício'} para acompanhar a evolução de carga.
              </p>
            </div>
            <div className="text-[10px] text-gj-text-secondary leading-[1.5]">
              {evolutionMetrics.data.length} ponto(s) disponível(is)
            </div>
          </Card>

          <Card className="!p-4 h-[194px] flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white leading-[1.43]">Ritmo no período</h2>
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
                    {selectedExercise?.name ?? 'Selecione um exercício'}
                  </h2>
                  <p className="text-[10px] text-gj-text-secondary leading-[1.5]">
                    Evolução de carga máxima
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gj-success leading-[1.4]">
                    {evolutionMetrics.progress > 0 ? '+' : ''}{evolutionMetrics.progress}%
                  </div>
                  <div className="text-[10px] text-gj-text-secondary leading-[1.5]">
                    {evolutionMetrics.range}
                  </div>
                </div>
              </div>

              <div className="h-[128px] rounded-gj-lg bg-gj-bg/50 px-3 py-2">
                <svg viewBox="0 0 300 112" className="h-full w-full overflow-visible" aria-hidden="true">
                  <path d={linePath} fill="none" stroke="#FF6B35" strokeWidth="2" />
                  {(evolutionMetrics?.data ?? []).map((point, index) => {
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
                {(evolutionMetrics?.data ?? []).map((point) => (
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
              {(highlights ?? []).map((item) => (
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
                      className={`flex h-12 items-center justify-between rounded-gj-lg border px-4 text-sm transition-all cursor-pointer ${isSelected
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
                  const isSelected = selectedExercise?.name === exercise.name
                  return (
                    <button
                      key={exercise.name}
                      type="button"
                      onClick={() => {
                        setSelectedExercise(exercise)
                        setExerciseSearch('')
                        setShowExerciseSheet(false)
                      }}
                      className={`flex h-14 items-center justify-between rounded-gj-lg border px-4 text-left transition-all cursor-pointer ${isSelected
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

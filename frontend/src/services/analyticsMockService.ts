import type {
  ExercicioCargaPorSemanaDTO,
  PeriodWeeks,
  RecordeSessaoDTO,
  RecordeSessaoLatestMap,
  SemanaEstatisticasDTO,
  SeriePorSemanaDTO,
} from '../types'
import {
  EXERCISE_OPTIONS,
  PERIOD_META,
  RHYTHM_BY_WEEK,
  mockExercises,
} from '../mocks/data'
import { mockWorkoutRecords } from '../features/profile/data/mockProfile'

const getPeriodLabel = (weeks: PeriodWeeks) =>
  `Últimas ${weeks} semanas` as keyof typeof PERIOD_META

export const analyticsMockService = {
  async getPeriodStats(semanas: PeriodWeeks): Promise<SemanaEstatisticasDTO> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    const meta = PERIOD_META[getPeriodLabel(semanas)]
    const series = RHYTHM_BY_WEEK.slice(-semanas)
    const totalSeries = series.reduce((total, value) => total + value, 0)

    return {
      totalSessoes: meta.sessions,
      cargaTotal: meta.totalLoad * 1000,
      tempoTotal: meta.minutes * 60,
      totalSeries,
      mediaSeriesPorSessao: meta.sessions > 0 ? totalSeries / meta.sessions : 0,
      diasAtivos: meta.activeDays,
    }
  },

  async getSeriesByPeriod(semanas: PeriodWeeks): Promise<SeriePorSemanaDTO[]> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    return RHYTHM_BY_WEEK.slice(-semanas).map((totalSeries, index) => ({
      semana: index + 1,
      totalSeries,
    }))
  },

  async getExerciseMaxLoadByPeriod(
    exercicioId: number,
    semanas: PeriodWeeks
  ): Promise<ExercicioCargaPorSemanaDTO[]> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    const exerciseName = mockExercises.find((exercise) => exercise.id === exercicioId)?.nome
    const analysis = EXERCISE_OPTIONS.find(
      (exercise) => exercise.name.toLowerCase() === exerciseName?.toLowerCase()
    ) ?? EXERCISE_OPTIONS[0]

    return (analysis?.maxLoads ?? []).slice(-semanas).map((maiorCarga, index) => ({
      semana: index + 1,
      maiorCarga,
    }))
  },

  async getLatestSessionRecords(): Promise<RecordeSessaoLatestMap> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    return {
      MAIOR_CARGA_TOTAL: { valor: 8400, updatedAt: '2026-05-29T20:00:00' },
      MAIS_SERIES: { valor: 23, updatedAt: '2026-05-29T20:00:00' },
      MAIOR_DURACAO: { valor: 4560, updatedAt: '2026-05-29T20:00:00' },
    }
  },

  async getSessionExerciseRecords(sessaoTreinoId: string): Promise<RecordeSessaoDTO[]> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    const workout = mockWorkoutRecords.find((item) => item.id === sessaoTreinoId)
    return (workout?.exerciseRecords ?? []).map((record) => ({
      nomeExercicio: record.exercise,
      maiorCarga: record.weightKg,
      maiorCargaUpdatedAt: record.date,
    }))
  },
}

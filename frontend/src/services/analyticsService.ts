import type { PeriodWeeks } from '../types'
import { DATA_SOURCE } from './api'
import { analyticsApiService } from './analyticsApiService'
import { analyticsMockService } from './analyticsMockService'

const getCurrentService = () =>
  DATA_SOURCE === 'mock' ? analyticsMockService : analyticsApiService

export const analyticsService = {
  getPeriodStats(semanas: PeriodWeeks) {
    return getCurrentService().getPeriodStats(semanas)
  },

  getSeriesByPeriod(semanas: PeriodWeeks) {
    return getCurrentService().getSeriesByPeriod(semanas)
  },

  getExerciseMaxLoadByPeriod(exercicioId: number, semanas: PeriodWeeks) {
    return getCurrentService().getExerciseMaxLoadByPeriod(exercicioId, semanas)
  },

  getLatestSessionRecords() {
    return getCurrentService().getLatestSessionRecords()
  },

  getSessionExerciseRecords(sessaoTreinoId: string) {
    return getCurrentService().getSessionExerciseRecords(sessaoTreinoId)
  },
}

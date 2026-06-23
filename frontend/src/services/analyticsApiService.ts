import type {
  ExercicioCargaPorSemanaDTO,
  PeriodWeeks,
  RecordeSessaoDTO,
  RecordeSessaoLatestMap,
  SemanaEstatisticasDTO,
  SeriePorSemanaDTO,
} from '../types'
import { apiClient } from './api'

const emptyPeriodStats = (): SemanaEstatisticasDTO => ({
  totalSessoes: 0,
  cargaTotal: 0,
  tempoTotal: 0,
  totalSeries: 0,
  mediaSeriesPorSessao: 0,
  diasAtivos: 0,
})

export const analyticsApiService = {
  async getPeriodStats(semanas: PeriodWeeks): Promise<SemanaEstatisticasDTO> {
    try {
      const data = await apiClient.get<SemanaEstatisticasDTO>(
        `/registro-treino/periodo/${semanas}`
      )
      return data ?? emptyPeriodStats()
    } catch (error) {
      console.error('Failed to fetch period stats:', error)
      return emptyPeriodStats()
    }
  },

  async getSeriesByPeriod(semanas: PeriodWeeks): Promise<SeriePorSemanaDTO[]> {
    try {
      const data = await apiClient.get<SeriePorSemanaDTO[]>(
        `/registro-treino/series-por-periodo/${semanas}`
      )
      return data ?? []
    } catch (error) {
      console.error('Failed to fetch series by period:', error)
      return []
    }
  },

  async getExerciseMaxLoadByPeriod(
    exercicioId: number,
    semanas: PeriodWeeks
  ): Promise<ExercicioCargaPorSemanaDTO[]> {
    try {
      const data = await apiClient.get<ExercicioCargaPorSemanaDTO[]>(
        `/registro-treino/maior-carga-exercicio/${exercicioId}/${semanas}`
      )
      return data ?? []
    } catch (error) {
      console.error('Failed to fetch exercise max load by period:', error)
      return []
    }
  },

  async getLatestSessionRecords(): Promise<RecordeSessaoLatestMap> {
    try {
      return await apiClient.get<RecordeSessaoLatestMap>('/recorde-sessao/latest')
    } catch (error) {
      console.error('Failed to fetch latest session records:', error)
      return {}
    }
  },

  async getSessionExerciseRecords(sessaoTreinoId: string): Promise<RecordeSessaoDTO[]> {
    try {
      const data = await apiClient.get<RecordeSessaoDTO[]>(
        `/recorde-exercicio/sessao/${sessaoTreinoId}`
      )
      return data ?? []
    } catch (error) {
      console.error('Failed to fetch session exercise records:', error)
      return []
    }
  },
}

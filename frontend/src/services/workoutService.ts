import { DATA_SOURCE } from './api'
import { workoutApiService } from './workoutApiService'
import { workoutMockService } from './workoutMockService'

/**
 * Unified workout service that routes to API or Mock based on DATA_SOURCE
 */
const getCurrentService = () => {
  return DATA_SOURCE === 'mock' ? workoutMockService : workoutApiService
}

export const workoutService = {
  getSessions: async () => {
    return getCurrentService().getSessions()
  },

  getSessionById: async (id: string) => {
    return getCurrentService().getSessionById(id)
  },

  createSession: async (data: any) => {
    return getCurrentService().createSession(data)
  },

  updateSession: async (id: string, data: any) => {
    return getCurrentService().updateSession(id, data)
  },

  deleteSession: async (id: string) => {
    return getCurrentService().deleteSession(id)
  },

  saveExecutionResult: async (registroId: string, durationSeconds: number) => {
    return getCurrentService().saveExecutionResult(registroId, durationSeconds)
  },

  createRegistroSerie: async (registroId: string, data: any) => {
    return getCurrentService().createRegistroSerie(registroId, data)
  },

  setActiveSession: async (sessionId: string) => {
    return getCurrentService().setActiveSession(sessionId)
  },

  clearActiveSession: async () => {
    return getCurrentService().clearActiveSession()
  },

  getWorkoutCalendar: async (year: number, month: number) => {
    return getCurrentService().getWorkoutCalendar(year, month)
  },

  getWeekStats: async (year: number, month: number, day: number) => {
    return getCurrentService().getWeekStats(year, month, day)
  },

  getWeeklyStreak: async (year: number, month: number, day: number) => {
    return getCurrentService().getWeeklyStreak(year, month, day)
  },

  getLastWeekSeries: async (options?: { semanaPassada?: boolean }) => {
    return getCurrentService().getLastWeekSeries(options)
  },

  getExerciseRecord: async (exercicioId: number) => {
    return getCurrentService().getExerciseRecord(exercicioId)
  },

  getLastSessionSeriesByExercise: async (exercicioId: number) => {
    return getCurrentService().getLastSessionSeriesByExercise(exercicioId)
  },
}

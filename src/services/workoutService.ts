import type { WorkoutSession, CreateSessaoTreinoComExerciciosRequestDTO, UpdateSessaoTreinoComExerciciosRequestDTO } from '../types'
import { apiClient } from './api'

export const workoutService = {
  getSessions: async (): Promise<WorkoutSession[]> => {
    try {
      return await apiClient.get<WorkoutSession[]>('/workouts')
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      return []
    }
  },

  getSessionById: async (id: string): Promise<WorkoutSession | null> => {
    try {
      return await apiClient.get<WorkoutSession>(`/workouts/${id}`)
    } catch (error) {
      console.error('Failed to fetch session:', error)
      return null
    }
  },

  createSession: async (
    data: CreateSessaoTreinoComExerciciosRequestDTO
  ): Promise<WorkoutSession> => {
    return await apiClient.post<WorkoutSession>('/workouts/create', data)
  },

  updateSession: async (
    id: string,
    data: UpdateSessaoTreinoComExerciciosRequestDTO
  ): Promise<WorkoutSession | null> => {
    try {
      return await apiClient.put<WorkoutSession>(`/workouts/${id}/edit`, data)
    } catch (error) {
      console.error('Failed to update session:', error)
      return null
    }
  },

  deleteSession: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete<void>(`/workouts/${id}`)
      return true
    } catch (error) {
      console.error('Failed to delete session:', error)
      return false
    }
  },

  saveExecutionResult: async (
    sessionId: string,
    result: Partial<WorkoutSession>
  ): Promise<void> => {
    try {
      await apiClient.post<void>(`/workouts/sessions/${sessionId}/execution`, result)
    } catch (error) {
      console.error('Failed to save execution result:', error)
    }
  },

  setActiveSession: async (sessionId: string): Promise<void> => {
    try {
      await apiClient.post<void>(`/workouts/sessions/${sessionId}/activate`, {})
    } catch (error) {
      console.error('Failed to set active session:', error)
    }
  },

  clearActiveSession: async (): Promise<void> => {
    try {
      await apiClient.post<void>('/workouts/sessions/deactivate', {})
    } catch (error) {
      console.error('Failed to clear active session:', error)
    }
  },
}

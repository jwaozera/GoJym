import type {
  WorkoutSession,
  CreateSessaoTreinoComExerciciosRequestDTO,
  UpdateSessaoTreinoComExerciciosRequestDTO,
  WorkoutExercise,
  Exercicio,
} from '../types'
import { apiClient } from './api'

// ===== BACKEND DTOs =====
interface BackendExerciseInSession {
  id?: string
  exercicioId?: number
  exercicioNome?: string
  numSeries?: number
  series?: number
  repeticoesMin?: number
  repeticoesMax?: number
  repsMin?: number
  repsMax?: number
  ordem?: number
  descanso?: number
}

interface BackendWorkoutListDTO {
  id: string
  nome: string
  createdAt?: string
  qtdExercicios?: number
}

interface BackendWorkoutDetailDTO {
  id: string
  nome: string
  createdAt?: string
  exercicios?: BackendExerciseInSession[]
}

interface StartWorkoutExecutionResponseDTO {
  id: string
}

interface CreateRegistroSerieRequestDTO {
  idExercicio: number
  numeroSerie: number
  carga: number
  repeticoes: number
}

interface RegistroSerieResponseDTO {
  id: string
  exercicio?: unknown
  numeroSerie: number
  carga: number
  repeticoes: number
  recorde?: boolean
}

interface FinishWorkoutExecutionRequestDTO {
  duracaoSegundos: number
}

interface FinishWorkoutExecutionResponseDTO {
  id: string
  duracaoSegundos?: number
  qtdSeries?: number
  concluido?: boolean
  cargaTotal?: number
  exercicioMaiorCarga?: {
    maiorCarga?: number
    nomeExercicio?: string
  }
}

// ===== MAPPERS =====
const mapBackendExerciseToFrontend = (
  ex: BackendExerciseInSession
): WorkoutExercise => {
  const numSeries = ex.numSeries ?? ex.series ?? 3
  const repeticoesMin = ex.repeticoesMin ?? ex.repsMin ?? 8
  const repeticoesMax = ex.repeticoesMax ?? ex.repsMax ?? 12

  return {
    id: ex.id ?? `ex-${Date.now()}`,
    exercicio: {
      id: ex.exercicioId ?? 0,
      nome: ex.exercicioNome ?? '',
    } as Exercicio,
    exercicioId: ex.exercicioId,
    exercicioNome: ex.exercicioNome,
    numSeries,
    repeticoesMin,
    repeticoesMax,
    ordem: ex.ordem,
    descanso: ex.descanso,
    sets: [], // WorkoutExercise requires sets array, but for list/detail we don't need actual sets
  }
}

const mapBackendWorkoutToFrontend = (
  workout: BackendWorkoutDetailDTO | BackendWorkoutListDTO
): WorkoutSession => ({
  id: workout.id,
  nome: workout.nome,
  name: workout.nome,
  createdAt: workout.createdAt ?? new Date().toISOString(),
  qtdExercicios: (workout as BackendWorkoutListDTO).qtdExercicios,
  exercicios:
    (workout as BackendWorkoutDetailDTO).exercicios?.map(mapBackendExerciseToFrontend) ?? [],
  isActive: false,
})

export const workoutService = {
  getSessions: async (): Promise<WorkoutSession[]> => {
    try {
      const backend = await apiClient.get<BackendWorkoutListDTO[]>('/workouts')
      return (backend || []).map(mapBackendWorkoutToFrontend)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      return []
    }
  },

  getSessionById: async (id: string): Promise<WorkoutSession | null> => {
    try {
      const backend = await apiClient.get<BackendWorkoutDetailDTO>(`/workouts/${id}`)
      return backend ? mapBackendWorkoutToFrontend(backend) : null
    } catch (error) {
      console.error('Failed to fetch session:', error)
      return null
    }
  },

  createSession: async (
    data: CreateSessaoTreinoComExerciciosRequestDTO
  ): Promise<WorkoutSession> => {
    // Convert frontend format to backend format
    const payload = {
      nome: data.nome,
      exercicios: (data.exercicios || []).map((ex, idx) => ({
        exercicioId: ex.exercicioId,
        series: ex.series,
        repsMin: ex.repsMin,
        repsMax: ex.repsMax,
        descanso: ex.descanso,
        ordem: ex.ordem ?? idx + 1,
      })),
    }
    const backend = await apiClient.post<BackendWorkoutDetailDTO>('/workouts/create', payload)
    return backend
      ? mapBackendWorkoutToFrontend(backend)
      : mapBackendWorkoutToFrontend({ id: '', nome: data.nome })
  },

  updateSession: async (
    id: string,
    data: UpdateSessaoTreinoComExerciciosRequestDTO
  ): Promise<WorkoutSession | null> => {
    try {
      // Convert frontend format to backend format
      const payload = {
        nome: data.nome,
        exercicios: (data.exercicios || []).map((ex, idx) => ({
          ...(ex.id ? { id: ex.id } : {}),
          exercicioId: ex.exercicioId,
          series: ex.series,
          repsMin: ex.repsMin,
          repsMax: ex.repsMax,
          descanso: ex.descanso,
          ordem: ex.ordem ?? idx + 1,
        })),
      }
      const backend = await apiClient.put<BackendWorkoutDetailDTO>(`/workouts/${id}/edit`, payload)
      return backend ? mapBackendWorkoutToFrontend(backend) : null
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

  // ===== Future: Execution Integration =====
  // The following methods are stubs for the execution phase integration.
  // They reference endpoints that will be implemented when workout execution is integrated.

  saveExecutionResult: async (
    registroId: string,
    durationSeconds: number
  ): Promise<FinishWorkoutExecutionResponseDTO | null> => {
    try {
      return await apiClient.patch<FinishWorkoutExecutionResponseDTO>(
        `/registro-treino/execute/${registroId}`,
        { duracaoSegundos: durationSeconds } as FinishWorkoutExecutionRequestDTO
      )
    } catch (error) {
      console.error('Failed to finalize execution:', error)
      return null
    }
  },

  createRegistroSerie: async (
    registroId: string,
    data: CreateRegistroSerieRequestDTO
  ): Promise<RegistroSerieResponseDTO | null> => {
    try {
      return await apiClient.post<RegistroSerieResponseDTO>(
        `/execute/serie/${registroId}`,
        data
      )
    } catch (error) {
      console.error('Failed to register serie:', error)
      return null
    }
  },

  setActiveSession: async (sessionId: string): Promise<string | null> => {
    try {
      const response = await apiClient.post<StartWorkoutExecutionResponseDTO>(
        `/registro-treino/execute/${sessionId}`,
        undefined
      )
      return response?.id ?? null
    } catch (error) {
      console.error('Failed to start workout execution:', error)
      return null
    }
  },

  clearActiveSession: async (): Promise<void> => {
    // No backend cancellation endpoint exists in the documented contract.
    // Clear local execution state only.
    return
  },
}

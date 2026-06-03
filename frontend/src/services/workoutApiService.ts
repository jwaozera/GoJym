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

interface CalendarDayDTO {
    dia: number
    ativo: boolean
    nomeTreino?: string
}

interface SeriesCountDiaDTO {
    data: string
    dia: number
    quantidade: number
}

interface RecordeExercicioResponseDTO {
    maiorCarga?: number
    maiorVolume?: number
    maiorCargaUpdatedAt?: string
    maiorVolumeUpdatedAt?: string
}

export interface WorkoutCalendarDay {
    day: number
    active: boolean
    workoutName?: string
    exerciseCount?: number
}

export interface WeeklySeriesDay {
    day: string
    sets: number
    active: boolean
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

const WEEK_DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

const emptyWeekSeries = (): WeeklySeriesDay[] =>
    WEEK_DAY_LABELS.map((day) => ({
        day,
        sets: 0,
        active: false,
    }))

const mapLastWeekSeries = (data: SeriesCountDiaDTO[]): WeeklySeriesDay[] => {
    const week = emptyWeekSeries()

    data.forEach((item) => {
        const index = Number.isInteger(item.dia)
            ? item.dia >= 1 && item.dia <= 7
                ? item.dia - 1
                : item.dia
            : -1
        if (index >= 0 && index < week.length) {
            week[index] = {
                day: WEEK_DAY_LABELS[index],
                sets: item.quantidade ?? 0,
                active: (item.quantidade ?? 0) > 0,
            }
        }
    })

    return week
}

/**
 * Workout service for real backend API (VITE_DATA_SOURCE=api)
 * Calls real Swagger endpoints:
 * - GET /workouts
 * - POST /workouts/create
 * - GET /workouts/{id}
 * - PUT /workouts/{id}/edit
 * - DELETE /workouts/{id}
 * - POST /registro-treino/execute/{idSessaoTreino}
 * - POST /execute/serie/{idRegistroTreino}
 * - GET /registro-treino/{ano}/{mes}
 * - GET /execute/serie/last-week
 * - GET /recorde-exercicio/{exercicioId}
 */
export const workoutApiService = {
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

    getWorkoutCalendar: async (year: number, month: number): Promise<WorkoutCalendarDay[]> => {
        try {
            const data = await apiClient.get<CalendarDayDTO[]>(`/registro-treino/${year}/${month}`)
            return (data || []).map((item) => ({
                day: item.dia,
                active: item.ativo,
                workoutName: item.nomeTreino,
            }))
        } catch (error) {
            console.error('Failed to fetch workout calendar:', error)
            return []
        }
    },

    getLastWeekSeries: async (): Promise<WeeklySeriesDay[]> => {
        try {
            const data = await apiClient.get<SeriesCountDiaDTO[]>('/execute/serie/last-week')
            return mapLastWeekSeries(data || [])
        } catch (error) {
            console.error('Failed to fetch last week series:', error)
            return emptyWeekSeries()
        }
    },

    getExerciseRecord: async (
        exercicioId: number
    ): Promise<RecordeExercicioResponseDTO | null> => {
        try {
            return await apiClient.get<RecordeExercicioResponseDTO>(`/recorde-exercicio/${exercicioId}`)
        } catch (error) {
            console.error('Failed to fetch exercise record:', error)
            return null
        }
    },
}

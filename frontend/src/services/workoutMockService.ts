import type {
    WorkoutSession,
    CreateSessaoTreinoComExerciciosRequestDTO,
    UpdateSessaoTreinoComExerciciosRequestDTO,
} from '../types'
import type { WeeklySeriesDay, WorkoutCalendarDay } from './workoutApiService'

import { mockSessions as mockSessionsSource } from '../mocks/data'

// Create a local mutable copy of the shared mock sessions for preview.
let mockSessions: WorkoutSession[] = mockSessionsSource.map((s: any) => ({ ...s }))

/**
 * Workout service for mock preview mode (VITE_DATA_SOURCE=mock)
 * No backend calls. Uses local mock data.
 */
export const workoutMockService = {
    getSessions: async (): Promise<WorkoutSession[]> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return [...mockSessions]
    },

    getSessionById: async (id: string): Promise<WorkoutSession | null> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return mockSessions.find((s) => s.id === id) || null
    },

    createSession: async (
        data: CreateSessaoTreinoComExerciciosRequestDTO
    ): Promise<WorkoutSession> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        // Convert exercise DTOs to WorkoutExercise format
        const exercicios = (data.exercicios || []).map((ex: any, idx: number) => ({
            id: ex.id ?? `ex-${Date.now()}-${idx}`,
            exercicio: {
                id: ex.exercicioId ?? 0,
                nome: ex.exercicioNome ?? '',
            },
            exercicioId: ex.exercicioId,
            exercicioNome: ex.exercicioNome,
            numSeries: ex.series ?? 3,
            repeticoesMin: ex.repsMin ?? 8,
            repeticoesMax: ex.repsMax ?? 12,
            ordem: ex.ordem,
            descanso: ex.descanso,
            sets: [],
        }))

        const newSession: WorkoutSession = {
            id: String(Date.now()),
            nome: data.nome,
            name: data.nome,
            createdAt: new Date().toISOString(),
            qtdExercicios: exercicios.length,
            exercicios,
            isActive: false,
        }
        mockSessions.push(newSession)
        return newSession
    },

    updateSession: async (
        id: string,
        data: UpdateSessaoTreinoComExerciciosRequestDTO
    ): Promise<WorkoutSession | null> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        const session = mockSessions.find((s) => s.id === id)
        if (session) {
            // Convert exercise DTOs to WorkoutExercise format
            const exercicios = (data.exercicios || []).map((ex: any, idx: number) => ({
                id: ex.id ?? `ex-${Date.now()}-${idx}`,
                exercicio: {
                    id: ex.exercicioId ?? 0,
                    nome: ex.exercicioNome ?? '',
                },
                exercicioId: ex.exercicioId,
                exercicioNome: ex.exercicioNome,
                numSeries: ex.series ?? 3,
                repeticoesMin: ex.repsMin ?? 8,
                repeticoesMax: ex.repsMax ?? 12,
                ordem: ex.ordem,
                descanso: ex.descanso,
                sets: [],
            }))

            session.nome = data.nome
            session.name = data.nome
            session.exercicios = exercicios
            session.qtdExercicios = exercicios.length
            return { ...session }
        }
        return null
    },

    deleteSession: async (id: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        const idx = mockSessions.findIndex((s) => s.id === id)
        if (idx >= 0) {
            mockSessions.splice(idx, 1)
            return true
        }
        return false
    },

    saveExecutionResult: async (
        registroId: string,
        durationSeconds: number
    ): Promise<{ id: string; duracaoSegundos?: number } | null> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return {
            id: registroId,
            duracaoSegundos: durationSeconds,
        }
    },

    createRegistroSerie: async (
        registroId: string,
        data: any
    ): Promise<{ id: string; numeroSerie: number; carga: number; repeticoes: number } | null> => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return {
            id: String(Date.now()),
            numeroSerie: data.numeroSerie,
            carga: data.carga,
            repeticoes: data.repeticoes,
        }
    },

    setActiveSession: async (sessionId: string): Promise<string | null> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        // Just return a mock registro ID
        return `registro-${Date.now()}`
    },

    clearActiveSession: async (): Promise<void> => {
        // No-op for mock
        return
    },

    getWorkoutCalendar: async (year: number, month: number): Promise<WorkoutCalendarDay[]> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        void year
        void month

        return mockSessions.slice(0, 4).map((session, index) => ({
            day: ((index + 1) * 7) <= 28 ? (index + 1) * 7 : index + 4,
            active: true,
            workoutName: session.name ?? session.nome,
            exerciseCount: session.exercicios?.length ?? session.exercises?.length ?? session.qtdExercicios ?? 0,
        }))
    },

    getLastWeekSeries: async (): Promise<WeeklySeriesDay[]> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return [
            { day: 'Seg', sets: 10, active: true },
            { day: 'Ter', sets: 14, active: true },
            { day: 'Qua', sets: 0, active: false },
            { day: 'Qui', sets: 21, active: true },
            { day: 'Sex', sets: 17, active: true },
            { day: 'Sab', sets: 12, active: true },
            { day: 'Dom', sets: 0, active: false },
        ]
    },

    getExerciseRecord: async (
        exercicioId: number
    ): Promise<{ maiorCarga?: number; maiorVolume?: number; maiorCargaUpdatedAt?: string; maiorVolumeUpdatedAt?: string } | null> => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        const records: Record<number, number> = {
            1: 80,
            2: 120,
            3: 70,
            4: 42,
        }

        const maiorCarga = records[exercicioId]
        return maiorCarga
            ? {
                maiorCarga,
                maiorVolume: maiorCarga * 10,
                maiorCargaUpdatedAt: new Date().toISOString(),
                maiorVolumeUpdatedAt: new Date().toISOString(),
            }
            : null
    },
}

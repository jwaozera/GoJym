/**
 * Mock data for visual preview only.
 *
 * IMPORTANT: This file is INCLUDED only when `VITE_DATA_SOURCE=mock`.
 * In `api` mode the application must use real backend endpoints
 * and MUST NOT read these mocks.
 */

// Home page mock data - restored from Vercel preview
export const WEEKLY_DATA = [
    { day: 'Seg', sets: 10, active: true },
    { day: 'Ter', sets: 14, active: true },
    { day: 'Qua', sets: 0, active: false },
    { day: 'Qui', sets: 21, active: true },
    { day: 'Sex', sets: 17, active: true },
    { day: 'Sáb', sets: 12, active: true },
    { day: 'Dom', sets: 0, active: false },
]

export const WEEKLY_DATA_PREV = [
    { day: 'Seg', sets: 16, active: true },
    { day: 'Ter', sets: 20, active: true },
    { day: 'Qua', sets: 12, active: true },
    { day: 'Qui', sets: 0, active: false },
    { day: 'Sex', sets: 18, active: true },
    { day: 'Sáb', sets: 0, active: false },
    { day: 'Dom', sets: 0, active: false },
]

export const WEEKLY_STATS = {
    totalSeries: 92,
    totalSessions: 4,
    totalWeight: '8.4t',
    totalTime: '4h 32min',
    activeDays: 4,
    avgSeriesPerSession: 23,
    mostFrequentWorkout: 'Treino A – Push',
}

export const STREAK_WEEKS = 21

// Analysis page mock data - restored from Vercel preview
export interface ExerciseAnalysisData {
    name: string
    category: string
    maxLoads: number[]
}

export const EXERCISE_OPTIONS: ExerciseAnalysisData[] = [
    { name: 'Supino reto', category: 'Peito', maxLoads: [60, 65, 62, 70, 72, 75, 78, 80, 82, 84, 86, 88] },
    { name: 'Desenvolvimento militar', category: 'Ombro', maxLoads: [30, 31, 32, 33, 34, 35, 36, 36, 37, 38, 39, 40] },
    { name: 'Tríceps corda', category: 'Tríceps', maxLoads: [25, 26, 26, 28, 29, 30, 31, 32, 32, 34, 35, 36] },
    { name: 'Puxada frente', category: 'Costas', maxLoads: [55, 56, 58, 60, 62, 63, 64, 66, 67, 68, 70, 72] },
]

export const RHYTHM_BY_WEEK = [72, 85, 68, 80, 92, 88, 95, 102, 97, 108, 112, 118]

export type PeriodOption = 'Últimas 4 semanas' | 'Últimas 8 semanas' | 'Últimas 12 semanas' | 'Este mês'

export interface PeriodMeta {
    start: number
    count: number
    availableWeeks: number
    sessions: number
    minutes: number
    totalLoad: number
    activeDays: number
    longestSession: number
}

export const PERIOD_META: Record<PeriodOption, PeriodMeta> = {
    'Últimas 4 semanas': { start: 4, count: 4, availableWeeks: 4, sessions: 16, minutes: 780, totalLoad: 34.6, activeDays: 14, longestSession: 68 },
    'Últimas 8 semanas': { start: 0, count: 8, availableWeeks: 8, sessions: 32, minutes: 1574, totalLoad: 67.2, activeDays: 28, longestSession: 72 },
    'Últimas 12 semanas': { start: 0, count: 12, availableWeeks: 12, sessions: 48, minutes: 2388, totalLoad: 105.8, activeDays: 41, longestSession: 76 },
    'Este mês': { start: 8, count: 4, availableWeeks: 4, sessions: 17, minutes: 828, totalLoad: 38.6, activeDays: 15, longestSession: 76 },
}

export const mockExercises = [
    { id: 1, nome: 'Supino Reto' },
    { id: 2, nome: 'Rosca Direta' },
    { id: 3, nome: 'Agachamento' },
    { id: 4, nome: 'Puxada Frontal' },
    { id: 5, nome: 'Desenvolvimento' },
    { id: 6, nome: 'Rosca Inversa' },
    { id: 7, nome: 'Leg Press' },
    { id: 8, nome: 'Supino Inclinado' },
]

export const mockSessions = [
    {
        id: '1',
        nome: 'Peito e Tríceps',
        name: 'Peito e Tríceps',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        qtdExercicios: 3,
        exercicios: [
            {
                id: 'ex1',
                exercicio: { id: 1, nome: 'Supino Reto' },
                exercicioId: 1,
                exercicioNome: 'Supino Reto',
                numSeries: 4,
                repeticoesMin: 8,
                repeticoesMax: 12,
                ordem: 1,
                descanso: 90,
                sets: [],
            },
            {
                id: 'ex2',
                exercicio: { id: 2, nome: 'Rosca Direta' },
                exercicioId: 2,
                exercicioNome: 'Rosca Direta',
                numSeries: 3,
                repeticoesMin: 10,
                repeticoesMax: 15,
                ordem: 2,
                descanso: 60,
                sets: [],
            },
            {
                id: 'ex3',
                exercicio: { id: 5, nome: 'Desenvolvimento' },
                exercicioId: 5,
                exercicioNome: 'Desenvolvimento',
                numSeries: 3,
                repeticoesMin: 8,
                repeticoesMax: 12,
                ordem: 3,
                descanso: 70,
                sets: [],
            },
        ],
        isActive: false,
    },
    {
        id: '2',
        nome: 'Costas e Bíceps',
        name: 'Costas e Bíceps',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        qtdExercicios: 2,
        exercicios: [
            {
                id: 'ex4',
                exercicio: { id: 4, nome: 'Puxada Frontal' },
                exercicioId: 4,
                exercicioNome: 'Puxada Frontal',
                numSeries: 4,
                repeticoesMin: 8,
                repeticoesMax: 12,
                ordem: 1,
                descanso: 80,
                sets: [],
            },
            {
                id: 'ex5',
                exercicio: { id: 6, nome: 'Rosca Inversa' },
                exercicioId: 6,
                exercicioNome: 'Rosca Inversa',
                numSeries: 3,
                repeticoesMin: 10,
                repeticoesMax: 15,
                ordem: 2,
                descanso: 60,
                sets: [],
            },
        ],
        isActive: false,
    },
    {
        id: '3',
        nome: 'Perna',
        name: 'Perna',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        qtdExercicios: 2,
        exercicios: [
            {
                id: 'ex6',
                exercicio: { id: 3, nome: 'Agachamento' },
                exercicioId: 3,
                exercicioNome: 'Agachamento',
                numSeries: 4,
                repeticoesMin: 10,
                repeticoesMax: 15,
                ordem: 1,
                descanso: 120,
                sets: [],
            },
            {
                id: 'ex7',
                exercicio: { id: 7, nome: 'Leg Press' },
                exercicioId: 7,
                exercicioNome: 'Leg Press',
                numSeries: 3,
                repeticoesMin: 8,
                repeticoesMax: 12,
                ordem: 2,
                descanso: 100,
                sets: [],
            },
        ],
        isActive: false,
    },
]

// Note: Additional mock files (profile/mockProfile.ts) contain profile-specific records.

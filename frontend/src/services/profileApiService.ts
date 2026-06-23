import { analyticsApiService } from './analyticsApiService'
import { workoutApiService } from './workoutApiService'

export interface ExerciseRecord {
    exercise: string
    date: string
    weightKg: number
    reps?: number | null
}

export interface SessionRecord {
    label: string
    date: string
    value: string
    icon: 'load' | 'sets' | 'duration'
}

export interface WorkoutRecords {
    id: string
    name: string
    exerciseRecords: ExerciseRecord[]
    sessionRecords: SessionRecord[]
}

const formatDate = (value?: string | null) => {
    if (!value) return 'Sem registro'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Sem registro' : date.toLocaleDateString('pt-BR')
}

const formatWeight = (weight: number) =>
    weight >= 1000 ? `${(weight / 1000).toFixed(1)}t` : `${Math.round(weight)} kg`

const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`
}

const getGeneralSessionRecords = async (): Promise<SessionRecord[]> => {
    const records = await analyticsApiService.getLatestSessionRecords()
    return [
        {
            label: 'Maior carga total',
            date: formatDate(records.MAIOR_CARGA_TOTAL?.updatedAt),
            value: records.MAIOR_CARGA_TOTAL
                ? formatWeight(records.MAIOR_CARGA_TOTAL.valor)
                : '—',
            icon: 'load',
        },
        {
            label: 'Mais séries',
            date: formatDate(records.MAIS_SERIES?.updatedAt),
            value: records.MAIS_SERIES ? String(Math.round(records.MAIS_SERIES.valor)) : '—',
            icon: 'sets',
        },
        {
            label: 'Maior duração',
            date: formatDate(records.MAIOR_DURACAO?.updatedAt),
            value: records.MAIOR_DURACAO ? formatDuration(records.MAIOR_DURACAO.valor) : '—',
            icon: 'duration',
        },
    ]
}

export const profileApiService = {
    getWorkoutRecords: async (): Promise<WorkoutRecords[]> => {
        const [sessions, sessionRecords] = await Promise.all([
            workoutApiService.getSessions(),
            getGeneralSessionRecords(),
        ])

        if (sessions.length === 0) {
            const hasAnyRecord = sessionRecords.some((record) => record.value !== '—')
            return hasAnyRecord
                ? [{
                    id: 'general',
                    name: 'Recordes gerais',
                    exerciseRecords: [],
                    sessionRecords,
                }]
                : []
        }

        return Promise.all(
            sessions.map(async (session) => {
                const records = await analyticsApiService.getSessionExerciseRecords(session.id)
                return {
                    id: session.id,
                    name: session.name ?? session.nome,
                    exerciseRecords: records.map((record) => ({
                        exercise: record.nomeExercicio,
                        date: formatDate(record.maiorCargaUpdatedAt),
                        weightKg: record.maiorCarga ?? 0,
                        reps: null,
                    })),
                    sessionRecords,
                }
            })
        )
    },

    getProfileMeta: async (): Promise<{ memberSinceLabel: string; memberSinceFull: string }> => {
        return { memberSinceLabel: '', memberSinceFull: '' }
    },
}

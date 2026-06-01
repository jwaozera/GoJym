import { apiClient } from './api'

export interface ExerciseRecord {
    exercise: string
    date: string
    weightKg: number
    reps: number
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

/**
 * Profile service for real backend API (VITE_DATA_SOURCE=api)
 * Note: No real `/profile/records` or `/profile/meta` endpoints are guaranteed by Swagger contract.
 * Per integration mode rules, return empty/neutral values to avoid calling non-existing endpoints.
 */
export const profileApiService = {
    getWorkoutRecords: async (): Promise<WorkoutRecords[]> => {
        // No real `/profile/records` endpoint is guaranteed by the Swagger integration.
        // Per integration mode rules, do not call non-existing endpoints – return empty.
        return []
    },

    getProfileMeta: async (): Promise<{ memberSinceLabel: string; memberSinceFull: string }> => {
        // `/profile/meta` is not part of the integrated Swagger contract; return neutral empty values.
        return { memberSinceLabel: '', memberSinceFull: '' }
    },
}

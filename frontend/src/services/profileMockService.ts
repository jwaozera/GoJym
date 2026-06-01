import { mockWorkoutRecords, profileMeta } from '../features/profile/data/mockProfile'

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
 * Profile service for mock preview mode (VITE_DATA_SOURCE=mock)
 * Provides sample data for visual preview.
 */
export const profileMockService = {
    getWorkoutRecords: async (): Promise<WorkoutRecords[]> => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return [...mockWorkoutRecords] as WorkoutRecords[]
    },

    getProfileMeta: async (): Promise<{ memberSinceLabel: string; memberSinceFull: string }> => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return { ...profileMeta }
    },
}

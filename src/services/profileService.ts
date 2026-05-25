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

export const profileService = {
  getWorkoutRecords: async (): Promise<WorkoutRecords[]> => {
    try {
      return await apiClient.get<WorkoutRecords[]>('/profile/records')
    } catch (error) {
      console.error('Failed to fetch workout records:', error)
      return []
    }
  },

  getProfileMeta: async (): Promise<{ memberSinceLabel: string; memberSinceFull: string }> => {
    try {
      return await apiClient.get<{ memberSinceLabel: string; memberSinceFull: string }>('/profile/meta')
    } catch (error) {
      console.error('Failed to fetch profile meta:', error)
      return {
        memberSinceLabel: '',
        memberSinceFull: '',
      }
    }
  },
}

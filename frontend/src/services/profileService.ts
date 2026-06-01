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
    // No real `/profile/records` endpoint is guaranteed by the Swagger integration.
    // Per integration mode rules, do not call non-existing endpoints – return empty.
    return []
  },

  getProfileMeta: async (): Promise<{ memberSinceLabel: string; memberSinceFull: string }> => {
    // `/profile/meta` is not part of the integrated Swagger contract; return neutral empty values.
    return { memberSinceLabel: '', memberSinceFull: '' }
  },
}

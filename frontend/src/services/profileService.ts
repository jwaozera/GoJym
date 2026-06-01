import { DATA_SOURCE } from './api'
import { profileApiService, type ExerciseRecord, type SessionRecord, type WorkoutRecords } from './profileApiService'
import { profileMockService } from './profileMockService'

export type { ExerciseRecord, SessionRecord, WorkoutRecords }

/**
 * Unified profile service that routes to API or Mock based on DATA_SOURCE
 */
const getCurrentService = () => {
  return DATA_SOURCE === 'mock' ? profileMockService : profileApiService
}

export const profileService = {
  async getWorkoutRecords() {
    return getCurrentService().getWorkoutRecords()
  },

  async getProfileMeta() {
    return getCurrentService().getProfileMeta()
  },
}

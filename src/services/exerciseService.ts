import type { Exercise } from '../types'
import { apiClient } from './api'

export const exerciseService = {
  search: async (query: string): Promise<Exercise[]> => {
    try {
      return await apiClient.get<Exercise[]>(`/exercises`)
    } catch (error) {
      console.error('Failed to search exercises:', error)
      return []
    }
  },
}

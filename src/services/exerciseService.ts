import type { Exercise } from '../types'
import { mockExercises } from '../mocks/data'

export const exerciseService = {
  search: async (query: string): Promise<Exercise[]> => {
    await new Promise(r => setTimeout(r, 300))
    const q = query.toLowerCase()
    return mockExercises.filter(
      e =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroup.toLowerCase().includes(q)
    )
  },
}

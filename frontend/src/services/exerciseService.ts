import { DATA_SOURCE } from './api'
import { exerciseApiService } from './exerciseApiService'
import { exerciseMockService } from './exerciseMockService'

/**
 * Unified exercise service that routes to API or Mock based on DATA_SOURCE
 */
const getCurrentService = () => {
  return DATA_SOURCE === 'mock' ? exerciseMockService : exerciseApiService
}

export const exerciseService = {
  async getAll() {
    return getCurrentService().getAll()
  },

  async search(query: string) {
    return getCurrentService().search(query)
  },

  async create(name: string) {
    return getCurrentService().create(name)
  },

  async update(id: number, name: string) {
    return getCurrentService().update(id, name)
  },

  async remove(id: number) {
    return getCurrentService().remove(id)
  },
}

import type { Exercise } from '../types'
import { apiClient } from './api'

// Backend DTO
interface BackendExerciseDTO {
    id: number
    nome: string
}

// Frontend shape (Exercise already defines `nome`, keep compatibility and add `name`)
type FrontendExercise = Exercise & { name?: string }

const mapFromBackend = (b: BackendExerciseDTO): FrontendExercise => ({
    id: b.id,
    nome: b.nome,
    name: b.nome,
})

/**
 * Exercise service for real backend API (VITE_DATA_SOURCE=api)
 * Calls real Swagger endpoints:
 * - GET /exercicios/search?q=...
 * - POST /exercicios
 * - PUT /exercicios/{id}
 * - DELETE /exercicios/{id}
 */
export const exerciseApiService = {
    // Fetch all exercises from backend and map to frontend shape
    async getAll(): Promise<FrontendExercise[]> {
        const backend = await apiClient.get<BackendExerciseDTO[]>('/exercises')
        return (backend || []).map(mapFromBackend)
    },

    // Search (client-side filtering) — keeps compatibility with previous API
    async search(query: string): Promise<FrontendExercise[]> {
        try {
            const all = await this.getAll()
            if (!query) return all
            const q = query.toLowerCase()
            return all.filter(
                (e) => (e.nome || '').toLowerCase().includes(q) || (e.name || '').toLowerCase().includes(q)
            )
        } catch (error) {
            console.error('Failed to search exercises:', error)
            return []
        }
    },

    async create(name: string): Promise<FrontendExercise | null> {
        const created = await apiClient.post<BackendExerciseDTO>('/exercises', { nome: name })
        return created ? mapFromBackend(created) : null
    },

    async update(id: number, name: string): Promise<FrontendExercise | null> {
        const updated = await apiClient.put<BackendExerciseDTO>(`/exercises/${id}`, { nome: name })
        return updated ? mapFromBackend(updated) : null
    },

    async remove(id: number): Promise<boolean> {
        await apiClient.delete(`/exercises/${id}`)
        // delete returns 204 No Content, if no error thrown consider success
        return true
    },
}

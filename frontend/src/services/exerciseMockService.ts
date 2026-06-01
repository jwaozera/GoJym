import type { Exercise } from '../types'
import { mockExercises as mockExercisesSource } from '../mocks/data'

type FrontendExercise = Exercise & { name?: string }

// Create a local mutable copy of the shared mock exercises so mock services
// can mutate state during preview without touching the original export.
let mockExercises: FrontendExercise[] = mockExercisesSource.map((e: any) => ({ id: e.id, nome: e.nome, name: e.nome }))

/**
 * Exercise service for mock preview mode (VITE_DATA_SOURCE=mock)
 * No backend calls. Uses local mock data.
 */
export const exerciseMockService = {
    async getAll(): Promise<FrontendExercise[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 100))
        return [...mockExercises]
    },

    async search(query: string): Promise<FrontendExercise[]> {
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!query) return [...mockExercises]
        const q = query.toLowerCase()
        return mockExercises.filter(
            (e) => (e.nome || '').toLowerCase().includes(q) || (e.name || '').toLowerCase().includes(q)
        )
    },

    async create(name: string): Promise<FrontendExercise | null> {
        if (!name?.trim()) return null
        await new Promise((resolve) => setTimeout(resolve, 100))
        const newExercise: FrontendExercise = {
            id: Math.max(...mockExercises.map((e) => e.id), 0) + 1,
            nome: name,
            name: name,
        }
        mockExercises.push(newExercise)
        return newExercise
    },

    async update(id: number, name: string): Promise<FrontendExercise | null> {
        if (!name?.trim()) return null
        await new Promise((resolve) => setTimeout(resolve, 100))
        const exercise = mockExercises.find((e) => e.id === id)
        if (exercise) {
            exercise.nome = name
            exercise.name = name
            return { ...exercise }
        }
        return null
    },

    async remove(id: number): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 100))
        const idx = mockExercises.findIndex((e) => e.id === id)
        if (idx >= 0) {
            mockExercises.splice(idx, 1)
            return true
        }
        return false
    },
}

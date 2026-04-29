import type { WorkoutSession } from '../types'
import { mockSessions } from '../mocks/data'

// copy local mutável dos mocks simula um banco de dados em memória
let sessions: WorkoutSession[] = [...mockSessions]

export const workoutService = {
  getSessions: async (): Promise<WorkoutSession[]> => {
    await new Promise(r => setTimeout(r, 200))
    return sessions.map(s => ({ ...s }))
  },

  getSessionById: async (id: string): Promise<WorkoutSession | null> => {
    await new Promise(r => setTimeout(r, 200))
    return sessions.find(s => s.id === id) ?? null
  },

  createSession: async (
    data: Omit<WorkoutSession, 'id' | 'createdAt'>
  ): Promise<WorkoutSession> => {
    await new Promise(r => setTimeout(r, 400))
    const newSession: WorkoutSession = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    sessions = [...sessions, newSession]
    return newSession
  },

  updateSession: async (
    id: string,
    data: Partial<Omit<WorkoutSession, 'id' | 'createdAt'>>
  ): Promise<WorkoutSession | null> => {
    await new Promise(r => setTimeout(r, 300))
    const idx = sessions.findIndex(s => s.id === id)
    if (idx === -1) return null
    sessions[idx] = { ...sessions[idx], ...data }
    return { ...sessions[idx] }
  },

  deleteSession: async (id: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 300))
    const before = sessions.length
    sessions = sessions.filter(s => s.id !== id)
    return sessions.length < before
  },

  saveExecutionResult: async (
    sessionId: string,
    result: Partial<WorkoutSession>
  ): Promise<void> => {
    await new Promise(r => setTimeout(r, 300))
    const idx = sessions.findIndex(s => s.id === sessionId)
    if (idx !== -1) {
      sessions[idx] = { ...sessions[idx], ...result, isActive: false }
    }
    console.log('[mock] saveExecutionResult', sessionId, result)
  },

  setActiveSession: (sessionId: string): void => {
    sessions = sessions.map(s => ({ ...s, isActive: s.id === sessionId }))
  },

  clearActiveSession: (): void => {
    sessions = sessions.map(s => ({ ...s, isActive: false }))
  },
}

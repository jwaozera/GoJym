import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { workoutService } from '../services/workoutService'
import type { WorkoutSession } from '../types'

export interface ActiveExecution {
  sessionId: string
  sessionName: string
  exerciseCount: number
  completedSets: number
  totalSets: number
  currentExIdx: number
  timerSeconds: number
  startedAt: string // ISO date
}

interface WorkoutState {
  sessions: WorkoutSession[]
  loading: boolean
  activeExecution: ActiveExecution | null
  fetchSessions: () => Promise<void>
  createSession: (
    data: Omit<WorkoutSession, 'id' | 'createdAt'>
  ) => Promise<WorkoutSession>
  updateSession: (
    id: string,
    data: Partial<Omit<WorkoutSession, 'id' | 'createdAt'>>
  ) => Promise<WorkoutSession | null>
  deleteSession: (id: string) => Promise<boolean>
  addSession: (session: WorkoutSession) => void
  saveExecutionResult: (
    sessionId: string,
    result: Partial<WorkoutSession>
  ) => Promise<void>
  setActiveExecution: (data: ActiveExecution | null) => void
  clearActiveExecution: () => void
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      sessions: [],
      loading: false,
      activeExecution: null,

      fetchSessions: async () => {
        set({ loading: true })
        const sessions = await workoutService.getSessions()
        set({ sessions, loading: false })
      },

      createSession: async (data) => {
        const session = await workoutService.createSession(data)
        set(state => ({ sessions: [...state.sessions, session] }))
        return session
      },

      updateSession: async (id, data) => {
        const updated = await workoutService.updateSession(id, data)
        if (updated) {
          set(state => ({
            sessions: state.sessions.map(s => (s.id === id ? updated : s)),
          }))
        }
        return updated
      },

      deleteSession: async (id) => {
        const success = await workoutService.deleteSession(id)
        if (success) {
          set(state => ({
            sessions: state.sessions.filter(s => s.id !== id),
          }))
        }
        return success
      },

      addSession: (session) =>
        set(state => ({ sessions: [...state.sessions, session] })),

      saveExecutionResult: async (sessionId, result) => {
        await workoutService.saveExecutionResult(sessionId, result)
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId ? { ...s, ...result, isActive: false } : s
          ),
          activeExecution: null,
        }))
      },

      setActiveExecution: (data) =>
        set({ activeExecution: data }),

      clearActiveExecution: () =>
        set({ activeExecution: null }),
    }),
    { name: 'gojym-workouts' }
  )
)


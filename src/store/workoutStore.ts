import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { workoutService } from '../services/workoutService'
import type { WorkoutSession, CreateSessaoTreinoComExerciciosRequestDTO } from '../types'

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
  getFullSession: (sessionId: string) => Promise<WorkoutSession | null>
  createSession: (
    data: CreateSessaoTreinoComExerciciosRequestDTO
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
  startActiveSession: (sessionId: string) => Promise<void>
  setActiveExecution: (data: ActiveExecution | null) => void
  clearActiveExecution: () => Promise<void>
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
        set(state => ({
          sessions: sessions.map(s => ({
            ...s,
            isActive: state.activeExecution
              ? s.id === state.activeExecution.sessionId
              : s.isActive,
          })),
          loading: false,
        }))
      },

      getFullSession: async (sessionId) => {
        return await workoutService.getSessionById(sessionId)
      },

      createSession: async (data) => {
        const session = await workoutService.createSession(data)
        set(state => {
          const nextSessions = [...state.sessions, session]
          const totalSets = (session.exercicios?.length ?? 0)

          return {
            sessions: nextSessions,
            activeExecution: state.activeExecution,
          }
        })
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

      startActiveSession: async (sessionId) => {
        await workoutService.setActiveSession(sessionId)
        set(state => {
          const session = state.sessions.find(s => s.id === sessionId)
          const totalSets = session?.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) ?? 0

          return {
            sessions: state.sessions.map(s => ({
              ...s,
              isActive: s.id === sessionId,
            })),
            activeExecution: session
              ? {
                  sessionId: session.id,
                  sessionName: session.name,
                  exerciseCount: session.exercises.length,
                  completedSets: 0,
                  totalSets,
                  currentExIdx: 0,
                  timerSeconds: 0,
                  startedAt: new Date().toISOString(),
                }
              : state.activeExecution,
          }
        })
      },

      setActiveExecution: (data) =>
        set({ activeExecution: data }),

      clearActiveExecution: async () => {
        await workoutService.clearActiveSession()
        set(state => ({
          sessions: state.sessions.map(s => ({ ...s, isActive: false })),
          activeExecution: null,
        }))
      },
    }),
    { name: 'gojym-workouts' }
  )
)


import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (data: Pick<User, 'name' | 'email'>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, _password) => {
        await new Promise((r) => setTimeout(r, 800))
        set({ user: { id: '1', name: 'Artur Ferreira Marques da Silva', email }, isAuthenticated: true })
      },
      register: async (name, email, _password) => {
        await new Promise((r) => setTimeout(r, 800))
        set({ user: { id: '1', name, email }, isAuthenticated: true })
      },
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : { id: '1', ...data },
          isAuthenticated: true,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'gojym-auth' }
  )
)

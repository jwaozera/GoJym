import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../services/api'
import { decodeJWT } from '../utils/jwt'
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
      login: async (email, password) => {
        try {
          const token = await apiClient.post<string>('/auth/login', {
            email,
            senhaHash: password,
          })

          if (!token) {
            throw new Error('No token received from server')
          }

          // Decodificar JWT para extrair dados do usuário
          const payload = decodeJWT(token)
          const user: User = {
            id: payload.sub || payload.id || '1',
            name: payload.name || email,
            email: payload.email || email,
          }

          localStorage.setItem('token', token)
          set({ user, isAuthenticated: true })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },
      register: async (name, email, password) => {
        try {
          const token = await apiClient.post<string>('/auth/register', {
            nome:name,
            email,
            senhaHash: password,
          })

          if (!token) {
            throw new Error('No token received from server')
          }

          // Decodificar JWT para extrair dados do usuário
          const payload = decodeJWT(token)
          const user: User = {
            id: payload.sub || payload.id || '1',
            name: payload.name || name,
            email: payload.email || email,
          }

          localStorage.setItem('token', token)
          set({ user, isAuthenticated: true })
        } catch (error) {
          console.error('Registration failed:', error)
          throw error
        }
      },
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : { id: '1', ...data },
          isAuthenticated: true,
        }))
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
        localStorage.removeItem('token')
      },
    }),
    { name: 'gojym-auth' }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
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
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const result = await authService.login({ email, password })

          if (!result || !result.token) {
            throw new Error('No token received from server')
          }

          const token = result.token
          let user: User = result.user

          // Try to decode JWT for additional data
          try {
            const payload = decodeJWT(token)
            user = {
              id: payload.sub || payload.id || result.user.id,
              name: payload.name || result.user.name,
              email: payload.email || result.user.email,
            }
          } catch {
            // If JWT decode fails, use result.user as-is
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
          const result = await authService.register({ nome: name, email, password })

          if (!result) {
            throw new Error('Registration failed')
          }

          // If register already returned a token (authApiService performs login),
          // use it directly to avoid duplicate login. Otherwise, call login.
          if (result.token) {
            const token = result.token
            let user: User = result.user
            try {
              const payload = decodeJWT(token)
              user = {
                id: payload.sub || payload.id || result.user.id,
                name: payload.name || result.user.name,
                email: payload.email || result.user.email,
              }
            } catch {
              // ignore decode errors and use result.user
            }
            localStorage.setItem('token', token)
            set({ user, isAuthenticated: true })
          } else {
            const state = get() as AuthState
            await state.login(email, password)
          }
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

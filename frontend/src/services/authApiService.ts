import { apiClient } from './api'

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    nome: string
    email: string
    password: string
}

export interface User {
    id: string
    nome: string
    name: string
    email: string
}

/**
 * Auth service for real backend API (VITE_DATA_SOURCE=api)
 * Calls real endpoints from Swagger:
 * - POST /auth/register
 * - POST /auth/login
 */
export const authApiService = {
    async register(data: RegisterRequest): Promise<{ user: User; token: string } | null> {
        try {
            // Per backend contract, POST /auth/register expects `senhaHash` and
            // returns 200 OK without a token body. Do not expect a token here.
            await apiClient.post<void>('/auth/register', {
                nome: data.nome,
                email: data.email,
                senhaHash: data.password,
            })

            // After successful registration, perform login to obtain token
            const token = await apiClient.post<string>('/auth/login', {
                email: data.email,
                senhaHash: data.password,
            })

            if (!token) {
                throw new Error('No token received from server after registration')
            }

            return {
                user: {
                    id: data.email,
                    nome: data.nome,
                    name: data.nome,
                    email: data.email,
                },
                token,
            }
        } catch (error) {
            console.error('Registration failed:', error)
            return null
        }
    },

    async login(data: LoginRequest): Promise<{ user: User; token: string } | null> {
        try {
            // Backend expects `senhaHash` in the request payload
            const token = await apiClient.post<string>('/auth/login', {
                email: data.email,
                senhaHash: data.password,
            })

            if (!token || typeof token !== 'string' || !token.trim()) {
                throw new Error('No token received from server')
            }

            const namePart = data.email.split('@')[0]
            return {
                user: {
                    id: data.email,
                    nome: namePart,
                    name: namePart,
                    email: data.email,
                },
                token,
            }
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    },
}

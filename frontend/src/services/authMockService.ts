/**
 * Auth service for mock preview mode (VITE_DATA_SOURCE=mock)
 * No backend calls. Used for visual preview on Vercel.
 */

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

// Mock token (not real, for preview only)
const generateMockToken = (): string =>
    `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`

export const authMockService = {
    async register(data: RegisterRequest): Promise<{ user: User; token: string } | null> {
        // Validate non-empty fields for preview
        if (!data.nome?.trim() || !data.email?.trim() || !data.password?.trim()) {
            return null
        }

        return {
            user: {
                id: data.email,
                nome: data.nome,
                name: data.nome,
                email: data.email,
            },
            token: generateMockToken(),
        }
    },

    async login(data: LoginRequest): Promise<{ user: User; token: string } | null> {
        // Validate non-empty fields for preview
        if (!data.email?.trim() || !data.password?.trim()) {
            return null
        }

        return {
            user: {
                id: data.email,
                nome: data.email.split('@')[0] || 'User',
                name: data.email.split('@')[0] || 'User',
                email: data.email,
            },
            token: generateMockToken(),
        }
    },
}

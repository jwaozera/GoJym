import { DATA_SOURCE } from './api'
import { authApiService, type LoginRequest, type RegisterRequest } from './authApiService'
import { authMockService } from './authMockService'

/**
 * Unified auth service that routes to API or Mock based on DATA_SOURCE
 */
const getCurrentService = () => {
    return DATA_SOURCE === 'mock' ? authMockService : authApiService
}

export const authService = {
    async register(data: RegisterRequest) {
        return getCurrentService().register(data)
    },

    async login(data: LoginRequest) {
        return getCurrentService().login(data)
    },
}

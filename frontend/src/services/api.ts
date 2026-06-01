export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const rawDataSource = import.meta.env.VITE_DATA_SOURCE
export const DATA_SOURCE: 'api' | 'mock' =
  rawDataSource === 'mock' || rawDataSource === 'api' ? rawDataSource : 'api'

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/reset-password']

const isPublicEndpoint = (endpoint?: string) =>
  !!endpoint && PUBLIC_ENDPOINTS.some((p) => endpoint.startsWith(p))

const getHeaders = (endpoint?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (isPublicEndpoint(endpoint)) {
    return headers
  }
  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    // No Content
    return undefined as unknown as T
  }

  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    // Try to extract useful error info from body
    try {
      if (contentType?.includes('application/json')) {
        const errBody = await response.json()
        const msg = errBody?.message || JSON.stringify(errBody)
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${msg}`)
      } else {
        const txt = await response.text()
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${txt}`)
      }
    } catch (e) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
  }

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text() as Promise<unknown> as Promise<T>
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(endpoint),
    })
    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(endpoint),
    })
    return handleResponse<T>(response)
  },
}

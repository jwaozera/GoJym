const API_BASE_URL = 'http://localhost:8080'

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/reset-password']

const getHeaders = (endpoint?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  // Não enviar token em endpoints públicos
  if (endpoint && PUBLIC_ENDPOINTS.includes(endpoint)) {
    return headers
  }
  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(endpoint),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    } else {
      return response.text() as Promise<T>
    }
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(endpoint),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(endpoint),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },
}

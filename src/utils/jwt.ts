export interface JWTPayload {
  sub?: string
  id?: string
  email?: string
  name?: string
  iat?: number
  exp?: number
  [key: string]: any
}

export const decodeJWT = (token: string): JWTPayload => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const payload = parts[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return {}
  }
}

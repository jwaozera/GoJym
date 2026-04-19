/**
 * Design tokens extraídos do Figma — GoJym
 * Estes tokens são a fonte da verdade para cores, tipografia e espaçamentos.
 */

export const colors = {
  // Backgrounds
  background: '#0A0E1A',
  surface: '#141824',
  surfaceElevated: '#1E2433',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9BA3B4',

  // Accent (orange)
  accent: '#FF6B35',
  accentSoft: 'rgba(255, 107, 53, 0.1)',
  accentGradient: 'linear-gradient(0deg, #FF6B35 0%, #FF8F5E 100%)',

  // Success (green)
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.1)',

  // Danger (red)
  danger: '#EF4444',

  // Bottom nav
  bottomNavBg: 'rgba(20, 24, 36, 0.95)',

  // Surface gradient
  surfaceGradient: 'linear-gradient(135deg, #141824 0%, #1E2433 100%)',
  summaryGradient: 'linear-gradient(180deg, #0A0E1A 0%, #141824 100%)',
} as const

export const typography = {
  fontFamily: "'Inter', sans-serif",

  headingXl: { fontWeight: 700, fontSize: '36px', lineHeight: '1.11' },
  headingLg: { fontWeight: 700, fontSize: '20px', lineHeight: '1.4' },
  headingMd: { fontWeight: 600, fontSize: '16px', lineHeight: '1.5' },
  headingSm: { fontWeight: 600, fontSize: '14px', lineHeight: '1.43' },

  bodyMd: { fontWeight: 400, fontSize: '16px', lineHeight: '1.5' },
  bodySm: { fontWeight: 400, fontSize: '14px', lineHeight: '1.43' },
  bodyXs: { fontWeight: 400, fontSize: '12px', lineHeight: '1.33' },

  labelSm: { fontWeight: 600, fontSize: '12px', lineHeight: '1.33' },
  labelXs: { fontWeight: 500, fontSize: '10px', lineHeight: '1.5' },

  caption: { fontWeight: 400, fontSize: '10px', lineHeight: '1.5' },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
} as const

export const borderRadius = {
  sm: '10px',
  md: '12px',
  lg: '16px',
  xl: '20px',
} as const

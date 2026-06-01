import { type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gj-accent text-white shadow-[0px_2px_8px_0px_rgba(255,107,53,0.15)] hover:brightness-110 active:brightness-95',
  secondary:
    'bg-gj-surface-elevated text-white border border-gj-border hover:bg-[#2A3142] active:bg-[#232839]',
  ghost:
    'bg-transparent text-gj-text-secondary hover:bg-white/5 active:bg-white/10',
  danger:
    'bg-gj-danger text-white hover:brightness-110 active:brightness-95',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs rounded-gj-md gap-1.5',
  md: 'h-[44px] px-5 text-sm rounded-gj-lg gap-2',
  lg: 'h-[52px] px-6 text-base rounded-gj-lg gap-2',
}

export const Button = ({
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-semibold
        transition-all duration-200
        select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
      )}
      {children}
    </button>
  )
}

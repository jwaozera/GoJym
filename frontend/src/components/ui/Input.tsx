import { type InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  leftIcon?: LucideIcon
}

export const Input = ({
  label,
  error,
  leftIcon: LeftIcon,
  type = 'text',
  className = '',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gj-text-secondary leading-[1.33]">
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gj-text-secondary pointer-events-none">
            <LeftIcon size={18} />
          </div>
        )}

        <input
          type={resolvedType}
          className={`
            w-full h-[54px] rounded-gj-lg
            bg-gj-surface-elevated
            border
            ${error ? 'border-gj-danger' : 'border-gj-border'}
            ${LeftIcon ? 'pl-11 pr-4' : 'px-[17px]'}
            ${isPassword ? 'pr-12' : ''}
            text-base text-gj-text-primary
            placeholder:text-gj-text-secondary
            font-normal leading-[1.5]
            outline-none
            transition-colors duration-200
            focus:border-gj-accent
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gj-text-secondary hover:text-gj-text-primary transition-colors p-0.5 cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-gj-danger leading-[1.33]">{error}</span>
      )}
    </div>
  )
}

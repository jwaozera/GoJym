import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

export const Card = ({
  children,
  noPadding = false,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        bg-gj-surface
        border border-gj-border
        rounded-gj-lg
        ${noPadding ? '' : 'p-[15px]'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

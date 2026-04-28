import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Dumbbell, BarChart3, User } from 'lucide-react'

const navItems = [
  { label: 'Início', icon: Home, path: '/home' },
  { label: 'Treinos', icon: Dumbbell, path: '/workouts' },
  { label: 'Análise', icon: BarChart3, path: '/analysis' },
  { label: 'Perfil', icon: User, path: '/profile', disabled: true },
]

export const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-gj-bottom-nav border-t border-gj-border backdrop-blur-sm z-50">
      <div className="flex items-center justify-between px-6 pt-3 pb-6">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          const Icon = item.icon

          return (
            <button
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path)}
              disabled={item.disabled}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gj-accent-soft'
                  : item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-white/5'
              }`}
            >
              <Icon
                size={20}
                className={isActive ? 'text-gj-accent' : 'text-gj-text-secondary'}
              />
              <span
                className={`text-[10px] leading-[1.5] ${
                  isActive
                    ? 'text-gj-accent font-semibold'
                    : 'text-gj-text-secondary font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

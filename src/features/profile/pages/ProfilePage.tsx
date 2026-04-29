import { useState } from 'react'
import { ChevronRight, LogOut, Pencil, Trophy, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useAuthStore } from '../../../store/authStore'
import { fallbackProfile, profileMeta } from '../data/mockProfile'

const iconButtonClass =
  'w-9 h-9 rounded-gj-md bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary transition-colors duration-200 hover:text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2'

const formatProfileDisplayName = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).join(' ')

export const ProfilePage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [showLogoutSheet, setShowLogoutSheet] = useState(false)

  const profileName = formatProfileDisplayName(user?.name ?? fallbackProfile.name)

  const handleConfirmLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gj-background text-gj-text-primary px-5 pt-14 pb-28">
      <header className="mb-8">
        <h1 className="text-[28px] font-bold leading-[1.2] tracking-normal">Perfil</h1>
      </header>

      <Card className="mb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-gj-lg bg-gradient-to-br from-gj-accent to-[#FF8A50] text-white shadow-[0_8px_24px_rgba(255,107,53,0.24)]">
            <User size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold leading-[1.25]">{profileName}</h2>
            <p className="mt-1 text-sm text-gj-text-secondary">
              Membro desde {profileMeta.memberSinceLabel}
            </p>
          </div>

          <button
            type="button"
            className={iconButtonClass}
            onClick={() => navigate('/profile/edit')}
            aria-label="Editar perfil"
          >
            <Pencil size={18} />
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => navigate('/profile/records')}
          className="group w-full text-left"
        >
          <Card className="transition-colors duration-200 group-hover:border-gj-accent group-hover:bg-gj-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-gj-md bg-gj-accent-soft text-gj-accent">
                <Trophy size={20} />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold leading-[1.3]">Recordes pessoais</p>
              </div>
              <ChevronRight size={20} className="text-gj-text-secondary transition-colors group-hover:text-gj-accent" />
            </div>
          </Card>
        </button>

        <button
          type="button"
          onClick={() => setShowLogoutSheet(true)}
          className="group w-full text-left"
        >
          <Card className="transition-colors duration-200 group-hover:border-gj-danger/50 group-hover:bg-gj-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-gj-md bg-gj-danger/10 text-gj-danger">
                <LogOut size={20} />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold leading-[1.3] text-gj-danger">Sair da conta</p>
              </div>
              <ChevronRight size={20} className="text-gj-danger/70" />
            </div>
          </Card>
        </button>
      </div>

      {showLogoutSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowLogoutSheet(false)}
          />
          <div className="relative w-full max-w-[430px] rounded-t-gj-lg border-t border-gj-border bg-gj-surface animate-slideUp">
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-gj-border" />
            </div>
            <div className="px-5 pb-8 pt-6">
              <h2 className="text-xl font-bold leading-[1.25]">Sair da conta?</h2>
              <p className="mt-2 text-sm leading-[1.5] text-gj-text-secondary">
                Você será direcionado para a tela de login e precisará entrar novamente para acessar sua conta.
              </p>
              <div className="mt-6 space-y-3">
                <Button type="button" variant="danger" fullWidth onClick={handleConfirmLogout}>
                  Confirmar saída
                </Button>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowLogoutSheet(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

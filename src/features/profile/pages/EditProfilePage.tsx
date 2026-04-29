import { useState } from 'react'
import { ArrowLeft, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { fallbackProfile } from '../data/mockProfile'

const headerButtonClass =
  'w-9 h-9 rounded-gj-md bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary transition-colors duration-200 hover:text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2'

export const EditProfilePage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const [name, setName] = useState(user?.name ?? fallbackProfile.name)
  const [email, setEmail] = useState(user?.email ?? fallbackProfile.email)

  const handleSave = () => {
    updateProfile({
      name: name.trim() || fallbackProfile.name,
      email: email.trim() || fallbackProfile.email,
    })
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gj-background text-gj-text-primary">
      <div className="mx-auto min-h-screen max-w-[430px] overflow-x-hidden">
      <header className="border-b border-gj-border px-5 pb-4 pt-14">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={headerButtonClass}
            onClick={() => navigate('/profile')}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold leading-[1.25]">Editar perfil</h1>
        </div>
      </header>

      <main className="px-5 pb-8 pt-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-gj-lg bg-gradient-to-br from-gj-accent to-[#FF8A50] text-white shadow-[0_8px_24px_rgba(255,107,53,0.24)]">
            <User size={36} />
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="Nome completo"
            leftIcon={User}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
          />
          <Input
            label="Email"
            leftIcon={Mail}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <Button type="button" fullWidth className="mt-8" onClick={handleSave}>
          Salvar alterações
        </Button>
      </main>
      </div>
    </div>
  )
}

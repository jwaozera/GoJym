import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { Button, Input } from '../../../components/ui'
import { Dumbbell } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      navigate('/home')
    } catch {
      setError('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gj-bg flex flex-col items-center px-6">
      {/* Logo */}
      <div className="mt-[145px] mb-4 flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-gj-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
            boxShadow: '0px 4px 16px 0px rgba(255, 107, 53, 0.2)',
          }}
        >
          <Dumbbell size={36} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-white leading-[1.33]">
          GoJym
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[343px] mt-[56px] flex flex-col gap-4"
      >
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Esqueci minha senha */}
        <button
          type="button"
          onClick={() => navigate('/reset-password')}
          className="self-start text-xs font-medium text-gj-accent leading-[1.33] hover:underline cursor-pointer"
        >
          Esqueci minha senha
        </button>

        {/* Erro */}
        {error && (
          <p className="text-sm text-gj-danger text-center">{error}</p>
        )}

        {/* Entrar */}
        <Button type="submit" fullWidth loading={loading}>
          Entrar
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gj-border" />
          <span className="text-xs text-gj-text-secondary">ou</span>
          <div className="flex-1 h-px bg-gj-border" />
        </div>

        {/* Criar conta */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => navigate('/register')}
        >
          Criar conta
        </Button>
      </form>
    </div>
  )
}

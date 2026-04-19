import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { Button, Input } from '../../../components/ui'
import { ArrowLeft, Dumbbell } from 'lucide-react'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!email.trim()) newErrors.email = 'Email é obrigatório'
    if (password.length < 6) newErrors.password = 'Mínimo de 6 caracteres'
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      await register(name, email, password)
      navigate('/home')
    } catch {
      setErrors({ form: 'Erro ao criar conta' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gj-bg flex flex-col px-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-12 left-6 w-9 h-9 rounded-gj-md bg-gj-surface-elevated flex items-center justify-center text-white hover:bg-[#2A3142] transition-colors cursor-pointer"
        aria-label="Voltar"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Header */}
      <div className="mt-[112px] flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-gj-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
            boxShadow: '0px 4px 12px 0px rgba(255, 107, 53, 0.18)',
          }}
        >
          <Dumbbell size={28} className="text-white" />
        </div>

        <h1 className="text-xl font-bold text-white leading-[1.4]">
          Criar conta
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[343px] mx-auto mt-10 flex flex-col gap-4"
      >
        <Input
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        {/* Erro geral */}
        {errors.form && (
          <p className="text-sm text-gj-danger text-center">{errors.form}</p>
        )}

        {/* Submit */}
        <Button type="submit" fullWidth loading={loading}>
          Criar conta
        </Button>

        {/* Link login */}
        <p className="text-center text-xs text-gj-text-secondary mt-2">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-gj-accent font-medium hover:underline cursor-pointer"
          >
            Entrar
          </button>
        </p>
      </form>
    </div>
  )
}

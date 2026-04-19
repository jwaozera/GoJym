import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../../components/ui'
import { ArrowLeft, Mail } from 'lucide-react'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Informe seu email')
      return
    }

    setLoading(true)
    // simula o envio
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
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
      <div className="mt-[108px] flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-gj-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
            boxShadow: '0px 4px 12px 0px rgba(255, 107, 53, 0.18)',
          }}
        >
          <Mail size={28} className="text-white" />
        </div>

        <h1 className="text-xl font-bold text-white leading-[1.4]">
          Redefinir senha
        </h1>

        <p className="text-sm text-gj-text-secondary text-center leading-[1.43]">
          Informe seu email para receber as instruções
        </p>
      </div>

      {/* Conteúdo */}
      <div className="w-full max-w-[343px] mx-auto mt-10">
        {sent ? (
          /* Estado de sucesso */
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gj-success-soft flex items-center justify-center">
              <Mail size={28} className="text-gj-success" />
            </div>

            <h2 className="text-base font-semibold text-white">
              Instruções enviadas!
            </h2>

            <p className="text-sm text-gj-text-secondary leading-[1.43]">
              Verifique sua caixa de entrada em{' '}
              <span className="text-white font-medium">{email}</span>
              {' '}e siga as instruções para redefinir sua senha.
            </p>

            <Button
              fullWidth
              onClick={() => navigate('/login')}
              className="mt-4"
            >
              Voltar ao login
            </Button>
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button type="submit" fullWidth loading={loading}>
              Enviar instruções
            </Button>

            <p className="text-center text-xs text-gj-text-secondary mt-2">
              Lembrou sua senha?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gj-accent font-medium hover:underline cursor-pointer"
              >
                Voltar ao login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

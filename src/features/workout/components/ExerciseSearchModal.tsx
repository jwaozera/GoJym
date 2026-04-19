import { useState, useEffect, useRef } from 'react'
import { useExercises } from '../../../hooks/useExercises'
import type { Exercise } from '../../../types'
import { Search, X, Plus, Loader2 } from 'lucide-react'

interface ExerciseSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (exercise: Exercise) => void
}

export const ExerciseSearchModal = ({
  isOpen,
  onClose,
  onSelect,
}: ExerciseSearchModalProps) => {
  const [search, setSearch] = useState('')
  const { exercises, loading } = useExercises(search)
  const inputRef = useRef<HTMLInputElement>(null)

  // foca no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // bloqueia scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* bottom sheet */}
      <div
        className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp"
        style={{ maxHeight: '75vh' }}
      >
        {/* drag handle */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gj-border" />
        </div>

        {/* conteúdo */}
        <div className="flex flex-col px-5 pb-6">
          {/* campo de busca */}
          <div className="relative mb-3">
            <div className="flex items-center gap-2 bg-gj-surface-elevated border border-gj-border rounded-gj-lg px-3 h-12">
              <Search size={16} className="text-gj-text-secondary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar exercício..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gj-text-secondary outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gj-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* lista de resultados */}
          <div
            className="flex flex-col gap-1 overflow-y-auto pr-1"
            style={{ maxHeight: 'calc(75vh - 140px)' }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-gj-accent animate-spin" />
              </div>
            ) : exercises.length === 0 && search.length > 0 ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <span className="text-sm text-gj-text-secondary">
                  Nenhum exercício encontrado
                </span>
                <button
                  onClick={() => {
                    const custom: Exercise = {
                      id: `custom-${Date.now()}`,
                      name: search,
                      category: 'Personalizado',
                      muscleGroup: 'Outros',
                    }
                    onSelect(custom)
                    onClose()
                  }}
                  className="flex items-center gap-2 text-sm text-gj-accent hover:underline cursor-pointer"
                >
                  <Plus size={14} />
                  Adicionar exercício personalizado: "{search}"
                </button>
              </div>
            ) : (
              exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    onSelect(ex)
                    onClose()
                  }}
                  className="flex items-center gap-3 p-3 rounded-gj-lg hover:bg-gj-surface-elevated transition-colors text-left cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white">{ex.name}</span>
                    <span className="text-[11px] text-gj-text-secondary">
                      {ex.muscleGroup} • {ex.category}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useReducer, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockSessions } from '../../../mocks/data'
import type { Exercise } from '../../../types'
import { Input, Button } from '../../../components/ui'
import { ExerciseSearchModal } from '../components/ExerciseSearchModal'
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Dumbbell,
  CheckCircle,
  Save,
  AlertTriangle,
} from 'lucide-react'

/* ----- tipos do reducer ----- */
interface ExerciseRow {
  id: string
  exercise: Exercise
  sets: string
  reps: string
  rest: string
}

interface FormState {
  name: string
  category: string
  objective: string
  duration: string
  exercises: ExerciseRow[]
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'ADD_EXERCISE'; exercise: Exercise }
  | { type: 'REMOVE_EXERCISE'; id: string }
  | { type: 'UPDATE_EXERCISE'; id: string; field: 'sets' | 'reps' | 'rest'; value: string }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }

    case 'ADD_EXERCISE':
      return {
        ...state,
        exercises: [
          ...state.exercises,
          {
            id: `ex-${Date.now()}`,
            exercise: action.exercise,
            sets: '3',
            reps: '8-12',
            rest: '90s',
          },
        ],
      }

    case 'REMOVE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter((e) => e.id !== action.id),
      }

    case 'UPDATE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map((e) =>
          e.id === action.id ? { ...e, [action.field]: action.value } : e
        ),
      }

    default:
      return state
  }
}

/* ----- componente ----- */
export const EditWorkoutPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const session = mockSessions.find((s) => s.id === sessionId)

  // converter sessão para FormState
  const buildInitialState = (): FormState => {
    if (!session) {
      return { name: '', category: '', objective: 'Hipertrofia', duration: '', exercises: [] }
    }

    const categories = [...new Set(session.exercises.map((we) => we.exercise.category))]

    return {
      name: session.name,
      category: categories.join(', '),
      objective: 'Hipertrofia',
      duration: session.durationSeconds
        ? String(Math.round(session.durationSeconds / 60))
        : '55',
      exercises: session.exercises.map((we) => {
        const reps = we.sets.map((s) => s.reps).filter((r): r is number => r !== null)
        const minR = reps.length ? Math.min(...reps) : 0
        const maxR = reps.length ? Math.max(...reps) : 0
        return {
          id: we.id,
          exercise: we.exercise,
          sets: String(we.sets.length),
          reps: minR === maxR ? String(minR) : `${minR}-${maxR}`,
          rest: `${we.restSeconds ?? 60}s`,
        }
      }),
    }
  }

  const [state, dispatch] = useReducer(formReducer, buildInitialState())
  const [showSearch, setShowSearch] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; leaving: boolean }>({
    show: false,
    leaving: false,
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-3 px-5">
        <span className="text-lg font-bold text-white">Treino não encontrado</span>
        <button
          onClick={() => navigate('/workouts')}
          className="text-sm text-gj-accent hover:underline cursor-pointer"
        >
          Voltar para treinos
        </button>
      </div>
    )
  }

  const handleSave = () => {
    if (!state.name.trim()) return

    setToast({ show: true, leaving: false })
    setTimeout(() => {
      setToast({ show: true, leaving: true })
      setTimeout(() => {
        setToast({ show: false, leaving: false })
        navigate(`/workouts/${session.id}`)
      }, 300)
    }, 1800)
  }

  const handleDelete = () => {
    // em produção removeria do store — por agora volta para a lista
    navigate('/workouts')
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3 border-b border-gj-border">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-gj-md bg-gj-surface-elevated flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-lg font-bold text-white leading-[1.4]">Editar treino</span>
      </div>

      {/* ===== FORM ===== */}
      <div className="flex-1 flex flex-col gap-4 px-5 py-4 overflow-y-auto">
        {/* nome */}
        <Input
          label="Nome do treino *"
          placeholder="Ex: Treino A — Push"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })
          }
        />

        {/* categoria + objetivo */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Categoria"
            placeholder="Push"
            value={state.category}
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })
            }
          />
          <Input
            label="Objetivo"
            placeholder="Hipertrofia"
            value={state.objective}
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', field: 'objective', value: e.target.value })
            }
          />
        </div>

        {/* duração */}
        <Input
          label="Duração estimada"
          placeholder="55 min"
          value={state.duration}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'duration', value: e.target.value })
          }
        />

        {/* ===== EXERCISE LIST ===== */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Exercícios</span>
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-gj-md bg-gj-surface-elevated border border-gj-border text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Adicionar
            </button>
          </div>

          {state.exercises.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 px-4 rounded-gj-lg border border-dashed border-gj-border">
              <div className="w-14 h-14 rounded-full bg-gj-surface-elevated flex items-center justify-center">
                <Dumbbell size={24} className="text-gj-text-secondary" />
              </div>
              <span className="text-sm text-gj-text-secondary text-center">
                Todos os exercícios foram removidos.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {state.exercises.map((row) => (
                <ExerciseCardInline
                  key={row.id}
                  row={row}
                  onUpdate={(field, value) =>
                    dispatch({ type: 'UPDATE_EXERCISE', id: row.id, field, value })
                  }
                  onRemove={() =>
                    dispatch({ type: 'REMOVE_EXERCISE', id: row.id })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* ===== EXCLUIR TREINO ===== */}
        <div className="mt-4 pt-4 border-t border-gj-border">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-10 rounded-gj-lg border border-gj-danger/30 text-gj-danger text-sm font-semibold hover:bg-gj-danger/10 transition-colors cursor-pointer"
            >
              Excluir treino
            </button>
          ) : (
            <div className="flex flex-col gap-3 p-4 rounded-gj-lg bg-gj-danger/5 border border-gj-danger/20">
              <div className="flex items-center gap-2 text-gj-danger">
                <AlertTriangle size={16} />
                <span className="text-sm font-semibold">Confirmar exclusão?</span>
              </div>
              <p className="text-xs text-gj-text-secondary">
                Esta ação não pode ser desfeita. O treino e todo o histórico serão removidos.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="px-5 py-4 border-t border-gj-border bg-gj-bg">
        <button
          onClick={handleSave}
          disabled={!state.name.trim()}
          className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Salvar alterações
        </button>
      </div>

      {/* ===== SEARCH MODAL ===== */}
      <ExerciseSearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={(exercise) => dispatch({ type: 'ADD_EXERCISE', exercise })}
      />

      {/* ===== TOAST ===== */}
      {toast.show && (
        <div
          className={`fixed top-14 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-40px)] max-w-[390px] flex items-center gap-3 p-4 rounded-gj-lg bg-gj-surface border border-gj-success/30 shadow-lg shadow-gj-success/10 ${
            toast.leaving ? 'animate-toast-out' : 'animate-toast-in'
          }`}
        >
          <CheckCircle size={18} className="text-gj-success shrink-0" />
          <span className="text-sm font-medium text-white">
            Alterações salvas com sucesso
          </span>
        </div>
      )}
    </div>
  )
}

/* ---------- ExerciseCard inline ---------- */
interface ExerciseCardInlineProps {
  row: ExerciseRow
  onUpdate: (field: 'sets' | 'reps' | 'rest', value: string) => void
  onRemove: () => void
}

const ExerciseCardInline = ({ row, onUpdate, onRemove }: ExerciseCardInlineProps) => (
  <div className="bg-gj-surface border border-gj-border rounded-gj-lg p-3.5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-gj-md bg-gj-accent-soft flex items-center justify-center text-gj-accent">
          <GripVertical size={14} />
        </div>
        <span className="text-sm font-semibold text-white">{row.exercise.name}</span>
      </div>
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-gj-md flex items-center justify-center text-gj-text-secondary hover:text-gj-danger hover:bg-gj-danger/10 transition-colors cursor-pointer"
      >
        <Trash2 size={14} />
      </button>
    </div>

    <div className="grid grid-cols-3 gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gj-text-secondary leading-[1.5]">Séries</label>
        <input
          type="text"
          value={row.sets}
          onChange={(e) => onUpdate('sets', e.target.value)}
          className="h-9 px-2.5 bg-gj-surface-elevated border border-gj-border rounded-gj-md text-sm text-white text-center outline-none focus:border-gj-accent transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gj-text-secondary leading-[1.5]">Reps</label>
        <input
          type="text"
          value={row.reps}
          onChange={(e) => onUpdate('reps', e.target.value)}
          className="h-9 px-2.5 bg-gj-surface-elevated border border-gj-border rounded-gj-md text-sm text-white text-center outline-none focus:border-gj-accent transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gj-text-secondary leading-[1.5]">Descanso</label>
        <input
          type="text"
          value={row.rest}
          onChange={(e) => onUpdate('rest', e.target.value)}
          className="h-9 px-2.5 bg-gj-surface-elevated border border-gj-border rounded-gj-md text-sm text-white text-center outline-none focus:border-gj-accent transition-colors"
        />
      </div>
    </div>
  </div>
)

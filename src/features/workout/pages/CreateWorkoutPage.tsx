import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Exercise } from '../../../types'
import { useWorkoutStore } from '../../../store/workoutStore'
import { Input } from '../../../components/ui'
import { ExerciseSearchModal } from '../components/ExerciseSearchModal'
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Dumbbell,
  CheckCircle,
  Save,
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

const initialState: FormState = {
  name: '',
  exercises: [],
}

/* ----- componente ----- */
export const CreateWorkoutPage = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const createSession = useWorkoutStore(s => s.createSession)
  const [showSearch, setShowSearch] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; leaving: boolean }>({
    show: false,
    leaving: false,
  })

  const handleAddExercise = (exercise: Exercise) => {
    dispatch({ type: 'ADD_EXERCISE', exercise })
  }

  const handleSave = async () => {
    if (!state.name.trim() || state.exercises.length === 0) return

    try {
      await createSession({
        name: state.name,
        isActive: false,
        exercises: state.exercises.map(row => ({
          id: `we-${crypto.randomUUID()}`,
          exercise: row.exercise,
          restSeconds: parseInt(row.rest.replace('s', '')) || 90,
          sets: Array.from({ length: parseInt(row.sets) || 3 }, (_, i) => ({
            id: crypto.randomUUID(),
            setNumber: i + 1,
            weight: null,
            reps: null,
            completed: false,
          })),
        })),
      })

      setToast({ show: true, leaving: false })
      setTimeout(() => {
        setToast({ show: true, leaving: true })
        setTimeout(() => {
          setToast({ show: false, leaving: false })
          navigate('/workouts')
        }, 300)
      }, 1800)
    } catch {
      // Tratamento de erro futuro
    }
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
        <span className="text-lg font-bold text-white leading-[1.4]">Criar treino</span>
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

          {/* estado vazio */}
          {state.exercises.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 px-4 rounded-gj-lg border border-dashed border-gj-border">
              <div className="w-14 h-14 rounded-full bg-gj-surface-elevated flex items-center justify-center">
                <Dumbbell size={24} className="text-gj-text-secondary" />
              </div>
              <span className="text-sm text-gj-text-secondary text-center">
                Nenhum exercício adicionado.
                <br />
                Toque em "Adicionar" para começar.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {state.exercises.map((row) => (
                <ExerciseCard
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
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="px-5 pt-4 pb-8 bg-gj-bg">
        <button
          onClick={handleSave}
          disabled={!state.name.trim() || state.exercises.length === 0}
          className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Salvar treino
        </button>
      </div>

      {/* ===== SEARCH MODAL ===== */}
      <ExerciseSearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleAddExercise}
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
            Treino salvo com sucesso
          </span>
        </div>
      )}
    </div>
  )
}

/* ---------- ExerciseCard inline ---------- */
interface ExerciseCardProps {
  row: ExerciseRow
  onUpdate: (field: 'sets' | 'reps' | 'rest', value: string) => void
  onRemove: () => void
}

const ExerciseCard = ({ row, onUpdate, onRemove }: ExerciseCardProps) => (
  <div className="bg-gj-surface border border-gj-border rounded-gj-lg p-3.5">
    {/* header */}
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

    {/* config row (séries / reps / descanso) */}
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

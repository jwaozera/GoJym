import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../../store/workoutStore'
import { useTimer } from '../../../hooks/useTimer'
import { SetInputRow } from '../components/SetInputRow'
import { RestTimer } from '../components/RestTimer'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Clock,
  Flame,
  Dumbbell,
  Target,
  Award,
  CheckCircle,
  SkipForward,
} from 'lucide-react'

/* ====== tipos internos ====== */
interface LiveSet {
  id: string
  setNumber: number
  weight: string
  reps: string
  completed: boolean
  lastWeight: number | null
  lastReps: number | null
}

interface LiveExercise {
  id: string
  name: string
  setsTarget: string // e.g. "4x8-12"
  restSeconds: number
  lastMaxWeight: number | null
  sets: LiveSet[]
}

type PageView = 'execution' | 'finishing' | 'summary'

/* ====== componente principal ====== */
export const ExecuteWorkoutPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const timer = useTimer()

  const { sessions, fetchSessions } = useWorkoutStore()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const session = sessions.find((s) => s.id === sessionId)

  /* ----- construir estado live ----- */
  const buildLiveExercises = useCallback((): LiveExercise[] => {
    if (!session) return []
    return session.exercises.map((we) => {
      const reps = we.sets.map((s) => s.reps).filter((r): r is number => r !== null)
      const minR = reps.length ? Math.min(...reps) : 0
      const maxR = reps.length ? Math.max(...reps) : 0
      const maxWeight = we.sets.reduce((max, s) => Math.max(max, s.weight ?? 0), 0)
      return {
        id: we.id,
        name: we.exercise.name,
        setsTarget: `${we.sets.length}x${minR === maxR ? minR : `${minR}-${maxR}`}`,
        restSeconds: we.restSeconds ?? 60,
        lastMaxWeight: maxWeight || null,
        sets: we.sets.map((s) => ({
          id: s.id,
          setNumber: s.setNumber,
          weight: s.weight?.toString() ?? '',
          reps: s.reps?.toString() ?? '',
          completed: false,
          lastWeight: s.weight,
          lastReps: s.reps,
        })),
      }
    })
  }, [session])

  const [exercises, setExercises] = useState<LiveExercise[]>([])
  const [currentExIdx, setCurrentExIdx] = useState(0)
  const [activeSetId, setActiveSetId] = useState<string | null>(null)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [showEndSheet, setShowEndSheet] = useState(false)
  const [view, setView] = useState<PageView>('execution')
  const initRef = useRef(false)

  /* Stable callbacks for RestTimer — must be before any early return */
  const handleRestFinish = useCallback(() => setShowRestTimer(false), [])
  const handleRestSkip = useCallback(() => setShowRestTimer(false), [])

  /* init */
  useEffect(() => {
    if (session && !initRef.current) {
      const built = buildLiveExercises()
      setExercises(built)
      // Focar na primeira série não concluída
      const firstSet = built[0]?.sets[0]
      setActiveSetId(firstSet?.id ?? null)
      timer.start()
      initRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  if (!session || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 px-5">
        <span className="text-lg font-bold text-white">Treino não encontrado</span>
        <button onClick={() => navigate('/workouts')} className="text-sm text-gj-accent cursor-pointer">
          Voltar para treinos
        </button>
      </div>
    )
  }

  const currentEx = exercises[currentExIdx]
  const totalExercises = exercises.length
  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0)
  const completedSets = exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.completed).length,
    0
  )
  const isLastExercise = currentExIdx === totalExercises - 1

  // Derivar activeSet a partir de activeSetId
  const activeSet = currentEx.sets.find(s => s.id === activeSetId)
    ?? currentEx.sets.find(s => !s.completed)
    ?? currentEx.sets[0]

  const isLastSet = currentEx.sets.every(s => s.completed || s.id === activeSetId)
    && currentEx.sets[currentEx.sets.length - 1].id === activeSetId

  /* ---- progress ratio (exercises) ---- */
  const exProgress = (currentExIdx + 1) / totalExercises

  /* ====== HANDLERS ====== */

  const handleWeightChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === currentEx.id
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, weight: value } : s)),
            }
          : ex
      )
    )
  }

  const handleRepsChange = (setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === currentEx.id
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, reps: value } : s)),
            }
          : ex
      )
    )
  }

  const handleToggleComplete = (setId: string) => {
    const targetSet = currentEx.sets.find(s => s.id === setId)

    // Se estava concluída e clicou para desmarcar
    if (targetSet?.completed) {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === currentEx.id
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, completed: false } : s
                ),
              }
            : ex
        )
      )
      setActiveSetId(setId)
      return
    }

    // Marcar como concluída e calcular próxima série
    setExercises((prev) => {
      const updated = prev.map((ex) =>
        ex.id === currentEx.id
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, completed: true } : s
              ),
            }
          : ex
      )

      // Achatar todas as séries em ordem para encontrar a próxima
      const allSets = updated.flatMap((ex) =>
        ex.sets.map((s) => ({ ...s, exerciseId: ex.id }))
      )
      const currentIdx = allSets.findIndex((s) => s.id === setId)
      const next = allSets.slice(currentIdx + 1).find((s) => !s.completed)

      // Agendar side-effects fora do setState
      queueMicrotask(() => {
        if (next) {
          const parentExIdx = updated.findIndex((ex) =>
            ex.sets.some((s) => s.id === next.id)
          )
          if (parentExIdx !== -1 && parentExIdx !== currentExIdx) {
            setCurrentExIdx(parentExIdx)
          }
          setActiveSetId(next.id)
          setShowRestTimer(true)
        } else {
          // Todas as séries concluídas
          timer.pause()
          setView('finishing')
        }
      })

      return updated
    })
  }

  const handleFinishWorkout = () => {
    timer.pause()
    setView('summary')
  }

  const handleCancel = () => {
    setShowEndSheet(true)
  }

  const handleSkipExercise = () => {
    if (isLastExercise) {
      setShowEndSheet(true)
    } else {
      handleNextExercise()
    }
  }

  const handleEndSheetContinue = () => {
    setShowEndSheet(false)
  }

  const handleEndSheetFinish = () => {
    setShowEndSheet(false)
    timer.pause()
    setView('summary')
  }

  const handleEndSheetDiscard = () => {
    setShowEndSheet(false)
    timer.reset()
    navigate('/workouts')
  }

  const handlePrevExercise = () => {
    if (currentExIdx > 0) {
      const prevIdx = currentExIdx - 1
      setCurrentExIdx(prevIdx)
      // Focar na primeira série não completa do exercício anterior
      const firstIncomplete = exercises[prevIdx].sets.find(s => !s.completed)
      setActiveSetId(firstIncomplete?.id ?? exercises[prevIdx].sets[0]?.id ?? null)
    }
  }

  const handleNextExercise = () => {
    if (currentExIdx < totalExercises - 1) {
      const nextIdx = currentExIdx + 1
      setCurrentExIdx(nextIdx)
      // Focar na primeira série não completa do próximo exercício
      const firstIncomplete = exercises[nextIdx].sets.find(s => !s.completed)
      setActiveSetId(firstIncomplete?.id ?? exercises[nextIdx].sets[0]?.id ?? null)
    }
  }


  /* ====== SUMMARY VIEW ====== */
  if (view === 'summary') {
    const durationMin = Math.floor(timer.seconds / 60)
    const totalWeight = exercises.reduce(
      (a, ex) =>
        a +
        ex.sets
          .filter((s) => s.completed)
          .reduce((b, s) => b + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0),
      0
    )
    const totalWeightTons = (totalWeight / 1000).toFixed(1)
    const completedExercises = exercises.filter((ex) =>
      ex.sets.every((s) => s.completed)
    ).length
    const maxWeightSet = exercises.flatMap((ex) => ex.sets.filter((s) => s.completed))
      .reduce(
        (max, s) => {
          const w = parseFloat(s.weight) || 0
          return w > max.weight ? { weight: w, reps: s.reps } : max
        },
        { weight: 0, reps: '0' }
      )
    const maxExName = exercises.find((ex) =>
      ex.sets.some(
        (s) => (parseFloat(s.weight) || 0) === maxWeightSet.weight
      )
    )?.name ?? ''

    return (
      <div
        className="flex flex-col min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #0A0E1A 0%, #141824 100%)',
        }}
      >
        {/* top icon + title */}
        <div className="flex flex-col items-center pt-16 pb-4">
          <div
            className="w-16 h-16 rounded-gj-lg flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            }}
          >
            <CheckCircle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Treino concluído</h1>
        </div>

        {/* metrics row */}
        <div className="grid grid-cols-3 gap-2 px-5 mb-3">
          {[
            { icon: <Dumbbell size={18} className="text-gj-accent" />, value: String(completedSets), label: 'Séries', bg: 'rgba(255,107,53,0.08)' },
            { icon: <Clock size={18} className="text-blue-400" />, value: `${durationMin}min`, label: 'Tempo', bg: 'rgba(59,130,246,0.08)' },
            { icon: <Flame size={18} className="text-gj-success" />, value: `${totalWeightTons}t`, label: 'Carga total', bg: 'rgba(16,185,129,0.08)' },
          ].map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center gap-1 py-4 rounded-gj-lg bg-gj-surface border border-gj-border"
            >
              <div
                className="w-9 h-9 rounded-gj-md flex items-center justify-center mb-1"
                style={{ background: m.bg }}
              >
                {m.icon}
              </div>
              <span className="text-xl font-bold text-white">{m.value}</span>
              <span className="text-[10px] text-gj-text-secondary">{m.label}</span>
            </div>
          ))}
        </div>

        {/* summary block */}
        <div className="mx-5 mb-3 rounded-gj-lg bg-gj-surface border border-gj-border overflow-hidden">
          <div className="px-4 py-3 border-b border-gj-border">
            <span className="text-sm font-semibold text-white">Resumo da sessão</span>
          </div>
          {[
            { label: 'Treino', value: session.name },
            { label: 'Exercícios concluídos', value: `${completedExercises}/${totalExercises}` },
            { label: 'Séries concluídas', value: `${completedSets}/${totalSets}` },
            { label: 'Maior carga', value: `${maxWeightSet.weight}kg — ${maxExName}` },
            { label: 'Duração real', value: `${durationMin} min` },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-3 ${
                i < arr.length - 1 ? 'border-b border-gj-border' : ''
              }`}
            >
              <span className="text-xs text-gj-text-secondary">{row.label}</span>
              <span className="text-sm font-semibold text-white">{row.value}</span>
            </div>
          ))}
        </div>

        {/* highlights */}
        <div className="mx-5 mb-4 rounded-gj-lg bg-gj-surface border border-gj-border overflow-hidden">
          <div className="px-4 py-3 border-b border-gj-border">
            <span className="text-sm font-semibold text-white">Destaques</span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {/* PR */}
            <div className="flex items-center gap-3 p-3 rounded-gj-md bg-gj-accent/5 border border-gj-accent/15">
              <Trophy size={18} className="text-gj-accent shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white block">Novo recorde pessoal</span>
                <span className="text-[10px] text-gj-text-secondary">
                  {maxExName} — {maxWeightSet.weight}kg × {maxWeightSet.reps} reps
                </span>
              </div>
            </div>
            {/* weekly goal */}
            <div className="flex items-center gap-3 p-3 rounded-gj-md bg-blue-500/5 border border-blue-500/15">
              <Target size={18} className="text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white block">Meta semanal atingida</span>
                <span className="text-[10px] text-gj-text-secondary">4/4 sessões concluídas esta semana</span>
              </div>
            </div>
            {/* streak */}
            <div className="flex items-center gap-3 p-3 rounded-gj-md bg-gj-success/5 border border-gj-success/15">
              <Award size={18} className="text-gj-success shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white block">Streak de 4 sessões</span>
                <span className="text-[10px] text-gj-text-secondary">Você está consistente. Continue assim!</span>
              </div>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex flex-col gap-3 px-5 pb-8 mt-auto">
          <button
            onClick={() => navigate('/home')}
            className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20"
          >
            Voltar ao início
          </button>
          <button
            onClick={() => navigate('/workouts')}
            className="w-full h-12 rounded-gj-lg bg-gj-surface-elevated border border-gj-border text-white text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          >
            Ver análise
          </button>
        </div>
      </div>
    )
  }

  /* ====== FINISHING CONFIRMATION VIEW ====== */
  if (view === 'finishing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-6">
        <div
          className="w-16 h-16 rounded-gj-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
          }}
        >
          <CheckCircle size={32} className="text-white" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Finalizar treino?</h2>
          <p className="text-sm text-gj-text-secondary">
            Você completou {completedSets} de {totalSets} séries em {timer.formatted.slice(3)}.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleFinishWorkout}
            className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20"
          >
            <CheckCircle size={16} />
            Concluir treino
          </button>
          <button
            onClick={() => setView('execution')}
            className="w-full h-12 rounded-gj-lg bg-gj-surface-elevated border border-gj-border text-white text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          >
            Continuar treinando
          </button>
        </div>
      </div>
    )
  }

  /* ====== EXECUTION VIEW ====== */
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HEADER ===== */}
      <div
        className="flex flex-col gap-3 px-5 pt-14 pb-3 border-b border-gj-border"
        style={{ background: 'rgba(20, 24, 36, 0.5)' }}
      >
        {/* top row */}
        <div className="flex items-center justify-between">
          {/* close */}
          <button
            onClick={handleCancel}
            className="w-9 h-9 rounded-gj-md bg-gj-surface-elevated flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* exercise indicator + timer */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gj-text-secondary">Exercício</span>
            <span className="text-lg font-bold text-white">
              {currentExIdx + 1}/{totalExercises}
            </span>
          </div>

          {/* timer */}
          <div className="flex items-center gap-1 h-9 px-3 rounded-gj-md bg-gj-surface-elevated">
            <Clock size={12} className="text-gj-accent" />
            <span className="text-xs font-semibold text-white tabular-nums">
              {timer.formatted.slice(3)}
            </span>
          </div>
        </div>

        {/* progress bar */}
        <div className="w-full h-2 rounded-full bg-gj-surface-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${exProgress * 100}%`,
              background: 'linear-gradient(90deg, #FF6B35, #FF8F5E)',
            }}
          />
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col gap-4 px-5 py-5 overflow-y-auto">
        {/* exercise card */}
        <div
          className="rounded-gj-lg border border-gj-border p-5"
          style={{
            background:
              'linear-gradient(135deg, #141824 0%, #161A27 20%, #181D2A 40%, #1A1F2D 60%, #1C2230 80%, #1E2433 100%)',
          }}
        >
          <h2 className="text-xl font-bold text-white mb-1">{currentEx.name}</h2>
          <p className="text-sm text-gj-text-secondary mb-3">{currentEx.setsTarget}</p>

          {/* última maior carga */}
          {currentEx.lastMaxWeight && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-gj-lg bg-gj-surface-elevated">
              <span className="text-[10px] text-gj-text-secondary">Última maior carga</span>
              <span className="text-base font-bold text-gj-accent">
                {currentEx.lastMaxWeight}kg
              </span>
            </div>
          )}
        </div>



        {/* series block */}
        <div className="rounded-gj-lg bg-gj-surface border border-gj-border p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Séries</span>
            <span className="text-xs text-gj-text-secondary">
              {currentEx.sets.filter((s) => s.completed).length}/{currentEx.sets.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {currentEx.sets.map((set) => (
              <SetInputRow
                key={set.id}
                setNumber={set.setNumber}
                weight={set.weight}
                reps={set.reps}
                completed={set.completed}
                lastWeight={set.lastWeight}
                lastReps={set.lastReps}
                isActive={set.id === activeSetId && !set.completed}
                onWeightChange={(v) => handleWeightChange(set.id, v)}
                onRepsChange={(v) => handleRepsChange(set.id, v)}
                onToggleComplete={() => handleToggleComplete(set.id)}
              />
            ))}
          </div>
        </div>

        {/* navegation exercicio */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={handlePrevExercise}
            disabled={currentExIdx === 0}
            className="flex items-center gap-1 text-xs text-gj-text-secondary disabled:opacity-30 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>
          <span className="text-xs text-gj-text-secondary">
            {currentEx.name}
          </span>
          <button
            onClick={handleNextExercise}
            disabled={isLastExercise}
            className="flex items-center gap-1 text-xs text-gj-text-secondary disabled:opacity-30 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Próximo
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ===== BOTTOM ACTION ===== */}
      <div className="px-5 py-4 border-t border-gj-border bg-gj-bg">
        {isLastExercise && isLastSet ? (
          <button
            onClick={handleFinishWorkout}
            className="w-full h-12 rounded-gj-lg text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            }}
          >
            <CheckCircle size={16} />
            Finalizar Treino
          </button>
        ) : (
          <button
            onClick={handleSkipExercise}
            className="w-full h-12 rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-gj-accent/20"
          >
            <SkipForward size={16} />
            Pular exercício
          </button>
        )}
      </div>

      {/* ===== REST TIMER ===== */}
      {showRestTimer && (
        <RestTimer
          initialSeconds={currentEx.restSeconds}
          onFinish={handleRestFinish}
          onSkip={handleRestSkip}
        />
      )}

      {/* ===== SHEET FINALIZAR TREINO ===== */}
      {showEndSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={handleEndSheetContinue} />

          {/* Bottom Sheet */}
          <div className="relative w-full max-w-[430px] bg-gj-surface border-t border-gj-border rounded-t-gj-lg animate-slideUp">
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gj-border" />
            </div>

            {/* Content */}
            <div className="flex flex-col px-5 pb-8">
              <h3 className="text-base font-semibold text-white mb-1">Sair da sessão?</h3>
              <p className="text-xs text-gj-text-secondary mb-5">
                Você completou {completedSets} de {totalSets} séries. Deseja realmente sair?
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleEndSheetContinue}
                  className="w-full h-[52px] rounded-gj-lg bg-gj-accent text-white text-sm font-semibold flex items-center justify-center hover:brightness-110 transition-all cursor-pointer"
                >
                  Continuar treino
                </button>
                <button
                  onClick={handleEndSheetFinish}
                  className="w-full h-[52px] rounded-gj-lg bg-gj-surface-elevated border border-gj-border text-white text-sm font-semibold flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Encerrar e ver resumo
                </button>
                <button
                  onClick={handleEndSheetDiscard}
                  className="w-full h-[52px] rounded-gj-lg text-red-400 text-sm font-semibold flex items-center justify-center hover:bg-red-400/10 transition-colors cursor-pointer"
                >
                  Descartar sessão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

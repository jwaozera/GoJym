import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Clock, Dumbbell, ListChecks, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { workoutRecords, type SessionRecord } from '../data/mockProfile'

const headerButtonClass =
  'w-9 h-9 rounded-gj-md bg-gj-surface-elevated border border-gj-border flex items-center justify-center text-gj-text-secondary transition-colors duration-200 hover:text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2'

const sessionIconMap: Record<SessionRecord['icon'], typeof Dumbbell> = {
  load: Dumbbell,
  sets: ListChecks,
  duration: Clock,
}

export const PersonalRecordsPage = () => {
  const navigate = useNavigate()
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workoutRecords[0]?.id ?? '')
  const [showWorkoutSheet, setShowWorkoutSheet] = useState(false)

  const selectedWorkout = useMemo(
    () => workoutRecords.find((workout) => workout.id === selectedWorkoutId) ?? workoutRecords[0],
    [selectedWorkoutId]
  )

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId)
    setShowWorkoutSheet(false)
  }

  return (
    <div className="min-h-screen bg-gj-background text-gj-text-primary">
      <div className="mx-auto min-h-screen max-w-[430px] overflow-x-hidden">
      <header className="border-b border-gj-border px-5 pb-4 pt-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={headerButtonClass}
            onClick={() => navigate('/profile')}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="min-w-0 flex-1 text-xl font-bold leading-[1.25]">Recordes pessoais</h1>
        </div>
      </header>

      <main className="px-5 pb-8 pt-6">
        <button
          type="button"
          onClick={() => setShowWorkoutSheet(true)}
          className="mb-7 flex h-11 w-full items-center justify-between rounded-gj-lg border border-gj-border bg-gj-surface-elevated px-4 text-left transition-colors duration-200 hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2"
        >
          <span className="truncate text-sm font-semibold">{selectedWorkout?.name}</span>
          <ChevronDown size={18} className="shrink-0 text-gj-text-secondary" />
        </button>

        <section>
          <h2 className="mb-3 text-lg font-bold leading-[1.25]">Recordes por exercício</h2>
          <div className="space-y-3">
            {selectedWorkout?.exerciseRecords.map((record) => (
              <Card key={`${record.exercise}-${record.date}`} className="bg-gj-surface-elevated/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-[1.35]">{record.exercise}</p>
                    <p className="mt-1 text-xs text-gj-text-secondary">{record.date}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gj-accent">
                    {record.weightKg}kg x {record.reps} reps
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold leading-[1.25]">Recordes de sessão</h2>
          <div className="space-y-3">
            {selectedWorkout?.sessionRecords.map((record) => {
              const Icon = sessionIconMap[record.icon]

              return (
                <Card key={record.label} className="bg-gj-surface-elevated/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-gj-md bg-gj-accent-soft text-gj-accent">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-[1.35]">{record.label}</p>
                      <p className="mt-1 text-xs text-gj-text-secondary">{record.date}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-gj-accent">{record.value}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      </div>

      {showWorkoutSheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowWorkoutSheet(false)}
          />
          <div className="relative w-full max-w-[430px] rounded-t-gj-lg border-t border-gj-border bg-gj-surface animate-slideUp">
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-gj-border" />
            </div>
            <div className="px-5 pb-8 pt-6">
              <h2 className="text-xl font-bold leading-[1.25]">Selecionar treino</h2>
              <div className="mt-5 space-y-2">
                {workoutRecords.map((workout) => {
                  const selected = workout.id === selectedWorkoutId

                  return (
                    <button
                      key={workout.id}
                      type="button"
                      onClick={() => handleSelectWorkout(workout.id)}
                      className={`flex h-12 w-full items-center justify-between rounded-gj-md border px-4 text-left transition-colors duration-200 ${
                        selected
                          ? 'border-gj-accent bg-gj-accent-soft text-gj-accent'
                          : 'border-gj-border bg-gj-surface-elevated text-gj-text-primary hover:border-gj-accent/70'
                      }`}
                    >
                      <span className="text-sm font-semibold">{workout.name}</span>
                      {selected && <Check size={18} />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

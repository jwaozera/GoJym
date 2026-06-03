import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { workoutService } from '../../../services/workoutService'

interface CalendarSheetProps {
  isOpen: boolean
  onClose: () => void
}

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const CalendarSheet = ({ isOpen, onClose }: CalendarSheetProps) => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [calendarDays, setCalendarDays] = useState<
    { day: number; active: boolean; workoutName?: string; exerciseCount?: number }[]
  >([])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    const loadCalendar = async () => {
      const days = await workoutService.getWorkoutCalendar(year, month + 1)
      if (!cancelled) {
        setCalendarDays(days)
      }
    }

    loadCalendar()

    return () => {
      cancelled = true
    }
  }, [isOpen, year, month])

  const workoutDays = useMemo(() => {
    const map = new Map<number, { name: string; exerciseCount: number }[]>()
    calendarDays.forEach((item) => {
      if (item.active) {
        const existing = map.get(item.day) || []
        existing.push({
          name: item.workoutName || 'Treino',
          exerciseCount: item.exerciseCount ?? 0,
        })
        map.set(item.day, existing)
      }
    })
    return map
  }, [calendarDays])

  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = startOffset + daysInMonth
  const weeks = Math.ceil(totalCells / 7)

  const handlePrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const selectedWorkouts = selectedDay ? workoutDays.get(selectedDay) : null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      <div
        className="relative w-full max-w-[430px] bg-gj-bg border-b border-gj-border rounded-b-gj-lg animate-slideDown"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gj-border" />
        </div>

        <div className="flex items-center justify-between px-5 mb-4">
          <h3 className="text-base font-semibold text-white">Calendario</h3>
          <button onClick={onClose} className="text-xs font-semibold text-gj-accent cursor-pointer">
            Fechar
          </button>
        </div>

        <div className="flex items-center justify-between px-5 mb-4">
          <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center text-gj-text-secondary hover:text-white transition-colors cursor-pointer">
            <ChevronLeft size={18} />
          </button>
          <span className="text-base font-semibold text-white">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center text-gj-text-secondary hover:text-white transition-colors cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 px-5 mb-2">
          {WEEK_DAYS.map(d => (
            <span key={d} className="text-center text-[10px] text-gj-text-secondary">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 px-5 pb-2">
          {Array.from({ length: weeks * 7 }, (_, i) => {
            const day = i - startOffset + 1
            if (day < 1 || day > daysInMonth) {
              return <div key={i} className="aspect-square" />
            }

            const hasWorkout = workoutDays.has(day)
            const isSelected = selectedDay === day
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()

            return (
              <button
                key={i}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`aspect-square rounded-gj-md flex flex-col items-center justify-center gap-0.5 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-gj-accent'
                    : hasWorkout
                      ? 'bg-gj-surface-elevated'
                      : 'hover:bg-white/5'
                }`}
              >
                <span className={`text-xs ${
                  isSelected
                    ? 'font-bold text-white'
                    : isToday
                      ? 'font-bold text-gj-accent'
                      : hasWorkout
                        ? 'font-normal text-white'
                        : 'font-normal text-gj-text-secondary'
                }`}>
                  {day}
                </span>
                {hasWorkout && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-gj-accent" />
                )}
              </button>
            )
          })}
        </div>

        {selectedWorkouts && selectedWorkouts.length > 0 && (
          <div className="mx-5 mb-5 rounded-gj-lg border border-gj-border overflow-hidden bg-gj-surface">
            <div className="px-4 py-3">
              <span className="text-sm font-semibold text-white">
                {selectedDay} de {MONTH_NAMES[month]}
              </span>
            </div>
            {selectedWorkouts.map((w, i) => (
              <div key={i} className="mx-3 mb-3 rounded-gj-md px-3 py-2.5" style={{ background: 'rgba(30, 36, 51, 0.5)' }}>
                <span className="text-sm text-white block">{w.name}</span>
                {w.exerciseCount > 0 && (
                  <span className="text-xs text-gj-text-secondary">{w.exerciseCount} exercicios</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

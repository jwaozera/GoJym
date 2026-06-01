// Mock profile data for visual preview only (VITE_DATA_SOURCE=mock).
// API mode must NOT consume this file.

export const profileMeta = {
  memberSinceLabel: 'abr/2026',
  memberSinceFull: 'Abril 2026',
}

export const fallbackProfile = {
  name: 'Usuário',
  email: 'usuario@email.com',
}

export interface ExerciseRecord {
  exercise: string
  date: string
  weightKg: number
  reps: number
}

export interface SessionRecord {
  label: string
  date: string
  value: string
  icon: 'load' | 'sets' | 'duration'
}

export interface WorkoutRecords {
  id: string
  name: string
  exerciseRecords: ExerciseRecord[]
  sessionRecords: SessionRecord[]
}

export const mockWorkoutRecords: WorkoutRecords[] = [
  {
    id: '1',
    name: 'Peito e Tríceps',
    exerciseRecords: [
      { exercise: 'Supino Reto', date: '2026-05-25', weightKg: 100, reps: 8 },
      { exercise: 'Supino Reto', date: '2026-05-18', weightKg: 95, reps: 10 },
      { exercise: 'Rosca Direta', date: '2026-05-25', weightKg: 30, reps: 12 },
    ],
    sessionRecords: [
      { label: 'Carga Total', date: '2026-05-29', value: '2,800 kg', icon: 'load' },
      { label: 'Séries', date: '2026-05-29', value: '12', icon: 'sets' },
      { label: 'Duração', date: '2026-05-29', value: '45 min', icon: 'duration' },
    ],
  },
  {
    id: '2',
    name: 'Costas e Bíceps',
    exerciseRecords: [
      { exercise: 'Puxada Frontal', date: '2026-05-27', weightKg: 80, reps: 10 },
      { exercise: 'Rosca Inversa', date: '2026-05-27', weightKg: 25, reps: 12 },
    ],
    sessionRecords: [
      { label: 'Carga Total', date: '2026-05-27', value: '2,100 kg', icon: 'load' },
      { label: 'Séries', date: '2026-05-27', value: '8', icon: 'sets' },
      { label: 'Duração', date: '2026-05-27', value: '40 min', icon: 'duration' },
    ],
  },
]

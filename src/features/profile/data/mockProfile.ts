export const profileMeta = {
  memberSinceLabel: 'abr/2026',
  memberSinceFull: 'Abril 2026',
}

export const fallbackProfile = {
  name: 'Artur Ferreira Marques da Silva',
  email: 'joao@email.com',
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

export const workoutRecords: WorkoutRecords[] = [
  {
    id: 'push',
    name: 'Treino A - Push',
    exerciseRecords: [
      { exercise: 'Supino reto', date: '16/04/2026', weightKg: 82, reps: 8 },
      { exercise: 'Desenvolvimento', date: '12/04/2026', weightKg: 40, reps: 10 },
      { exercise: 'Tríceps corda', date: '09/04/2026', weightKg: 36, reps: 12 },
      { exercise: 'Elevação lateral', date: '07/04/2026', weightKg: 14, reps: 15 },
    ],
    sessionRecords: [
      { label: 'Maior carga total', date: '10/04/2026', value: '12.4t', icon: 'load' },
      { label: 'Mais séries', date: '08/04/2026', value: '28 séries', icon: 'sets' },
      { label: 'Maior duração', date: '05/04/2026', value: '1h 22min', icon: 'duration' },
    ],
  },
  {
    id: 'pull',
    name: 'Treino B - Pull',
    exerciseRecords: [
      { exercise: 'Remada curvada', date: '11/04/2026', weightKg: 70, reps: 10 },
      { exercise: 'Puxada frente', date: '13/04/2026', weightKg: 68, reps: 12 },
      { exercise: 'Rosca direta', date: '15/04/2026', weightKg: 18, reps: 10 },
    ],
    sessionRecords: [
      { label: 'Maior carga total', date: '13/04/2026', value: '9.8t', icon: 'load' },
      { label: 'Mais séries', date: '11/04/2026', value: '22 séries', icon: 'sets' },
      { label: 'Maior duração', date: '15/04/2026', value: '1h 08min', icon: 'duration' },
    ],
  },
  {
    id: 'legs',
    name: 'Treino C - Legs',
    exerciseRecords: [
      { exercise: 'Agachamento', date: '14/04/2026', weightKg: 100, reps: 8 },
      { exercise: 'Leg press', date: '18/04/2026', weightKg: 220, reps: 12 },
    ],
    sessionRecords: [
      { label: 'Maior carga total', date: '18/04/2026', value: '14.1t', icon: 'load' },
      { label: 'Mais séries', date: '14/04/2026', value: '24 séries', icon: 'sets' },
      { label: 'Maior duração', date: '18/04/2026', value: '1h 16min', icon: 'duration' },
    ],
  },
]

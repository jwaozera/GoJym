import type { Exercise, WorkoutSession } from '../types'

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Supino Reto', category: 'Peito', muscleGroup: 'Peitoral' },
  { id: '2', name: 'Agachamento', category: 'Pernas', muscleGroup: 'Quadríceps' },
  { id: '3', name: 'Remada Curvada', category: 'Costas', muscleGroup: 'Dorsal' },
  { id: '4', name: 'Desenvolvimento', category: 'Ombro', muscleGroup: 'Deltóide' },
  { id: '5', name: 'Rosca Direta', category: 'Bíceps', muscleGroup: 'Bíceps' },
  { id: '6', name: 'Tríceps Pulley', category: 'Tríceps', muscleGroup: 'Tríceps' },
  { id: '7', name: 'Leg Press', category: 'Pernas', muscleGroup: 'Quadríceps' },
  { id: '8', name: 'Puxada Frontal', category: 'Costas', muscleGroup: 'Dorsal' },
]

export const mockSessions: WorkoutSession[] = [
  {
    id: '1',
    name: 'Treino A — Peito e Tríceps',
    isActive: false,
    exercises: [
      {
        id: 'we1',
        exercise: mockExercises[0],
        sets: [
          { id: 's1', setNumber: 1, weight: 80, reps: 10, completed: true },
          { id: 's2', setNumber: 2, weight: 80, reps: 9, completed: true },
          { id: 's3', setNumber: 3, weight: 75, reps: 8, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-15'),
    completedAt: new Date('2026-04-15'),
    durationSeconds: 3600,
  },
  {
    id: '2',
    name: 'Treino B — Costas e Bíceps',
    isActive: true,
    exercises: [
      {
        id: 'we2',
        exercise: mockExercises[2],
        sets: [
          { id: 's4', setNumber: 1, weight: 70, reps: 12, completed: true },
          { id: 's5', setNumber: 2, weight: 70, reps: 10, completed: false },
        ],
      },
    ],
    createdAt: new Date('2026-04-18'),
    durationSeconds: 1200,
  },
]

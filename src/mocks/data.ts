import type { Exercise, WorkoutSession } from '../types'

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Supino Reto', category: 'Peito', muscleGroup: 'Peitoral' },
  { id: '2', name: 'Supino Inclinado', category: 'Peito', muscleGroup: 'Peitoral' },
  { id: '3', name: 'Supino Declinado', category: 'Peito', muscleGroup: 'Peitoral' },
  { id: '4', name: 'Crucifixo Inclinado', category: 'Peito', muscleGroup: 'Peitoral' },
  { id: '5', name: 'Agachamento', category: 'Pernas', muscleGroup: 'Quadríceps' },
  { id: '6', name: 'Remada Curvada', category: 'Costas', muscleGroup: 'Dorsal' },
  { id: '7', name: 'Desenvolvimento', category: 'Ombro', muscleGroup: 'Deltóide' },
  { id: '8', name: 'Rosca Direta', category: 'Bíceps', muscleGroup: 'Bíceps' },
  { id: '9', name: 'Tríceps Pulley', category: 'Tríceps', muscleGroup: 'Tríceps' },
  { id: '10', name: 'Leg Press', category: 'Pernas', muscleGroup: 'Quadríceps' },
  { id: '11', name: 'Puxada Frontal', category: 'Costas', muscleGroup: 'Dorsal' },
  { id: '12', name: 'Elevação Lateral', category: 'Ombro', muscleGroup: 'Deltóide' },
  { id: '13', name: 'Rosca Martelo', category: 'Bíceps', muscleGroup: 'Bíceps' },
  { id: '14', name: 'Extensão de Tríceps', category: 'Tríceps', muscleGroup: 'Tríceps' },
  { id: '15', name: 'Tríceps Corda', category: 'Tríceps', muscleGroup: 'Tríceps' },
]

export const mockSessions: WorkoutSession[] = [
  {
    id: '1',
    name: 'Treino A — Push',
    isActive: false,
    exercises: [
      {
        id: 'we1',
        exercise: mockExercises[0], // Supino Reto
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, weight: 80, reps: 10, completed: true },
          { id: 's2', setNumber: 2, weight: 80, reps: 9, completed: true },
          { id: 's3', setNumber: 3, weight: 75, reps: 8, completed: true },
          { id: 's4', setNumber: 4, weight: 75, reps: 8, completed: true },
        ],
      },
      {
        id: 'we2',
        exercise: mockExercises[6], // Desenvolvimento
        restSeconds: 60,
        sets: [
          { id: 's5', setNumber: 1, weight: 30, reps: 12, completed: true },
          { id: 's6', setNumber: 2, weight: 30, reps: 10, completed: true },
          { id: 's7', setNumber: 3, weight: 28, reps: 10, completed: true },
        ],
      },
      {
        id: 'we3',
        exercise: mockExercises[3], // Crucifixo Inclinado
        restSeconds: 60,
        sets: [
          { id: 's8', setNumber: 1, weight: 14, reps: 15, completed: true },
          { id: 's9', setNumber: 2, weight: 14, reps: 12, completed: true },
          { id: 's10', setNumber: 3, weight: 12, reps: 12, completed: true },
        ],
      },
      {
        id: 'we4',
        exercise: mockExercises[11], // Elevação Lateral
        restSeconds: 45,
        sets: [
          { id: 's11', setNumber: 1, weight: 10, reps: 15, completed: true },
          { id: 's12', setNumber: 2, weight: 10, reps: 12, completed: true },
          { id: 's13', setNumber: 3, weight: 10, reps: 12, completed: true },
        ],
      },
      {
        id: 'we5',
        exercise: mockExercises[14], // Tríceps Corda
        restSeconds: 45,
        sets: [
          { id: 's14', setNumber: 1, weight: 25, reps: 15, completed: true },
          { id: 's15', setNumber: 2, weight: 25, reps: 12, completed: true },
          { id: 's16', setNumber: 3, weight: 25, reps: 12, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-15'),
    completedAt: new Date('2026-04-15'),
    durationSeconds: 3300,
  },
  {
    id: '2',
    name: 'Treino B — Pull',
    isActive: true,
    exercises: [
      {
        id: 'we6',
        exercise: mockExercises[5], // Remada Curvada
        restSeconds: 90,
        sets: [
          { id: 's17', setNumber: 1, weight: 70, reps: 12, completed: true },
          { id: 's18', setNumber: 2, weight: 70, reps: 10, completed: false },
          { id: 's19', setNumber: 3, weight: 65, reps: 10, completed: false },
        ],
      },
      {
        id: 'we7',
        exercise: mockExercises[10], // Puxada Frontal
        restSeconds: 60,
        sets: [
          { id: 's20', setNumber: 1, weight: 60, reps: 12, completed: false },
          { id: 's21', setNumber: 2, weight: 60, reps: 10, completed: false },
          { id: 's22', setNumber: 3, weight: 55, reps: 10, completed: false },
        ],
      },
      {
        id: 'we8',
        exercise: mockExercises[7], // Rosca Direta
        restSeconds: 60,
        sets: [
          { id: 's23', setNumber: 1, weight: 16, reps: 12, completed: false },
          { id: 's24', setNumber: 2, weight: 16, reps: 10, completed: false },
          { id: 's25', setNumber: 3, weight: 14, reps: 10, completed: false },
        ],
      },
    ],
    createdAt: new Date('2026-04-18'),
    durationSeconds: 1200,
  },
]

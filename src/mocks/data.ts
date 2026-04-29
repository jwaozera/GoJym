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
  // ===== Sessões adicionais para popular o calendário =====
  {
    id: '3',
    name: 'Treino A — Push',
    isActive: false,
    exercises: [
      {
        id: 'we9',
        exercise: mockExercises[0],
        restSeconds: 90,
        sets: [
          { id: 's26', setNumber: 1, weight: 82, reps: 10, completed: true },
          { id: 's27', setNumber: 2, weight: 82, reps: 9, completed: true },
          { id: 's28', setNumber: 3, weight: 80, reps: 8, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-02'),
    completedAt: new Date('2026-04-02'),
    durationSeconds: 2700,
  },
  {
    id: '4',
    name: 'Treino B — Pull',
    isActive: false,
    exercises: [
      {
        id: 'we10',
        exercise: mockExercises[5],
        restSeconds: 90,
        sets: [
          { id: 's29', setNumber: 1, weight: 72, reps: 12, completed: true },
          { id: 's30', setNumber: 2, weight: 72, reps: 10, completed: true },
          { id: 's31', setNumber: 3, weight: 68, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-04'),
    completedAt: new Date('2026-04-04'),
    durationSeconds: 2400,
  },
  {
    id: '5',
    name: 'Treino C — Legs',
    isActive: false,
    exercises: [
      {
        id: 'we11',
        exercise: mockExercises[4], // Agachamento
        restSeconds: 120,
        sets: [
          { id: 's32', setNumber: 1, weight: 100, reps: 10, completed: true },
          { id: 's33', setNumber: 2, weight: 100, reps: 8, completed: true },
          { id: 's34', setNumber: 3, weight: 95, reps: 8, completed: true },
          { id: 's35', setNumber: 4, weight: 90, reps: 10, completed: true },
        ],
      },
      {
        id: 'we12',
        exercise: mockExercises[9], // Leg Press
        restSeconds: 90,
        sets: [
          { id: 's36', setNumber: 1, weight: 200, reps: 15, completed: true },
          { id: 's37', setNumber: 2, weight: 200, reps: 12, completed: true },
          { id: 's38', setNumber: 3, weight: 180, reps: 12, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-07'),
    completedAt: new Date('2026-04-07'),
    durationSeconds: 3600,
  },
  {
    id: '6',
    name: 'Treino A — Push',
    isActive: false,
    exercises: [
      {
        id: 'we13',
        exercise: mockExercises[1], // Supino Inclinado
        restSeconds: 90,
        sets: [
          { id: 's39', setNumber: 1, weight: 60, reps: 12, completed: true },
          { id: 's40', setNumber: 2, weight: 60, reps: 10, completed: true },
          { id: 's41', setNumber: 3, weight: 55, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-09'),
    completedAt: new Date('2026-04-09'),
    durationSeconds: 2800,
  },
  {
    id: '7',
    name: 'Treino B — Pull',
    isActive: false,
    exercises: [
      {
        id: 'we14',
        exercise: mockExercises[10], // Puxada Frontal
        restSeconds: 60,
        sets: [
          { id: 's42', setNumber: 1, weight: 62, reps: 12, completed: true },
          { id: 's43', setNumber: 2, weight: 62, reps: 10, completed: true },
          { id: 's44', setNumber: 3, weight: 58, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-11'),
    completedAt: new Date('2026-04-11'),
    durationSeconds: 2500,
  },
  {
    id: '8',
    name: 'Treino C — Legs',
    isActive: false,
    exercises: [
      {
        id: 'we15',
        exercise: mockExercises[4], // Agachamento
        restSeconds: 120,
        sets: [
          { id: 's45', setNumber: 1, weight: 105, reps: 10, completed: true },
          { id: 's46', setNumber: 2, weight: 105, reps: 8, completed: true },
          { id: 's47', setNumber: 3, weight: 100, reps: 8, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-14'),
    completedAt: new Date('2026-04-14'),
    durationSeconds: 3200,
  },
  {
    id: '9',
    name: 'Treino A — Push',
    isActive: false,
    exercises: [
      {
        id: 'we16',
        exercise: mockExercises[0], // Supino Reto
        restSeconds: 90,
        sets: [
          { id: 's48', setNumber: 1, weight: 85, reps: 10, completed: true },
          { id: 's49', setNumber: 2, weight: 85, reps: 9, completed: true },
          { id: 's50', setNumber: 3, weight: 80, reps: 8, completed: true },
        ],
      },
      {
        id: 'we17',
        exercise: mockExercises[6], // Desenvolvimento
        restSeconds: 60,
        sets: [
          { id: 's51', setNumber: 1, weight: 32, reps: 12, completed: true },
          { id: 's52', setNumber: 2, weight: 32, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-21'),
    completedAt: new Date('2026-04-21'),
    durationSeconds: 3100,
  },
  {
    id: '10',
    name: 'Treino B — Pull',
    isActive: false,
    exercises: [
      {
        id: 'we18',
        exercise: mockExercises[5], // Remada Curvada
        restSeconds: 90,
        sets: [
          { id: 's53', setNumber: 1, weight: 75, reps: 12, completed: true },
          { id: 's54', setNumber: 2, weight: 75, reps: 10, completed: true },
          { id: 's55', setNumber: 3, weight: 70, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-23'),
    completedAt: new Date('2026-04-23'),
    durationSeconds: 2600,
  },
  {
    id: '11',
    name: 'Treino C — Legs',
    isActive: false,
    exercises: [
      {
        id: 'we19',
        exercise: mockExercises[4], // Agachamento
        restSeconds: 120,
        sets: [
          { id: 's56', setNumber: 1, weight: 110, reps: 10, completed: true },
          { id: 's57', setNumber: 2, weight: 110, reps: 8, completed: true },
          { id: 's58', setNumber: 3, weight: 105, reps: 8, completed: true },
        ],
      },
      {
        id: 'we20',
        exercise: mockExercises[9], // Leg Press
        restSeconds: 90,
        sets: [
          { id: 's59', setNumber: 1, weight: 220, reps: 15, completed: true },
          { id: 's60', setNumber: 2, weight: 220, reps: 12, completed: true },
          { id: 's61', setNumber: 3, weight: 200, reps: 12, completed: true },
        ],
      },
    ],
    createdAt: new Date('2026-04-25'),
    completedAt: new Date('2026-04-25'),
    durationSeconds: 3800,
  },
]

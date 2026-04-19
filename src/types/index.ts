export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroup: string
  imageUrl?: string
}

export interface Set {
  id: string
  setNumber: number
  weight: number | null
  reps: number | null
  completed: boolean
}

export interface WorkoutExercise {
  id: string
  exercise: Exercise
  sets: Set[]
  restSeconds?: number
}

export interface WorkoutSession {
  id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt: Date
  completedAt?: Date
  durationSeconds?: number
  isActive?: boolean
}

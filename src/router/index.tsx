import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { HomePage } from '../features/workout/pages/HomePage'
import { WorkoutListPage } from '../features/workout/pages/WorkoutListPage'
import { WorkoutDetailPage } from '../features/workout/pages/WorkoutDetailPage'
import { EditWorkoutPage } from '../features/workout/pages/EditWorkoutPage'
import { CreateWorkoutPage } from '../features/workout/pages/CreateWorkoutPage'
import { ExecuteWorkoutPage } from '../features/workout/pages/ExecuteWorkoutPage'
import { AppLayout } from '../components/AppLayout'
import { ProtectedRoute } from '../components/ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'workouts', element: <WorkoutListPage /> },
      { path: 'workouts/:sessionId', element: <WorkoutDetailPage /> },
      { path: 'workouts/:sessionId/edit', element: <EditWorkoutPage /> },
      { path: 'workout/create', element: <CreateWorkoutPage /> },
      { path: 'workout/execute/:sessionId', element: <ExecuteWorkoutPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
])

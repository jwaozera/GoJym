import { useState, useEffect } from 'react'
import type { Exercise } from '../types'
import { mockExercises } from '../mocks/data'

export const useExercises = (search: string) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const filtered = mockExercises.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(search.toLowerCase())
    )
    const t = setTimeout(() => { setExercises(filtered); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [search])

  return { exercises, loading }
}

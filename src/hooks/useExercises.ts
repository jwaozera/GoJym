import { useState, useEffect } from 'react'
import type { Exercise } from '../types'
import { exerciseService } from '../services/exerciseService'

export const useExercises = (search: string) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    exerciseService.search(search).then(results => {
      if (!cancelled) {
        setExercises(results)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [search])

  return { exercises, loading }
}

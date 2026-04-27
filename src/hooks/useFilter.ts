'use client'

import { useState, useCallback } from 'react'

type FilterType = 'all' | 'uncompleted' | 'completed'

export function useFilter() {
  const [filter, setFilter] = useState<FilterType>('all')

  const changeFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter)
  }, [])

  return { filter, changeFilter }
}

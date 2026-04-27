'use client'

import { useState, useEffect, useCallback } from 'react'
import { Todo } from '@/components/item/TodoItem'

type FilterType = 'all' | 'uncompleted' | 'completed'

interface UseTodosOptions {
  filter: FilterType
}

export function useTodos({ filter }: UseTodosOptions) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/todos?filter=${filter}`)
      if (!res.ok) {
        throw new Error('获取待办失败')
      }
      const data = await res.json()
      setTodos(data.todos)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取待办失败')
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = useCallback(async (title: string, priority: string, dueDate: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, dueDate })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '添加失败')
    }

    await fetchTodos()
  }, [fetchTodos])

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '更新失败')
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    )
  }, [])

  const updateTitle = useCallback(async (id: string, title: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '更新失败')
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, title } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback(async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '删除失败')
    }

    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleComplete,
    updateTitle,
    deleteTodo,
    refetch: fetchTodos
  }
}

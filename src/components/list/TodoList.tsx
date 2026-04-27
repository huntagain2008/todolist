'use client'

import React from 'react'
import TodoItem, { Todo } from '../item/TodoItem'
import EmptyState from '../empty/EmptyState'

type FilterType = 'all' | 'uncompleted' | 'completed'

interface TodoListProps {
  todos: Todo[]
  filter: FilterType
  onToggleComplete: (id: string, completed: boolean) => Promise<void>
  onUpdateTitle: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}

export default function TodoList({
  todos,
  filter,
  onToggleComplete,
  onUpdateTitle,
  onDelete,
  isLoading
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (todos.length === 0) {
    return <EmptyState filter={filter} />
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={() =>
            onToggleComplete(todo.id, !todo.completed)
          }
          onUpdateTitle={(title) => onUpdateTitle(todo.id, title)}
          onDelete={() => onDelete(todo.id)}
          disabled={isLoading}
        />
      ))}
    </div>
  )
}

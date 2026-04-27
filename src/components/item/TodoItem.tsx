'use client'

import React from 'react'
import TodoCheckbox from './TodoCheckbox'
import TodoTitle from './TodoTitle'
import TodoPriority from './TodoPriority'
import TodoDueDate from './TodoDueDate'
import TodoActions from './TodoActions'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Todo {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

interface TodoItemProps {
  todo: Todo
  onToggleComplete: () => Promise<void>
  onUpdateTitle: (title: string) => Promise<void>
  onDelete: () => Promise<void>
  disabled?: boolean
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onUpdateTitle,
  onDelete,
  disabled
}: TodoItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <TodoCheckbox
        checked={todo.completed}
        onChange={onToggleComplete}
        disabled={disabled}
      />
      <TodoTitle
        title={todo.title}
        completed={todo.completed}
        onSave={onUpdateTitle}
        disabled={disabled}
      />
      <TodoPriority priority={todo.priority} />
      <TodoDueDate dueDate={todo.dueDate} />
      <TodoActions
        onDelete={onDelete}
        disabled={disabled}
      />
    </div>
  )
}

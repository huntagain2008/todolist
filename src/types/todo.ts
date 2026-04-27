import { Priority } from '@prisma/client'

export interface CreateTodoInput {
  title: string
  priority?: Priority
  dueDate?: string
}

export interface UpdateTodoInput {
  title?: string
  completed?: boolean
  priority?: Priority
  dueDate?: string | null
}

export interface TodoResponse {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type FilterType = 'all' | 'uncompleted' | 'completed'

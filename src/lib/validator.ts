import { Priority } from '@prisma/client'

const TITLE_MAX_LENGTH = 200
const VALID_PRIORITIES: Priority[] = ['HIGH', 'MEDIUM', 'LOW']

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateTitle(title: unknown): ValidationResult {
  if (typeof title !== 'string') {
    return { valid: false, error: 'Title must be a string' }
  }

  const trimmed = title.trim()

  if (!trimmed) {
    return { valid: false, error: 'Title is required' }
  }

  if (trimmed.length > TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title must be at most ${TITLE_MAX_LENGTH} characters` }
  }

  return { valid: true }
}

export function validatePriority(priority: unknown): ValidationResult {
  if (priority === undefined || priority === null) {
    return { valid: true }
  }

  if (!VALID_PRIORITIES.includes(priority as Priority)) {
    return { valid: false, error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` }
  }

  return { valid: true }
}

export function validateDueDate(dueDate: unknown): ValidationResult {
  if (dueDate === undefined || dueDate === null || dueDate === '') {
    return { valid: true }
  }

  if (typeof dueDate !== 'string') {
    return { valid: false, error: 'Due date must be a string' }
  }

  const date = new Date(dueDate)

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Due date must be a valid date' }
  }

  return { valid: true }
}

export function validateCompleted(completed: unknown): ValidationResult {
  if (completed === undefined || completed === null) {
    return { valid: true }
  }

  if (typeof completed !== 'boolean') {
    return { valid: false, error: 'Completed must be a boolean' }
  }

  return { valid: true }
}

export function isValidFilter(filter: unknown): filter is 'all' | 'uncompleted' | 'completed' {
  return filter === 'all' || filter === 'uncompleted' || filter === 'completed'
}

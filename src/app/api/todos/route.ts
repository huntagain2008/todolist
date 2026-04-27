import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateTitle, validatePriority, validateDueDate, isValidFilter } from '@/lib/validator'
import { CreateTodoInput, FilterType } from '@/types/todo'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filter = searchParams.get('filter') || 'all'

  logger.info('listTodos start', { filter })

  if (!isValidFilter(filter)) {
    logger.warn('listTodos validation_failed', { filter, error: 'Invalid filter parameter' })
    return NextResponse.json(
      { error: 'Invalid filter parameter. Must be: all, uncompleted, or completed' },
      { status: 400 }
    )
  }

  try {
    let where = {}

    if (filter === 'uncompleted') {
      where = { completed: false }
    } else if (filter === 'completed') {
      where = { completed: true }
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    const formattedTodos = todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate?.toISOString() || null,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }))

    logger.info('listTodos success', { count: todos.length, filter })

    return NextResponse.json({ todos: formattedTodos })
  } catch (error) {
    logger.error('listTodos fetch_failed', { filter, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  logger.info('createTodo start')

  try {
    const body: CreateTodoInput = await request.json()

    const titleValidation = validateTitle(body.title)
    if (!titleValidation.valid) {
      logger.warn('createTodo validation_failed', { field: 'title', error: titleValidation.error })
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      )
    }

    const priorityValidation = validatePriority(body.priority)
    if (!priorityValidation.valid) {
      logger.warn('createTodo validation_failed', { field: 'priority', error: priorityValidation.error })
      return NextResponse.json(
        { error: priorityValidation.error },
        { status: 400 }
      )
    }

    const dueDateValidation = validateDueDate(body.dueDate)
    if (!dueDateValidation.valid) {
      logger.warn('createTodo validation_failed', { field: 'dueDate', error: dueDateValidation.error })
      return NextResponse.json(
        { error: dueDateValidation.error },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title.trim(),
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null
      }
    })

    logger.info('createTodo success', { id: todo.id, title: todo.title })

    return NextResponse.json({
      todo: {
        ...todo,
        dueDate: todo.dueDate?.toISOString() || null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('createTodo failed', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

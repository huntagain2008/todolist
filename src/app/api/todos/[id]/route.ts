import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateTitle, validatePriority, validateDueDate, validateCompleted } from '@/lib/validator'
import { UpdateTodoInput } from '@/types/todo'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  logger.info('getTodo start', { id })

  try {
    const todo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!todo) {
      logger.warn('getTodo not_found', { id })
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    logger.info('getTodo success', { id, title: todo.title })

    return NextResponse.json({
      todo: {
        ...todo,
        dueDate: todo.dueDate?.toISOString() || null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      }
    })
  } catch (error) {
    logger.error('getTodo failed', { id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  logger.info('updateTodo start', { id })

  try {
    const body: UpdateTodoInput = await request.json()

    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!existingTodo) {
      logger.warn('updateTodo not_found', { id })
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    if (body.title !== undefined) {
      const titleValidation = validateTitle(body.title)
      if (!titleValidation.valid) {
        logger.warn('updateTodo validation_failed', { field: 'title', error: titleValidation.error })
        return NextResponse.json(
          { error: titleValidation.error },
          { status: 400 }
        )
      }
    }

    if (body.priority !== undefined) {
      const priorityValidation = validatePriority(body.priority)
      if (!priorityValidation.valid) {
        logger.warn('updateTodo validation_failed', { field: 'priority', error: priorityValidation.error })
        return NextResponse.json(
          { error: priorityValidation.error },
          { status: 400 }
        )
      }
    }

    if (body.dueDate !== undefined) {
      const dueDateValidation = validateDueDate(body.dueDate)
      if (!dueDateValidation.valid) {
        logger.warn('updateTodo validation_failed', { field: 'dueDate', error: dueDateValidation.error })
        return NextResponse.json(
          { error: dueDateValidation.error },
          { status: 400 }
        )
      }
    }

    if (body.completed !== undefined) {
      const completedValidation = validateCompleted(body.completed)
      if (!completedValidation.valid) {
        logger.warn('updateTodo validation_failed', { field: 'completed', error: completedValidation.error })
        return NextResponse.json(
          { error: completedValidation.error },
          { status: 400 }
        )
      }
    }

    const updateData: {
      title?: string
      completed?: boolean
      priority?: 'HIGH' | 'MEDIUM' | 'LOW'
      dueDate?: Date | null
    } = {}

    if (body.title !== undefined) {
      updateData.title = body.title.trim()
    }
    if (body.completed !== undefined) {
      updateData.completed = body.completed
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData
    })

    logger.info('updateTodo success', { id, updates: updateData })

    return NextResponse.json({
      todo: {
        ...todo,
        dueDate: todo.dueDate?.toISOString() || null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      }
    })
  } catch (error) {
    logger.error('updateTodo failed', { id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  logger.info('deleteTodo start', { id })

  try {
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!existingTodo) {
      logger.warn('deleteTodo not_found', { id })
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id }
    })

    logger.info('deleteTodo success', { id, title: existingTodo.title })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('deleteTodo failed', { id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import React from 'react'

interface TodoDueDateProps {
  dueDate: string | null
}

export default function TodoDueDate({ dueDate }: TodoDueDateProps) {
  if (!dueDate) return null

  const date = new Date(dueDate)
  const month = date.getMonth() + 1
  const day = date.getDate()

  return (
    <span className="text-sm text-gray-500">
      {month}/{day}
    </span>
  )
}

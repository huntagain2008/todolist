import React from 'react'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

interface TodoPriorityProps {
  priority: Priority
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  HIGH: { label: '高', color: 'bg-red-100 text-red-700' },
  MEDIUM: { label: '中', color: 'bg-amber-100 text-amber-700' },
  LOW: { label: '低', color: 'bg-green-100 text-green-700' },
}

export default function TodoPriority({ priority }: TodoPriorityProps) {
  const { label, color } = priorityConfig[priority]

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

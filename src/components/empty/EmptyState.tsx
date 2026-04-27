'use client'

import React from 'react'

interface EmptyStateProps {
  filter: 'all' | 'uncompleted' | 'completed'
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getMessage = () => {
    switch (filter) {
      case 'all':
        return { title: '暂无待办事项', description: '开始添加你的第一个待办吧' }
      case 'uncompleted':
        return { title: '没有未完成的待办', description: '太棒了，所有任务都完成了！' }
      case 'completed':
        return { title: '没有已完成的待办', description: '完成的任务会显示在这里' }
    }
  }

  const { title, description } = getMessage()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

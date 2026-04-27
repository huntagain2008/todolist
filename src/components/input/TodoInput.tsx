'use client'

import React, { useState } from 'react'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

interface TodoInputProps {
  onAdd: (title: string, priority: Priority, dueDate: string) => Promise<void>
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('标题不能为空')
      return
    }

    if (title.trim().length > 200) {
      setError('标题不能超过200个字符')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd(title.trim(), priority, dueDate)
      setTitle('')
      setPriority('MEDIUM')
      setDueDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError('')
          }}
          placeholder="输入待办事项..."
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {title.length > 180 && title.length <= 200 && (
          <p className="mt-1 text-sm text-amber-500">标题还可以输入 {200 - title.length} 个字符</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
          >
            <option value="HIGH">高 (HIGH)</option>
            <option value="MEDIUM">中 (MEDIUM)</option>
            <option value="LOW">低 (LOW)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">截止日期</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '添加中...' : '添加'}
      </button>
    </form>
  )
}

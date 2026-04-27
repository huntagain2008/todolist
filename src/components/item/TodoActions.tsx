'use client'

import React, { useState } from 'react'

interface TodoActionsProps {
  onDelete: () => void
  disabled?: boolean
}

export default function TodoActions({
  onDelete,
  disabled
}: TodoActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={disabled}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          删除
        </button>
      </div>

      {showConfirm && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-48">
          <p className="text-sm text-gray-700 mb-3">确定要删除吗？</p>
          <div className="flex gap-2">
            <button
              onClick={confirmDelete}
              className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除
            </button>
            <button
              onClick={cancelDelete}
              className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

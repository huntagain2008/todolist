'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TodoTitleProps {
  title: string
  completed: boolean
  onSave: (title: string) => Promise<void>
  disabled?: boolean
}

export default function TodoTitle({ title, completed, onSave, disabled }: TodoTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (!trimmed) {
      setEditValue(title)
      setIsEditing(false)
      return
    }
    if (trimmed === title) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(trimmed)
      setIsEditing(false)
    } catch {
      setEditValue(title)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isSaving || disabled}
        className="flex-1 px-2 py-1 border border-blue-500 rounded outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
    )
  }

  return (
    <span
      onClick={() => !disabled && setIsEditing(true)}
      className={`flex-1 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 ${
        completed ? 'line-through text-gray-400' : 'text-gray-700'
      } ${disabled ? 'cursor-default' : ''}`}
    >
      {title}
    </span>
  )
}

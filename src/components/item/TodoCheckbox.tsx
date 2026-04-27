'use client'

import React from 'react'

interface TodoCheckboxProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export default function TodoCheckbox({ checked, onChange, disabled }: TodoCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
    />
  )
}

import React from 'react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☑</span>
          <h1 className="text-xl font-semibold text-gray-800">待办清单</h1>
        </div>
      </div>
    </header>
  )
}

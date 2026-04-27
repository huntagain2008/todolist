'use client'

import { useTodos } from '@/hooks/useTodos'
import { useFilter } from '@/hooks/useFilter'
import Header from '@/components/layout/Header'
import TodoInput from '@/components/input/TodoInput'
import TodoFilter from '@/components/filter/TodoFilter'
import TodoList from '@/components/list/TodoList'

export default function Home() {
  const { filter, changeFilter } = useFilter()
  const {
    todos,
    isLoading,
    error,
    addTodo,
    toggleComplete,
    updateTitle,
    deleteTodo
  } = useTodos({ filter })

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">待办事项</h2>

        <TodoInput onAdd={addTodo} />

        <TodoFilter currentFilter={filter} onFilterChange={changeFilter} />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <TodoList
          todos={todos}
          filter={filter}
          onToggleComplete={toggleComplete}
          onUpdateTitle={updateTitle}
          onDelete={deleteTodo}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}

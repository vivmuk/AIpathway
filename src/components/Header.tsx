import React from 'react'

interface HeaderProps {
  onRestart?: () => void
}

export default function Header({ onRestart }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-3xl">🧠</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AIPathway
          </h1>
        </div>
        {onRestart && (
          <button
            onClick={onRestart}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            ← Start Over
          </button>
        )}
      </div>
    </header>
  )
}


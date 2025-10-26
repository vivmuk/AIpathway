import React from 'react'

interface HeaderProps {
  onRestart?: () => void
}

export default function Header({ onRestart }: HeaderProps) {
  return (
    <header className="border-b" style={{ backgroundColor: '#333333' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🧠</div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F28C38' }}>
            AIPathway
          </h1>
        </div>
        {onRestart && (
          <button
            onClick={onRestart}
            className="px-4 py-2 font-semibold rounded-full transition-colors"
            style={{ color: '#FFFFFF', border: '2px solid #666666' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E53935'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#666666'
            }}
          >
            ← Start Over
          </button>
        )}
      </div>
    </header>
  )
}


'use client'

import { useState } from 'react'
import { Chapter } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChapterCardProps {
  chapter: Chapter
  onBack: () => void
  onComplete: () => void
  isCompleted: boolean
  onNext?: () => void
  onPrev?: () => void
  totalChapters?: number
}

export default function ChapterCard({ chapter, onBack, onComplete, isCompleted, onNext, onPrev, totalChapters = 10 }: ChapterCardProps) {
  const [showKeyTerms, setShowKeyTerms] = useState(true)
  const [showExamples, setShowExamples] = useState(true)
  const [showTryIt, setShowTryIt] = useState(true)
  const [showTools, setShowTools] = useState(true)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Back to Course
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Chapter {chapter.chapterNumber}
              </span>
              {isCompleted && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center">
                  ✓ Completed
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              {chapter.title}
            </h1>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-600 font-medium mb-1">Learning Objective:</p>
              <p className="text-gray-800">{chapter.learningObjective}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="markdown-content prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {chapter.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Key Terms */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => setShowKeyTerms(!showKeyTerms)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            📚 Key Terms ({chapter.keyTerms.length})
          </h2>
          <span className="text-2xl">{showKeyTerms ? '−' : '+'}</span>
        </button>
        {showKeyTerms && (
          <div className="p-6 space-y-4">
            {chapter.keyTerms.map((term, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 mb-1">{term.term}</h3>
                <p className="text-gray-700">{term.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Examples */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            💡 Real-World Examples ({chapter.examples.length})
          </h2>
          <span className="text-2xl">{showExamples ? '−' : '+'}</span>
        </button>
        {showExamples && (
          <div className="p-6 space-y-4">
            {chapter.examples.map((example, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">{index + 1}.</span>
                  <p className="text-gray-800">{example}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Try It Yourself */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => setShowTryIt(!showTryIt)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            🚀 Try It Yourself ({chapter.tryItYourself.length})
          </h2>
          <span className="text-2xl">{showTryIt ? '−' : '+'}</span>
        </button>
        {showTryIt && (
          <div className="p-6 space-y-4">
            {chapter.tryItYourself.map((exercise, index) => (
              <div key={index} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start">
                  <span className="text-yellow-600 font-bold mr-2">✓</span>
                  <p className="text-gray-800">{exercise}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tool Walkthrough */}
      {chapter.toolWalkthrough && (
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <button
            onClick={() => setShowTools(!showTools)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              🛠️ Tool Walkthrough: {chapter.toolWalkthrough.toolName}
            </h2>
            <span className="text-2xl">{showTools ? '−' : '+'}</span>
          </button>
          {showTools && (
            <div className="p-6">
              <p className="text-gray-700 mb-4">{chapter.toolWalkthrough.description}</p>
              <div className="space-y-3">
                {chapter.toolWalkthrough.steps.map((step, index) => (
                  <div key={index} className="flex items-start bg-purple-50 rounded-lg p-4">
                    <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-800 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Button */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        {!isCompleted ? (
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            ✓ Mark as Complete
          </button>
        ) : (
          <div className="text-green-600 font-semibold">
            ✓ You've completed this chapter!
          </div>
        )}
        
        {/* Chapter Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Previous Chapter
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Chapter →
            </button>
          )}
        </div>
        
        <button
          onClick={onBack}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Back to Course Overview
        </button>
      </div>
    </div>
  )
}


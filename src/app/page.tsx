'use client'

import { useState } from 'react'
import Quiz from '@/components/Quiz'
import PersonaSelector from '@/components/PersonaSelector'
import CourseView from '@/components/CourseView'
import Header from '@/components/Header'
import { UserProfile, Course } from '@/types'

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'persona' | 'quiz' | 'course'>('welcome')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [course, setCourse] = useState<Course | null>(null)

  const handleStartQuiz = () => {
    setStep('quiz')
  }

  const handleShowPersonas = () => {
    setStep('persona')
  }

  const handlePersonaSelect = (profile: UserProfile) => {
    setUserProfile(profile)
    setStep('course')
  }

  const handleCustomizeQuiz = () => {
    setStep('quiz')
  }

  const handleQuizComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setStep('course')
  }

  const handleRestartQuiz = () => {
    setUserProfile(null)
    setCourse(null)
    setStep('welcome')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onRestart={step !== 'welcome' ? handleRestartQuiz : undefined} />
      
      <main className="container mx-auto px-4 py-8">
        {step === 'welcome' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-12 relative">
              <div className="inline-block mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <span className="text-sm font-semibold text-blue-600">
                  🚀 Powered by Advanced AI
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black mb-4 text-blue-600 leading-none tracking-tight">
                AIPathway
              </h1>
              <p className="text-2xl md:text-3xl text-gray-900 mb-3 font-black">
                Your Personal AI Learning Journey
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
                Take a quick 9-question assessment and get a custom 10-chapter AI curriculum 
                tailored exactly to you.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Personalized</h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Curriculum adapted to your knowledge level, goals, and learning style
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Instant</h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Get your complete 10-chapter course generated in under 45 seconds
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Cutting-Edge</h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Learn the latest: GPT-5, Claude, LangChain, RAG systems, and more
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center mb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Quick Start with Personas */}
                <button
                  onClick={handleShowPersonas}
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white overflow-hidden rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <span className="relative flex items-center gap-2">
                    🚀 Quick Start
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>

                {/* Custom Quiz */}
                <button
                  onClick={handleStartQuiz}
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold overflow-hidden rounded-full shadow-sm hover:shadow-md transition-all duration-300 bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-600"
                >
                  <span className="relative flex items-center gap-2">
                    ✨ Custom Quiz
                  </span>
                </button>
              </div>
              <p className="text-gray-500 mt-4 text-sm font-normal">
                Choose a preset persona or customize your path
              </p>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-black mb-6 text-blue-600">What You Get</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">10 personalized chapters from fundamentals to advanced</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">Hands-on examples with real AI tools and frameworks</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">Interactive exercises for practical learning</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">Progress tracking and adaptive content</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">Export as HTML for offline study</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-normal">Industry-specific examples and use cases</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'persona' && (
          <PersonaSelector 
            onSelect={handlePersonaSelect}
            onCustomize={handleCustomizeQuiz}
          />
        )}

        {step === 'quiz' && (
          <Quiz onComplete={handleQuizComplete} />
        )}

        {step === 'course' && userProfile && (
          <CourseView userProfile={userProfile} />
        )}
      </main>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 AIPathway - Personalized AI Learning</p>
          <p className="text-sm mt-2">Powered by Venice AI</p>
        </div>
      </footer>
    </div>
  )
}


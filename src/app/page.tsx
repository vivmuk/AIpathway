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
              <div className="inline-block mb-4 px-4 py-2 rounded-full border" style={{ backgroundColor: '#fff5ed', borderColor: '#ffd5c2' }}>
                <span className="text-sm font-semibold" style={{ color: '#F15A24' }}>
                  🚀 Powered by Advanced AI
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black mb-4 leading-none tracking-tight" style={{ color: '#F28C38' }}>
                AIPathway
              </h1>
              <p className="text-2xl md:text-3xl mb-3 font-black" style={{ color: '#000000' }}>
                Your Personal AI Learning Journey
              </p>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed font-normal" style={{ color: '#666666' }}>
                Take a quick 9-question assessment and get a custom 10-chapter AI curriculum 
                tailored exactly to you.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Personalized</h3>
                <p className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>
                  Curriculum adapted to your knowledge level, goals, and learning style
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Instant</h3>
                <p className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>
                  Get your complete 10-chapter course generated in under 45 seconds
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Cutting-Edge</h3>
                <p className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>
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
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white overflow-hidden rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#F15A24' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E53935'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F15A24'}
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
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold overflow-hidden rounded-full shadow-sm hover:shadow-md transition-all duration-300 bg-white text-gray-900"
                  style={{ borderWidth: '2px', borderColor: '#666666' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E53935'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#666666'}
                >
                  <span className="relative flex items-center gap-2">
                    ✨ Custom Quiz
                  </span>
                </button>
              </div>
              <p className="mt-4 text-sm font-normal" style={{ color: '#666666' }}>
                Choose a preset persona or customize your path
              </p>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-black mb-6" style={{ color: '#F28C38' }}>What You Get</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>10 personalized chapters from fundamentals to advanced</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>Hands-on examples with real AI tools and frameworks</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>Interactive exercises for practical learning</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>Progress tracking and adaptive content</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>Export as HTML for offline study</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F15A24' }}>
                    ✓
                  </div>
                  <span className="text-base leading-relaxed font-normal" style={{ color: '#666666' }}>Industry-specific examples and use cases</span>
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


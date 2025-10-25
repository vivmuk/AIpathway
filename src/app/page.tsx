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
    <div className="min-h-screen">
      <Header onRestart={step !== 'welcome' ? handleRestartQuiz : undefined} />
      
      <main className="container mx-auto px-4 py-8">
        {step === 'welcome' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Hero Section with Glass Morphism */}
            <div className="text-center mb-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10"></div>
              <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full border border-blue-600/20 backdrop-blur-sm">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 Powered by Advanced AI
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                AIPathway
              </h1>
              <p className="text-2xl md:text-3xl text-gray-800 mb-4 font-semibold">
                Your Personal AI Learning Journey
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Take a quick 8-question assessment and get a custom 10-chapter AI curriculum 
                tailored exactly to you.
              </p>
            </div>

            {/* Feature Cards with Modern Design */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🎯</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Personalized</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Curriculum adapted to your knowledge level, goals, and learning style
                  </p>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">⚡</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get your complete 10-chapter course generated in under 45 seconds
                  </p>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-white to-pink-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-pink-100 hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🚀</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Cutting-Edge</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn the latest: GPT-5, Claude, LangChain, RAG systems, and more
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center mb-16">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Quick Start with Personas */}
                <button
                  onClick={handleShowPersonas}
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white overflow-hidden rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <span className="relative flex items-center gap-3">
                    🚀 Quick Start
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>

                {/* Custom Quiz */}
                <button
                  onClick={handleStartQuiz}
                  className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold overflow-hidden rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600"
                >
                  <span className="relative flex items-center gap-3">
                    ✨ Custom Quiz
                  </span>
                </button>
              </div>
              <p className="text-gray-500 mt-4 text-sm font-medium">
                Choose a preset persona or customize your path
              </p>
            </div>

            {/* Benefits Section with Glass Effect */}
            <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-white/50">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur opacity-30"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">What You Get</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">10 personalized chapters from fundamentals to advanced applications</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">Hands-on examples with real AI tools and frameworks</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">Interactive exercises for practical learning</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">Progress tracking and adaptive content</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">Export as PDF or HTML for offline study</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">Regenerate sections at different difficulty levels</span>
                  </div>
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


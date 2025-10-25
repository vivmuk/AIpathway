'use client'

import { UserProfile } from '@/types'

interface PersonaSelectorProps {
  onSelect: (profile: UserProfile) => void
  onCustomize: () => void
}

const personas = [
  {
    id: 'beginner',
    title: '🌱 Beginner Explorer',
    description: 'New to AI, want structured foundations',
    emoji: '🌱',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    profile: {
      aiScore: 15,
      personaType: 'beginner' as const,
      learningFocus: ['Understand AI concepts and terminology', 'Use AI tools for productivity'],
      learningStyle: 'visual' as const,
      timeCommitment: '3-5 hours per week',
      goals: ['Understand AI concepts and terminology'],
      codingExperience: 'no-code',
      aiToolsUsed: ['None of the above']
    }
  },
  {
    id: 'applied',
    title: '🎯 Applied Learner',
    description: 'Know basics, want practical applications',
    emoji: '🎯',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    profile: {
      aiScore: 45,
      personaType: 'applied' as const,
      learningFocus: ['Use AI tools for productivity', 'Apply AI to specific industry (healthcare, finance, etc.)'],
      learningStyle: 'mixed' as const,
      timeCommitment: '3-5 hours per week',
      goals: ['Use AI tools for productivity'],
      codingExperience: 'basic',
      aiToolsUsed: ['ChatGPT / Claude / Gemini']
    }
  },
  {
    id: 'technical',
    title: '🔧 Technical Builder',
    description: 'Developer ready to build AI systems',
    emoji: '🔧',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    profile: {
      aiScore: 70,
      personaType: 'technical' as const,
      learningFocus: ['Build AI applications and products', 'Research and experiment with cutting-edge AI'],
      learningStyle: 'hands-on' as const,
      timeCommitment: '6-10 hours per week',
      goals: ['Build AI applications and products'],
      codingExperience: 'proficient',
      aiToolsUsed: ['ChatGPT / Claude / Gemini', 'GitHub Copilot', 'OpenAI API / Anthropic API']
    }
  },
  {
    id: 'leadership',
    title: '👔 Leadership Learner',
    description: 'Executive seeking strategic AI fluency',
    emoji: '👔',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    profile: {
      aiScore: 40,
      personaType: 'leadership' as const,
      learningFocus: ['Lead AI initiatives at work', 'Understand AI concepts and terminology'],
      learningStyle: 'text' as const,
      timeCommitment: '1-2 hours per week',
      goals: ['Lead AI initiatives at work'],
      codingExperience: 'basic',
      aiToolsUsed: ['ChatGPT / Claude / Gemini']
    }
  }
]

export default function PersonaSelector({ onSelect, onCustomize }: PersonaSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Learning Path
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          Select a persona that matches your goals
        </p>
        <p className="text-gray-500">
          Or take the custom quiz for a fully personalized experience
        </p>
      </div>

      {/* Persona Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.profile)}
            className="group relative bg-white rounded-2xl p-8 text-left hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-transparent hover:scale-105"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${persona.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`text-6xl mb-2 transform group-hover:scale-110 transition-transform`}>
                  {persona.emoji}
                </div>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${persona.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span className="text-white text-sm font-semibold">Select →</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                {persona.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {persona.description}
              </p>
              
              {/* Profile highlights */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold">Level:</span>
                  <span>{persona.profile.aiScore < 30 ? 'Beginner' : persona.profile.aiScore < 60 ? 'Intermediate' : 'Advanced'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold">Style:</span>
                  <span className="capitalize">{persona.profile.learningStyle}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="font-semibold">Time:</span>
                  <span>{persona.profile.timeCommitment}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Quiz Option */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-20"></div>
          <button
            onClick={onCustomize}
            className="relative bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all hover:shadow-lg"
          >
            ✨ Take Custom Quiz Instead
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-3">Get a fully personalized curriculum</p>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'

interface QuizProps {
  onComplete: (profile: UserProfile) => void
}

interface Question {
  id: string
  question: string
  type: 'single' | 'multiple' | 'scale'
  options?: string[]
  scaleRange?: { min: number; max: number; minLabel: string; maxLabel: string }
}

const questions: Question[] = [
  {
    id: 'knowledge_level',
    question: 'How would you describe your current understanding of AI?',
    type: 'single',
    options: [
      'Complete beginner - I know very little about AI',
      'Basic awareness - I have heard of AI but havent used it much',
      'Intermediate - I use AI tools regularly',
      'Advanced - I understand ML concepts and have built AI solutions',
      'Expert - I work professionally with AI/ML technologies'
    ]
  },
  {
    id: 'coding_experience',
    question: 'What is your coding/programming experience?',
    type: 'single',
    options: [
      'No coding experience',
      'Basic scripting (Excel, simple automation)',
      'Some programming knowledge (Python, JavaScript basics)',
      'Proficient programmer (can build applications)',
      'Expert developer (professional software engineering)'
    ]
  },
  {
    id: 'ai_tools',
    question: 'Which AI tools have you used? (Select all that apply)',
    type: 'multiple',
    options: [
      'ChatGPT / Claude / Gemini',
      'GitHub Copilot',
      'Midjourney / DALL-E / Stable Diffusion',
      'LangChain / LlamaIndex',
      'Hugging Face models',
      'OpenAI API / Anthropic API',
      'None of the above'
    ]
  },
  {
    id: 'learning_goals',
    question: 'What are your primary learning goals? (Select all that apply)',
    type: 'multiple',
    options: [
      'Understand AI concepts and terminology',
      'Use AI tools for productivity',
      'Build AI applications and products',
      'Lead AI initiatives at work',
      'Research and experiment with cutting-edge AI',
      'Apply AI to specific industry (healthcare, finance, etc.)'
    ]
  },
  {
    id: 'learning_style',
    question: 'How do you learn best?',
    type: 'single',
    options: [
      'Visual (diagrams, videos, infographics)',
      'Reading (articles, documentation)',
      'Hands-on (coding, experiments, projects)',
      'Mixed approach'
    ]
  },
  {
    id: 'time_commitment',
    question: 'How much time can you dedicate to learning?',
    type: 'single',
    options: [
      '1-2 hours per week',
      '3-5 hours per week',
      '6-10 hours per week',
      '10+ hours per week'
    ]
  },
  {
    id: 'technical_depth',
    question: 'How technical do you want your learning to be?',
    type: 'scale',
    scaleRange: {
      min: 1,
      max: 5,
      minLabel: 'Conceptual only',
      maxLabel: 'Deep technical'
    }
  },
  {
    id: 'application_focus',
    question: 'What interests you most?',
    type: 'single',
    options: [
      'Understanding how AI works',
      'Using AI for personal productivity',
      'Building AI products',
      'AI strategy and leadership',
      'Research and innovation'
    ]
  },
  {
    id: 'industry',
    question: 'Which industry do you work in or want to apply AI to?',
    type: 'single',
    options: [
      'Healthcare & Life Sciences',
      'Finance & Banking',
      'Technology & Software',
      'Marketing & Media',
      'Education & Training',
      'Retail & E-commerce',
      'Manufacturing & Supply Chain',
      'Legal & Professional Services',
      'Real Estate & Construction',
      'Other / General Business'
    ]
  },
  {
    id: 'ai_mindset',
    question: 'Which statement resonates most with you?',
    type: 'single',
    options: [
      'AI is replacing jobs - I need to protect my current skills',
      'AI is a tool - I want to learn how to use it effectively',
      'AI is transformative - I want to reimagine how I work',
      'AI is an opportunity - I want to create new value with it'
    ]
  }
]

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSingleChoice = (option: string) => {
    setAnswers({ ...answers, [question.id]: option })
  }

  const handleMultipleChoice = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option]
    setSelectedOptions(newSelection)
  }

  const handleScaleChoice = (value: number) => {
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleNext = () => {
    if (question.type === 'multiple') {
      setAnswers({ ...answers, [question.id]: selectedOptions })
      setSelectedOptions([])
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      generateProfile()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const generateProfile = () => {
    // Calculate AI score based on knowledge level and coding experience
    const knowledgeMap: Record<string, number> = {
      'Complete beginner - I know very little about AI': 10,
      'Basic awareness - I have heard of AI but havent used it much': 30,
      'Intermediate - I use AI tools regularly': 50,
      'Advanced - I understand ML concepts and have built AI solutions': 75,
      'Expert - I work professionally with AI/ML technologies': 95
    }

    const codingMap: Record<string, string> = {
      'No coding experience': 'no-code',
      'Basic scripting (Excel, simple automation)': 'basic',
      'Some programming knowledge (Python, JavaScript basics)': 'intermediate',
      'Proficient programmer (can build applications)': 'proficient',
      'Expert developer (professional software engineering)': 'expert'
    }

    const personaMap: Record<string, UserProfile['personaType']> = {
      'Understanding how AI works': 'beginner',
      'Using AI for personal productivity': 'applied',
      'Building AI products': 'technical',
      'AI strategy and leadership': 'leadership',
      'Research and innovation': 'technical'
    }

    const learningStyleMap: Record<string, UserProfile['learningStyle']> = {
      'Visual (diagrams, videos, infographics)': 'visual',
      'Reading (articles, documentation)': 'text',
      'Hands-on (coding, experiments, projects)': 'hands-on',
      'Mixed approach': 'mixed'
    }

    const aiScore = knowledgeMap[answers.knowledge_level as string] || 30
    const personaType = personaMap[answers.application_focus as string] || 'applied'
    const learningStyle = learningStyleMap[answers.learning_style as string] || 'mixed'

    // Determine AI mindset
    const mindsetMap: Record<string, 'fixed' | 'growth' | 'exploring'> = {
      'AI is replacing jobs - I need to protect my current skills': 'fixed',
      'AI is a tool - I want to learn how to use it effectively': 'exploring',
      'AI is transformative - I want to reimagine how I work': 'growth',
      'AI is an opportunity - I want to create new value with it': 'growth'
    }

    const profile: UserProfile = {
      aiScore,
      personaType,
      learningFocus: answers.learning_goals || [],
      learningStyle,
      timeCommitment: answers.time_commitment || '3-5 hours per week',
      goals: answers.learning_goals || [],
      codingExperience: codingMap[answers.coding_experience as string] || 'basic',
      aiToolsUsed: answers.ai_tools || [],
      industry: answers.industry as string || 'General Business',
      aiMindset: mindsetMap[answers.ai_mindset as string] || 'exploring'
    }

    onComplete(profile)
  }

  const canProceed = () => {
    if (question.type === 'single') {
      return answers[question.id] !== undefined
    }
    if (question.type === 'multiple') {
      return selectedOptions.length > 0
    }
    if (question.type === 'scale') {
      return answers[question.id] !== undefined
    }
    return false
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            {question.question}
          </h2>

          {question.type === 'single' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSingleChoice(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[question.id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[question.id] === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOptions.includes(option)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      selectedOptions.includes(option)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOptions.includes(option) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'scale' && question.scaleRange && (
            <div className="py-6">
              <div className="flex justify-between mb-4 text-sm text-gray-600">
                <span>{question.scaleRange.minLabel}</span>
                <span>{question.scaleRange.maxLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                {Array.from(
                  { length: question.scaleRange.max - question.scaleRange.min + 1 },
                  (_, i) => i + question.scaleRange!.min
                ).map((value) => (
                  <button
                    key={value}
                    onClick={() => handleScaleChoice(value)}
                    className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                      answers[question.id] === value
                        ? 'border-blue-500 bg-blue-500 text-white scale-110'
                        : 'border-gray-300 hover:border-blue-300 bg-white text-gray-700'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Generate Course' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}


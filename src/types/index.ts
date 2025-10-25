export interface QuizAnswer {
  questionId: string
  answer: string | number
}

export interface UserProfile {
  aiScore: number
  personaType: 'beginner' | 'applied' | 'technical' | 'leadership'
  learningFocus: string[]
  learningStyle: 'visual' | 'text' | 'hands-on' | 'mixed'
  timeCommitment: string
  goals: string[]
  codingExperience: string
  aiToolsUsed: string[]
  industry?: string
  aiMindset?: 'fixed' | 'growth' | 'exploring'
}

export interface Chapter {
  chapterNumber: number
  title: string
  learningObjective: string
  content: string
  keyTerms: { term: string; definition: string }[]
  examples: string[]
  tryItYourself: string[]
  toolWalkthrough?: {
    toolName: string
    description: string
    steps: string[]
  }
  resources?: {
    type: 'github' | 'youtube' | 'documentation' | 'article'
    title: string
    url: string
  }[]
}

export interface Course {
  id: string
  title: string
  subtitle: string
  generatedAt: string
  userProfile: UserProfile
  chapters: Chapter[]
  overallDescription: string
}

export interface Progress {
  courseId: string
  completedChapters: number[]
  currentChapter: number
  startedAt: string
  lastAccessedAt: string
}


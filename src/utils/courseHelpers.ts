import { Course, UserProfile } from '@/types'

/**
 * Generate a shareable summary of the course
 */
export function generateCourseSummary(course: Course): string {
  return `
📚 ${course.title}
${course.subtitle}

Generated on: ${new Date(course.generatedAt).toLocaleDateString()}

Course Overview:
${course.overallDescription}

Chapters:
${course.chapters.map(ch => `${ch.chapterNumber}. ${ch.title}`).join('\n')}

---
Created with AIPathway - Personalized AI Learning
  `.trim()
}

/**
 * Calculate estimated completion time based on user profile
 */
export function estimateCompletionTime(
  totalChapters: number,
  timeCommitment: string
): string {
  const hoursPerWeekMap: Record<string, number> = {
    '1-2 hours per week': 1.5,
    '3-5 hours per week': 4,
    '6-10 hours per week': 8,
    '10+ hours per week': 12,
  }

  const hoursPerWeek = hoursPerWeekMap[timeCommitment] || 4
  const hoursPerChapter = 1.5 // Average time per chapter
  const totalHours = totalChapters * hoursPerChapter
  const weeks = Math.ceil(totalHours / hoursPerWeek)

  if (weeks === 1) return '1 week'
  if (weeks < 4) return `${weeks} weeks`
  if (weeks < 8) return `${Math.round(weeks / 4)} month${weeks > 4 ? 's' : ''}`
  return `${Math.round(weeks / 4)} months`
}

/**
 * Get persona description for display
 */
export function getPersonaDescription(personaType: UserProfile['personaType']): string {
  const descriptions = {
    beginner: '🌱 Beginner Explorer - Building foundational knowledge',
    applied: '🎯 Applied Learner - Focusing on practical applications',
    technical: '🔧 Technical Builder - Learning implementation skills',
    leadership: '👔 Leadership Learner - Strategic AI understanding',
  }
  return descriptions[personaType] || 'AI Learner'
}

/**
 * Get learning style icon and description
 */
export function getLearningStyleInfo(style: UserProfile['learningStyle']): {
  icon: string
  description: string
} {
  const styles = {
    visual: {
      icon: '🎨',
      description: 'Visual learner - diagrams and infographics',
    },
    text: {
      icon: '📖',
      description: 'Text-based learner - detailed written content',
    },
    'hands-on': {
      icon: '🛠️',
      description: 'Hands-on learner - practical exercises and coding',
    },
    mixed: {
      icon: '🌈',
      description: 'Mixed approach - combines multiple learning styles',
    },
  }
  return styles[style] || { icon: '📚', description: 'Adaptive learner' }
}

/**
 * Format AI score to descriptive level
 */
export function formatAIScore(score: number): {
  level: string
  color: string
  description: string
} {
  if (score < 20) {
    return {
      level: 'Beginner',
      color: 'text-blue-600',
      description: 'Just starting your AI journey',
    }
  } else if (score < 40) {
    return {
      level: 'Novice',
      color: 'text-green-600',
      description: 'Building foundational knowledge',
    }
  } else if (score < 60) {
    return {
      level: 'Intermediate',
      color: 'text-yellow-600',
      description: 'Comfortable with AI concepts',
    }
  } else if (score < 80) {
    return {
      level: 'Advanced',
      color: 'text-orange-600',
      description: 'Strong AI understanding',
    }
  } else {
    return {
      level: 'Expert',
      color: 'text-purple-600',
      description: 'AI professional',
    }
  }
}

/**
 * Generate achievement badges based on progress
 */
export function getAchievements(completedChapters: number): string[] {
  const achievements: string[] = []

  if (completedChapters >= 1) achievements.push('🎯 First Steps')
  if (completedChapters >= 3) achievements.push('🔥 On Fire')
  if (completedChapters >= 5) achievements.push('⭐ Halfway Hero')
  if (completedChapters >= 7) achievements.push('🚀 Almost There')
  if (completedChapters >= 10) achievements.push('🏆 Course Champion')

  return achievements
}

/**
 * Save course to localStorage with error handling
 */
export function saveCourseToStorage(course: Course): boolean {
  try {
    localStorage.setItem('aipathway_course', JSON.stringify(course))
    return true
  } catch (error) {
    console.error('Error saving course to localStorage:', error)
    return false
  }
}

/**
 * Load course from localStorage
 */
export function loadCourseFromStorage(): Course | null {
  try {
    const courseData = localStorage.getItem('aipathway_course')
    return courseData ? JSON.parse(courseData) : null
  } catch (error) {
    console.error('Error loading course from localStorage:', error)
    return null
  }
}

/**
 * Clear all AIPathway data from localStorage
 */
export function clearStorageData(): void {
  try {
    localStorage.removeItem('aipathway_course')
    localStorage.removeItem('aipathway_progress')
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}


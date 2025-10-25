import { Progress } from '@/types'

interface ProgressDashboardProps {
  progress: Progress
  totalChapters: number
}

export default function ProgressDashboard({ progress, totalChapters }: ProgressDashboardProps) {
  const completionPercentage = (progress.completedChapters.length / totalChapters) * 100
  
  const startDate = new Date(progress.startedAt)
  const lastAccessDate = new Date(progress.lastAccessedAt)
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Progress</h2>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">
            {progress.completedChapters.length}
          </div>
          <div className="text-sm text-gray-600">Chapters Completed</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600">
            {Math.round(completionPercentage)}%
          </div>
          <div className="text-sm text-gray-600">Course Progress</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">
            {progress.currentChapter}
          </div>
          <div className="text-sm text-gray-600">Current Chapter</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-orange-600">
            {daysSinceStart}
          </div>
          <div className="text-sm text-gray-600">Days Learning</div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{progress.completedChapters.length} / {totalChapters} chapters</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      {completionPercentage === 100 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="font-semibold text-green-800">
            Congratulations! You've completed the entire course!
          </div>
        </div>
      )}
    </div>
  )
}


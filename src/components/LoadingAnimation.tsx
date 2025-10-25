export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 mb-6">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
        
        {/* Middle rotating ring */}
        <div className="absolute inset-2 border-4 border-purple-200 rounded-full"></div>
        <div
          className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        ></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🧠</span>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Generating Your Course...
        </h3>
        <p className="text-sm text-gray-600">
          Our AI is crafting personalized content
        </p>
      </div>
    </div>
  )
}


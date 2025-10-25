'use client'

import { useState } from 'react'

export default function Debug() {
  const [testing, setTesting] = useState(false)
  const [testingJson, setTestingJson] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [jsonResult, setJsonResult] = useState<any>(null)

  const testVeniceAPI = async () => {
    setTesting(true)
    setResult(null)

    try {
      console.log('🧪 Testing Venice API...')
      const response = await fetch('/api/test-venice')
      const data = await response.json()
      
      console.log('Test result:', data)
      setResult(data)
    } catch (error: any) {
      console.error('Test failed:', error)
      setResult({ error: error.message })
    } finally {
      setTesting(false)
    }
  }

  const testJsonSchema = async () => {
    setTestingJson(true)
    setJsonResult(null)

    try {
      console.log('🧪 Testing JSON Schema...')
      const response = await fetch('/api/test-json-schema')
      const data = await response.json()
      
      console.log('JSON Schema test result:', data)
      setJsonResult(data)
    } catch (error: any) {
      console.error('JSON Schema test failed:', error)
      setJsonResult({ error: error.message })
    } finally {
      setTestingJson(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔧 Venice API Debug</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Venice Connection</h2>
          <div className="flex gap-4">
            <button
              onClick={testVeniceAPI}
              disabled={testing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {testing ? '🔄 Testing...' : '▶️ Test Basic'}
            </button>
            <button
              onClick={testJsonSchema}
              disabled={testingJson}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {testingJson ? '🔄 Testing...' : '🧪 Test JSON Schema'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Basic Test Result' : '❌ Basic Test Failed'}
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {jsonResult && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {jsonResult.success ? '✅ JSON Schema Test Result' : '❌ JSON Schema Test Failed'}
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(jsonResult, null, 2)}
            </pre>
            {jsonResult.success && jsonResult.parsed && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Parsed Course Data:</h4>
                <p className="text-green-700">Title: {jsonResult.parsed.title}</p>
                <p className="text-green-700">Chapters: {jsonResult.parsed.chapters?.length}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>Click "Run Test" to test Venice API connection</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>Check server terminal for backend logs</li>
            <li>Look for emoji indicators: ✅ (success) or ❌ (error)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}


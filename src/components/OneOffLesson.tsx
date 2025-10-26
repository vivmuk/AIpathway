'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonContent {
  topic: string
  knowledgeLevel: string
  content: string
  keyTerms: Array<{ term: string; definition: string }>
  examples: string[]
  practicalExercises: string[]
  latestNews: Array<{
    headline: string
    summary: string
    source: string
    date: string
    url: string
  }>
}

const HOT_TOPICS = [
  { id: 'gpt5', label: '🚀 GPT-5 and Next-Gen LLMs', description: 'Latest developments in large language models' },
  { id: 'chain-of-debate', label: '💭 Chain of Debate', description: 'Advanced reasoning techniques for AI' },
  { id: 'multimodal-ai', label: '🎨 Multimodal AI', description: 'Vision, audio, and text integration' },
  { id: 'ai-agents', label: '🤖 Autonomous AI Agents', description: 'Self-directed AI systems and workflows' },
  { id: 'rag-systems', label: '📚 RAG Systems', description: 'Retrieval-Augmented Generation techniques' },
  { id: 'prompt-engineering', label: '✍️ Advanced Prompt Engineering', description: 'Latest prompting strategies and patterns' },
]

const KNOWLEDGE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to this topic' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some familiarity' },
  { value: 'advanced', label: 'Advanced', description: 'Strong understanding' },
  { value: 'expert', label: 'Expert', description: 'Deep expertise' },
]

export default function OneOffLesson({ onBack }: { onBack: () => void }) {
  const [topic, setTopic] = useState('')
  const [knowledgeLevel, setKnowledgeLevel] = useState('intermediate')
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<LessonContent | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTopicClick = (topicLabel: string) => {
    setTopic(topicLabel)
  }

  const handleGenerateLesson = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          knowledgeLevel,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate lesson')
      }

      const data = await response.json()
      setLesson(data.lesson)
    } catch (err: any) {
      setError(err.message || 'Failed to generate lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleExportHTML = () => {
    if (!lesson) return

    const markdownToHTML = (markdown: string | undefined | null): string => {
      if (!markdown || typeof markdown !== 'string') return ''
      return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lesson.topic}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 40px 20px; 
      line-height: 1.8; 
      color: #1f2937;
      background: linear-gradient(to bottom, #eff6ff, #ffffff);
    }
    h1 { color: #F28C38; font-size: 2.5em; margin-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h3 { color: #2563eb; margin-top: 20px; }
    .header { background: linear-gradient(135deg, #F28C38 0%, #F15A24 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
    .content { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px; }
    .key-term { background: #dbeafe; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; border-radius: 4px; }
    .example { background: #d1fae5; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 4px; }
    .exercise { background: #f3e8ff; padding: 15px; margin: 10px 0; border-left: 4px solid #9333ea; border-radius: 4px; }
    .news-item { background: #fef3c7; padding: 20px; margin: 15px 0; border-left: 4px solid #f59e0b; border-radius: 4px; }
    .badge { display: inline-block; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; margin-bottom: 10px; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${lesson.topic}</h1>
    <div class="badge">${KNOWLEDGE_LEVELS.find(l => l.value === lesson.knowledgeLevel)?.label || lesson.knowledgeLevel}</div>
  </div>

  <div class="content">
    ${markdownToHTML(lesson.content)}
  </div>

  ${lesson.keyTerms && lesson.keyTerms.length > 0 ? `
  <div class="content">
    <h2>🔑 Key Terms</h2>
    ${lesson.keyTerms.map(term => `
      <div class="key-term">
        <strong>${term?.term || 'Term'}:</strong> ${term?.definition || ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${lesson.examples && lesson.examples.length > 0 ? `
  <div class="content">
    <h2>💡 Examples</h2>
    ${lesson.examples.map((ex, i) => `
      <div class="example">
        <strong>Example ${i + 1}:</strong> ${markdownToHTML(ex)}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${lesson.practicalExercises && lesson.practicalExercises.length > 0 ? `
  <div class="content">
    <h2>🚀 Practical Exercises</h2>
    ${lesson.practicalExercises.map((ex, i) => `
      <div class="exercise">
        <strong>${i + 1}.</strong> ${markdownToHTML(ex)}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${lesson.latestNews && lesson.latestNews.length > 0 ? `
  <div class="content">
    <h2>📰 Latest News & Developments</h2>
    ${lesson.latestNews.map(news => `
      <div class="news-item">
        <h3><a href="${news.url}" target="_blank" style="color: #ea580c; text-decoration: none;">${news.headline}</a></h3>
        <p>${news.summary}</p>
        <p style="font-size: 0.9em; color: #6b7280;">
          <strong>Source:</strong> ${news.source} | <strong>Date:</strong> ${news.date} | <a href="${news.url}" target="_blank" style="color: #2563eb;">Read more →</a>
        </p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <footer style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280;">
    <p><strong>${lesson.topic}</strong></p>
    <p>Generated by AIPathway | Powered by Venice AI</p>
  </footer>
</body>
</html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${lesson.topic.replace(/[^a-z0-9]/gi, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    if (!lesson) return

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - (margin * 2)
      let yPosition = margin

      const checkAddPage = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      const addWrappedText = (text: string, fontSize: number, fontStyle: string = 'normal', color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', fontStyle)
        doc.setTextColor(color[0], color[1], color[2])
        
        const lines = doc.splitTextToSize(text, maxWidth)
        const lineHeight = fontSize * 0.5
        
        lines.forEach((line: string) => {
          checkAddPage(lineHeight)
          doc.text(line, margin, yPosition)
          yPosition += lineHeight
        })
        
        yPosition += lineHeight * 0.3
      }

      // Title Page
      doc.setFillColor(249, 115, 22)
      doc.rect(0, 0, pageWidth, 60, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      const titleLines = doc.splitTextToSize(lesson.topic, maxWidth)
      let titleY = 30
      titleLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, titleY, { align: 'center' })
        titleY += 10
      })
      
      yPosition = 80
      addWrappedText(`Knowledge Level: ${KNOWLEDGE_LEVELS.find(l => l.value === lesson.knowledgeLevel)?.label || lesson.knowledgeLevel}`, 12, 'italic', [107, 114, 128])
      yPosition += 10

      // Content
      if (lesson.content) {
        const contentParagraphs = lesson.content.split('\n\n')
        contentParagraphs.forEach(para => {
          if (para.trim()) {
            const cleanPara = para.replace(/[#*`]/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').trim()
            if (cleanPara) {
              addWrappedText(cleanPara, 10, 'normal', [31, 41, 55])
              yPosition += 3
            }
          }
        })
      }

      yPosition += 10

      // Key Terms
      if (Array.isArray(lesson.keyTerms) && lesson.keyTerms.length > 0) {
        checkAddPage(30)
        addWrappedText('Key Terms', 14, 'bold', [30, 64, 175])
        yPosition += 5
        lesson.keyTerms.forEach(term => {
          checkAddPage(20)
          addWrappedText(`• ${term?.term || 'Term'}: ${term?.definition || ''}`, 9, 'normal', [55, 65, 81])
          yPosition += 3
        })
        yPosition += 8
      }

      // Examples
      if (Array.isArray(lesson.examples) && lesson.examples.length > 0) {
        checkAddPage(30)
        addWrappedText('Examples', 14, 'bold', [22, 163, 74])
        yPosition += 5
        lesson.examples.forEach((ex, i) => {
          checkAddPage(20)
          addWrappedText(`${i + 1}. ${ex || ''}`, 9, 'normal', [55, 65, 81])
          yPosition += 3
        })
        yPosition += 8
      }

      // Exercises
      if (Array.isArray(lesson.practicalExercises) && lesson.practicalExercises.length > 0) {
        checkAddPage(30)
        addWrappedText('Practical Exercises', 14, 'bold', [147, 51, 234])
        yPosition += 5
        lesson.practicalExercises.forEach((ex, i) => {
          checkAddPage(20)
          addWrappedText(`${i + 1}. ${ex || ''}`, 9, 'normal', [55, 65, 81])
          yPosition += 3
        })
        yPosition += 8
      }

      // Latest News
      if (Array.isArray(lesson.latestNews) && lesson.latestNews.length > 0) {
        checkAddPage(30)
        addWrappedText('Latest News & Developments', 14, 'bold', [245, 158, 11])
        yPosition += 5
        lesson.latestNews.forEach(news => {
          checkAddPage(30)
          addWrappedText(news.headline, 11, 'bold', [0, 0, 0])
          yPosition += 2
          addWrappedText(news.summary, 9, 'normal', [55, 65, 81])
          yPosition += 2
          addWrappedText(`Source: ${news.source} | ${news.date}`, 8, 'italic', [107, 114, 128])
          yPosition += 2
          addWrappedText(`Link: ${news.url}`, 8, 'normal', [37, 99, 235])
          yPosition += 5
        })
      }

      // Footer
      doc.addPage()
      yPosition = pageHeight / 2
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 64, 175)
      doc.text(lesson.topic, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text('Generated by AIPathway | Powered by Venice AI', pageWidth / 2, yPosition, { align: 'center' })

      const fileName = `${lesson.topic.replace(/[^a-z0-9]/gi, '_')}.pdf`
      doc.save(fileName)
    } catch (error: any) {
      alert(`Failed to export PDF: ${error.message || 'Unknown error'}`)
    }
  }

  if (lesson) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Lesson Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-8 mb-6 text-white">
          <button
            onClick={() => {
              setLesson(null)
              setTopic('')
            }}
            className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            ← Back to New Lesson
          </button>
          <h1 className="text-4xl font-bold mb-2">{lesson.topic}</h1>
          <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm">
            {KNOWLEDGE_LEVELS.find(l => l.value === lesson.knowledgeLevel)?.label || lesson.knowledgeLevel}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleExportHTML}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            📄 Export HTML
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            📑 Export PDF
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Key Terms */}
        {lesson.keyTerms && lesson.keyTerms.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">🔑 Key Terms</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.keyTerms.map((term, i) => (
                <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{term.term}</h3>
                  <p className="text-gray-700 leading-relaxed">{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        {lesson.examples && lesson.examples.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">💡 Real-World Examples</h2>
            <div className="space-y-4">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-gray-800 leading-relaxed flex-1">{ex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Exercises */}
        {lesson.practicalExercises && lesson.practicalExercises.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">🚀 Try It Yourself</h2>
            <div className="space-y-4">
              {lesson.practicalExercises.map((ex, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-gray-800 leading-relaxed flex-1">{ex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest News */}
        {lesson.latestNews && lesson.latestNews.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-8 mb-6 border-2 border-orange-200">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
              📰 Latest News & Developments
            </h2>
            <div className="space-y-6">
              {lesson.latestNews.map((news, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-orange-900 hover:text-orange-700 hover:underline mb-3 block transition-colors"
                  >
                    {news.headline}
                  </a>
                  <p className="text-gray-700 leading-relaxed mb-4">{news.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v8h12V6H4zm2 2a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"/>
                      </svg>
                      <strong>{news.source}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      {news.date}
                    </span>
                    <span>•</span>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1"
                    >
                      Read full article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Quick Lesson Generator</h1>
        <p className="text-gray-600 mb-6">
          Get an instant, personalized lesson on any AI topic with the latest news and developments
        </p>

        {/* Hot Topics */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">🔥 Hot Topics Right Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HOT_TOPICS.map((hotTopic) => (
              <button
                key={hotTopic.id}
                onClick={() => handleTopicClick(hotTopic.label)}
                className="text-left p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg border border-orange-200 transition"
              >
                <div className="font-semibold text-gray-900">{hotTopic.label}</div>
                <div className="text-sm text-gray-600">{hotTopic.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            What would you like to learn about?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., GPT-5, Chain of Debate, RAG systems..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Knowledge Level */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Your Knowledge Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {KNOWLEDGE_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => setKnowledgeLevel(level.value)}
                className={`p-4 rounded-lg border-2 transition ${
                  knowledgeLevel === level.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-white hover:border-orange-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{level.label}</div>
                <div className="text-xs text-gray-600">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateLesson}
          disabled={loading || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Your Lesson...
            </span>
          ) : (
            '🚀 Generate Lesson with Latest News'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">✨ What you'll get:</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Personalized lesson tailored to your knowledge level</li>
          <li>• Key terms and definitions</li>
          <li>• Real-world examples</li>
          <li>• Practical exercises to try</li>
          <li>• <strong>Latest news and developments</strong> on your topic</li>
          <li>• Downloadable HTML and PDF formats</li>
        </ul>
      </div>
    </div>
  )
}


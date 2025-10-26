'use client'

import { useState, useEffect } from 'react'
import { UserProfile, Course, Progress } from '@/types'
import ChapterCard from './ChapterCard'
import { jsPDF } from 'jspdf'
import ProgressDashboard from './ProgressDashboard'

interface CourseViewProps {
  userProfile: UserProfile
}

export default function CourseView({ userProfile }: CourseViewProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [generationProgress, setGenerationProgress] = useState<string>('Preparing...')
  const [chaptersGenerated, setChaptersGenerated] = useState<number>(0)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Check if there's a cached course for this user profile
    const cachedCourse = localStorage.getItem('aipathway_course')
    const cachedProgress = localStorage.getItem('aipathway_progress')
    
    if (cachedCourse && cachedProgress) {
      try {
        const parsedCourse = JSON.parse(cachedCourse)
        const parsedProgress = JSON.parse(cachedProgress)
        
        // Validate cache: same profile AND has expected chapter count
        const expectedChapters = parsedCourse.chapters?.length || 0
        const isSameProfile = parsedCourse.userProfile?.personaType === userProfile.personaType
        const hasValidChapters = expectedChapters > 0
        
        if (isSameProfile && hasValidChapters) {
          setCourse(parsedCourse)
          setProgress(parsedProgress)
          setLoading(false)
          return
        } else {
          // Clear invalid cache
          localStorage.removeItem('aipathway_course')
          localStorage.removeItem('aipathway_progress')
        }
      } catch (e) {
        // Clear corrupted cache
        localStorage.removeItem('aipathway_course')
        localStorage.removeItem('aipathway_progress')
      }
    }
    
    // No cache or different profile, generate new course
    generateCourse()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateCourse = async () => {
    // Prevent duplicate generation
    if (isGenerating) {
      return
    }
    
    setIsGenerating(true)
    setLoading(true)
    setError(null)
    setChaptersGenerated(0)

    try {
      // Step 1: Generate course outline
      setGenerationProgress('Creating your personalized course outline...')
      
      const outlineResponse = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfile }),
      })

      if (!outlineResponse.ok) {
        const errorData = await outlineResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate outline')
      }

      const { outline } = await outlineResponse.json()
      console.log('✅ Outline generated:', outline.title)
      
      // Create initial course object with empty chapters
      const courseId = `course-${Date.now()}`
      const initialCourse: Course = {
        id: courseId,
        title: outline.title,
        subtitle: outline.subtitle,
        overallDescription: outline.overallDescription,
        generatedAt: new Date().toISOString(),
        userProfile,
        chapters: outline.chapters.map((ch: any) => ({
          ...ch,
          content: '',
          keyTerms: [],
          examples: [],
          tryItYourself: [],
          toolWalkthrough: null
        }))
      }
      
      setCourse(initialCourse)
      
      // Step 2: Generate each chapter with Mistral
      console.log('📖 Step 2: Generating chapters with Mistral...')
      const fullChapters: any[] = []
      
      for (let i = 0; i < outline.chapters.length; i++) {
        const chapterOutline = outline.chapters[i]
        setGenerationProgress(`Generating Chapter ${i + 1} of ${outline.chapters.length}: ${chapterOutline.title}`)
        setChaptersGenerated(i)
        
        let chapter = null
        let retryCount = 0
        const maxRetries = 2
        
        // Try to generate chapter with retries
        while (!chapter && retryCount < maxRetries) {
          try {
            const chapterResponse = await fetch('/api/generate-chapter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chapterOutline,
                userProfile,
                courseTitle: outline.title
              }),
            })

            if (chapterResponse.ok) {
              const data = await chapterResponse.json()
              chapter = data.chapter
            } else {
              retryCount++
              if (retryCount < maxRetries) {
                setGenerationProgress(`Retrying Chapter ${i + 1} (attempt ${retryCount + 1})...`)
                await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2s before retry
              }
            }
          } catch (chapterError) {
            retryCount++
            if (retryCount < maxRetries) {
              setGenerationProgress(`Retrying Chapter ${i + 1} (attempt ${retryCount + 1})...`)
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }
        }
        
        // If chapter generation failed after retries, create a basic chapter
        if (!chapter) {
          chapter = {
            ...chapterOutline,
            content: `# ${chapterOutline.title}\n\n**Learning Objective:** ${chapterOutline.learningObjective}\n\n*This chapter is being regenerated. Please refresh or try exporting again in a moment.*\n\nIn this chapter, you will learn about ${chapterOutline.title.toLowerCase()}. The content will cover the fundamentals and practical applications related to ${chapterOutline.learningObjective.toLowerCase()}.`,
            keyTerms: [],
            examples: [],
            tryItYourself: [],
            toolWalkthrough: null
          }
        }
        
        fullChapters.push(chapter)
        
        // Update course with generated chapter
        const updatedCourse = {
          ...initialCourse,
          chapters: initialCourse.chapters.map((ch, idx) => 
            idx < fullChapters.length ? fullChapters[idx] : ch
          )
        }
        setCourse(updatedCourse)
        setChaptersGenerated(i + 1)
        
        // Save progress after each chapter to prevent data loss
        localStorage.setItem('aipathway_course', JSON.stringify(updatedCourse))
      }
      
      // Final course with all chapters
      const finalCourse = {
        ...initialCourse,
        chapters: fullChapters
      }
      
      setCourse(finalCourse)
      console.log('✅ All chapters generated!')

      // Initialize progress
      const newProgress: Progress = {
        courseId: finalCourse.id,
        completedChapters: [],
        currentChapter: 1,
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      }
      setProgress(newProgress)

      // Save to localStorage
      localStorage.setItem('aipathway_course', JSON.stringify(finalCourse))
      localStorage.setItem('aipathway_progress', JSON.stringify(newProgress))
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating your course')
    } finally {
      setLoading(false)
      setIsGenerating(false)
    }
  }

  const handleChapterClick = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber)
    
    if (progress) {
      const updatedProgress = {
        ...progress,
        currentChapter: chapterNumber,
        lastAccessedAt: new Date().toISOString()
      }
      setProgress(updatedProgress)
      localStorage.setItem('aipathway_progress', JSON.stringify(updatedProgress))
    }
  }

  const handleChapterComplete = (chapterNumber: number) => {
    if (progress && !progress.completedChapters.includes(chapterNumber)) {
      const updatedProgress = {
        ...progress,
        completedChapters: [...progress.completedChapters, chapterNumber],
        lastAccessedAt: new Date().toISOString()
      }
      setProgress(updatedProgress)
      localStorage.setItem('aipathway_progress', JSON.stringify(updatedProgress))
    }
  }

  const handleBackToCourse = () => {
    setSelectedChapter(null)
  }

  const handleExportPDF = () => {
    try {
      if (!course) {
        alert('No course to export')
        return
      }
      
      // Check if chapters have content
      const chaptersWithContent = course.chapters.filter(ch => ch?.content && ch.content.trim() !== '')
      if (chaptersWithContent.length === 0) {
        alert('Please wait for chapters to finish generating before exporting.')
        return
      }
      
      if (chaptersWithContent.length < course.chapters.length) {
        if (!confirm(`Only ${chaptersWithContent.length} of ${course.chapters.length} chapters have content. Export anyway?`)) {
          return
        }
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - (margin * 2)
      let yPosition = margin

      // Helper to add new page if needed
      const checkAddPage = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // Helper to wrap and add text
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
        
        yPosition += lineHeight * 0.3 // Small spacing after paragraph
      }

      // Title Page
      doc.setFillColor(249, 115, 22) // Orange
      doc.rect(0, 0, pageWidth, 60, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      const titleLines = doc.splitTextToSize(course.title, maxWidth)
      let titleY = 30
      titleLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, titleY, { align: 'center' })
        titleY += 12
      })
      
      yPosition = 80
      addWrappedText(course.subtitle, 14, 'italic', [107, 114, 128])
      yPosition += 10
      addWrappedText(course.overallDescription, 11, 'normal', [55, 65, 81])
      
      yPosition += 20

      // Chapters
      chaptersWithContent.forEach((chapter, idx) => {
        if (idx > 0) {
          doc.addPage()
          yPosition = margin
        }

        // Chapter Header
        doc.setFillColor(59, 130, 246) // Blue
        doc.rect(0, yPosition - 10, pageWidth, 20, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(`Chapter ${chapter.chapterNumber}: ${chapter.title}`, margin, yPosition)
        yPosition += 15
        
        doc.setTextColor(0, 0, 0)
        addWrappedText(`Objective: ${chapter.learningObjective}`, 10, 'italic', [75, 85, 99])
        yPosition += 8

        // Content
        if (chapter.content) {
          const contentParagraphs = chapter.content.split('\n\n')
          contentParagraphs.forEach(para => {
            if (para.trim()) {
              // Remove markdown formatting for PDF
              const cleanPara = para
                .replace(/[#*`]/g, '')
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                .trim()
              if (cleanPara) {
                addWrappedText(cleanPara, 10, 'normal', [31, 41, 55])
                yPosition += 3
              }
            }
          })
        }

        yPosition += 10

        // Key Terms
        if (Array.isArray(chapter.keyTerms) && chapter.keyTerms.length > 0) {
          checkAddPage(30)
          addWrappedText('Key Terms', 14, 'bold', [30, 64, 175])
          yPosition += 5
          chapter.keyTerms.forEach(term => {
            checkAddPage(20)
            addWrappedText(`• ${term?.term || 'Term'}: ${term?.definition || ''}`, 9, 'normal', [55, 65, 81])
            yPosition += 3
          })
          yPosition += 8
        }

        // Examples
        if (Array.isArray(chapter.examples) && chapter.examples.length > 0) {
          checkAddPage(30)
          addWrappedText('Real-World Examples', 14, 'bold', [22, 163, 74])
          yPosition += 5
          chapter.examples.forEach((ex, i) => {
            checkAddPage(20)
            addWrappedText(`${i + 1}. ${ex || ''}`, 9, 'normal', [55, 65, 81])
            yPosition += 3
          })
          yPosition += 8
        }

        // Try It Yourself
        if (Array.isArray(chapter.tryItYourself) && chapter.tryItYourself.length > 0) {
          checkAddPage(30)
          addWrappedText('Try It Yourself', 14, 'bold', [147, 51, 234])
          yPosition += 5
          chapter.tryItYourself.forEach((ex, i) => {
            checkAddPage(20)
            addWrappedText(`${i + 1}. ${ex || ''}`, 9, 'normal', [55, 65, 81])
            yPosition += 3
          })
          yPosition += 8
        }

        // Tool Walkthrough
        if (chapter.toolWalkthrough && Array.isArray(chapter.toolWalkthrough.steps) && chapter.toolWalkthrough.steps.length > 0) {
          checkAddPage(30)
          addWrappedText(`Tool Walkthrough: ${chapter.toolWalkthrough.toolName || 'GenAI Tool'}`, 14, 'bold', [168, 85, 247])
          yPosition += 5
          if (chapter.toolWalkthrough.description) {
            addWrappedText(chapter.toolWalkthrough.description, 9, 'italic', [75, 85, 99])
            yPosition += 3
          }
          chapter.toolWalkthrough.steps.forEach((step, i) => {
            checkAddPage(20)
            addWrappedText(`${i + 1}. ${step || ''}`, 9, 'normal', [55, 65, 81])
            yPosition += 3
          })
        }
      })

      // Footer on last page
      doc.addPage()
      yPosition = pageHeight / 2
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 64, 175)
      doc.text(course.title, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text('Powered by AIPathway & Venice AI', pageWidth / 2, yPosition, { align: 'center' })

      // Save PDF
      const fileName = `${course.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
      doc.save(fileName)
      
    } catch (error: any) {
      alert(`Failed to export PDF: ${error.message || 'Unknown error'}. Please try again.`)
    }
  }

  const handleExportHTML = () => {
    try {
      if (!course) {
        alert('No course to export')
        return
      }
      
      // Check if chapters have content
      const chaptersWithContent = course.chapters.filter(ch => ch?.content && ch.content.trim() !== '')
      if (chaptersWithContent.length === 0) {
        alert('Please wait for chapters to finish generating before exporting.')
        return
      }
      
      if (chaptersWithContent.length < course.chapters.length) {
        if (!confirm(`Only ${chaptersWithContent.length} of ${course.chapters.length} chapters have content. Export anyway?`)) {
          return
        }
      }

    // Helper function to convert markdown to HTML
      const markdownToHTML = (markdown: string | undefined | null): string => {
        if (!markdown || typeof markdown !== 'string') {
          return ''
        }
      return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    }

    // Generate HTML content with proper markdown rendering
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${course.title}</title>
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
    h1 { 
      color: #1e40af; 
      font-size: 2.5em; 
      margin-bottom: 10px;
      background: linear-gradient(to right, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h2 { 
      color: #1e40af; 
      border-bottom: 3px solid #93c5fd; 
      padding-bottom: 10px; 
      margin-top: 40px;
      font-size: 1.8em;
    }
    h3 { 
      color: #1e3a8a; 
      margin-top: 30px;
      font-size: 1.4em;
    }
    p { margin: 15px 0; }
    .subtitle { 
      font-style: italic; 
      font-size: 1.3em; 
      color: #4b5563; 
      margin-bottom: 20px;
    }
    .description { 
      background: white; 
      padding: 20px; 
      border-left: 4px solid #3b82f6; 
      margin: 30px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .chapter { 
      margin-bottom: 60px; 
      page-break-after: always; 
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .chapter-header {
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .learning-objective { 
      background: #dbeafe; 
      padding: 15px; 
      border-left: 4px solid #2563eb; 
      margin: 20px 0;
      border-radius: 4px;
    }
    .content { 
      margin: 25px 0; 
      line-height: 1.9;
    }
    .key-term { 
      background: #eff6ff; 
      padding: 15px; 
      margin: 15px 0; 
      border-left: 4px solid #2563eb;
      border-radius: 4px;
    }
    .example { 
      background: #f0fdf4; 
      padding: 15px; 
      margin: 15px 0; 
      border-left: 4px solid #10b981;
      border-radius: 4px;
    }
    .try-it { 
      background: #fef3c7; 
      padding: 15px; 
      margin: 15px 0; 
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
    }
    .tool-walkthrough {
      background: #faf5ff;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #7c3aed;
      border-radius: 4px;
    }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #1f2937;
      color: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    }
    pre code {
      background: transparent;
      color: inherit;
    }
    strong { color: #1f2937; }
    em { color: #4b5563; }
    ul, ol { margin: 15px 0; padding-left: 30px; }
    li { margin: 8px 0; }
    blockquote {
      border-left: 4px solid #d1d5db;
      padding-left: 20px;
      margin: 20px 0;
      color: #6b7280;
      font-style: italic;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media print {
      body { background: white; }
      .chapter { box-shadow: none; border: 1px solid #e5e7eb; }
    }
  </style>
</head>
<body>
  <h1>${course.title}</h1>
  <p class="subtitle">${course.subtitle}</p>
  <div class="description">
    <p>${markdownToHTML(course.overallDescription)}</p>
  </div>
  <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 40px 0;">
  
  ${course.chapters.filter(ch => ch.content && ch.content.trim() !== '').map(chapter => `
    <div class="chapter">
      <div class="chapter-header">
        <h2 style="color: white; border: none; margin: 0; padding: 0;">Chapter ${chapter.chapterNumber}: ${chapter.title}</h2>
      </div>
      
      <div class="learning-objective">
        <strong>📚 Learning Objective:</strong> ${chapter.learningObjective}
      </div>
      
      <div class="content">
        ${markdownToHTML(chapter.content)}
      </div>
      
      ${Array.isArray(chapter.keyTerms) && chapter.keyTerms.length > 0 ? `
      <h3>🔑 Key Terms</h3>
      ${chapter.keyTerms.map(term => `
        <div class="key-term">
          <strong>${(term?.term || 'Term')}:</strong> ${(term?.definition || 'Definition')}
        </div>
      `).join('')}
      ` : ''}
      
      ${Array.isArray(chapter.examples) && chapter.examples.length > 0 ? `
      <h3>💡 Real-World Examples</h3>
      ${chapter.examples.map((example, idx) => `
        <div class="example">
          <strong>Example ${idx + 1}:</strong> ${markdownToHTML(example || '')}
        </div>
      `).join('')}
      ` : ''}
      
      ${Array.isArray(chapter.tryItYourself) && chapter.tryItYourself.length > 0 ? `
      <h3>🚀 Try It Yourself</h3>
      ${chapter.tryItYourself.map((exercise, idx) => `
        <div class="try-it">
          <strong>${idx + 1}.</strong> ${markdownToHTML(exercise || '')}
        </div>
      `).join('')}
      ` : ''}
      
      ${chapter.toolWalkthrough && Array.isArray(chapter.toolWalkthrough.steps) ? `
        <h3>🛠️ Tool Walkthrough: ${chapter.toolWalkthrough.toolName || 'Tool Guide'}</h3>
        <div class="tool-walkthrough">
          <p>${chapter.toolWalkthrough.description || ''}</p>
          <ol>
            ${chapter.toolWalkthrough.steps.map(step => `<li>${markdownToHTML(step || '')}</li>`).join('')}
          </ol>
        </div>
      ` : ''}
    </div>
  `).join('')}
  
  <footer style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280;">
    <p><strong>${course.title}</strong></p>
    <p>Generated by AIPathway - Personalized AI Learning</p>
    <p>© ${new Date().getFullYear()} | Powered by Venice AI</p>
  </footer>
</body>
</html>
    `

    // Create download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${course.title.replace(/[^a-z0-9]/gi, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
      
      console.log('✅ HTML export successful')
    } catch (error: any) {
      console.error('❌ HTML export failed:', error)
      alert(`Failed to export HTML: ${error.message || 'Unknown error'}. Please try again or check the console for details.`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-2">Generating Your Personalized Course...</h2>
          <p className="text-gray-600 mb-4">{generationProgress}</p>
          {chaptersGenerated > 0 && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(chaptersGenerated / (course?.chapters.length || 10)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Chapter {chaptersGenerated} of {course?.chapters.length || 10} complete</p>
            </div>
          )}
          <p className="text-gray-600 mb-4">
            Our AI is crafting a custom {course?.chapters.length || 10}-chapter curriculum just for you
          </p>
          <div className="max-w-md mx-auto bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">✓ Analyzing your profile</span>
              <span className="text-green-500">●</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">⟳ Building curriculum structure</span>
              <span className="text-blue-500">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">○ Creating chapter content</span>
              <span className="text-gray-300">●</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">This usually takes about 10 minutes to generate all chapters</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-red-800 mb-2">Error Generating Course</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={generateCourse}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  if (selectedChapter !== null) {
    const chapter = course.chapters.find(c => c.chapterNumber === selectedChapter)
    
    if (!chapter) {
      console.error('❌ Chapter not found:', selectedChapter)
      return (
        <div className="max-w-4xl mx-auto p-8 bg-red-50 rounded-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Chapter Not Found</h2>
          <p className="text-gray-700 mb-4">Unable to load Chapter {selectedChapter}</p>
          <button
            onClick={handleBackToCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Course
          </button>
        </div>
      )
    }

    // Check if chapter has content
    if (!chapter.content || chapter.content.trim() === '') {
      return (
        <div className="max-w-4xl mx-auto p-8 bg-yellow-50 rounded-xl">
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">Chapter Still Loading</h2>
          <p className="text-gray-700 mb-4">Chapter {selectedChapter}: {chapter.title} is being generated...</p>
          <button
            onClick={handleBackToCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Course
          </button>
        </div>
      )
    }

    const totalChapters = course.chapters.length
    
    const handleNextChapter = () => {
      if (selectedChapter < totalChapters) {
        setSelectedChapter(selectedChapter + 1)
      }
    }
    
    const handlePrevChapter = () => {
      if (selectedChapter > 1) {
        setSelectedChapter(selectedChapter - 1)
      }
    }

    return (
      <ChapterCard
        chapter={chapter}
        onBack={handleBackToCourse}
        onComplete={() => handleChapterComplete(selectedChapter)}
        isCompleted={progress?.completedChapters.includes(selectedChapter) || false}
        onNext={selectedChapter < totalChapters ? handleNextChapter : undefined}
        onPrev={selectedChapter > 1 ? handlePrevChapter : undefined}
        totalChapters={totalChapters}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {course.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
            <p className="text-gray-700 max-w-3xl">{course.overallDescription}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportHTML}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              📄 Export HTML
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              📑 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      {progress && (
        <ProgressDashboard
          progress={progress}
          totalChapters={course.chapters.length}
        />
      )}

      {/* Chapter List */}
      <div className="grid md:grid-cols-2 gap-6">
        {course.chapters.map((chapter) => (
          <div
            key={chapter.chapterNumber}
            onClick={() => handleChapterClick(chapter.chapterNumber)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Chapter {chapter.chapterNumber}
              </span>
              {progress?.completedChapters.includes(chapter.chapterNumber) && (
                <span className="text-green-500 text-2xl">✓</span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {chapter.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {chapter.learningObjective}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>📚 {chapter.keyTerms.length} key terms</span>
              <span className="text-blue-600 font-medium">Start learning →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


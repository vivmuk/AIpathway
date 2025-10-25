# 🧠 AIPathway - Personalized AI Learning Platform

**Version:** 1.0  
**Created:** October 2025

AIPathway is an intelligent web application that generates a **personalized 10-chapter AI learning curriculum** in real-time. After completing a short AI Fluency Quiz, users receive a custom course designed around their knowledge level, learning goals, and preferred learning style.

---

## ✨ Features

### 🎯 Personalized Learning
- **AI Fluency Quiz**: 8-question adaptive assessment
- **Custom Curriculum**: 10 chapters tailored to your profile
- **Adaptive Content**: Adjusts to your knowledge level and goals

### 📚 Rich Content
- Detailed chapter content with markdown formatting
- Key terminology with definitions
- Real-world examples and analogies
- "Try it yourself" practical exercises
- Tool walkthroughs for current AI technologies

### 🚀 Interactive Experience
- **Simplify Content**: "Explain like I'm 12" button for difficult topics
- **Progress Tracking**: Dashboard showing completion status
- **Collapsible Sections**: Easy navigation through chapter content
- **Export Options**: Download as HTML (PDF coming soon)

### 🛠️ Modern AI Tools Covered
- GPT-5, Claude, Gemini
- LangChain, LlamaIndex
- Hugging Face
- GitHub Copilot
- RAG Systems
- AI Agents
- And more...

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **LLM**: Venice API (Llama 3.3 70B)
- **Markdown**: react-markdown + remark-gfm
- **Storage**: LocalStorage (for progress tracking)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Venice API key

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

The `.env.local` file should already be configured with:
```env
VENICE_API_KEY=ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC
VENICE_API_URL=https://api.venice.ai/api/v1
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How It Works

### 1. Welcome Screen
Users are greeted with an overview of the platform and its benefits.

### 2. AI Fluency Quiz
- 8 adaptive questions covering:
  - Current AI knowledge level
  - Coding/programming experience
  - AI tools used
  - Learning goals
  - Preferred learning style
  - Time commitment
  - Technical depth preference
  - Application focus

### 3. Course Generation
- Quiz results are sent to Venice API
- LLM generates a personalized 10-chapter curriculum
- Generation takes ~30-45 seconds
- Course is saved to localStorage

### 4. Course View
- Overview of all 10 chapters
- Progress dashboard showing completion status
- Click any chapter to start learning

### 5. Chapter Experience
- Rich markdown content
- Collapsible sections (Key Terms, Examples, Try It Yourself, Tool Walkthroughs)
- Simplify/complexify buttons for adaptive learning
- Mark as complete functionality

### 6. Export
- Export entire course as HTML for offline study
- PDF export (coming soon)

---

## 🎓 User Personas Supported

| Persona | Description |
|---------|-------------|
| **Beginner Explorer** | Little AI knowledge, wants structured foundation |
| **Applied Learner** | Basic AI exposure, wants practical applications |
| **Technical Builder** | Coding background, wants implementation skills |
| **Leadership Learner** | Executive/manager seeking strategic AI fluency |

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-course/
│   │   │   │   └── route.ts          # Course generation API
│   │   │   └── simplify-chapter/
│   │   │       └── route.ts          # Content simplification API
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page
│   ├── components/
│   │   ├── Header.tsx                # App header
│   │   ├── Quiz.tsx                  # AI Fluency Quiz
│   │   ├── CourseView.tsx            # Course overview
│   │   ├── ChapterCard.tsx           # Individual chapter view
│   │   └── ProgressDashboard.tsx     # Progress tracking
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🔧 Configuration

### Venice API Models Available
- `llama-3.3-70b` (default) - Balanced performance
- `llama-3.1-405b` - Most intelligent
- `qwen-2.5-qwq-32b` - Reasoning focused
- `venice-uncensored` - Uncensored responses

### Customization
You can customize the quiz questions in `src/components/Quiz.tsx` and the course generation prompt in `src/app/api/generate-course/route.ts`.

---

## 📊 Success Metrics (Target)

| Metric | Target |
|--------|--------|
| Course generation success rate | ≥ 95% |
| Average generation time | < 45 sec |
| User satisfaction | ≥ 4.5 / 5 |
| Retention (Chapter 1→10) | ≥ 70% |
| API uptime | 99.9% |

---

## 🚀 Future Enhancements

- [ ] PDF export functionality
- [ ] User authentication (Firebase/Auth0)
- [ ] Database storage for courses
- [ ] Adaptive difficulty based on performance
- [ ] Voice-based learning mode
- [ ] Peer comparison leaderboard
- [ ] AI mentor chatbot
- [ ] Integration with learning platforms (Coursera, Khan Academy)
- [ ] Mobile app version
- [ ] Monetization with premium pathways

---

## 🤝 Contributing

This is a personal project by Vivek Mukhatyar. If you have suggestions or find bugs, feel free to reach out!

---

## 📄 License

© 2025 Vivek Mukhatyar - All Rights Reserved

---

## 🙏 Acknowledgments

- **Venice AI** for providing the LLM inference API
- **Next.js** team for the excellent framework
- **Tailwind CSS** for beautiful styling
- **Open source community** for amazing tools and libraries

---

## 📞 Support

For questions or issues, please contact the project owner.

---

**Happy Learning! 🎓🚀**


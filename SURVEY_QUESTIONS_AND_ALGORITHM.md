# 📋 Survey Questions & Algorithm Documentation

This document details all survey questions asked to users and explains how the personalization algorithm uses each answer to generate custom AI learning courses.

---

## 📝 Survey Questions Overview

The survey consists of **10 questions** that collect information about:
- AI knowledge and experience
- Coding/programming background
- Learning preferences and goals
- Industry context
- Mindset and motivations

---

## ❓ Question 1: AI Knowledge Level

**Question:** "How would you describe your current understanding of AI?"

**Type:** Single choice

**Options:**
1. Complete beginner - I know very little about AI
2. Basic awareness - I have heard of AI but haven't used it much
3. Intermediate - I use AI tools regularly
4. Advanced - I understand ML concepts and have built AI solutions
5. Expert - I work professionally with AI/ML technologies

### Algorithm Usage

**Primary Function:** Calculates the **AI Score** (0-100 scale)

**Mapping:**
```typescript
const knowledgeMap = {
  'Complete beginner - I know very little about AI': 10,
  'Basic awareness - I have heard of AI but haven't used it much': 30,
  'Intermediate - I use AI tools regularly': 50,
  'Advanced - I understand ML concepts and have built AI solutions': 75,
  'Expert - I work professionally with AI/ML technologies': 95
}
```

**How It's Used:**
- **Course Outline Generation:**
  - Determines technical level categorization:
    - `aiScore < 30`: "beginner-friendly"
    - `aiScore < 50`: "introductory to intermediate"
    - `aiScore < 75`: "intermediate to advanced"
    - `aiScore >= 75`: "advanced and technical"
  
- **Chapter Generation:**
  - Adjusts content complexity and jargon:
    - `< 30`: "very beginner-friendly, avoiding jargon"
    - `< 50`: "introductory to intermediate"
    - `< 75`: "intermediate to advanced"
    - `>= 75`: "advanced and technical"

- **Impact:** This is the **most critical metric** for personalization. It directly controls vocabulary, depth, and prerequisite assumptions throughout the course.

---

## ❓ Question 2: Coding Experience

**Question:** "What is your coding/programming experience?"

**Type:** Single choice

**Options:**
1. No coding experience
2. Basic scripting (Excel, simple automation)
3. Some programming knowledge (Python, JavaScript basics)
4. Proficient programmer (can build applications)
5. Expert developer (professional software engineering)

### Algorithm Usage

**Primary Function:** Determines coding experience level in the user profile

**Mapping:**
```typescript
const codingMap = {
  'No coding experience': 'no-code',
  'Basic scripting (Excel, simple automation)': 'basic',
  'Some programming knowledge (Python, JavaScript basics)': 'intermediate',
  'Proficient programmer (can build applications)': 'proficient',
  'Expert developer (professional software engineering)': 'expert'
}
```

**How It's Used:**
- **Stored in Profile:** `codingExperience` field
- **Content Adaptation:**
  - For `no-code` and `basic`: Content avoids code-heavy examples, focuses on no-code AI tools
  - For `intermediate` and above: Content includes coding examples, API usage, frameworks
- **Exercises:** Determines whether "Try It Yourself" exercises include coding tasks or focus on tool usage only

---

## ❓ Question 3: AI Tools Used

**Question:** "Which AI tools have you used? (Select all that apply)"

**Type:** Multiple choice

**Options:**
1. ChatGPT / Claude / Gemini
2. GitHub Copilot
3. Midjourney / DALL-E / Stable Diffusion
4. LangChain / LlamaIndex
5. Hugging Face models
6. OpenAI API / Anthropic API
7. None of the above

### Algorithm Usage

**Primary Function:** Tracks user's existing AI tool familiarity

**Mapping:**
- Stored as an array in `aiToolsUsed` field
- Passed directly to the AI model in the user profile

**How It's Used:**
- **Content Relevance:**
  - If user has used tools like ChatGPT/Claude: Content assumes familiarity with basic prompting
  - If user has used APIs: Content can reference API concepts without explanation
  - If user has used LangChain/LlamaIndex: Content can build on framework knowledge
  - If "None of the above": Content starts from absolute basics, introduces tools step-by-step

- **Tool Walkthroughs:**
  - Early chapters (1-5) include tool walkthroughs
  - Tools mentioned are prioritized based on user's existing experience
  - New tools are introduced more gradually if user hasn't used any

- **Example Selection:**
  - Examples reference tools the user has already encountered
  - New tools are introduced in contexts that relate to familiar tools

---

## ❓ Question 4: Learning Goals

**Question:** "What are your primary learning goals? (Select all that apply)"

**Type:** Multiple choice

**Options:**
1. Understand AI concepts and terminology
2. Use AI tools for productivity
3. Build AI applications and products
4. Lead AI initiatives at work
5. Research and experiment with cutting-edge AI
6. Apply AI to specific industry (healthcare, finance, etc.)

### Algorithm Usage

**Primary Function:** Defines learning focus and course priorities

**Mapping:**
- Stored in both `learningFocus` and `goals` arrays
- Passed directly to AI prompts

**How It's Used:**
- **Course Outline Generation:**
  - Goals are included in the prompt: `Goals: ${profile.goals.join(', ')}`
  - AI uses this to prioritize chapter topics:
    - "Understand concepts" → More foundational/theoretical chapters
    - "Use tools for productivity" → More practical, tool-focused chapters
    - "Build applications" → Technical implementation chapters
    - "Lead initiatives" → Strategy and leadership-focused chapters
    - "Research cutting-edge" → Advanced and emerging topic chapters
    - "Apply to industry" → Industry-specific use cases woven throughout

- **Chapter Content:**
  - Each chapter's examples, exercises, and content align with stated goals
  - Technical depth adjusted based on goals (e.g., "build applications" gets more code)

- **Content Emphasis:**
  - Multiple goals allow for a balanced curriculum
  - Single-focused goals result in more specialized course structure

---

## ❓ Question 5: Learning Style

**Question:** "How do you learn best?"

**Type:** Single choice

**Options:**
1. Visual (diagrams, videos, infographics)
2. Reading (articles, documentation)
3. Hands-on (coding, experiments, projects)
4. Mixed approach

### Algorithm Usage

**Primary Function:** Determines content presentation format preferences

**Mapping:**
```typescript
const learningStyleMap = {
  'Visual (diagrams, videos, infographics)': 'visual',
  'Reading (articles, documentation)': 'text',
  'Hands-on (coding, experiments, projects)': 'hands-on',
  'Mixed approach': 'mixed'
}
```

**How It's Used:**
- **Stored in Profile:** `learningStyle` field (`'visual' | 'text' | 'hands-on' | 'mixed'`)

- **Chapter Content Adaptation:**
  - Included in chapter generation prompt: `Learning Style: ${profile.learningStyle}`
  - **Visual learners:** Content includes structured markdown formatting, clear headers, visual descriptions, encourages diagram creation
  - **Text learners:** Content is text-heavy, well-structured documentation style, comprehensive explanations
  - **Hands-on learners:** More exercises, code examples, "Try It Yourself" sections are more extensive, tool walkthroughs are step-by-step
  - **Mixed approach:** Balanced combination of all formats

- **Exercise Design:**
  - Visual: Exercises may include "create a diagram" or "visualize this concept"
  - Hands-on: More coding/practical exercises
  - Text: Reading assignments, documentation exploration

---

## ❓ Question 6: Time Commitment

**Question:** "How much time can you dedicate to learning?"

**Type:** Single choice

**Options:**
1. 1-2 hours per week
2. 3-5 hours per week
3. 6-10 hours per week
4. 10+ hours per week

### Algorithm Usage

**Primary Function:** Sets expectations for content length and pacing

**Mapping:**
- Stored directly as string in `timeCommitment` field
- Default: `'3-5 hours per week'` if not provided

**How It's Used:**
- **Content Length:**
  - Lower time commitment (1-2 hours): Chapters are shorter, more focused, less dense
  - Higher time commitment (10+ hours): Chapters can be longer, more comprehensive, include more exercises
  
- **Chapter Count:**
  - Currently fixed at 3 (dev) or 10 (production) chapters
  - Could be dynamically adjusted based on time commitment in future iterations

- **Exercise Volume:**
  - Lower commitment: Fewer, more essential exercises
  - Higher commitment: More extensive exercise sets, optional deep-dives

---

## ❓ Question 7: Technical Depth Preference

**Question:** "How technical do you want your learning to be?"

**Type:** Scale (1-5)

**Scale Labels:**
- **Min (1):** "Conceptual only"
- **Max (5):** "Deep technical"

### Algorithm Usage

**Primary Function:** Fine-tunes technical complexity beyond AI score

**Mapping:**
- Stored as number (1-5) in answers
- Currently stored but **not actively used** in the current implementation

**Potential Usage (Future Enhancement):**
- Could override or fine-tune the AI score-based technical level
- A high AI score (75) with low technical preference (1-2) might result in conceptual focus despite expertise
- A low AI score (30) with high technical preference (4-5) might introduce more technical depth earlier

**Current Status:** 
- ✅ Collected in survey
- ⚠️ Stored in answers
- ❌ Not passed to AI prompts yet
- 💡 **Recommendation:** Add to chapter generation prompt for better personalization

---

## ❓ Question 8: Application Focus

**Question:** "What interests you most?"

**Type:** Single choice

**Options:**
1. Understanding how AI works
2. Using AI for personal productivity
3. Building AI products
4. AI strategy and leadership
5. Research and innovation

### Algorithm Usage

**Primary Function:** **Determines Persona Type** - This is the key question for persona classification

**Mapping:**
```typescript
const personaMap = {
  'Understanding how AI works': 'beginner',
  'Using AI for personal productivity': 'applied',
  'Building AI products': 'technical',
  'AI strategy and leadership': 'leadership',
  'Research and innovation': 'technical'
}
```

**How It's Used:**
- **Persona Type Assignment:** 
  - Stored in `personaType` field (`'beginner' | 'applied' | 'technical' | 'leadership'`)

- **Course Outline Generation:**
  - Drives the persona description in the outline prompt:
    ```typescript
    const personaDescriptions = {
      beginner: 'a complete beginner who wants structured foundational knowledge of AI concepts',
      applied: 'someone with basic AI exposure who wants to apply AI to business workflows',
      technical: 'a technical learner who understands coding and wants to learn implementation',
      leadership: 'a leader/executive aiming to gain strategic understanding of AI'
    }
    ```
  
- **Content Strategy:**
  - **Beginner:** Fundamental concepts, terminology, building blocks
  - **Applied:** Practical applications, business use cases, productivity tools
  - **Technical:** Implementation details, frameworks, APIs, coding examples
  - **Leadership:** Strategic overview, decision-making frameworks, team leadership

- **Chapter Progression:**
  - Persona type influences the learning path structure:
    - Beginner: Linear progression from basics
    - Applied: Use-case driven progression
    - Technical: Project-based progression
    - Leadership: Strategic theme progression

---

## ❓ Question 9: Industry

**Question:** "Which industry do you work in or want to apply AI to?"

**Type:** Single choice

**Options:**
1. Healthcare & Life Sciences
2. Finance & Banking
3. Technology & Software
4. Marketing & Media
5. Education & Training
6. Retail & E-commerce
7. Manufacturing & Supply Chain
8. Legal & Professional Services
9. Real Estate & Construction
10. Other / General Business

### Algorithm Usage

**Primary Function:** Industry-specific personalization

**Mapping:**
- Stored in `industry` field as string
- Default: `'General Business'` if not provided

**How It's Used:**
- **Course Outline Generation:**
  - Included in prompt: `Industry: ${profile.industry || 'General'}`
  - AI uses this to:
    - Prioritize industry-relevant AI use cases
    - Structure examples around industry scenarios
    - Choose terminology relevant to the industry

- **Chapter Content:**
  - Examples are tailored: `Give 2-3 real-world AI/GenAI examples${profile.industry ? ` relevant to ${profile.industry}` : ''}`
  - Healthcare: Medical AI applications, diagnostic tools, patient data
  - Finance: Fraud detection, algorithmic trading, risk analysis
  - Marketing: Content generation, customer analysis, campaign optimization
  - Education: Personalized learning, content creation, student assessment
  - And so on for each industry...

- **Use Case Selection:**
  - Industry determines which AI applications are highlighted
  - Makes the course more immediately relevant and actionable

---

## ❓ Question 10: AI Mindset

**Question:** "Which statement resonates most with you?"

**Type:** Single choice

**Options:**
1. AI is replacing jobs - I need to protect my current skills
2. AI is a tool - I want to learn how to use it effectively
3. AI is transformative - I want to reimagine how I work
4. AI is an opportunity - I want to create new value with it

### Algorithm Usage

**Primary Function:** Captures user's mindset and motivation

**Mapping:**
```typescript
const mindsetMap = {
  'AI is replacing jobs - I need to protect my current skills': 'fixed',
  'AI is a tool - I want to learn how to use it effectively': 'exploring',
  'AI is transformative - I want to reimagine how I work': 'growth',
  'AI is an opportunity - I want to create new value with it': 'growth'
}
```

**How It's Used:**
- **Stored in Profile:** `aiMindset` field (`'fixed' | 'growth' | 'exploring'`)
- **Currently stored but not actively used** in AI prompts

**Potential Usage (Future Enhancement):**
- **Fixed mindset:** Focus on defensive skills, job security, staying relevant
- **Exploring mindset:** Tool-focused, practical application, immediate utility
- **Growth mindset:** Innovation, transformation, creative applications

**Current Status:**
- ✅ Collected in survey
- ✅ Stored in profile
- ⚠️ Not passed to AI prompts yet
- 💡 **Recommendation:** Add mindset context to prompts to adjust tone and framing

---

## 🔄 Algorithm Flow Summary

### Step 1: Survey Data Collection
All 10 questions are answered by the user through the Quiz component.

### Step 2: Profile Generation
The `generateProfile()` function processes answers:

```typescript
const profile: UserProfile = {
  aiScore,              // From Q1 (knowledge_level)
  personaType,          // From Q8 (application_focus)
  learningFocus,        // From Q4 (learning_goals)
  learningStyle,        // From Q5 (learning_style)
  timeCommitment,       // From Q6 (time_commitment)
  goals,                // From Q4 (learning_goals)
  codingExperience,     // From Q2 (coding_experience)
  aiToolsUsed,          // From Q3 (ai_tools)
  industry,             // From Q9 (industry)
  aiMindset             // From Q10 (ai_mindset)
}
```

### Step 3: Course Outline Generation
The profile is sent to `/api/generate-outline`:

**Key Data Used:**
- `aiScore` → Technical level classification
- `personaType` → Persona description
- `goals` → Goal priorities
- `industry` → Industry context

**Prompt Structure:**
```
Create a course outline for [personaType]
- AI Fluency Score: [aiScore]/100
- Technical level: [derived from aiScore]
- Goals: [goals array]
- Industry: [industry]
```

### Step 4: Chapter Generation
For each chapter, profile data is used in `/api/generate-chapter`:

**Key Data Used:**
- `aiScore` → Technical level and complexity
- `industry` → Industry-specific examples
- `goals` → Goal alignment
- `learningStyle` → Content format preferences

**Prompt Structure:**
```
Create Chapter [N] with:
- Technical Level: [derived from aiScore]
- Industry: [industry]
- Goals: [goals array]
- Learning Style: [learningStyle]
```

---

## 📊 Data Importance Ranking

### Tier 1: Critical (Always Used)
1. **AI Score** (Q1) - Directly controls technical level
2. **Persona Type** (Q8) - Determines learning path structure
3. **Goals** (Q4) - Shapes course priorities and topics

### Tier 2: High Impact (Frequently Used)
4. **Industry** (Q9) - Customizes examples and use cases
5. **Learning Style** (Q5) - Affects content presentation
6. **Coding Experience** (Q2) - Determines technical depth

### Tier 3: Contextual (Situationally Used)
7. **AI Tools Used** (Q3) - Adjusts assumptions about familiarity
8. **Time Commitment** (Q6) - Could affect content length (currently fixed)

### Tier 4: Collected but Not Fully Utilized
9. **Technical Depth Preference** (Q7) - Stored but not in prompts
10. **AI Mindset** (Q10) - Stored but not in prompts

---

## 🎯 Recommendations for Enhancement

### Immediate Improvements:
1. **Add Technical Depth to Prompts:**
   - Include `technical_depth` value in chapter generation
   - Use it to fine-tune complexity beyond AI score

2. **Add Mindset to Prompts:**
   - Include `aiMindset` to adjust tone and framing
   - Fixed mindset → Defensive, practical focus
   - Growth mindset → Innovation and transformation focus

3. **Use Time Commitment:**
   - Adjust chapter length based on time availability
   - More exercises for higher time commitment

### Advanced Improvements:
4. **Dynamic Chapter Count:**
   - Adjust total chapters based on time commitment and goals

5. **Progressive Difficulty:**
   - Use AI tools used to determine starting complexity
   - Skip basics if user has extensive tool experience

6. **Mindset-Informed Content:**
   - Adjust examples to address user concerns
   - Fixed mindset: Focus on job security applications
   - Growth mindset: Focus on creative and transformative uses

---

## 📝 Conclusion

The survey collects comprehensive user data across 10 dimensions. The algorithm primarily uses:
- **AI Score** and **Persona Type** as core differentiators
- **Industry** and **Goals** for content customization
- **Learning Style** and **Coding Experience** for format adaptation

Two fields (Technical Depth Preference and AI Mindset) are collected but not yet fully utilized in the AI prompts, representing opportunities for enhanced personalization.


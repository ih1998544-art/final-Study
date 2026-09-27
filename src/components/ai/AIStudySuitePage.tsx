import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ExternalLink,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Check,
  Globe,
  SlidersHorizontal,
  Bot,
  BookOpen,
  Calculator,
  FlaskConical,
  Brain,
  GraduationCap,
  PenTool,
  Code2,
  Presentation,
  Languages,
  FileSpreadsheet,
  Mic,
  FileSearch,
  Microscope,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { OfficialAppLogo } from './OfficialAppLogos';

export interface RealWorldApp {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  purposeUrdu: string;
  purposeEnglish: string;
  url: string;
  embedUrl?: string;
  queryUrl?: (query: string) => string;
  badge: string;
  icon: React.ElementType;
  popularFor: string[];
  samplePrompts: string[];
  company: string;
  pricing: string;
  canEmbed?: boolean;
}

export const REAL_WORLD_AI_APPS: RealWorldApp[] = [
  // 1. General AI Tutor
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'general_tutor',
    categoryLabel: '🤖 General AI Tutor',
    purposeUrdu: 'Questions, explanations, learning aur multi-subject assistance',
    purposeEnglish: 'Comprehensive questions, conceptual breakdowns, problem-solving, and general academic learning',
    url: 'https://chatgpt.com',
    queryUrl: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
    badge: 'OpenAI Core',
    icon: Bot,
    popularFor: ['General Tutor', 'Science', 'Coding', 'Language'],
    samplePrompts: [
      'Explain quantum entanglement in simple terms with everyday analogies',
      'Derive the quadratic formula step-by-step from first principles',
      'Compare mitosis and meiosis with a comparison matrix',
      'Write an essay outline discussing the economic causes of the French Revolution',
    ],
    company: 'OpenAI',
    pricing: 'Free & Plus',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'general_tutor',
    categoryLabel: '🤖 General AI Tutor',
    purposeUrdu: 'Real-time search, multimodal learning, math aur explanations',
    purposeEnglish: 'Grounded research with Google Search integration, multimodal image understanding, and academic analysis',
    url: 'https://gemini.google.com',
    badge: 'Google AI',
    icon: Sparkles,
    popularFor: ['General Tutor', 'Science', 'Real-time Info'],
    samplePrompts: [
      'Summarize the latest scientific discoveries on dark energy from 2024-2026',
      'Help me understand the mechanism of CRISPR-Cas9 gene editing',
      'Solve this physics projectile motion calculation with step-by-step formulas',
      'Explain the Keynesian multiplier effect with mathematical derivations',
    ],
    company: 'Google',
    pricing: 'Free & Advanced',
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'general_tutor',
    categoryLabel: '🤖 General AI Tutor',
    purposeUrdu: 'Deep analytical thinking, complex writing, coding aur long-document synthesis',
    purposeEnglish: 'Nuanced academic writing, complex multi-page essay analysis, and high-accuracy coding synthesis',
    url: 'https://claude.ai',
    badge: 'Anthropic Core',
    icon: Brain,
    popularFor: ['General Tutor', 'Coding', 'Deep Writing'],
    samplePrompts: [
      'Critique this philosophical argument regarding utilitarianism vs deontology',
      'Analyze the historical rhetoric in Martin Luther King Jr.’s Letter from Birmingham Jail',
      'Refactor this Python dynamic programming solution from O(N^2) to O(N log N)',
      'Explain eigenvalues and eigenvectors through geometric transformations',
    ],
    company: 'Anthropic',
    pricing: 'Free & Pro',
  },

  // 2. Study from Notes/PDFs
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'notes_pdf',
    categoryLabel: '📖 Study from Notes/PDFs',
    purposeUrdu: 'Apni PDFs, research papers aur lecture notes se study aur Q&A',
    purposeEnglish: 'Grounding AI on your exact course materials, PDFs, Google Docs, and generating Audio Overviews',
    url: 'https://notebooklm.google.com',
    badge: 'Personalized AI',
    icon: BookOpen,
    popularFor: ['PDF Notes', 'Audio Overviews', 'Study Organization'],
    samplePrompts: [
      'Upload course syllabus and generate a 2-week active recall study roadmap',
      'Generate an interactive podcast-style audio discussion based on my uploaded chapters',
      'Extract all key formulas and definitions from Chapter 4 of my physics textbook',
      'Create 10 diagnostic exam questions grounded strictly in my uploaded lecture notes',
    ],
    company: 'Google',
    pricing: 'Free',
  },
  {
    id: 'mindgrasp',
    name: 'Mindgrasp',
    category: 'notes_pdf',
    categoryLabel: '📖 Study from Notes/PDFs',
    purposeUrdu: 'Documents, textbooks aur lecture recordings se smart notes aur flashcards banana',
    purposeEnglish: 'Instant document summaries, smart flashcards, quizzes, and audio playback directly from course files',
    url: 'https://mindgrasp.ai',
    badge: 'Document AI',
    icon: FileSpreadsheet,
    popularFor: ['PDF Notes', 'Transcripts', 'Smart Flashcards'],
    samplePrompts: [
      'Upload a 60-page PDF and generate bulleted active recall summary notes',
      'Create flashcard decks from my uploaded biochemistry slide deck',
      'Generate a practice multiple choice test based on my seminar notes',
    ],
    company: 'Mindgrasp AI',
    pricing: 'Free Trial & Subscription',
  },

  // 3. Research
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    category: 'research',
    categoryLabel: '🔎 Research & Sources',
    purposeUrdu: 'Verified citations aur real-time academic sources ke sath research',
    purposeEnglish: 'Conversational search engine delivering direct answers with verified inline academic citations and source links',
    url: 'https://www.perplexity.ai',
    queryUrl: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    badge: 'Live Citations',
    icon: Search,
    popularFor: ['Research', 'Citations', 'Literature'],
    samplePrompts: [
      'What is the current academic consensus regarding dietary intermittent fasting on longevity?',
      'Find peer-reviewed sources explaining the causes of the Bronze Age collapse in the Mediterranean',
      'What are the primary computational limitations of quantum computers in cryptographic factoring?',
    ],
    company: 'Perplexity AI',
    pricing: 'Free & Pro',
  },
  {
    id: 'elicit',
    name: 'Elicit',
    category: 'research',
    categoryLabel: '🔎 Research & Sources',
    purposeUrdu: 'Academic papers search, systematic reviews aur methodology extraction',
    purposeEnglish: 'Automates research workflows: searching over 200M papers, summarizing abstracts, and extracting study methodologies into matrices',
    url: 'https://elicit.com',
    badge: 'Research Assistant',
    icon: FileSearch,
    popularFor: ['Research', 'Literature Review', 'Paper Synthesis'],
    samplePrompts: [
      'Find randomized controlled trials investigating cognitive behavioral therapy for adolescent anxiety',
      'Synthesize empirical papers on the economic impacts of universal basic income experiments',
      'Extract participant sample size, methodology, and outcome metrics across 10 educational intervention studies',
    ],
    company: 'Elicit Inc.',
    pricing: 'Free Tier & Plus',
  },
  {
    id: 'consensus',
    name: 'Consensus',
    category: 'research',
    categoryLabel: '🔎 Research & Sources',
    purposeUrdu: 'Science-backed answers aur consensus meter peer-reviewed research se',
    purposeEnglish: 'AI search engine querying peer-reviewed research with a "Consensus Meter" showing scientific agreement percentages',
    url: 'https://consensus.app',
    queryUrl: (q) => `https://consensus.app/results/?q=${encodeURIComponent(q)}`,
    badge: 'Peer-Reviewed',
    icon: Microscope,
    popularFor: ['Research', 'Literature Review', 'Scientific Consensus'],
    samplePrompts: [
      'Does creatine supplementation improve cognitive performance in sleep-deprived individuals?',
      'Do microplastics cross the blood-brain barrier in mammalian studies?',
      'What does empirical research indicate about the effectiveness of active learning over traditional lectures?',
    ],
    company: 'Consensus',
    pricing: 'Free & Premium',
  },

  // 4. Mathematics
  {
    id: 'wolframalpha',
    name: 'Wolfram Alpha',
    category: 'mathematics',
    categoryLabel: '🧮 Mathematics & Calculations',
    purposeUrdu: 'Exact step-by-step maths calculations, calculus derivations aur physics computations',
    purposeEnglish: 'Definitive computational intelligence engine providing step-by-step solutions for calculus, differential equations, and linear algebra',
    url: 'https://www.wolframalpha.com',
    queryUrl: (q) => `https://www.wolframalpha.com/input?i=${encodeURIComponent(q)}`,
    badge: 'Computational Engine',
    icon: Calculator,
    popularFor: ['Mathematics', 'Science Calculations', 'Plots'],
    samplePrompts: [
      'integrate x^2 * sin(x) dx step-by-step',
      'solve d^2y/dx^2 + 4dy/dx + 4y = e^(-2x)',
      'eigenvalues {{2, 1}, {1, 2}}',
      'taylor series of e^x * cos(x) around x=0 to order 5',
    ],
    company: 'Wolfram Research',
    pricing: 'Free & Pro',
    canEmbed: true,
  },
  {
    id: 'photomath',
    name: 'Photomath',
    category: 'mathematics',
    categoryLabel: '🧮 Mathematics & Calculations',
    purposeUrdu: 'Handwritten equations scan karke step-by-step solution aur animated explanations',
    purposeEnglish: 'Mobile and web camera math solver providing animated step-by-step arithmetic, algebraic, and trigonometric explanations',
    url: 'https://photomath.com',
    badge: 'Visual Math',
    icon: Calculator,
    popularFor: ['Algebra', 'Step-by-step Math', 'Visual Solutions'],
    samplePrompts: [
      'Solve quadratic equations by completing the square',
      'Factorize polynomial expressions step-by-step',
      'Graph system of linear inequalities on Cartesian plane',
    ],
    company: 'Google / Photomath',
    pricing: 'Free & Plus',
  },

  // 5. Flashcards
  {
    id: 'quizlet',
    name: 'Quizlet',
    category: 'flashcards',
    categoryLabel: '🧠 Flashcards & Memorization',
    purposeUrdu: 'AI flashcards, study sets, matching games aur practice tests for active recall',
    purposeEnglish: 'Global flashcard platform featuring AI Q-Chat tutor, learn mode, match games, and millions of student study decks',
    url: 'https://quizlet.com',
    badge: 'Active Recall',
    icon: Brain,
    popularFor: ['Flashcards', 'Memorization', 'Practice Tests'],
    samplePrompts: [
      'Search MCAT biology and biochemistry high-yield study sets',
      'Practice active recall on Spanish irregular verb conjugations',
      'Use Learn Mode to memorize cranial nerves and their functions',
    ],
    company: 'Quizlet',
    pricing: 'Free & Plus',
  },
  {
    id: 'anki',
    name: 'Anki',
    category: 'flashcards',
    categoryLabel: '🧠 Flashcards & Memorization',
    purposeUrdu: 'Gold-standard spaced repetition system (SRS) for long-term memorization',
    purposeEnglish: 'The premier open-source spaced repetition software (FSRS algorithm) utilized by medical and engineering students worldwide',
    url: 'https://ankiweb.net',
    badge: 'Gold Standard SRS',
    icon: Brain,
    popularFor: ['Spaced Repetition', 'Medical School', 'Language Decks'],
    samplePrompts: [
      'Download pre-made AnKing medical licensing examination deck',
      'Set up daily 20-card spaced review intervals with FSRS scheduling',
      'Review daily review queue using cloze deletion cards',
    ],
    company: 'Anki / AnkiWeb',
    pricing: 'Free Web/PC',
  },
  {
    id: 'knowt',
    name: 'Knowt',
    category: 'flashcards',
    categoryLabel: '🧠 Flashcards & Memorization',
    purposeUrdu: 'Free alternative to Quizlet jo notes ko automatically flashcards aur quizzes mein badalta hay',
    purposeEnglish: 'Free Quizlet alternative allowing instant Quizlet import, converting notes into flashcards, and unlimited free practice tests',
    url: 'https://knowt.com',
    badge: 'Free Flashcards',
    icon: Brain,
    popularFor: ['Flashcards', 'Quizlet Import', 'Practice Quizzes'],
    samplePrompts: [
      'Import my existing Quizlet deck without paywalls',
      'Paste lecture notes to automatically generate a 25-card study deck',
      'Take a timed simulated multiple choice exam from my flashcards',
    ],
    company: 'Knowt Inc.',
    pricing: 'Free',
  },

  // 6. AI Tutoring
  {
    id: 'khanmigo',
    name: 'Khanmigo',
    category: 'ai_tutoring',
    categoryLabel: '🎓 AI Tutoring & Guided Learning',
    purposeUrdu: 'Khan Academy ka Socratic AI tutor jo direct answer dene ke bajaye step-by-step guide karta hay',
    purposeEnglish: 'Khan Academy’s Socratic AI guide that refuses to give away answers, nudging students toward deep conceptual mastery',
    url: 'https://www.khanacademy.org/khanmigo',
    badge: 'Socratic Tutor',
    icon: GraduationCap,
    popularFor: ['Socratic Tutoring', 'K-12 & College', 'Math Guidance'],
    samplePrompts: [
      'Guide me through finding the derivative of f(x) = x * ln(x) using the product rule without giving me the final answer immediately',
      'Help me diagnose why my physics force balance equation is not balancing',
      'Ask me guiding questions to help me write my college admissions personal statement',
    ],
    company: 'Khan Academy',
    pricing: 'Accessible Educational Access',
  },

  // 7. Writing
  {
    id: 'grammarly',
    name: 'Grammarly',
    category: 'writing',
    categoryLabel: '✍️ Writing & Grammar',
    purposeUrdu: 'Grammar checking, sentence rewriting, academic tone adjustment aur plagiarism detection',
    purposeEnglish: 'Real-time grammar correction, academic conciseness suggestions, tone adjustment, and citation formatting',
    url: 'https://app.grammarly.com',
    badge: 'Writing Assistant',
    icon: PenTool,
    popularFor: ['Grammar', 'Academic Tone', 'Essay Polish'],
    samplePrompts: [
      'Rewrite this paragraph to sound authoritative and academic for an APA-format journal submission',
      'Fix passive voice constructions and reduce wordiness in my thesis methodology section',
      'Check my essay draft for grammatical precision, punctuation, and clarity',
    ],
    company: 'Grammarly',
    pricing: 'Free & Premium',
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    category: 'writing',
    categoryLabel: '✍️ Writing & Grammar',
    purposeUrdu: 'Sentence paraphrasing, vocabulary enhancement, summarization aur citation generator',
    purposeEnglish: 'Academic paraphraser offering multiple modes (Formal, Academic, Fluent), summarizer, and automated APA/MLA citation generator',
    url: 'https://quillbot.com',
    badge: 'Paraphrasing Tool',
    icon: PenTool,
    popularFor: ['Paraphrasing', 'Summarizing', 'Citations'],
    samplePrompts: [
      'Paraphrase this complex scientific sentence in Academic Mode while preserving technical meaning',
      'Summarize a 3-page research excerpt into 3 crisp bullet points',
      'Generate an APA 7th edition citation for a published journal article',
    ],
    company: 'QuillBot / Learneo',
    pricing: 'Free & Premium',
  },

  // 8. Coding
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    categoryLabel: '💻 Coding & Programming',
    purposeUrdu: 'Code autocompletion, debugging, algorithms likhna aur programming help',
    purposeEnglish: 'AI pair programmer integrated into IDEs (VS Code, JetBrains) accelerating algorithm development, debugging, and test generation',
    url: 'https://github.com/features/copilot',
    badge: 'Developer Choice',
    icon: Code2,
    popularFor: ['Coding', 'Algorithms', 'Debugging'],
    samplePrompts: [
      'Write an optimized Binary Search Tree insertion and traversal in C++',
      'Generate automated unit test cases using pytest for this payment calculation function',
      'Explain this cryptic compile error in Rust: lifetime parameter mismatch',
    ],
    company: 'GitHub / Microsoft',
    pricing: 'Free for Students via GitHub Student Pack',
  },

  // 9. Presentations
  {
    id: 'gamma',
    name: 'Gamma',
    category: 'presentations',
    categoryLabel: '📝 Presentations & Slides',
    purposeUrdu: 'Topic ya notes se minutes mein professional slide decks aur presentations banana',
    purposeEnglish: 'AI presentation builder that transforms study notes or outlines into beautifully designed slide decks, documents, and webpages in seconds',
    url: 'https://gamma.app',
    badge: 'AI Slides',
    icon: Presentation,
    popularFor: ['Slide Decks', 'Presentations', 'Visual Reports'],
    samplePrompts: [
      'Create an 8-slide academic presentation on The Future of Quantum Computing in Cryptography',
      'Generate a visual slide deck explaining Cellular Mitosis stages with diagrams',
      'Transform my lecture notes on Microeconomics Market Structures into student slides',
    ],
    company: 'Gamma Tech',
    pricing: 'Free Tier & Plus',
  },
  {
    id: 'canva_ai',
    name: 'Canva Magic Studio',
    category: 'presentations',
    categoryLabel: '📝 Presentations & Slides',
    purposeUrdu: 'Educational slides, academic posters, infographics aur visual presentations banana',
    purposeEnglish: 'Comprehensive design suite with Magic Design generating presentation slides, scientific infographics, and conference posters',
    url: 'https://www.canva.com/magic-studio/',
    badge: 'Visual Design',
    icon: Presentation,
    popularFor: ['Infographics', 'Posters', 'Classroom Slides'],
    samplePrompts: [
      'Design a scientific conference research poster on Environmental Chemistry',
      'Create an infographic illustrating the human circulatory system',
      'Generate presentation slides for a university business case study',
    ],
    company: 'Canva',
    pricing: 'Free & Canva Pro (Free for Education)',
  },

  // 10. Language Learning
  {
    id: 'duolingo_max',
    name: 'Duolingo Max',
    category: 'language',
    categoryLabel: '🗣️ Language Learning',
    purposeUrdu: 'AI roleplay conversation practice aur "Explain My Answer" ke sath language seekhna',
    purposeEnglish: 'Gamified language acquisition powered by GPT-4 featuring interactive Roleplay dialogues and Explain My Answer feedback',
    url: 'https://www.duolingo.com',
    badge: 'Language AI',
    icon: Languages,
    popularFor: ['Speaking Practice', 'Grammar Explanations', 'Vocabulary'],
    samplePrompts: [
      'Practice real-life conversational dialogue ordering food at a French café',
      'Explain why the subjunctive mood was required in this Spanish sentence',
      'Drill German adjective endings through interactive challenges',
    ],
    company: 'Duolingo',
    pricing: 'Free & Max Subscription',
  },

  // 11. Notes/Organization
  {
    id: 'notion_ai',
    name: 'Notion AI',
    category: 'organization',
    categoryLabel: '📑 Notes & Organization',
    purposeUrdu: 'Semester study organization, lecture notes synthesis, timetables aur databases',
    purposeEnglish: 'Integrated workspace for students: synthesizing course syllabi, creating relational assignment trackers, and querying your personal notes',
    url: 'https://www.notion.so/product/ai',
    badge: 'Workspace Hub',
    icon: FileSpreadsheet,
    popularFor: ['Study Timetables', 'Course Databases', 'Note Organization'],
    samplePrompts: [
      'Create a comprehensive semester syllabus tracker database with due dates and weights',
      'Summarize meeting notes from our student engineering capstone team',
      'Synthesize an active recall study schedule based on my course notes table',
    ],
    company: 'Notion Labs',
    pricing: 'Free for Students & AI Add-on',
  },

  // 12. Lecture/Audio Notes
  {
    id: 'otter_ai',
    name: 'Otter.ai',
    category: 'audio_notes',
    categoryLabel: '🎙️ Lecture & Audio Notes',
    purposeUrdu: 'Live classroom lectures aur audio recordings ko automatically transcribed notes mein badalna',
    purposeEnglish: 'Automated lecture transcription providing real-time speech-to-text, speaker identification, automated slide captures, and executive summaries',
    url: 'https://otter.ai',
    badge: 'Voice to Text',
    icon: Mic,
    popularFor: ['Lecture Transcripts', 'Audio Summaries', 'Meeting Notes'],
    samplePrompts: [
      'Record a 50-minute university lecture and extract key discussion points and action items',
      'Search transcript for professor’s comments on upcoming exam topics',
      'Generate a 5-minute study brief from a recorded guest speaker lecture',
    ],
    company: 'Otter.ai',
    pricing: 'Free Tier & Pro',
  },

  // 13. Academic Research
  {
    id: 'semantic_scholar',
    name: 'Semantic Scholar',
    category: 'academic_research',
    categoryLabel: '🧑‍🔬 Academic Research',
    purposeUrdu: 'Scientific papers discover karna, citation graphs dekhna aur AI TLDR summaries parhna',
    purposeEnglish: 'AI-backed research engine by Allen Institute for AI analyzing over 200M academic papers with one-line TLDR summaries and citation influence graphs',
    url: 'https://www.semanticscholar.org',
    queryUrl: (q) => `https://www.semanticscholar.org/search?q=${encodeURIComponent(q)}`,
    badge: '200M+ Papers',
    icon: Microscope,
    popularFor: ['Paper Discovery', 'Citation Graphs', 'TLDR Summaries'],
    samplePrompts: [
      'Search highly influential papers on transformer neural network architectures',
      'Discover primary literature on mRNA vaccine delivery mechanisms',
      'Analyze citation velocity for foundational papers in quantum error correction',
    ],
    company: 'Allen Institute for AI (AI2)',
    pricing: '100% Free Non-Profit',
    canEmbed: true,
  },
];

export const CATEGORIES_LIST = [
  { id: 'all', label: 'All Real AI Tools', count: REAL_WORLD_AI_APPS.length },
  { id: 'general_tutor', label: '🤖 General AI Tutor', count: 3 },
  { id: 'notes_pdf', label: '📖 Study from Notes/PDFs', count: 2 },
  { id: 'research', label: '🔎 Research & Sources', count: 3 },
  { id: 'mathematics', label: '🧮 Mathematics', count: 2 },
  { id: 'flashcards', label: '🧠 Flashcards & Memorization', count: 3 },
  { id: 'ai_tutoring', label: '🎓 AI Tutoring', count: 1 },
  { id: 'writing', label: '✍️ Writing & Grammar', count: 2 },
  { id: 'coding', label: '💻 Coding & Programming', count: 1 },
  { id: 'presentations', label: '📝 Presentations & Slides', count: 2 },
  { id: 'language', label: '🗣️ Language Learning', count: 1 },
  { id: 'organization', label: '📑 Notes & Organization', count: 1 },
  { id: 'audio_notes', label: '🎙️ Lecture & Audio Notes', count: 1 },
  { id: 'academic_research', label: '🧑‍🔬 Academic Research', count: 1 },
];

export const AIStudySuitePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<RealWorldApp | null>(REAL_WORLD_AI_APPS[0]);
  const [universalPrompt, setUniversalPrompt] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const { showToast } = useToast();
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const filteredApps = REAL_WORLD_AI_APPS.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purposeEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purposeUrdu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.popularFor.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenInWebsite = (app: RealWorldApp) => {
    setActiveApp(app);
    // Smooth scroll to in-website viewer
    setTimeout(() => {
      iframeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLaunchExternal = (app: RealWorldApp, customQuery?: string) => {
    const query = customQuery || universalPrompt;
    let targetUrl = app.url;
    if (query && app.queryUrl) {
      targetUrl = app.queryUrl(query);
    }
    // Safe standard external navigation
    window.location.href = targetUrl;
  };

  const handleCopyPromptAndLaunch = (app: RealWorldApp, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedAppId(app.id);
    showToast({
      type: 'info',
      title: 'Prompt Copied!',
      message: `Prompt copied to clipboard. Opening ${app.name}...`,
    });
    setTimeout(() => {
      setCopiedAppId(null);
      handleLaunchExternal(app, promptText);
    }, 700);
  };

  const getComputedIframeSrc = (app: RealWorldApp): string => {
    if (universalPrompt && app.queryUrl) {
      return app.queryUrl(universalPrompt);
    }
    return app.embedUrl || app.url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-28">
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Access Directory · 23 Real-World AI Applications</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
            Real World AI Applications Suite
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            No simulated or canned replies. Directly access and use the exact, industry-leading AI tools modern scholars use every day: ChatGPT, Gemini, Claude, Wolfram Alpha, Perplexity, NotebookLM, Elicit, Grammarly, Quizlet, and GitHub Copilot.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct In-Website Web Viewer
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 font-medium">
              ⚡ 1-Click Prompt Dispatch
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 font-medium">
              🔗 Official Verified Portals
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive In-Website Application Window */}
      {activeApp && (
        <div
          ref={iframeContainerRef}
          className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all ${
            isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'relative'
          }`}
        >
          {/* Browser Window Header Bar */}
          <div className="bg-slate-100 dark:bg-slate-850 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="flex items-center gap-2">
                <OfficialAppLogo appId={activeApp.id} className="w-5 h-5 rounded-md shrink-0 shadow-xs" size={20} />
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-display">
                  {activeApp.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                  {activeApp.badge}
                </span>
              </div>
            </div>

            {/* URL Display Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 max-w-sm truncate">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{activeApp.url}</span>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reload Portal"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLaunchExternal(activeApp)}
                className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <span>Open {activeApp.name} Direct</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Quick Query Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full">
              <input
                type="text"
                value={universalPrompt}
                onChange={(e) => setUniversalPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLaunchExternal(activeApp);
                  }
                }}
                placeholder={`Ask ${activeApp.name} (e.g. solve integral, explain topic, search literature)...`}
                className="w-full pl-3.5 pr-24 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                onClick={() => handleLaunchExternal(activeApp)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Embedded Viewer Body */}
          <div className="relative bg-slate-900 min-h-[460px] sm:min-h-[580px] flex-1 flex flex-col">
            {/* Live iframe */}
            <iframe
              key={`${activeApp.id}-${iframeKey}`}
              src={getComputedIframeSrc(activeApp)}
              title={`${activeApp.name} Official Live Window`}
              className="w-full flex-1 min-h-[460px] sm:min-h-[580px] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
              allow="camera; microphone; clipboard-write; encrypted-media; fullscreen"
            />

            {/* Informational overlay bar for security policies */}
            <div className="bg-slate-850 text-slate-300 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <OfficialAppLogo appId={activeApp.id} className="w-4 h-4 rounded shrink-0" size={16} />
                  <span>Official Application Portal: {activeApp.name} ({activeApp.company})</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {activeApp.purposeUrdu} · {activeApp.purposeEnglish}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(activeApp.url);
                    showToast({
                      type: 'info',
                      title: 'Link Copied',
                      message: `${activeApp.name} official URL copied.`,
                    });
                  }}
                  className="text-xs h-8 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>Copy Link</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLaunchExternal(activeApp)}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  <span>Launch Full App</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Universal Search & Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Browse Real AI Tools by Academic Purpose
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any application to open directly in the website or launch its official portal.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps (e.g. ChatGPT, Wolfram, Perplexity)..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`ml-1.5 text-[10px] font-mono px-1 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => {
          const isCurrentActive = activeApp?.id === app.id;
          const AppIcon = app.icon;

          return (
            <div
              key={app.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 ${
                isCurrentActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/90 dark:border-slate-700 shadow-xs overflow-hidden">
                      <OfficialAppLogo appId={app.id} className="w-8 h-8 rounded-lg shrink-0" size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                          {app.name}
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {app.pricing}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        By {app.company} · {app.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Urdu Purpose (Exact as requested) */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono text-[11px] block mb-0.5">
                    🎯 Kis Kaam Ke Liye:
                  </span>
                  {app.purposeUrdu}
                </div>

                {/* English Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {app.purposeEnglish}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.popularFor.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Sample Prompt Chips with 1-Click Copy & Launch */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Sample Prompt to test:
                  </span>
                  <div className="space-y-1">
                    {app.samplePrompts.slice(0, 2).map((promptText, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleCopyPromptAndLaunch(app, promptText)}
                        className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                        title="Click to copy prompt and open app"
                      >
                        <span className="truncate italic">"{promptText}"</span>
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInWebsite(app)}
                  className={`flex-1 text-xs h-9 font-semibold cursor-pointer ${
                    isCurrentActive
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  <span>Open in Website</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLaunchExternal(app)}
                  className="text-xs h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  title={`Open official ${app.name} portal`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

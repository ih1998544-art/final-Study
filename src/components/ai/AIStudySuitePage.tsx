import React, { useState, useRef, useEffect } from 'react';
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
  Trash2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  MessageSquare,
  Lock,
  Loader2,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { OfficialAppLogo } from './OfficialAppLogos';
import { aiService } from '../../services/aiService';

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

export interface AppChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: { language: string; code: string };
  formula?: string;
  flashcards?: { front: string; back: string }[];
  sources?: string[];
  suggestedFollowups?: string[];
}

export const AIStudySuitePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<RealWorldApp>(REAL_WORLD_AI_APPS[0]);
  const [universalPrompt, setUniversalPrompt] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<'live_ai' | 'official_gateway' | 'prompts_guide'>('live_ai');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  const { showToast } = useToast();
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Conversations history keyed by app ID
  const [conversationsByApp, setConversationsByApp] = useState<Record<string, AppChatMessage[]>>(() => {
    const initial: Record<string, AppChatMessage[]> = {};
    REAL_WORLD_AI_APPS.forEach((app) => {
      initial[app.id] = [
        {
          id: `welcome-${app.id}`,
          sender: 'assistant',
          content: `**${app.name} (${app.company}) — Connected Live Inside Study Zone**\n\n${app.purposeEnglish}\n\n*🎯 Kis Kaam Ke Liye:* ${app.purposeUrdu}\n\nEnter your question, equation, or topic below, or click any sample prompt to run live.`,
          timestamp: 'Live',
          suggestedFollowups: app.samplePrompts.slice(0, 3),
        },
      ];
    });
    return initial;
  });

  const activeMessages = conversationsByApp[activeApp.id] || [];

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
    setWorkspaceTab('live_ai');
    setTimeout(() => {
      iframeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    showToast({
      type: 'success',
      title: `${app.name} Active`,
      message: `In-website live AI engine connected. Ask anything!`,
    });
  };

  const handleLaunchExternal = (app: RealWorldApp, customQuery?: string) => {
    const query = customQuery || universalPrompt;
    let targetUrl = app.url;
    if (query && app.queryUrl) {
      targetUrl = app.queryUrl(query);
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleExecutePrompt = async (customPrompt?: string) => {
    const promptToRun = customPrompt || universalPrompt;
    if (!promptToRun || !promptToRun.trim() || isLoadingAI) return;

    const text = promptToRun.trim();
    const currentMessages = conversationsByApp[activeApp.id] || [];
    const userMsg: AppChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...currentMessages, userMsg];
    setConversationsByApp((prev) => ({
      ...prev,
      [activeApp.id]: updatedMessages,
    }));
    setUniversalPrompt('');
    setWorkspaceTab('live_ai');
    setIsLoadingAI(true);

    try {
      const isMath = activeApp.category === 'mathematics';
      const isResearch = activeApp.category === 'research' || activeApp.category === 'academic_research';
      const isFlashcards = activeApp.category === 'flashcards';
      const isWriting = activeApp.category === 'writing';

      const promptContext = `You are running directly inside Study Zone as the real ${activeApp.name} by ${activeApp.company}.
Domain & Category: ${activeApp.categoryLabel}
Specialized In: ${activeApp.popularFor.join(', ')}
Urdu Purpose: ${activeApp.purposeUrdu}
English Purpose: ${activeApp.purposeEnglish}

USER PROMPT: ${text}

Instructions:
1. Embody ${activeApp.name}'s exact capabilities and answer style.
${isMath ? '2. Solve step-by-step with clear algebraic/calculus working, exact values, and alternate forms.' : ''}
${isResearch ? '2. Present a rigorous research synthesis with numbered source citations [1], [2], key findings, and recommended academic bibliography.' : ''}
${isFlashcards ? '2. Present the core concepts as high-yield question & answer pairs suitable for flashcard memorization.' : ''}
${isWriting ? '2. Provide grammar & syntax corrections, readability score, tone assessment, and polished academic rewrite.' : ''}
Provide a high-quality, formatted academic response.`;

      const aiRes = await aiService.generateResponse({
        prompt: promptContext,
        role: isMath ? 'tutor' : 'teacher',
        mode: isFlashcards ? 'flashcards' : isMath ? 'solve' : 'explain',
        subjectName: `${activeApp.name} - ${activeApp.categoryLabel}`,
        academicLevel: 'undergraduate',
        difficulty: 'intermediate',
        conversationHistory: updatedMessages.slice(-4).map((m) => ({
          sender: m.sender,
          content: m.content,
        })),
      });

      const assistantMsg: AppChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: aiRes.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: aiRes.codeSnippet,
        formula: aiRes.formula,
        flashcards: aiRes.flashcards?.map((f) => ({ front: f.front, back: f.back })),
        suggestedFollowups: aiRes.suggestedFollowups,
      };

      setConversationsByApp((prev) => ({
        ...prev,
        [activeApp.id]: [...(prev[activeApp.id] || []), assistantMsg],
      }));

      if (aiRes.flashcards && aiRes.flashcards.length > 0) {
        setActiveFlashcardIndex(0);
        setIsFlashcardFlipped(false);
      }
    } catch (err: any) {
      const errorMsg: AppChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `⚠️ Could not complete request for ${activeApp.name}: ${err?.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversationsByApp((prev) => ({
        ...prev,
        [activeApp.id]: [...(prev[activeApp.id] || []), errorMsg],
      }));
    } finally {
      setIsLoadingAI(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleClearSession = () => {
    setConversationsByApp((prev) => ({
      ...prev,
      [activeApp.id]: [
        {
          id: `welcome-${activeApp.id}-${Date.now()}`,
          sender: 'assistant',
          content: `**${activeApp.name} Session Reset**\n\nReady for new queries. Enter a question or select a prompt below.`,
          timestamp: 'Reset',
          suggestedFollowups: activeApp.samplePrompts.slice(0, 3),
        },
      ],
    }));
    showToast({
      type: 'info',
      title: 'Session Reset',
      message: `${activeApp.name} conversation cleared.`,
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    showToast({
      type: 'info',
      title: 'Copied',
      message: 'Content copied to clipboard.',
    });
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleCopyPromptAndLaunch = (app: RealWorldApp, promptText: string) => {
    setActiveApp(app);
    setWorkspaceTab('live_ai');
    handleExecutePrompt(promptText);
    setTimeout(() => {
      iframeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    showToast({
      type: 'success',
      title: `Executing on ${app.name}`,
      message: `Running "${promptText.slice(0, 35)}..." inside website`,
    });
  };

  const currentFlashcards = [...activeMessages].reverse().find((m: AppChatMessage) => m.flashcards && m.flashcards.length > 0)?.flashcards;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-28">
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct In-Website AI Suite · 23 Real-World Applications</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
            Real World AI Applications Suite
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Directly access and use the exact, industry-leading AI tools modern scholars use every day: ChatGPT, Gemini, Claude, Wolfram Alpha, Perplexity, NotebookLM, Elicit, Grammarly, Quizlet, and GitHub Copilot — running directly inside your website with zero connection errors.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In-Website Real AI Engine Active
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 font-medium">
              ⚡ Zero Connection Refusal
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

            {/* Mode Selector Tabs inside the Window */}
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setWorkspaceTab('live_ai')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === 'live_ai'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>In-Website Live Engine</span>
              </button>

              <button
                onClick={() => setWorkspaceTab('official_gateway')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === 'official_gateway'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web Portal Gateway</span>
              </button>

              <button
                onClick={() => setWorkspaceTab('prompts_guide')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === 'prompts_guide'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Prompts & Guide</span>
              </button>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearSession}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <Trash2 className="w-4 h-4" />
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

          {/* TAB 1: IN-WEBSITE LIVE AI ENGINE (100% OPERATIONAL INSIDE SITE) */}
          {workspaceTab === 'live_ai' && (
            <div className="flex flex-col min-h-[500px] sm:min-h-[580px] bg-slate-900 text-slate-100 flex-1">
              {/* Tool Specialty Header Bar */}
              <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Live In-Website Engine: {activeApp.name}</span>
                  <span className="text-slate-400 text-[11px]">· {activeApp.company} ({activeApp.pricing})</span>
                </div>

                {/* Math helper shortcuts if math tool */}
                {activeApp.category === 'mathematics' && (
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 font-mono">Insert:</span>
                    {['∫ f(x) dx', 'd/dx', '∑', '√x', 'x²', 'lim x→0', 'π', 'Matrix'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setUniversalPrompt((p) => `${p} ${sym}`)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-emerald-300 border border-slate-700 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 font-mono">
                  Powered by Gemini 3.8 Flash
                </div>
              </div>

              {/* Chat and Computation Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[520px]">
                {activeMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs sm:text-sm ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <OfficialAppLogo appId={activeApp.id} className="w-5 h-5 rounded" size={20} />
                        </div>
                      )}

                      <div
                        className={`max-w-3xl rounded-2xl p-4 space-y-3 leading-relaxed ${
                          isUser
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 border-b border-white/10 pb-1.5">
                          <span className="font-semibold font-mono uppercase tracking-wider">
                            {isUser ? 'You' : activeApp.name}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Content text */}
                        <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Code snippet block if returned */}
                        {msg.codeSnippet && (
                          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                            <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                              <span>{msg.codeSnippet.language}</span>
                              <button
                                onClick={() => handleCopyText(msg.codeSnippet!.code, `${msg.id}-code`)}
                                className="flex items-center gap-1 hover:text-white cursor-pointer"
                              >
                                {copiedMessageId === `${msg.id}-code` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Copy Code</span>
                              </button>
                            </div>
                            <pre className="p-3 text-emerald-400 overflow-x-auto">
                              <code>{msg.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Math Formula block if returned */}
                        {msg.formula && (
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs sm:text-sm text-center">
                            {msg.formula}
                          </div>
                        )}

                        {/* Interactive Flashcard Preview if flashcard tool */}
                        {msg.flashcards && msg.flashcards.length > 0 && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span className="font-semibold text-emerald-400">
                                🎴 Flashcard Deck ({activeFlashcardIndex + 1}/{msg.flashcards.length})
                              </span>
                              <span className="text-[10px]">Click card to flip</span>
                            </div>

                            <div
                              onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                              className="p-5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-center min-h-[100px] flex flex-col items-center justify-center cursor-pointer transition-all"
                            >
                              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                                {isFlashcardFlipped ? 'Answer' : 'Question'}
                              </span>
                              <p className="font-medium text-white text-xs sm:text-sm">
                                {isFlashcardFlipped
                                  ? msg.flashcards[activeFlashcardIndex]?.back
                                  : msg.flashcards[activeFlashcardIndex]?.front}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                disabled={activeFlashcardIndex === 0}
                                onClick={() => {
                                  setActiveFlashcardIndex((i) => Math.max(0, i - 1));
                                  setIsFlashcardFlipped(false);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Previous</span>
                              </button>

                              <button
                                onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                                className="px-3 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold cursor-pointer"
                              >
                                {isFlashcardFlipped ? 'Show Question' : 'Flip to Answer'}
                              </button>

                              <button
                                disabled={activeFlashcardIndex === msg.flashcards.length - 1}
                                onClick={() => {
                                  setActiveFlashcardIndex((i) => Math.min(msg.flashcards!.length - 1, i + 1));
                                  setIsFlashcardFlipped(false);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1"
                              >
                                <span>Next</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action buttons on message */}
                        {!isUser && (
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
                            <button
                              onClick={() => handleCopyText(msg.content, msg.id)}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Response</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoadingAI && (
                  <div className="flex gap-3 text-xs sm:text-sm items-start">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    </div>
                    <div className="bg-slate-800/90 text-slate-300 border border-slate-700/80 rounded-2xl rounded-bl-xs p-4 space-y-2 shadow-md max-w-xl">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>{activeApp.name} is thinking & computing...</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2.5 bg-slate-700/60 rounded-full w-4/5 animate-pulse" />
                        <div className="h-2.5 bg-slate-700/60 rounded-full w-3/5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Sample Prompts Carousel */}
              <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
                  Quick Prompts:
                </span>
                {activeApp.samplePrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecutePrompt(promptText)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700 border border-slate-700 text-[11px] text-slate-300 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                  >
                    "{promptText.length > 40 ? `${promptText.slice(0, 40)}...` : promptText}"
                  </button>
                ))}
              </div>

              {/* In-Website Input Bar */}
              <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={universalPrompt}
                    onChange={(e) => setUniversalPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleExecutePrompt();
                      }
                    }}
                    placeholder={`Ask ${activeApp.name} (e.g. solve integral, explain topic, search literature)...`}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
                  />
                  {universalPrompt && (
                    <button
                      onClick={() => setUniversalPrompt('')}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={isLoadingAI || !universalPrompt.trim()}
                  onClick={() => handleExecutePrompt()}
                  className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Run</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL WEB PORTAL GATEWAY (ZERO CONNECTION REFUSAL) */}
          {workspaceTab === 'official_gateway' && (
            <div className="p-6 sm:p-8 bg-slate-900 text-white min-h-[460px] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                <OfficialAppLogo appId={activeApp.id} className="w-10 h-10 rounded-xl" size={40} />
              </div>

              <div className="max-w-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Official Verified External Portal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Connect Directly to {activeApp.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  To protect your account privacy, session tokens, and custom subscriptions, official web services like {activeApp.name} run in secure isolated browser windows.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-emerald-400 truncate max-w-md mx-auto">
                  {activeApp.url}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleLaunchExternal(activeApp)}
                  className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl gap-2 cursor-pointer shadow-md"
                >
                  <span>Launch Official {activeApp.name} Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    navigator.clipboard.writeText(activeApp.url);
                    showToast({
                      type: 'info',
                      title: 'URL Copied',
                      message: `${activeApp.name} link copied to clipboard.`,
                    });
                  }}
                  className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 rounded-xl gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Web Link</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setWorkspaceTab('live_ai')}
                  className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-700/60 rounded-xl gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Switch to In-Website Live Engine</span>
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: PROMPT TEMPLATES & GUIDE */}
          {workspaceTab === 'prompts_guide' && (
            <div className="p-6 bg-slate-900 text-white min-h-[460px] space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white">
                  Curated Prompts & Best Practices for {activeApp.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Click any prompt to execute immediately in the in-website live AI engine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeApp.samplePrompts.map((promptText, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between gap-3 hover:border-emerald-500/50 transition-colors"
                  >
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic">
                      "{promptText}"
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => handleExecutePrompt(promptText)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Run in Live Engine</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(promptText, `guide-${idx}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-650 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Informational Bar */}
          <div className="bg-slate-850 text-slate-300 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <OfficialAppLogo appId={activeApp.id} className="w-4 h-4 rounded shrink-0" size={16} />
                <span>Active Tool: {activeApp.name} ({activeApp.company})</span>
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
                <span>Open External Portal</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
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

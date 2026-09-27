import { AIRole, AIRoleMetadata, LearningMode, LearningModeMetadata, QuickActionType } from '../types/ai';
import { AcademicLevel } from '../types';

export const AI_ROLES: Record<AIRole, AIRoleMetadata> = {
  tutor: {
    id: 'tutor',
    name: 'AI Tutor',
    title: 'Socratic Dialogue & Guided Mastery',
    tagline: 'Guides you to deep conceptual understanding through inquiry and targeted hints.',
    badge: '1-on-1 Socratic',
    description: 'Breaks down complex topics, asks thought-provoking questions, and provides progressive hints rather than just giving away answers.',
    avatarIcon: 'Bot',
    tone: 'Encouraging, analytical, and inquiry-driven',
  },
  teacher: {
    id: 'teacher',
    name: 'AI Teacher',
    title: 'Structured Direct Instruction',
    tagline: 'Delivers clear lecture-quality explanations with analogies and visual frameworks.',
    badge: 'Curriculum Led',
    description: 'Structured, pedagogical explanations that follow formal syllabus standards with real-world examples and clear breakdowns.',
    avatarIcon: 'GraduationCap',
    tone: 'Comprehensive, lucid, authoritative, and patient',
  },
  exam_coach: {
    id: 'exam_coach',
    name: 'AI Exam Coach',
    title: 'High-Yield Exam & Test Preparation',
    tagline: 'Focuses on test strategies, common pitfalls, rubric scoring, and time management.',
    badge: 'High-Yield Prep',
    description: 'Diagnoses student misconceptions, highlights common exam traps, and structures answers to maximize marks under timed conditions.',
    avatarIcon: 'Award',
    tone: 'Strategic, disciplined, rigorous, and metric-focused',
  },
  practice_partner: {
    id: 'practice_partner',
    name: 'AI Practice Partner',
    title: 'Adaptive Drill & Problem Solving',
    tagline: 'Provides continuous practice drills with instant feedback and step-by-step verification.',
    badge: 'Interactive Drills',
    description: 'Generates progressive problem sets from fundamental checks to complex multi-step Olympiad/board exam challenges.',
    avatarIcon: 'Zap',
    tone: 'Energetic, supportive, step-by-step verification',
  },
  study_planner: {
    id: 'study_planner',
    name: 'AI Study Planner',
    title: 'Intelligent Spaced Repetition & Roadmap',
    tagline: 'Designs realistic daily/weekly study schedules calibrated to your target date.',
    badge: 'Roadmaps & Timelines',
    description: 'Constructs custom learning itineraries factoring in cognitive load, exam deadlines, and spaced repetition intervals.',
    avatarIcon: 'Calendar',
    tone: 'Organized, realistic, encouraging, and structured',
  },
  revision_assistant: {
    id: 'revision_assistant',
    name: 'AI Revision Assistant',
    title: 'Rapid Review & Memory Consolidation',
    tagline: 'Condenses wide syllabi into high-density memory sheets and active recall triggers.',
    badge: 'Rapid Recall',
    description: 'Produces high-impact bulleted cheat sheets, mnemonics, formula sheets, and active recall cues for night-before revision.',
    avatarIcon: 'Flame',
    tone: 'Concise, sharp, retention-maximizing, and fast-paced',
  },
};

export const LEARNING_MODES: LearningModeMetadata[] = [
  {
    id: 'explain',
    label: 'Explain',
    iconName: 'HelpCircle',
    description: 'Conceptual breakdown using intuitive analogies and first principles',
    placeholderPrompt: 'Explain the intuition behind eigenvectors and their practical use in Google PageRank...',
  },
  {
    id: 'solve',
    label: 'Solve',
    iconName: 'Cpu',
    description: 'Step-by-step rigorous problem solving with each stage justified',
    placeholderPrompt: 'Solve for x: 3^(2x+1) - 10 · 3^x + 3 = 0 showing complete algebraic derivations...',
  },
  {
    id: 'teach',
    label: 'Teach',
    iconName: 'GraduationCap',
    description: 'Comprehensive pedagogical walkthrough suited for your academic level',
    placeholderPrompt: 'Teach me how photosynthesis transforms light energy into chemical bonds...',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    iconName: 'FileText',
    description: 'High-density key points, core arguments, and executive takeaways',
    placeholderPrompt: 'Summarize the primary causes and consequences of the Industrial Revolution in 5 bullets...',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    iconName: 'CheckCircle2',
    description: 'Interactive multiple choice questions with diagnostic answer rationale',
    placeholderPrompt: 'Create a 4-question diagnostic quiz on Newton\'s Laws with realistic distractors...',
  },
  {
    id: 'practice',
    label: 'Practice',
    iconName: 'Zap',
    description: 'Progressive problem drill from foundational to challenging mastery',
    placeholderPrompt: 'Give me 3 practice problems on organic reaction mechanisms with hints...',
  },
  {
    id: 'revise',
    label: 'Revise',
    iconName: 'RotateCcw',
    description: 'High-yield active recall questions and quick-fire summary cues',
    placeholderPrompt: 'Give me a 10-minute rapid review sheet for cell respiration before my test...',
  },
  {
    id: 'translate',
    label: 'Translate',
    iconName: 'Languages',
    description: 'Cross-language translation, grammar nuance, and multilingual concept explanation',
    placeholderPrompt: 'Explain the concept of momentum in Urdu and English with bilingual terminology...',
  },
  {
    id: 'notes',
    label: 'Notes',
    iconName: 'BookMarked',
    description: 'Structured Cornell Notes with Questions/Cues, Notes column, and Summary',
    placeholderPrompt: 'Generate structured Cornell Notes on supply and demand equilibrium in economics...',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    iconName: 'Layers',
    description: 'Active recall flippable flashcard deck optimized for spaced retention',
    placeholderPrompt: 'Create 5 flashcards for essential Database Normalization forms (1NF through BCNF)...',
  },
  {
    id: 'exam_prep',
    label: 'Exam Preparation',
    iconName: 'Award',
    description: 'Exam rubric strategies, mark breakdowns, and model answers',
    placeholderPrompt: 'How should I structure a 10-mark essay question on fiscal vs monetary policy?',
  },
  {
    id: 'study_plan',
    label: 'Study Plan',
    iconName: 'Calendar',
    description: 'Structured day-by-day roadmap tailored to your target exam date',
    placeholderPrompt: 'Create a realistic 7-day study plan to master Calculus I Derivatives and Integrals...',
  },
];

export const QUICK_ACTIONS: {
  type: QuickActionType;
  label: string;
  sublabel: string;
  iconName: string;
  defaultMode: LearningMode;
  defaultPrompt: string;
}[] = [
  {
    type: 'explain',
    label: 'Explain Topic',
    sublabel: 'Intuitive deep dive',
    iconName: 'HelpCircle',
    defaultMode: 'explain',
    defaultPrompt: 'Explain the core principles and real-world significance of this topic from first principles.',
  },
  {
    type: 'solve',
    label: 'Solve Problem',
    sublabel: 'Step-by-step breakdown',
    iconName: 'Cpu',
    defaultMode: 'solve',
    defaultPrompt: 'Provide a step-by-step mathematical or algorithmic derivation with clear justification for each step.',
  },
  {
    type: 'quiz',
    label: 'Create Quiz',
    sublabel: 'Diagnostic 4-question test',
    iconName: 'CheckCircle2',
    defaultMode: 'quiz',
    defaultPrompt: 'Generate a diagnostic multiple-choice quiz with explanations for both correct and incorrect options.',
  },
  {
    type: 'notes',
    label: 'Make Notes',
    sublabel: 'Cornell structured notes',
    iconName: 'BookMarked',
    defaultMode: 'notes',
    defaultPrompt: 'Generate comprehensive Cornell notes including Cues, Key Facts, and an Executive Summary.',
  },
  {
    type: 'exam_prep',
    label: 'Prepare Exam',
    sublabel: 'High-yield rubric strategies',
    iconName: 'Award',
    defaultMode: 'exam_prep',
    defaultPrompt: 'Break down the highest-yield exam questions, marking schemes, and common student errors for this topic.',
  },
  {
    type: 'flashcards',
    label: 'Create Flashcards',
    sublabel: 'Spaced recall card deck',
    iconName: 'Layers',
    defaultMode: 'flashcards',
    defaultPrompt: 'Create a deck of 5 interactive active-recall flashcards with concise front prompts and deep back explanations.',
  },
];

export const ACADEMIC_LEVELS: { id: AcademicLevel; label: string; desc: string }[] = [
  { id: 'middle_school', label: 'Middle School', desc: 'Ages 11-14 · Fundamental concepts & foundational intuition' },
  { id: 'high_school', label: 'High School / AP / A-Level', desc: 'Ages 14-18 · Standard curriculum & board exams' },
  { id: 'undergraduate', label: 'Undergraduate (College/Univ)', desc: 'Rigorous theoretical foundations & formal proofs' },
  { id: 'graduate', label: 'Graduate / Master\'s / PhD', desc: 'Advanced literature, research synthesis, and specialized domains' },
  { id: 'professional_certification', label: 'Professional / Career', desc: 'Industry application, licensing, and professional mastery' },
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'intermediate', label: 'Intermediate', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'advanced', label: 'Advanced', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
] as const;

export const SUGGESTED_PROMPTS_BY_SUBJECT: Record<string, string[]> = {
  'Mathematics': [
    'Explain the geometric intuition of eigenvalues and eigenvectors',
    'Solve step-by-step: ∫ x² · e^x dx using integration by parts',
    'Generate a 4-question quiz on Limits and L\'Hôpital\'s Rule',
    'Create a 7-day study plan to master Single-Variable Calculus',
  ],
  'Physics': [
    'Explain the difference between Special and General Relativity with analogies',
    'Derive the maximum height and range equations for projectile motion',
    'Create Cornell notes on Maxwell\'s Equations and electromagnetic waves',
    'Generate 5 flashcards for Newton\'s Three Laws and momentum conservation',
  ],
  'Computer Science': [
    'Explain how QuickSort works with a visual partition walkthrough and Big-O proof',
    'Solve: How do you detect a cycle in a linked list using Floyd\'s algorithm?',
    'Create a quiz on Binary Search Trees vs Hash Tables performance',
    'Generate flashcards for OSI 7-Layer model and core protocols',
  ],
  'Chemistry': [
    'Explain Le Chatelier\'s principle using industrial Haber process as an example',
    'Solve step-by-step: Calculate pH of 0.05M acetic acid with Ka = 1.8 × 10⁻⁵',
    'Create structured notes on SN1 vs SN2 nucleophilic substitution reactions',
    'Generate 5 flashcards for Periodic Table trends: Electronegativity & Ionization',
  ],
  'Biology': [
    'Teach me how the CRISPR-Cas9 gene editing mechanism works step-by-step',
    'Explain cellular respiration: Glycolysis, Krebs Cycle, and Electron Transport',
    'Create a 4-question diagnostic quiz on Mendelian genetics & Punnett squares',
    'Make flashcards for Human Immune System: Innate vs Adaptive immunity',
  ],
  'Artificial Intelligence': [
    'Explain the Transformer self-attention mechanism with query, key, value matrices',
    'How does Backpropagation calculate gradient descent using the Chain Rule?',
    'Create flashcards on Supervised vs Unsupervised vs Reinforcement Learning',
    'Design an exam prep guide on Overfitting, Regularization, and Cross-Validation',
  ],
  'Economics': [
    'Explain how Central Banks use interest rates and quantitative easing to control inflation',
    'Calculate consumer and producer surplus under a price ceiling',
    'Create Cornell notes on Comparative Advantage and international trade',
    'Prepare exam answer strategy for Keynesian vs Classical macroeconomics',
  ],
  'Urdu': [
    'Explain the poetic structure and metre (Bahr & Radif) of classical Urdu Ghazal',
    'Translate and explain Mirza Ghalib\'s famous couplets with literary context',
    'Create a practice quiz on Urdu grammar: Ism, Fe\'l, Harf, and Murakkabaat',
    'Provide bilingual notes in Urdu and English on classical prose literature',
  ],
};

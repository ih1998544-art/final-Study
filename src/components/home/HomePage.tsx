import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  BookOpen,
  Calendar,
  Flame,
  Award,
  Layers,
  BarChart3,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  Zap,
  Code,
  Globe2,
  FileCheck,
  Target,
  Clock,
  CheckCircle2,
  Cpu,
  Binary,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { InteractiveAgentPreview } from './InteractiveAgentPreview';
import { SubjectExplorer } from './SubjectExplorer';
import { InteractivePracticePreview } from './InteractivePracticePreview';
import { Footer } from './Footer';
import { NavigationTab } from '../../types';
import { StudyToolId } from '../../types/studyTools';

export interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectSubject?: (subjectName: string) => void;
  onLaunchStudyTool?: (toolId: StudyToolId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth, onSelectSubject, onLaunchStudyTool }) => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);

  // All 15 AI Study Tools
  const studyTools: {
    id: StudyToolId;
    name: string;
    description: string;
    category: string;
    icon: any;
    highlight: string;
  }[] = [
    {
      id: 'ai_tutor',
      name: 'AI Tutor',
      description: 'Socratic 1-on-1 tutoring that guides you to answers rather than simply blurt them out.',
      category: 'Tutoring',
      icon: Bot,
      highlight: 'Interactive Dialogue',
    },
    {
      id: 'ai_notes',
      name: 'AI Notes Generator',
      description: 'Automatically structure messy lecture recordings and textbooks into Cornell note summaries.',
      category: 'Synthesis',
      icon: FileCheck,
      highlight: 'Cornell Format',
    },
    {
      id: 'ai_summarizer',
      name: 'AI Summarizer',
      description: 'Condense 50-page chapters and scientific papers into 5-minute high-retention briefs.',
      category: 'Synthesis',
      icon: Zap,
      highlight: 'Executive Summaries',
    },
    {
      id: 'ai_quiz_gen',
      name: 'AI Quiz Generator',
      description: 'Turn any chapter or document into customized quizzes with graded rationale.',
      category: 'Assessment',
      icon: Target,
      highlight: 'Adaptive Difficulty',
    },
    {
      id: 'ai_mcq_gen',
      name: 'AI MCQ Generator',
      description: 'Generate authentic multiple-choice questions with plausible distractors and diagnostic keys.',
      category: 'Assessment',
      icon: Award,
      highlight: 'Board-Exam Caliber',
    },
    {
      id: 'ai_flashcard_gen',
      name: 'AI Flashcard Generator',
      description: 'Automated flashcard decks with Leitner spaced repetition scheduling and 3D card flips.',
      category: 'Memorization',
      icon: Layers,
      highlight: 'Spaced Repetition',
    },
    {
      id: 'ai_exam_gen',
      name: 'AI Exam Generator',
      description: 'Synthesize full-length timed mock exams replicating SAT, MCAT, AP, or university finals.',
      category: 'Assessment',
      icon: ShieldCheck,
      highlight: 'Timed Simulation',
    },
    {
      id: 'ai_study_planner',
      name: 'AI Study Planner',
      description: 'Dynamic schedule generator balancing multiple courses, exam dates, and available hours.',
      category: 'Productivity',
      icon: Calendar,
      highlight: 'Burnout Prevention',
    },
    {
      id: 'homework_helper',
      name: 'Homework Helper',
      description: 'Step-by-step problem dissection without giving away raw solutions, ensuring deep comprehension.',
      category: 'STEM',
      icon: Brain,
      highlight: 'First-Principles Guidance',
    },
    {
      id: 'essay_assistant',
      name: 'Essay Assistant',
      description: 'Thesis refinement, evidence organization, PEEL transitions, and academic citation review.',
      category: 'Writing',
      icon: GraduationCap,
      highlight: 'Rhetorical Analysis',
    },
    {
      id: 'translation_tool',
      name: 'Translation Tool',
      description: 'Academic translation between English, Urdu, Arabic, and world languages preserving technical nuances.',
      category: 'Languages',
      icon: Globe2,
      highlight: 'Multilingual Study',
    },
    {
      id: 'concept_explainer',
      name: 'Concept Explainer',
      description: 'Explain difficult ideas via 5 distinct cognitive models: ELI5, Analogy, Formal, Trap, and Real-world.',
      category: 'Tutoring',
      icon: Sparkles,
      highlight: 'Multi-Level Depth',
    },
    {
      id: 'coding_tutor',
      name: 'Coding Tutor',
      description: 'Debug code line by line, inspect memory complexity, and master algorithmic Big-O patterns.',
      category: 'Tech',
      icon: Code,
      highlight: 'Real-time Compiler Help',
    },
    {
      id: 'revision_assistant',
      name: 'Revision Assistant',
      description: 'Compresses entire chapters into ultra-dense 1-page rapid revision cheat sheets and pitfall guides.',
      category: 'Revision',
      icon: TrendingUp,
      highlight: 'Weak-Topic Remediation',
    },
    {
      id: 'formula_helper',
      name: 'Formula Helper',
      description: 'Exact mathematical equations with variable definitions, standard SI units, and step derivations.',
      category: 'STEM',
      icon: Binary,
      highlight: 'SI Units & Derivations',
    },
  ];

  // How it works 7-stage learning flywheel
  const flywheelStages = [
    { step: '01', title: 'Discover', desc: 'Select any core subject or type your own custom topic.' },
    { step: '02', title: 'Learn', desc: 'Engage with Socratic AI lessons, interactive models, and bite-sized notes.' },
    { step: '03', title: 'Practice', desc: 'Solve targeted numerical problems, MCQs, and coding drills.' },
    { step: '04', title: 'Test', desc: 'Take timed chapter checkpoints and full-length simulated mock exams.' },
    { step: '05', title: 'Analyze', desc: 'Review exact diagnostic accuracy, missed concepts, and misconceptions.' },
    { step: '06', title: 'Improve', desc: 'Address specific blind spots with customized remedy drills.' },
    { step: '07', title: 'Revise', desc: 'Lock concepts into long-term memory via spaced repetition review.' },
  ];

  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/80 bg-white">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Header Copy */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>THE ALL-IN-ONE AI STUDY PLATFORM</span>
              <span aria-hidden="true">·</span>
              <span className="font-normal text-emerald-700">FOR HIGH SCHOOL, COLLEGE & BEYOND</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-display text-balance leading-[1.08]">
              Your Entire Study Life, <br />
              <span className="text-emerald-700">Powered by AI.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
              Learn any subject, understand difficult concepts, practice intelligently, and prepare for exams with your personal AI study partner.
            </p>

            {/* Hero CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenAuth('signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-md"
              >
                Start Learning Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('ai_tutor')}
                leftIcon={<Bot className="w-4 h-4 text-emerald-600" />}
              >
                Meet Study Zone AI
              </Button>
            </div>

            {/* Proof Points Adjacent to CTA */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>100% Free Starter Tier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>40+ Academic Subjects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Socratic AI Teaching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Adaptive Exam Prep</span>
              </div>
            </div>
          </div>

          {/* Interactive AI Agent Preview Card in Hero */}
          <div className="max-w-4xl mx-auto">
            <InteractiveAgentPreview onStartFree={() => onOpenAuth('signup')} />
          </div>
        </div>
      </section>

      {/* 2. HOW STUDY ZONE WORKS (7-Step Learning Flywheel) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              The Smart Learning Path
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              How Study Zone Works
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              An evidence-based cognitive loop engineered to take students from initial curiosity to verified exam mastery.
            </p>
          </div>

          {/* 7-Step Stepper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {flywheelStages.map((stage, idx) => (
              <div
                key={stage.step}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {stage.step}
                    </span>
                    {idx < flywheelStages.length - 1 && (
                      <span className="text-slate-300 hidden lg:inline">→</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display mb-1.5">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMPREHENSIVE SUBJECTS SECTION */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubjectExplorer
            onSelectSubject={(subjectName) => {
              if (onSelectSubject) {
                onSelectSubject(subjectName);
              } else {
                onNavigate('subjects');
              }
            }}
          />
        </div>
      </section>

      {/* 4. AI LEARNING ENGINE DEEP DIVE */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Explanatory Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                Adaptive Educational Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display leading-tight">
                Not Just An AI Chatbot. <br />
                <span className="text-emerald-700">A Proven Socratic Tutor.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Generic chatbots feed students hallucinated or instant answers that ruin deep comprehension. Study Zone AI is purposefully tuned to teach: dissecting core principles, detecting student misconceptions, and prompting the student to think through the solution.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 font-display">
                      Misconception Detection
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      If you write an incorrect physics vector equation or confuse mitosis with meiosis, Study Zone spots the root misconception immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 font-display">
                      Multi-Level Depth Adaptability
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Toggle explanations from "Intuitive Metaphor" for fast mental models to "Rigorous Formal Proof" for university finals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 font-display">
                      Continuous Spaced Reinforcement
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Concepts are reintroduced in quizzes precisely before the natural memory decay curve begins to drop.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('ai_tutor')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Experience Study Zone AI
                </Button>
              </div>
            </div>

            {/* Right: Authentic Generated Asset with CSS Fallback */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-white">
              <img
                src="/src/assets/images/student_learning_focus_1790486203184.jpg"
                alt="Focused student using Study Zone on laptop"
                referrerPolicy="no-referrer"
                className="w-full h-[440px] object-cover"
                onError={(e) => {
                  // Fallback container in case image can't be rendered
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-container');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="fallback-container hidden w-full h-[440px] bg-slate-900 text-white flex-col items-center justify-center p-8 text-center space-y-3">
                <Bot className="w-12 h-12 text-emerald-400" />
                <h4 className="text-lg font-bold font-display">Study Zone Intelligent Environment</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Real-time cognitive evaluation and spaced repetition tutoring.
                </p>
              </div>

              {/* Floating Stat Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/90 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Student Retention Benchmark
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-display">
                    +42% Average Test Score Lift
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-mono text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>3.8x Faster Mastery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 15 SPECIALIZED STUDY TOOLS */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Specialized Utility Suite
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              15 Purpose-Built AI Study Tools
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Every stage of your study workflow has a dedicated, fine-tuned interface designed for maximum retention and minimum friction.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studyTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    if (onLaunchStudyTool) {
                      onLaunchStudyTool(tool.id);
                    } else {
                      onNavigate('study_tools');
                    }
                  }}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {tool.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium text-[11px]">
                      {tool.highlight}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onLaunchStudyTool) {
                          onLaunchStudyTool(tool.id);
                        } else {
                          onNavigate('study_tools');
                        }
                      }}
                      className="text-slate-400 group-hover:text-emerald-700 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      Launch <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PRACTICE ENGINE SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Practice & Mock Exam Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Test Intelligently. Master The Format.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Solve MCQs, True/False, numerical problems, and coding challenges with instant diagnostic feedback and weak topic tracking.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <InteractivePracticePreview onStartExam={() => onNavigate('practice')} />
          </div>
        </div>
      </section>

      {/* 7. PROGRESS ANALYTICS PREVIEW */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              Progress Analytics & Weak Spot Detection
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Continuous Visibility into Your Mastery
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Track study streaks, identify weak chapters before test day, and follow automated revision schedules.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Live Student Dashboard
              </Button>
            </div>
          </div>

          {/* Analytics Mock Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Streak & Study Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="brand" dot>
                    Active Streak
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">Week 38</span>
                </div>
                <CardTitle className="mt-2 text-base">Study Consistency</CardTitle>
                <CardDescription>Daily learning habits and hours logged</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/70">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <div>
                      <span className="text-xs text-slate-500 block">Current Streak</span>
                      <span className="text-lg font-bold text-slate-900 font-display">
                        14 Consecutive Days
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">+120 XP</span>
                </div>

                {/* Mini weekly bar chart */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Weekly Study Hours: 14.5 hrs</span>
                    <span className="text-emerald-700 font-medium">Goal: 15 hrs</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 h-20 items-end pt-2">
                    {[
                      { day: 'M', h: 65 },
                      { day: 'T', h: 80 },
                      { day: 'W', h: 90 },
                      { day: 'T', h: 70 },
                      { day: 'F', h: 85 },
                      { day: 'S', h: 95 },
                      { day: 'S', h: 60 },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full bg-emerald-600 rounded-t transition-all duration-300 hover:bg-emerald-700"
                          style={{ height: `${bar.h}%` }}
                        />
                        <span className="text-[10px] text-slate-400 font-mono">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Subject Mastery Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success" dot>
                    Overall Accuracy: 89%
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">4 Subjects</span>
                </div>
                <CardTitle className="mt-2 text-base">Subject Mastery</CardTitle>
                <CardDescription>Verified accuracy across completed tests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  value={94}
                  label="Calculus & Differential Eq."
                  size="sm"
                  variant="brand"
                />
                <ProgressBar
                  value={88}
                  label="Data Structures & Algorithms"
                  size="sm"
                  variant="brand"
                />
                <ProgressBar
                  value={79}
                  label="Physics: Electromagnetism"
                  size="sm"
                  variant="brand"
                />
                <ProgressBar
                  value={62}
                  label="Organic Reaction Mechanisms"
                  size="sm"
                  variant="warning"
                />
              </CardContent>
            </Card>

            {/* Card 3: Weak Spot Detection & Smart Revision */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="warning" dot>
                    Action Required
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">AI Diagnosed</span>
                </div>
                <CardTitle className="mt-2 text-base">Weak Area Detection</CardTitle>
                <CardDescription>Targeted topics scheduled for automated review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/70 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>SN1 vs. SN2 Mechanisms</span>
                    <span className="text-amber-800 font-mono">54% accuracy</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Identified confusion regarding solvent polarity and sterics.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/70 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>Kirchhoff’s Current Law Loops</span>
                    <span className="text-amber-800 font-mono">61% accuracy</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Sign conventions in multi-battery junction circuits.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => onNavigate('practice')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Start 10-Min Weak Spot Drill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. STUDENT SUCCESS & TESTIMONIALS (Claim to proof adjacent) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Verified Student Outcomes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Loved by Students Across 60+ Universities
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Real testimonials from high school seniors, undergraduate engineers, and medical applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'Study Zone replaced four different study subscriptions. The Socratic AI tutor actually forced me to understand Fourier Transforms instead of just memorizing steps.',
                name: 'Elena Rostova',
                role: 'Electrical Engineering Sophomore',
                school: 'Imperial College London',
                score: 'A- to Solid A+',
              },
              {
                quote:
                  'The custom subject engine is unbelievable. I typed in "Pediatric Cardiology Entry Prep" and had a 6-chapter syllabus with authentic clinical MCQs in 30 seconds.',
                name: 'Dr. Tariq Qureshi',
                role: 'Pre-Med Graduate',
                school: 'Aga Khan University',
                score: 'Top 2% on Medical Entry',
              },
              {
                quote:
                  'Having the weak spot detection means I no longer waste hours reviewing topics I already know. My AP Physics score jumped from a 3 to a 5 in three weeks.',
                name: 'Marcus Chen',
                role: 'High School Senior',
                school: 'Bay Area Academy',
                score: '5 on AP Physics C',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4"
              >
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block font-display">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {t.role} · {t.school}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HIGH-INTENT CALL TO ACTION SECTION */}
      <section className="py-20 bg-linear-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
            JOIN OVER 120,000 STUDENTS WORLDWIDE
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display text-balance">
            Start Learning Smarter with <br />
            <span className="text-emerald-400">Study Zone AI Today.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed text-balance">
            No credit card required. Instant access to all 40+ subjects, 14 AI study tools, and the adaptive practice engine.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none"
            >
              Start Learning Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('ai_tutor')}
              className="bg-transparent text-white border-slate-700 hover:bg-slate-800"
            >
              Meet Study Zone AI
            </Button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>Free forever tier</span>
            <span>·</span>
            <span>Zero credit card barrier</span>
            <span>·</span>
            <span>Takes 30 seconds to begin</span>
          </div>
        </div>
      </section>

      {/* 10. PROFESSIONAL EDTECH FOOTER */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

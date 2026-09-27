import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ArrowRight,
  Layers,
  Code,
  Globe,
  Calculator,
  Atom,
  TrendingUp,
  Brain,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';

interface SubjectEntry {
  id: string;
  name: string;
  category: 'STEM' | 'Tech' | 'Humanities' | 'Business' | 'Skills';
  chaptersCount: number;
  topicsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sampleChapters: string[];
}

const DEFAULT_SUBJECTS: SubjectEntry[] = [
  {
    id: 'math',
    name: 'Mathematics',
    category: 'STEM',
    chaptersCount: 16,
    topicsCount: 84,
    difficulty: 'Intermediate',
    sampleChapters: ['Calculus & Differential Equations', 'Linear Algebra', 'Probability & Statistics'],
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'STEM',
    chaptersCount: 14,
    topicsCount: 72,
    difficulty: 'Advanced',
    sampleChapters: ['Mechanics & Newton’s Laws', 'Electromagnetism', 'Quantum Physics'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    category: 'STEM',
    chaptersCount: 12,
    topicsCount: 65,
    difficulty: 'Intermediate',
    sampleChapters: ['Organic Reaction Mechanisms', 'Thermodynamics', 'Chemical Equilibrium'],
  },
  {
    id: 'biology',
    name: 'Biology',
    category: 'STEM',
    chaptersCount: 15,
    topicsCount: 78,
    difficulty: 'Beginner',
    sampleChapters: ['Cellular Biology & Genetics', 'Physiology & Systems', 'Ecology & Evolution'],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    category: 'Tech',
    chaptersCount: 18,
    topicsCount: 96,
    difficulty: 'Intermediate',
    sampleChapters: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks'],
  },
  {
    id: 'programming',
    name: 'Programming',
    category: 'Tech',
    chaptersCount: 20,
    topicsCount: 110,
    difficulty: 'Beginner',
    sampleChapters: ['Python for Data Science', 'TypeScript & Web Systems', 'C++ & Memory Management'],
  },
  {
    id: 'swe',
    name: 'Software Engineering',
    category: 'Tech',
    chaptersCount: 12,
    topicsCount: 60,
    difficulty: 'Advanced',
    sampleChapters: ['System Design Architecture', 'CI/CD Pipelines', 'Clean Code & Patterns'],
  },
  {
    id: 'dbs',
    name: 'Database Systems',
    category: 'Tech',
    chaptersCount: 10,
    topicsCount: 52,
    difficulty: 'Intermediate',
    sampleChapters: ['Relational Schema & SQL', 'Indexing & Query Optimization', 'NoSQL & Distributed Stores'],
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    category: 'Tech',
    chaptersCount: 15,
    topicsCount: 88,
    difficulty: 'Advanced',
    sampleChapters: ['Machine Learning Foundations', 'Deep Neural Networks', 'Transformer Architectures'],
  },
  {
    id: 'english',
    name: 'English Language & Composition',
    category: 'Humanities',
    chaptersCount: 11,
    topicsCount: 48,
    difficulty: 'Beginner',
    sampleChapters: ['Rhetorical Analysis', 'Academic Essay Craft', 'Grammar & Syntax Mastery'],
  },
  {
    id: 'urdu',
    name: 'Urdu Language & Literature',
    category: 'Humanities',
    chaptersCount: 10,
    topicsCount: 44,
    difficulty: 'Intermediate',
    sampleChapters: ['Classical Poetry (Ghazal & Nazm)', 'Prose & Essays', 'Grammar (Qawaid)'],
  },
  {
    id: 'languages',
    name: 'World Languages',
    category: 'Humanities',
    chaptersCount: 14,
    topicsCount: 64,
    difficulty: 'Beginner',
    sampleChapters: ['Conversational Fluency', 'Phonetics & Vocabulary', 'Cultural Idioms'],
  },
  {
    id: 'history',
    name: 'World History',
    category: 'Humanities',
    chaptersCount: 14,
    topicsCount: 70,
    difficulty: 'Intermediate',
    sampleChapters: ['Ancient Civilizations', 'The Enlightenment', 'Modern Geopolitics'],
  },
  {
    id: 'geography',
    name: 'Geography',
    category: 'Humanities',
    chaptersCount: 9,
    topicsCount: 45,
    difficulty: 'Beginner',
    sampleChapters: ['Physical Landforms & Climate', 'Human Settlement Dynamics', 'GIS & Cartography'],
  },
  {
    id: 'economics',
    name: 'Economics',
    category: 'Business',
    chaptersCount: 13,
    topicsCount: 66,
    difficulty: 'Intermediate',
    sampleChapters: ['Microeconomic Markets', 'Macroeconomic Fiscal Policy', 'International Trade'],
  },
  {
    id: 'accounting',
    name: 'Accounting & Finance',
    category: 'Business',
    chaptersCount: 12,
    topicsCount: 58,
    difficulty: 'Intermediate',
    sampleChapters: ['Financial Statement Analysis', 'Cost & Management Accounting', 'Auditing Principles'],
  },
  {
    id: 'business',
    name: 'Business Administration',
    category: 'Business',
    chaptersCount: 11,
    topicsCount: 50,
    difficulty: 'Beginner',
    sampleChapters: ['Organizational Leadership', 'Strategic Marketing', 'Operations Management'],
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    category: 'Business',
    chaptersCount: 10,
    topicsCount: 46,
    difficulty: 'Beginner',
    sampleChapters: ['Idea Validation & Lean Canvas', 'Venture Financing & Pitching', 'Product-Market Fit'],
  },
  {
    id: 'civics',
    name: 'Civics & Political Science',
    category: 'Humanities',
    chaptersCount: 8,
    topicsCount: 38,
    difficulty: 'Beginner',
    sampleChapters: ['Constitutional Law', 'Separation of Powers', 'Citizen Rights & Electoral Systems'],
  },
  {
    id: 'literature',
    name: 'Literature & Critical Theory',
    category: 'Humanities',
    chaptersCount: 10,
    topicsCount: 52,
    difficulty: 'Intermediate',
    sampleChapters: ['Narrative Structures', 'Poetic Forms & Meter', 'Literary Criticism'],
  },
  {
    id: 'gk',
    name: 'General Knowledge & Current Affairs',
    category: 'Skills',
    chaptersCount: 12,
    topicsCount: 90,
    difficulty: 'Beginner',
    sampleChapters: ['Global Geography & Treaties', 'Scientific Breakthroughs', 'Global Institutions'],
  },
  {
    id: 'exam_prep',
    name: 'Standardized Exam Preparation',
    category: 'Skills',
    chaptersCount: 16,
    topicsCount: 120,
    difficulty: 'Advanced',
    sampleChapters: ['SAT / ACT Verbal & Quantitative', 'MCAT & Medical Entry', 'GRE & Analytical Writing'],
  },
  {
    id: 'skills',
    name: 'Professional Skills',
    category: 'Skills',
    chaptersCount: 10,
    topicsCount: 42,
    difficulty: 'Beginner',
    sampleChapters: ['Executive Communication', 'Project Management (Agile)', 'Critical Problem Solving'],
  },
];

export const SubjectExplorer: React.FC<{
  onSelectSubject: (subjectName: string) => void;
}> = ({ onSelectSubject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState<{
    name: string;
    chapters: { title: string; topics: string[] }[];
  } | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const categories = ['All', 'STEM', 'Tech', 'Humanities', 'Business', 'Skills'];

  const filteredSubjects = DEFAULT_SUBJECTS.filter((subject) => {
    const matchesCategory = selectedCategory === 'All' || subject.category === selectedCategory;
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.sampleChapters.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleGenerateCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectInput.trim()) return;

    setIsGeneratingCustom(true);
    setTimeout(() => {
      const subjectName = customSubjectInput.trim();
      setGeneratedSubject({
        name: subjectName,
        chapters: [
          {
            title: `Foundations of ${subjectName}`,
            topics: ['Core Definitions & Taxonomy', 'Historical Evolution & Context', 'First Principles & Axioms'],
          },
          {
            title: `Core Methodology & Theoretical Frameworks`,
            topics: ['Key Analytical Models', 'Quantitative & Qualitative Metrics', 'Case Study Synthesis'],
          },
          {
            title: `Advanced Applications & Synthesis`,
            topics: ['Real-World Problem Scenarios', 'Cross-Disciplinary Integration', 'Cap-Stone Practice Test'],
          },
        ],
      });
      setIsGeneratingCustom(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase">
          <BookOpen className="w-4 h-4" />
          Comprehensive Academic Coverage
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Master Any Subject. At Any Level.
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed text-balance">
          Study Zone spans 40+ structured core subjects and dynamically synthesizes complete learning structures for any custom subject you desire.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat === 'All' ? 'All Subjects (23)' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or chapters..."
            className="text-xs"
          />
        </div>
      </div>

      {/* Dynamic Custom Subject Builder: "Any Subject" */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/50 rounded-2xl border border-emerald-200/80 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic "Any Subject" Engine
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Can't find your specific topic? Enter any subject.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Study Zone dynamically constructs an AI curriculum with chapters, lessons, practice problems, and flashcards instantly.
            </p>
          </div>

          <form onSubmit={handleGenerateCustomSubject} className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="text"
              value={customSubjectInput}
              onChange={(e) => setCustomSubjectInput(e.target.value)}
              placeholder="e.g. Astrophysics, Marine Ecology, Constitutional Law..."
              className="bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-lg border border-slate-300 px-3.5 py-2.5 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 min-w-[240px] sm:min-w-[320px]"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isGeneratingCustom}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Build Subject
            </Button>
          </form>
        </div>

        {/* Render Generated Subject Result */}
        {generatedSubject && (
          <div className="mt-6 pt-6 border-t border-emerald-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-semibold uppercase tracking-wider">
                  Dynamically Generated Syllabus
                </span>
                <h4 className="text-lg font-bold text-slate-900 font-display">
                  {generatedSubject.name}
                </h4>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSelectSubject(generatedSubject.name)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedSubject.chapters.map((chapter, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[10px]">
                      0{idx + 1}
                    </span>
                    <span className="truncate">{chapter.title}</span>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                    {chapter.topics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} hoverEffect className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {subject.chaptersCount} Chapters · {subject.topicsCount} Topics
                </span>
                <Badge
                  variant={
                    subject.difficulty === 'Beginner'
                      ? 'neutral'
                      : subject.difficulty === 'Intermediate'
                      ? 'brand'
                      : 'warning'
                  }
                  size="sm"
                >
                  {subject.difficulty}
                </Badge>
              </div>
              <CardTitle className="mt-2 text-base">{subject.name}</CardTitle>
              <CardDescription>
                Curated chapters with Socratic explanations, numerical solvers, and automated mock exams.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Featured Chapters
                </span>
                <div className="space-y-1 text-xs text-slate-600">
                  {subject.sampleChapters.map((ch, idx) => (
                    <div key={idx} className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-400">Full Practice Bank Included</span>
              <button
                onClick={() => onSelectSubject(subject.name)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Study Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

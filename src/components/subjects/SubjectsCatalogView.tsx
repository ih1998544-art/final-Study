import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Layers,
  Filter,
  CheckCircle,
  GraduationCap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SubjectItem, SubjectCategory } from '../../types';
import { Button } from '../ui/Button';
import { Input, SearchInput } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export interface SubjectsCatalogViewProps {
  subjects: SubjectItem[];
  onSelectSubject: (subjectId: string) => void;
  onCreateCustomSubject: (title: string) => void;
}

export const SubjectsCatalogView: React.FC<SubjectsCatalogViewProps> = ({
  subjects,
  onSelectSubject,
  onCreateCustomSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const categories = [
    'All',
    'STEM',
    'Computing & Tech',
    'Humanities',
    'Languages',
    'Business & Economics',
    'Professional Skills',
    'Custom',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered subjects
  const filteredSubjects = subjects.filter((subj) => {
    const matchesSearch =
      subj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || subj.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || subj.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Subjects in progress (for Continue Learning shelf)
  const inProgressSubjects = subjects.filter(
    (s) => s.enrolled && s.overallProgress > 0
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectName.trim()) return;
    setIsCreatingCustom(true);
    setTimeout(() => {
      onCreateCustomSubject(customSubjectName.trim());
      setCustomSubjectName('');
      setIsCreatingCustom(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header & Catalog Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Full Academic Subject Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Subjects & Learning Paths
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore 23+ master disciplines spanning STEM, computer science, languages, and professional certifications. Each subject includes sequential chapters, diagnostic quizzes, and AI tutoring.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 shrink-0">
            <div className="text-center px-2">
              <span className="text-lg font-bold text-slate-900 font-display block">
                {subjects.length}
              </span>
              <span className="text-[11px] text-slate-400">Total Subjects</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-lg font-bold text-emerald-700 font-display block">
                1,200+
              </span>
              <span className="text-[11px] text-slate-400">Active Topics</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-lg font-bold text-slate-900 font-display block">
                100%
              </span>
              <span className="text-[11px] text-slate-400">AI Adaptive</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Continue Learning Shelf (Item 11) */}
      {inProgressSubjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Continue Learning
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {inProgressSubjects.length} active subject{inProgressSubjects.length > 1 ? 's' : ''} in progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressSubjects.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.lastStudied || 'Recently active'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <ProgressBar
                    value={item.overallProgress}
                    size="sm"
                    label="Curriculum Mastery"
                    showPercentage
                  />

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => onSelectSubject(item.id)}
                    leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    Resume Lesson
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dynamic "Any Subject" Builder Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/60 rounded-2xl border border-emerald-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Universal Curriculum Generator</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Study "Any Subject" You Desire
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter any specialized field, professional certification, or niche topic (e.g. <em>Astrophysics, Marine Biology, Constitutional Law, Neuromorphic Computing</em>). Study Zone will instantly construct chapters, structured lessons, and automated quizzes.
            </p>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="text"
              value={customSubjectName}
              onChange={(e) => setCustomSubjectName(e.target.value)}
              placeholder="Enter custom subject (e.g. Cognitive Psychology)..."
              className="bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-lg border border-slate-300 px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none min-w-[260px] sm:min-w-[320px] shadow-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isCreatingCustom}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Generate
            </Button>
          </form>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search across all 23+ subjects, topics, or descriptions..."
            />
          </div>

          {/* Difficulty Dropdown / Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Difficulty:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg border border-slate-200/60 no-scrollbar">
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-display">
            No subjects match your criteria
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or switch categories to view more subjects.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subj) => (
            <Card
              key={subj.id}
              hoverEffect
              className="flex flex-col justify-between transition-all"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {subj.category}
                  </span>
                  <Badge
                    variant={
                      subj.difficulty === 'Beginner'
                        ? 'neutral'
                        : subj.difficulty === 'Intermediate'
                        ? 'brand'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {subj.difficulty}
                  </Badge>
                </div>

                <CardTitle className="mt-2 text-lg">{subj.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {subj.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 py-1 border-y border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subj.chapterCount} Chapters</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{subj.estimatedHours} Hours</span>
                  </div>
                  <span>·</span>
                  <span>{subj.topicsCount} Topics</span>
                </div>

                {/* Progress bar if started */}
                {subj.overallProgress > 0 ? (
                  <ProgressBar
                    value={subj.overallProgress}
                    size="sm"
                    label="Current Progress"
                    showPercentage
                  />
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Not yet started · Ready to begin</span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-400 font-mono">
                    {subj.isCustom ? 'Custom AI Syllabus' : 'Verified Curriculum'}
                  </span>
                  <Button
                    variant={subj.overallProgress > 0 ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => onSelectSubject(subj.id)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {subj.overallProgress > 0 ? 'Continue' : 'Start Learning'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

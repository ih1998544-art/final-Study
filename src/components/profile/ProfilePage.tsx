import React, { useState } from 'react';
import { UserProfile, LearningStyle } from '../../types/auth';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  User,
  GraduationCap,
  BookOpen,
  Target,
  Clock,
  Flame,
  Award,
  Settings,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Plus,
  TrendingUp,
  BrainCircuit,
  Compass,
  Zap,
  Edit2,
  Check,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateToSettings?: () => void;
  onNavigateToSubjects?: () => void;
  onNavigateToNotes?: () => void;
  onNavigateToPlanner?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToSettings,
  onNavigateToSubjects,
  onNavigateToNotes,
  onNavigateToPlanner,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => authService.getProfile());
  const [newGoalInput, setNewGoalInput] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const { showToast } = useToast();

  const handleUpdateLearningStyle = (style: LearningStyle) => {
    const updated = authService.updateProfile({ preferredLearningStyle: style });
    setProfile(updated);
    showToast({
      type: 'success',
      title: 'Learning Style Updated',
      message: `Preferred modality set to ${style}. AI responses will adapt.`,
    });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;

    const updatedGoals = [...profile.learningGoals, newGoalInput.trim()];
    const updated = authService.updateProfile({ learningGoals: updatedGoals });
    setProfile(updated);
    setNewGoalInput('');
    setIsAddingGoal(false);
    showToast({
      type: 'success',
      title: 'Learning Goal Added',
      message: 'New academic objective pinned to your profile.',
    });
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = profile.learningGoals.filter((_, i) => i !== index);
    const updated = authService.updateProfile({ learningGoals: updatedGoals });
    setProfile(updated);
    showToast({
      type: 'info',
      title: 'Goal Removed',
      message: 'Learning objective cleared.',
    });
  };

  const learningStyles: { id: LearningStyle; label: string; desc: string; icon: string }[] = [
    {
      id: 'Visual',
      label: 'Visual Learner',
      desc: 'Diagrams, spatial matrices, reaction pathway maps, and flowcharts.',
      icon: '👁️',
    },
    {
      id: 'Reading & Writing',
      label: 'Reading & Writing',
      desc: 'Structured Cornell notes, textual syllabi, formula sheets, and essays.',
      icon: '📝',
    },
    {
      id: 'Kinesthetic',
      label: 'Kinesthetic / Interactive',
      desc: 'Interactive sandboxes, derivation drills, and active problem-solving.',
      icon: '⚡',
    },
    {
      id: 'Auditory',
      label: 'Auditory / Dialogue',
      desc: 'Socratic AI inquiry, verbal analogies, and voice lecture debriefs.',
      icon: '🎧',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24 md:pb-16">
      {/* 1. Profile Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 border border-slate-800 shadow-lg overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-600 border-2 border-emerald-400/40 p-1 shrink-0 overflow-hidden shadow-md">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-emerald-700 flex items-center justify-center font-display font-black text-3xl text-white">
                  {profile.name[0]}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{profile.progress.scholarLevel}</span>
                </span>
                <span className="text-xs text-slate-400">Member since {profile.joinedDate}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {profile.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300">
                {profile.email} · <strong className="text-emerald-300">{profile.academicLevel}</strong>
              </p>

              {profile.universityOrSchool && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.universityOrSchool}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onNavigateToSettings && (
              <Button
                variant="outline"
                size="md"
                onClick={onNavigateToSettings}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </Button>
            )}

            {onNavigateToPlanner && (
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateToPlanner}
                className="text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Study Planner</span>
              </Button>
            )}
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {profile.progress.totalHoursStudied} hrs
          </div>
          <div className="text-[11px] text-slate-500 font-medium">158 min / day average</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {profile.progress.currentStreakDays} Days
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Record: {profile.progress.longestStreakDays} days</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {profile.progress.averageAccuracyPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Across {profile.progress.totalQuizzesTaken} diagnostic quizzes</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Lessons Done</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {profile.progress.completedLessonsCount} Units
          </div>
          <div className="text-[11px] text-slate-500 font-medium">{profile.progress.xpPoints} Academic XP</div>
        </div>
      </div>

      {/* 3. Main Grid: Left Column (Subjects, Goals, Learning Style) & Right Column (Study Preferences, History, Saved) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Subjects, Goals, Learning Style */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enrolled Subjects Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Enrolled Academic Subjects ({profile.enrolledSubjects.length})
                </h3>
              </div>
              {onNavigateToSubjects && (
                <button
                  onClick={onNavigateToSubjects}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Manage Curriculum →
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.enrolledSubjects.map((subj, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-2 text-xs font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{subj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Learning Style */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Cognitive Learning Style & AI Adaptations
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active: {profile.preferredLearningStyle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learningStyles.map((style) => {
                const isSelected = profile.preferredLearningStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleUpdateLearningStyle(style.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{style.icon}</span>
                        <span className="text-xs font-bold text-slate-900 font-display">
                          {style.label}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Learning Goals */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Target Academic Milestones ({profile.learningGoals.length})
                </h3>
              </div>
              <button
                onClick={() => setIsAddingGoal(!isAddingGoal)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            {/* Add Goal Input */}
            {isAddingGoal && (
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  placeholder="e.g. Master Linear Algebra matrix diagonalization"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Button type="submit" variant="primary" size="sm" className="text-xs cursor-pointer">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingGoal(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
              </form>
            )}

            <div className="space-y-2">
              {profile.learningGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{goal}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer text-xs"
                    title="Remove goal"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Study Preferences, Saved Content, History */}
        <div className="space-y-8">
          {/* Study Preferences Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Study Preferences
                </h3>
              </div>
              {onNavigateToSettings && (
                <button
                  onClick={onNavigateToSettings}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Edit study preferences"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Daily Target:</span>
                <strong className="text-slate-900 font-display">
                  {profile.studyPreferences.dailyTargetMinutes} minutes / day
                </strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Session Block:</span>
                <strong className="text-slate-900 font-display">
                  {profile.studyPreferences.preferredSessionDurationMinutes} min + {profile.studyPreferences.breakIntervalMinutes}m break
                </strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Prime Study Time:</span>
                <strong className="text-emerald-700 font-display">
                  {profile.studyPreferences.preferredStudyTime}
                </strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Focus Intensity:</span>
                <strong className="text-slate-900 font-display">
                  {profile.studyPreferences.focusIntensity}
                </strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">AI Tutoring Style:</span>
                <strong className="text-sky-700 font-display">
                  {profile.studyPreferences.aiAssistanceLevel}
                </strong>
              </div>
            </div>
          </div>

          {/* Saved Content Counters */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Saved Content Vault
                </h3>
              </div>
              {onNavigateToNotes && (
                <button
                  onClick={onNavigateToNotes}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  View All →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] uppercase font-bold">Notes</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">
                  {profile.savedContent.notesCount}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] uppercase font-bold">Decks</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">
                  {profile.savedContent.flashcardDecksCount}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-[10px] uppercase font-bold">PDFs & Docs</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">
                  {profile.savedContent.resourcesCount}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[10px] uppercase font-bold">Lessons</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">
                  {profile.savedContent.bookmarkedLessonsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Study History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Recent Study Activity
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {profile.studyHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {item.activityType} · {item.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 font-display pt-0.5">
                    {item.activityTitle}
                  </h5>

                  {item.notesSummary && (
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.notesSummary}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Duration: {item.durationMinutes} min</span>
                    {item.scorePercentage !== undefined && (
                      <span className="font-semibold text-emerald-700 font-mono">
                        Score: {item.scorePercentage}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

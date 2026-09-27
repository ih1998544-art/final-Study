import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Bot,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Layers,
  Search,
  Sliders,
  Bell,
  Trash2,
  Share2,
  Download,
  Flame,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input, Textarea, SearchInput } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Dropdown } from '../ui/Dropdown';
import { Tabs } from '../ui/Tabs';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { Skeleton, CardSkeleton, TableSkeleton } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';

export const FoundationShowcase: React.FC<{
  onExploreAI: () => void;
  onExploreSubjects: () => void;
}> = ({ onExploreAI, onExploreSubjects }) => {
  const { showToast } = useToast();

  // Interactive component states
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [demoInput, setDemoInput] = useState('Quantum Mechanics & Wave Functions');
  const [progressVal, setProgressVal] = useState(68);
  const [simulateError, setSimulateError] = useState(false);
  const [loadingSimulation, setLoadingSimulation] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Step 1 Foundation Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              STEP 1 Completed — Design System & Architectural Foundation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Study Zone Design System & Component Library
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engineered according to the $70k+ EdTech specification. Features a unified 60-30-10 color hierarchy with refined emerald green brand accents, zero-pill metadata discipline, single-elevation cards, high-contrast accessible inputs, and full responsive layout controls.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoadingSimulation(true);
                setTimeout(() => setLoadingSimulation(false), 1500);
              }}
            >
              Test Loading States
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Sliders className="w-3.5 h-3.5" />}
            >
              Test Modal Component
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Overview Card (Master Spec Preview) */}
      <div className="bg-linear-to-b from-emerald-50/50 via-white to-white rounded-2xl border border-emerald-100/80 p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="font-semibold text-emerald-600">STUDY ZONE PLATFORM</span>
          <span aria-hidden="true">·</span>
          <span>Learn Smarter · Study Better · Go Further</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display max-w-3xl mx-auto text-balance leading-tight">
          Your Entire Study Life, <br className="hidden sm:block" />
          <span className="text-emerald-600">Powered by AI.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Learn any subject, understand difficult concepts, practice intelligently, and prepare for exams with your personal AI study partner.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onExploreSubjects}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Learning Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onExploreAI}
            leftIcon={<Bot className="w-4 h-4 text-emerald-600" />}
          >
            Meet Study Zone AI
          </Button>
        </div>

        {/* High-end interactive AI dashboard preview mockup */}
        <div className="mt-10 max-w-3xl mx-auto bg-white rounded-xl border border-slate-200/90 shadow-md p-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Study Zone AI Agent</span>
              <span>·</span>
              <span>Online & Ready</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">Context: General Sciences</span>
          </div>
          <div className="py-4 space-y-3">
            <div className="bg-slate-50 rounded-lg p-3.5 text-xs text-slate-700 flex items-start gap-3">
              <Bot className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-900">AI Tutor:</span>
                <p>Welcome to Study Zone! What concept or subject are we mastering today? I can explain theories, solve numerical problems, create practice quizzes, or build an adaptive exam revision plan.</p>
              </div>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Input
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Ask anything (e.g. Explain Newton's laws with real-world examples)..."
              className="text-xs"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                showToast({
                  type: 'info',
                  title: 'AI Workspace Ready',
                  message: `Subject query primed: "${demoInput}". Full backend ready in Step 2.`,
                });
              }}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Ask AI
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Showcase */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Foundation Component Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live testing suite verifying all 22 required architectural elements
            </p>
          </div>

          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'buttons_inputs', label: 'Inputs & Buttons' },
              { id: 'feedback_states', label: 'Feedback & Modals' },
              { id: 'cards_progress', label: 'Cards & Metrics' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="brand">Architecture</Badge>
                  <span className="text-xs text-slate-400 font-mono">01 - 07</span>
                </div>
                <CardTitle className="mt-2">Design System Tokens</CardTitle>
                <CardDescription>
                  Strict 60-30-10 color palette, Plus Jakarta Sans & Cabinet Grotesk typography, and fluid responsive grid.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Canvas (60%):</span>
                    <span className="font-mono text-slate-900">#F8FAFC (Slate 50)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Surfaces (30%):</span>
                    <span className="font-mono text-slate-900">#FFFFFF / #E2E8F0</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Brand Accent (10%):</span>
                    <span className="font-mono text-emerald-600 font-semibold">#059669 (Emerald)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-slate-500">Zero pill-slop compliant</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </CardFooter>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">Navigation</Badge>
                  <span className="text-xs text-slate-400 font-mono">20 - 22</span>
                </div>
                <CardTitle className="mt-2">Navigation System</CardTitle>
                <CardDescription>
                  Desktop collapsible sidebar, 3-zone top bar contract, and responsive thumb-friendly mobile navigation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Top navigation adheres to the exact Top Bar Contract: Zone 1 single wordmark, Zone 2 clean text links, Zone 3 primary actions.
                </p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">Breakpoints:</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Mobile (&lt;768px) · Tablet (768-1024px) · Desktop (1024px+)
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-slate-500">All handlers connected</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </CardFooter>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Interactive</Badge>
                  <span className="text-xs text-slate-400 font-mono">08 - 19</span>
                </div>
                <CardTitle className="mt-2">UI Component Suite</CardTitle>
                <CardDescription>
                  15+ production components: Buttons, Cards, Inputs, Modals, Dropdowns, Tabs, Badges, Toasts, Loaders, and Empty/Error handlers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      showToast({
                        type: 'success',
                        title: 'Success Notification',
                        message: 'Toast engine operating with auto-dismissal.',
                      })
                    }
                  >
                    Trigger Toast
                  </Button>
                  <Dropdown
                    trigger={
                      <Button size="sm" variant="secondary">
                        Action Menu ▾
                      </Button>
                    }
                    items={[
                      {
                        id: 'save',
                        label: 'Save Notes',
                        icon: <Download className="w-3.5 h-3.5" />,
                        onClick: () =>
                          showToast({
                            type: 'info',
                            title: 'Saved',
                            message: 'Study notes saved to library.',
                          }),
                      },
                      {
                        id: 'share',
                        label: 'Share Workspace',
                        icon: <Share2 className="w-3.5 h-3.5" />,
                        onClick: () =>
                          showToast({
                            type: 'info',
                            title: 'Link Copied',
                            message: 'Workspace share link copied.',
                          }),
                        dividerAfter: true,
                      },
                      {
                        id: 'delete',
                        label: 'Clear History',
                        icon: <Trash2 className="w-3.5 h-3.5" />,
                        onClick: () =>
                          showToast({
                            type: 'warning',
                            title: 'Cleared',
                            message: 'Practice history cleared.',
                          }),
                        isDanger: true,
                      },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-slate-500">WCAG AA accessible</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </CardFooter>
            </Card>
          </div>
        )}

        {/* TAB 2: BUTTONS & INPUTS */}
        {activeTab === 'buttons_inputs' && (
          <div className="space-y-8">
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Button System (Item 8)</CardTitle>
                <CardDescription>
                  Standardized variants (Primary, Secondary, Outline, Ghost, Danger) and sizes (sm, md, lg) with icon integration and loading spinners.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Variants
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline Action</Button>
                    <Button variant="ghost">Ghost Action</Button>
                    <Button variant="danger">Destructive Action</Button>
                    <Button variant="primary" isLoading>
                      Saving Lesson
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Sizes & Icons
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                      Small Button
                    </Button>
                    <Button size="md" leftIcon={<Bot className="w-4 h-4" />}>
                      Medium Default
                    </Button>
                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Large Hero CTA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inputs Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Form & Input Controls (Item 10)</CardTitle>
                <CardDescription>
                  Text fields, Search inputs with clear actions, Textareas with helper copy and validation states.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Subject Title"
                  placeholder="e.g. Organic Chemistry"
                  helperText="Enter any academic or custom subject"
                />

                <SearchInput
                  label="Catalog Search"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal('')}
                  placeholder="Search topics, MCQs, or lecture summaries..."
                />

                <Input
                  label="Validated Field"
                  defaultValue="InvalidInput@"
                  error="Please enter a valid academic email address"
                />

                <Input
                  label="Disabled Field"
                  disabled
                  defaultValue="Pro Plan Feature (Locked)"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="AI Study Prompt"
                    placeholder="Describe what you want Study Zone to create (e.g. generate a 10-question MCQ test on Cell Mitosis)..."
                    helperText="Study Zone AI supports explanation, problem solving, flashcard generation, and study plans."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: FEEDBACK, MODALS & TOASTS */}
        {activeTab === 'feedback_states' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Dialogs (Items 11, 16)</CardTitle>
                <CardDescription>
                  Toast notifications (Success, Info, Warning, Error) and fully accessible modal dialogs with keyboard escape listeners.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Trigger Toast Notifications
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        showToast({
                          type: 'success',
                          title: 'Lesson Completed',
                          message: 'You earned +50 XP and extended your streak!',
                        })
                      }
                    >
                      Success Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        showToast({
                          type: 'info',
                          title: 'Study Reminder',
                          message: 'Mathematics practice scheduled in 30 minutes.',
                        })
                      }
                    >
                      Info Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        showToast({
                          type: 'warning',
                          title: 'Quiz Incomplete',
                          message: 'You have 3 unattempted questions in Mechanics.',
                        })
                      }
                    >
                      Warning Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        showToast({
                          type: 'error',
                          title: 'Connection Issue',
                          message: 'Unable to reach the study service. Please retry.',
                        })
                      }
                    >
                      Error Toast
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Modal Dialog
                  </h4>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Study Settings Modal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error & Empty States */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Empty & Error States (Items 18, 19)</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSimulateError(!simulateError)}
                  >
                    Toggle: {simulateError ? 'Showing Error' : 'Showing Empty'}
                  </Button>
                </div>
                <CardDescription>
                  Pre-designed empty states with thoughtful microcopy and error states with active retry handlers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {simulateError ? (
                  <ErrorState
                    title="Could not load practice quizzes"
                    message="The test engine encountered a temporary timeout. Check your network or retry."
                    onRetry={() => {
                      setSimulateError(false);
                      showToast({
                        type: 'success',
                        title: 'Reloaded',
                        message: 'Practice data restored successfully.',
                      });
                    }}
                  />
                ) : (
                  <EmptyState
                    title="No study activity yet"
                    description="You have not started any lessons or quizzes today. Select a subject to kick off your streak."
                    actionLabel="Browse Subjects"
                    onAction={onExploreSubjects}
                    secondaryActionLabel="Open AI Tutor"
                    onSecondaryAction={onExploreAI}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: CARDS, PROGRESS & SKELETON LOADERS */}
        {activeTab === 'cards_progress' && (
          <div className="space-y-8">
            {/* Progress Bars & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Bars & Semantic Badges (Items 14, 15)</CardTitle>
                <CardDescription>
                  Tabular numeric precision indicators and anti-slop metadata labels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Interactive Progress Slider
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressVal}
                      onChange={(e) => setProgressVal(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  <ProgressBar
                    value={progressVal}
                    label="Physics — Mechanics Mastery"
                    size="md"
                    variant="brand"
                  />
                  <ProgressBar
                    value={92}
                    label="Calculus — Derivatives Quiz Accuracy"
                    size="sm"
                    variant="success"
                  />
                  <ProgressBar
                    value={42}
                    label="Database Systems — Weak Topic Review"
                    size="sm"
                    variant="warning"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Metadata & Badges (Zero-Pill Discipline)
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge variant="unboxed" dot>
                      Computer Science · 12 Chapters · 45 min
                    </Badge>
                    <Badge variant="brand" dot>
                      AI Recommended
                    </Badge>
                    <Badge variant="success" dot>
                      Mastered
                    </Badge>
                    <Badge variant="warning" dot>
                      Needs Revision
                    </Badge>
                    <Badge variant="danger" dot>
                      Exam Due Tomorrow
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading Skeletons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Skeleton Loaders (Item 17)</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLoadingSimulation(!loadingSimulation)}
                  >
                    {loadingSimulation ? 'Show Mock Content' : 'Simulate Skeletons'}
                  </Button>
                </div>
                <CardDescription>
                  Layout-exact skeleton placeholders that prevent layout jitter during data fetch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSimulation ? (
                  <div className="space-y-4">
                    <TableSkeleton rows={3} />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-xl border border-slate-200/80 p-4">
                    {[
                      { name: 'Linear Algebra', progress: 85, status: 'Mastered' },
                      { name: 'Data Structures & Algorithms', progress: 62, status: 'In Progress' },
                      { name: 'Organic Chemistry', progress: 34, status: 'Needs Practice' },
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">{row.name}</span>
                        </div>
                        <div className="w-36">
                          <ProgressBar value={row.progress} size="sm" showPercentage />
                        </div>
                        <Badge
                          variant={
                            row.status === 'Mastered'
                              ? 'success'
                              : row.status === 'Needs Practice'
                              ? 'warning'
                              : 'brand'
                          }
                          size="sm"
                        >
                          {row.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Study Preference Configuration"
        description="Customize your learning pace, active subjects, and daily study target."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                showToast({
                  type: 'success',
                  title: 'Preferences Saved',
                  message: 'Your study goals and target exam date updated.',
                });
              }}
            >
              Save Preferences
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Daily Study Goal (Minutes)"
            type="number"
            defaultValue={45}
            helperText="Recommended: 45 - 60 minutes for high retention"
          />
          <Input
            label="Primary Academic Level"
            defaultValue="Undergraduate (Computer Science & Engineering)"
          />
          <Textarea
            label="Exam Targets"
            defaultValue="Mid-term exam on October 15 (Calculus & Algorithms)"
          />
        </div>
      </Modal>
    </div>
  );
};

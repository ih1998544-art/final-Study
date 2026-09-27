import React, { useState } from 'react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { TopHeader } from './components/navigation/TopHeader';
import { MobileNav } from './components/navigation/MobileNav';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { FoundationShowcase } from './components/foundation/FoundationShowcase';
import { HomePage } from './components/home/HomePage';
import { SubjectsCatalogView } from './components/subjects/SubjectsCatalogView';
import { SubjectDetailView } from './components/subjects/SubjectDetailView';
import { AIWorkspace } from './components/ai/AIWorkspace';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { PracticeDashboard } from './components/practice/PracticeDashboard';
import { StudyToolsDashboard } from './components/studyTools/StudyToolsDashboard';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { ProgressAnalyticsView } from './components/analytics/ProgressAnalyticsView';
import { NotesAndResourcesHub } from './components/resources/NotesAndResourcesHub';
import { AuthModal } from './components/auth/AuthModal';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { PricingPage } from './components/pricing/PricingPage';
import { authService } from './services/authService';
import { UserProfile, AuthMode } from './types/auth';
import { INITIAL_SUBJECTS, generateCustomSubject } from './data/subjectsData';
import { NavigationTab, SubjectItem, Chapter } from './types';
import { StudyToolId } from './types/studyTools';
import { Button } from './components/ui/Button';
import { CreditCard } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getProfile());
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedStudyToolId, setSelectedStudyToolId] = useState<StudyToolId | null>(null);
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (profile: UserProfile, message: string) => {
    setCurrentUser(profile);
    showToast({
      type: 'success',
      title: 'Authenticated',
      message,
    });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of your session.',
    });
    setActiveTab('home');
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveTab('subjects');
  };

  const handleCreateCustomSubject = (title: string) => {
    const newSubject = generateCustomSubject(title);
    setSubjects((prev) => [newSubject, ...prev]);
    setSelectedSubjectId(newSubject.id);
    setActiveTab('subjects');
    showToast({
      type: 'success',
      title: 'Custom Subject Synthesized',
      message: `"${title}" has been structured into 3 chapters with lessons and quizzes!`,
    });

    // Sync to backend API
    fetch('/api/subjects/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category: 'STEM', academicLevel: 'College Core' }),
    }).catch(() => {});
  };

  const handleUpdateSubjectProgress = (
    subjectId: string,
    updatedChapters: Chapter[],
    newOverallProgress: number
  ) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            chapters: updatedChapters,
            overallProgress: newOverallProgress,
            lastStudied: 'Just now',
          };
        }
        return s;
      })
    );

    // Sync to backend API
    fetch(`/api/subjects/${subjectId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapters: updatedChapters, overallProgress: newOverallProgress }),
    }).catch(() => {});
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <TopHeader
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'subjects') {
            // keep current selected subject if set, or let user browse catalog
          } else {
            setSelectedSubjectId(null);
          }
          if (tab !== 'study_tools') {
            setSelectedStudyToolId(null);
          }
          setActiveTab(tab);
        }}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onLoginClick={() => handleOpenAuth('login')}
        onGetStartedClick={() => handleOpenAuth('signup')}
        userProfile={currentUser}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Layout Area: Desktop Sidebar + Viewport Content */}
      <div className="flex-1 flex w-full">
        {/* Desktop Collapsible Sidebar */}
        <DesktopSidebar
          activeTab={activeTab}
          onNavigate={(tab) => {
            if (tab !== 'subjects') setSelectedSubjectId(null);
            if (tab !== 'study_tools') setSelectedStudyToolId(null);
            setActiveTab(tab);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userStreakDays={7}
          userProfile={currentUser}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0">
          {activeTab === 'home' ? (
            <HomePage
              onNavigate={(tab) => {
                if (tab === 'subjects') {
                  setSelectedSubjectId(null);
                }
                if (tab !== 'study_tools') {
                  setSelectedStudyToolId(null);
                }
                setActiveTab(tab);
              }}
              onLaunchStudyTool={(toolId) => {
                setSelectedStudyToolId(toolId);
                setActiveTab('study_tools');
              }}
              onOpenAuth={handleOpenAuth}
              onSelectSubject={(subjName) => {
                const match = subjects.find(
                  (s) => s.name.toLowerCase() === subjName.toLowerCase()
                );
                if (match) {
                  setSelectedSubjectId(match.id);
                  setActiveTab('subjects');
                } else {
                  handleCreateCustomSubject(subjName);
                }
              }}
            />
          ) : activeTab === 'dashboard' ? (
            <StudentDashboard
              onNavigate={(tab) => {
                if (tab !== 'subjects') setSelectedSubjectId(null);
                setActiveTab(tab);
              }}
              onSelectSubject={(subjId) => {
                setSelectedSubjectId(subjId);
                setActiveTab('subjects');
              }}
              onOpenAITutorWithPrompt={(prompt, subjectName) => {
                setPendingAIPrompt(prompt);
                setActiveTab('ai_tutor');
                showToast({
                  type: 'info',
                  title: 'Connecting to AI Tutor',
                  message: `Launching session for ${subjectName || 'Study Zone AI'}...`,
                });
              }}
              subjects={subjects}
            />
          ) : activeTab === 'analytics' ? (
            <ProgressAnalyticsView
              onNavigateHome={() => setActiveTab('home')}
              onNavigateToSubjects={() => {
                setSelectedSubjectId(null);
                setActiveTab('subjects');
              }}
              onNavigateToPractice={() => setActiveTab('practice')}
              onNavigateToPlanner={() => setActiveTab('planner')}
              onNavigateToAITutor={(prompt) => {
                if (prompt) setPendingAIPrompt(prompt);
                setActiveTab('ai_tutor');
              }}
            />
          ) : activeTab === 'subjects' ? (
            selectedSubject ? (
              <SubjectDetailView
                subject={selectedSubject}
                onBack={() => setSelectedSubjectId(null)}
                onOpenAITutor={(query) => {
                  setPendingAIPrompt(query);
                  showToast({
                    type: 'info',
                    title: 'Connecting to AI Tutor',
                    message: query,
                  });
                  setActiveTab('ai_tutor');
                }}
                onUpdateSubjectProgress={handleUpdateSubjectProgress}
              />
            ) : (
              <SubjectsCatalogView
                subjects={subjects}
                onSelectSubject={handleSelectSubject}
                onCreateCustomSubject={handleCreateCustomSubject}
              />
            )
          ) : activeTab === 'ai_tutor' ? (
            <AIWorkspace
              subjects={subjects}
              initialSubjectId={selectedSubjectId}
              initialPrompt={pendingAIPrompt}
              onExploreSubjects={() => {
                setSelectedSubjectId(null);
                setActiveTab('subjects');
              }}
            />
          ) : activeTab === 'practice' ? (
            <PracticeDashboard
              subjects={subjects}
              initialSubjectId={selectedSubjectId}
              onOpenAITutor={(prompt, subjectName) => {
                setPendingAIPrompt(prompt);
                setActiveTab('ai_tutor');
                showToast({
                  type: 'info',
                  title: 'Connecting to AI Tutor',
                  message: `Analyzing practice test results for ${subjectName}...`,
                });
              }}
              onOpenLesson={(lessonTitle, subjectName) => {
                const targetSubject = subjects.find(
                  (s) => s.name.toLowerCase() === subjectName.toLowerCase()
                );
                if (targetSubject) {
                  setSelectedSubjectId(targetSubject.id);
                  setActiveTab('subjects');
                  showToast({
                    type: 'info',
                    title: 'Opening Lesson',
                    message: `Navigating to "${lessonTitle}" in ${targetSubject.name}...`,
                  });
                } else {
                  setActiveTab('subjects');
                }
              }}
            />
          ) : activeTab === 'study_tools' ? (
            <StudyToolsDashboard
              initialToolId={selectedStudyToolId}
              onNavigateHome={() => {
                setSelectedStudyToolId(null);
                setActiveTab('home');
              }}
              onNavigateToPractice={() => setActiveTab('practice')}
              onNavigateToSubjects={() => setActiveTab('subjects')}
            />
          ) : activeTab === 'planner' ? (
            <StudyPlannerView
              onNavigateToSubjects={() => {
                setSelectedSubjectId(null);
                setActiveTab('subjects');
              }}
              onNavigateToPractice={() => setActiveTab('practice')}
              onNavigateToAITutor={(prompt) => {
                if (prompt) setPendingAIPrompt(prompt);
                setActiveTab('ai_tutor');
              }}
            />
          ) : activeTab === 'resources' ? (
            <NotesAndResourcesHub
              onNavigateToStudyTools={() => setActiveTab('study_tools')}
              onNavigateToSubjects={() => {
                setSelectedSubjectId(null);
                setActiveTab('subjects');
              }}
              onNavigateToAITutor={(prompt) => {
                if (prompt) setPendingAIPrompt(prompt);
                setActiveTab('ai_tutor');
              }}
            />
          ) : activeTab === 'design_system' ? (
            <div className="pb-20 md:pb-12">
              <FoundationShowcase
                onExploreAI={() => setActiveTab('ai_tutor')}
                onExploreSubjects={() => {
                  setSelectedSubjectId(null);
                  setActiveTab('subjects');
                }}
              />
            </div>
          ) : activeTab === 'profile' ? (
            <ProfilePage
              onNavigateToSettings={() => setActiveTab('settings')}
              onNavigateToSubjects={() => {
                setSelectedSubjectId(null);
                setActiveTab('subjects');
              }}
              onNavigateToNotes={() => setActiveTab('resources')}
              onNavigateToPlanner={() => setActiveTab('planner')}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPage
              onLogout={handleLogout}
              onNavigateToProfile={() => setActiveTab('profile')}
            />
          ) : activeTab === 'pricing' ? (
            <PricingPage
              onNavigateHome={() => setActiveTab('home')}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          ) : (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 pb-20 md:pb-12">
              {/* Context header for active section */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                    Study Zone Ecosystem
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 font-display capitalize">
                    {String(activeTab).replace('_', ' ')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Integrated module connected to the Study Zone AI educational framework.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('design_system')}
                  >
                    View Design System
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('home')}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>

              {/* View Placeholder with Step Readiness */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 font-display">
                  Transparent Pricing & Scholarship Plans
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Study Zone is free for all core educational learning and practice. Check back for institution and tutor tiers.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedSubjectId(null);
                      setActiveTab('subjects');
                    }}
                  >
                    Explore Subjects System
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('home')}
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Navigation (Slide-out drawer + bottom navigation bar) */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLoginClick={() => handleOpenAuth('login')}
        onGetStartedClick={() => handleOpenAuth('signup')}
        userProfile={currentUser}
        onLogout={handleLogout}
      />

      {/* Complete Authentication & Recovery Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}


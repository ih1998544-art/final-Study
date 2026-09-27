import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  GraduationCap,
  Award,
  Zap,
  Calendar,
  Flame,
  Send,
  Plus,
  Trash2,
  Bookmark,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Layers,
  ArrowUp,
  X,
  AlertTriangle,
  RefreshCw,
  Clock,
  Check,
  PanelLeftClose,
  PanelLeft,
  BookOpen,
} from 'lucide-react';
import {
  AIChatSession,
  AIMessage,
  AIRole,
  AcademicLevel,
  DifficultyLevel,
  LearningMode,
  QuickActionType,
  SavedNote,
} from '../../types/ai';
import { SubjectItem } from '../../types';
import {
  AI_ROLES,
  LEARNING_MODES,
  ACADEMIC_LEVELS,
  DIFFICULTY_LEVELS,
  QUICK_ACTIONS,
  SUGGESTED_PROMPTS_BY_SUBJECT,
} from '../../data/aiConstants';
import { aiService } from '../../services/aiService';
import { Button } from '../ui/Button';
import { ChatMessageItem } from './ChatMessageItem';
import { AIEmptyState } from './AIEmptyState';
import { AISavedNotesModal } from './AISavedNotesModal';
import { useToast } from '../ui/Toast';

export interface AIWorkspaceProps {
  subjects: SubjectItem[];
  initialSubjectId?: string | null;
  initialPrompt?: string | null;
  onExploreSubjects?: () => void;
}

export const AIWorkspace: React.FC<AIWorkspaceProps> = ({
  subjects,
  initialSubjectId,
  initialPrompt,
  onExploreSubjects,
}) => {
  const { showToast } = useToast();

  // Find initial subject or default to Mathematics
  const defaultSubject =
    subjects.find((s) => s.id === initialSubjectId) ||
    subjects.find((s) => s.name === 'Mathematics') ||
    subjects[0];

  // Sessions state (with localStorage persistence)
  const [sessions, setSessions] = useState<AIChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('studyzone_ai_sessions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial session
    return [
      {
        id: 'session-default-1',
        title: `${defaultSubject.name} Concept Exploration`,
        subjectId: defaultSubject.id,
        subjectName: defaultSubject.name,
        role: 'tutor',
        academicLevel: 'undergraduate',
        difficulty: 'intermediate',
        activeMode: 'explain',
        messages: [],
        createdAt: 'Just now',
        updatedAt: 'Just now',
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-default-1');

  // Saved Notes state (with localStorage persistence)
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const saved = localStorage.getItem('studyzone_ai_saved_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'note-sample-1',
        title: 'Eigenvalues & Geometric Multiplicity',
        subjectName: 'Mathematics',
        mode: 'notes',
        content:
          'Core Theorem: If a matrix A has distinct eigenvalues, its eigenvectors are linearly independent. The geometric multiplicity cannot exceed the algebraic multiplicity.',
        timestamp: 'Yesterday',
        tags: ['LinearAlgebra', 'Eigenvectors', 'Theorems'],
      },
    ];
  });

  // Current session derived
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Session parameters (modifiable in workspace topbar)
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>(currentSession.subjectName);
  const [selectedRole, setSelectedRole] = useState<AIRole>(currentSession.role);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(currentSession.academicLevel);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(currentSession.difficulty);
  const [activeMode, setActiveMode] = useState<LearningMode>(currentSession.activeMode);

  // Chat input and flow state
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Synthesizing pedagogical model...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI Panels state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHistorySearchOpen, setIsHistorySearchOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [isSavedNotesModalOpen, setIsSavedNotesModalOpen] = useState(false);
  const [isParamsDropdownOpen, setIsParamsDropdownOpen] = useState(false);

  // Auto-scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when active session changes
  useEffect(() => {
    if (currentSession) {
      setSelectedSubjectName(currentSession.subjectName);
      setSelectedRole(currentSession.role);
      setAcademicLevel(currentSession.academicLevel);
      setDifficulty(currentSession.difficulty);
      setActiveMode(currentSession.activeMode);
      setErrorMessage(null);
    }
  }, [activeSessionId]);

  // Handle incoming initial prompt if redirected from a lesson or topic
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setPromptInput(initialPrompt.trim());
    }
  }, [initialPrompt]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem('studyzone_ai_sessions', JSON.stringify(sessions));
    } catch {
      // storage full or disabled
    }
  }, [sessions]);

  // Persist saved notes
  useEffect(() => {
    try {
      localStorage.setItem('studyzone_ai_saved_notes', JSON.stringify(savedNotes));
    } catch {
      // storage full or disabled
    }
  }, [savedNotes]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  // Handle New Chat creation
  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: AIChatSession = {
      id: newSessionId,
      title: `New ${selectedSubjectName} Chat`,
      subjectId: subjects.find((s) => s.name === selectedSubjectName)?.id || 'custom',
      subjectName: selectedSubjectName,
      role: selectedRole,
      academicLevel: academicLevel,
      difficulty: difficulty,
      activeMode: activeMode,
      messages: [],
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setErrorMessage(null);
    setPromptInput('');
    if (textareaRef.current) textareaRef.current.focus();

    showToast({
      type: 'info',
      title: 'New Chat Initialized',
      message: `Fresh session ready for ${selectedSubjectName} (${AI_ROLES[selectedRole].name}).`,
    });
  };

  // Handle Delete Session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Don't leave empty: create a new one
      const fresh: AIChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Study Session',
        subjectId: defaultSubject.id,
        subjectName: defaultSubject.name,
        role: 'tutor',
        academicLevel: 'undergraduate',
        difficulty: 'intermediate',
        activeMode: 'explain',
        messages: [],
        createdAt: 'Just now',
        updatedAt: 'Just now',
      };
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setActiveSessionId(remaining[0].id);
    }

    showToast({
      type: 'info',
      title: 'Chat Session Removed',
      message: 'Session removed from your history.',
    });
  };

  // Send Prompt to AI
  const handleSendMessage = async (customPrompt?: string, overrideMode?: LearningMode) => {
    const textToSend = (customPrompt || promptInput).trim();
    if (!textToSend || isLoading) return;

    const usedMode = overrideMode || activeMode;
    const userMsgId = `msg-user-${Date.now()}`;
    const assistantMsgId = `msg-ai-${Date.now() + 1}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: AIMessage = {
      id: userMsgId,
      sender: 'user',
      content: textToSend,
      timestamp: nowTime,
      metadata: {
        mode: usedMode,
        role: selectedRole,
        subjectName: selectedSubjectName,
        academicLevel,
        difficulty,
      },
    };

    // Update active session title if it's the first message
    const isFirstMessage = currentSession.messages.length === 0;
    const newTitle = isFirstMessage
      ? textToSend.length > 36
        ? textToSend.slice(0, 36) + '...'
        : textToSend
      : currentSession.title;

    // Append user message immediately
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          return {
            ...s,
            title: newTitle,
            role: selectedRole,
            subjectName: selectedSubjectName,
            activeMode: usedMode,
            messages: [...s.messages, userMessage],
            updatedAt: 'Just now',
          };
        }
        return s;
      })
    );

    setPromptInput('');
    setIsLoading(true);
    setErrorMessage(null);

    // Multi-stage loading indicators for realism
    setLoadingStage('Analyzing academic level & domain taxonomy...');
    const t1 = setTimeout(() => {
      setLoadingStage('Synthesizing pedagogical guidance...');
    }, 450);

    try {
      const response = await aiService.generateResponse({
        prompt: textToSend,
        role: selectedRole,
        mode: usedMode,
        subjectName: selectedSubjectName,
        academicLevel,
        difficulty,
        conversationHistory: currentSession.messages.map((m) => ({
          sender: m.sender,
          content: m.content,
        })),
      });

      const assistantMessage: AIMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          mode: usedMode,
          role: selectedRole,
          subjectName: selectedSubjectName,
          academicLevel,
          difficulty,
          codeSnippet: response.codeSnippet,
          formula: response.formula,
          quiz: response.quiz,
          flashcards: response.flashcards,
          studyPlan: response.studyPlan,
          cornellNotes: response.cornellNotes,
          suggestedFollowups: response.suggestedFollowups,
          isSaved: false,
        },
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === currentSession.id) {
            return {
              ...s,
              messages: [...s.messages, assistantMessage],
              updatedAt: 'Just now',
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Study Zone AI experienced a temporary interruption synthesizing your response. Please click retry.'
      );
    } finally {
      clearTimeout(t1);
      setIsLoading(false);
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    const messages = currentSession.messages;
    if (messages.length === 0) return;

    // Find last user message
    let lastUserPrompt = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserPrompt = messages[i].content;
        break;
      }
    }

    if (!lastUserPrompt) return;

    // Remove the trailing assistant message if present
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          const msgs = [...s.messages];
          if (msgs[msgs.length - 1]?.sender === 'assistant') {
            msgs.pop();
          }
          return { ...s, messages: msgs };
        }
        return s;
      })
    );

    handleSendMessage(lastUserPrompt);
  };

  // Copy Message Handler
  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'success',
      title: 'Response Copied',
      message: 'Copied to clipboard formatted as Markdown.',
    });
  };

  // Save Response / Bookmark to Saved Notes
  const handleSaveResponse = (msg: AIMessage) => {
    const isAlreadySaved = msg.metadata?.isSaved;

    if (isAlreadySaved) {
      // Unsave
      setSavedNotes((prev) => prev.filter((n) => n.id !== msg.metadata?.savedNoteId));
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === currentSession.id) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msg.id
                  ? { ...m, metadata: { ...m.metadata!, isSaved: false, savedNoteId: undefined } }
                  : m
              ),
            };
          }
          return s;
        })
      );
      showToast({
        type: 'info',
        title: 'Removed from Saved Notes',
        message: 'Note bookmark removed.',
      });
      return;
    }

    // Save
    const noteId = `note-${Date.now()}`;
    const newNote: SavedNote = {
      id: noteId,
      title: `${selectedSubjectName} (${msg.metadata?.mode || 'Concept'})`,
      subjectName: selectedSubjectName,
      mode: msg.metadata?.mode || 'explain',
      content: msg.content,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: [selectedSubjectName, msg.metadata?.mode || 'StudyZone', selectedRole],
    };

    setSavedNotes((prev) => [newNote, ...prev]);

    // Mark message as saved
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === msg.id
                ? { ...m, metadata: { ...m.metadata!, isSaved: true, savedNoteId: noteId } }
                : m
            ),
          };
        }
        return s;
      })
    );

    showToast({
      type: 'success',
      title: 'Saved to Notebook',
      message: 'This response has been archived in your Saved Notes.',
    });
  };

  // Delete note from modal
  const handleDeleteSavedNote = (noteId: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast({
      type: 'info',
      title: 'Note Deleted',
      message: 'Saved study note was removed.',
    });
  };

  // Quick Action selection from empty state or top actions
  const handleSelectQuickAction = (actionType: QuickActionType) => {
    const actionConfig = QUICK_ACTIONS.find((a) => a.type === actionType);
    if (!actionConfig) return;

    setActiveMode(actionConfig.defaultMode);
    handleSendMessage(actionConfig.defaultPrompt, actionConfig.defaultMode);
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filtered session history
  const filteredSessions = sessions.filter((s) => {
    if (!historySearchQuery) return true;
    const q = historySearchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.subjectName.toLowerCase().includes(q);
  });

  // Dynamic suggested prompts for current subject
  const currentSuggestedPrompts =
    SUGGESTED_PROMPTS_BY_SUBJECT[selectedSubjectName] || [
      `Explain the fundamental laws of ${selectedSubjectName} from first principles`,
      `Create a 4-question diagnostic quiz on ${selectedSubjectName}`,
      `Solve a challenging problem step-by-step in ${selectedSubjectName}`,
      `Make Cornell notes for ${selectedSubjectName} midterm review`,
    ];

  const currentRoleMeta = AI_ROLES[selectedRole] || AI_ROLES.tutor;
  const currentModeMeta = LEARNING_MODES.find((m) => m.id === activeMode) || LEARNING_MODES[0];

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-100 overflow-hidden relative">
      {/* ========================================================
          LEFT SIDEBAR: New Chat, History, Saved Notes, Subjects
      ======================================================== */}
      <aside
        className={`bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 z-20 shrink-0 ${
          isSidebarOpen ? 'w-72 lg:w-80' : 'w-0 -translate-x-full lg:w-0 overflow-hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Study Zone AI
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Socratic Engine
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: New Chat & Saved Notes */}
        <div className="p-3.5 space-y-2 border-b border-slate-100">
          <Button
            variant="primary"
            size="sm"
            onClick={handleNewChat}
            className="w-full justify-center shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Chat
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsSavedNotesModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-medium text-slate-700 hover:text-emerald-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved ({savedNotes.length})</span>
            </button>

            {onExploreSubjects && (
              <button
                type="button"
                onClick={onExploreSubjects}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-medium text-slate-700 hover:text-emerald-800 transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Subjects</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat History Search & Filter */}
        <div className="px-3 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Recent Sessions ({sessions.length})
          </span>
          <button
            type="button"
            onClick={() => setIsHistorySearchOpen(!isHistorySearchOpen)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
            title="Search history"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {isHistorySearchOpen && (
          <div className="px-3 py-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter sessions..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        )}

        {/* Sessions History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching conversations found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const msgCount = session.messages.length;

              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group relative p-2.5 rounded-xl cursor-pointer text-xs transition-all flex items-start justify-between gap-2 ${
                    isActive
                      ? 'bg-emerald-50/80 border border-emerald-200/90 text-slate-900 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-semibold text-slate-900 truncate block">
                        {session.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="text-emerald-700 font-medium">
                        {session.subjectName}
                      </span>
                      <span>·</span>
                      <span>{msgCount} {msgCount === 1 ? 'msg' : 'msgs'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-white transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer with Active Persona Info */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>Model: <strong>Study Zone Pro v2.4</strong></span>
            <span className="text-emerald-600 font-semibold">100% Free Tier</span>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN WORKSPACE AREA
      ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Workspace Top Toolbar: Subject, Persona, Level, Mode */}
        <header className="bg-white border-b border-slate-200/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
          {/* Left Zone: Sidebar toggle + Subject & Role Badges */}
          <div className="flex items-center gap-2.5 min-w-0">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                title="Open sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}

            {/* Subject Selector Dropdown */}
            <div className="relative">
              <select
                aria-label="Select Subject"
                value={selectedSubjectName}
                onChange={(e) => setSelectedSubjectName(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold font-display rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* AI Persona Selector Dropdown */}
            <div className="relative hidden sm:block">
              <select
                aria-label="Select AI Persona"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AIRole)}
                className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer outline-none focus:border-emerald-600"
              >
                {Object.values(AI_ROLES).map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Zone: Academic Level, Difficulty, Mode, Settings */}
          <div className="flex items-center gap-2">
            {/* Academic Level Selector */}
            <div className="relative hidden md:block">
              <select
                aria-label="Select Academic Level"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 pr-6 appearance-none cursor-pointer outline-none hover:border-slate-300"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Difficulty Selector */}
            <div className="relative hidden lg:block">
              <select
                aria-label="Select Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 pr-6 appearance-none cursor-pointer outline-none hover:border-slate-300"
              >
                {DIFFICULTY_LEVELS.map((dif) => (
                  <option key={dif.id} value={dif.id}>
                    {dif.label} Difficulty
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear / New Chat shortcut */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="text-xs h-8"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </header>

        {/* 12 Learning Modes Horizontal Selector Bar */}
        <div className="bg-white border-b border-slate-200/80 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Mode:
          </span>
          {LEARNING_MODES.map((mode) => {
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Stream / Empty State */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {currentSession.messages.length === 0 ? (
            <AIEmptyState
              currentSubject={selectedSubjectName}
              selectedRole={selectedRole}
              onSelectRole={(r) => setSelectedRole(r)}
              onSelectQuickAction={handleSelectQuickAction}
              onSelectPrompt={(p, m) => handleSendMessage(p, m)}
              suggestedPrompts={currentSuggestedPrompts}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {currentSession.messages.map((msg, idx) => (
                <ChatMessageItem
                  key={msg.id || idx}
                  message={msg}
                  onCopy={handleCopyResponse}
                  onSave={handleSaveResponse}
                  onRegenerate={handleRegenerate}
                  onSelectFollowup={(followup) => handleSendMessage(followup)}
                  isLastAssistantMessage={
                    msg.sender === 'assistant' &&
                    idx === currentSession.messages.length - 1
                  }
                />
              ))}

              {/* Loading State: Multi-stage thinking */}
              {isLoading && (
                <div className="flex items-start gap-3 my-5 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm border border-slate-200/90 p-5 shadow-xs space-y-3 max-w-lg w-full">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-semibold text-emerald-800 font-display">
                        {loadingStage}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-full" />
                      <div className="h-3 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 my-4">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold font-display">Generation Interrupted</h4>
                    <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRegenerate}
                        className="bg-rose-600 hover:bg-rose-700 border-rose-600 text-xs py-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Generation
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setErrorMessage(null)}
                        className="text-xs text-rose-700 hover:bg-rose-100 py-1"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Dynamic Suggested Prompts Bar (when conversation is active) */}
        {currentSession.messages.length > 0 && !isLoading && (
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              Try asking:
            </span>
            {currentSuggestedPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-800 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span className="truncate max-w-[220px]">{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Large AI Input Area */}
        <div className="bg-white border-t border-slate-200/90 p-4 sm:p-5 shadow-lg shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 bg-white transition-all shadow-xs">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentModeMeta.placeholderPrompt}
                className="w-full px-4 pt-3.5 pb-12 rounded-2xl outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none font-sans leading-relaxed"
              />

              {/* Bottom Input Controls Bar */}
              <div className="absolute left-3 right-3 bottom-2.5 flex items-center justify-between pointer-events-none">
                {/* Left indicators: Active mode + token counter */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {currentModeMeta.label} Mode
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {promptInput.length} characters
                  </span>
                </div>

                {/* Right controls: Clear + Send Button */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {promptInput.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPromptInput('')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={!promptInput.trim() || isLoading}
                    onClick={() => handleSendMessage()}
                    className={`h-9 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                      promptInput.trim() && !isLoading
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-bar helper text */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>
                Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Shift + Enter</kbd> for new line
              </span>
              <span className="hidden sm:inline">
                Study Zone AI · Real-time pedagogical Socratic reasoning
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Saved Notes Modal */}
      <AISavedNotesModal
        isOpen={isSavedNotesModalOpen}
        onClose={() => setIsSavedNotesModalOpen(false)}
        savedNotes={savedNotes}
        onDeleteNote={handleDeleteSavedNote}
        onSelectNote={(note) => {
          setIsSavedNotesModalOpen(false);
          handleSendMessage(`Explain this saved note further: "${note.content}"`);
        }}
      />
    </div>
  );
};

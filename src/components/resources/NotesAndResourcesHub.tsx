import React, { useState } from 'react';
import { NotesManager } from '../notes/NotesManager';
import { FlashcardsManager } from '../flashcards/FlashcardsManager';
import { AcademicResourcesManager } from './AcademicResourcesManager';
import { BookOpen, Layers, FileText, Sparkles, Plus, Bookmark } from 'lucide-react';
import { notesAndResourcesService } from '../../services/notesAndResourcesService';

interface NotesAndResourcesHubProps {
  initialTab?: 'notes' | 'flashcards' | 'resources';
  onNavigateToStudyTools?: () => void;
  onNavigateToSubjects?: () => void;
  onNavigateToAITutor?: (prompt?: string) => void;
}

export const NotesAndResourcesHub: React.FC<NotesAndResourcesHubProps> = ({
  initialTab = 'notes',
  onNavigateToStudyTools,
  onNavigateToSubjects,
  onNavigateToAITutor,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'resources'>(initialTab);

  const notesCount = notesAndResourcesService.getNotes().length;
  const decksCount = notesAndResourcesService.getDecks().length;
  const resourcesCount = notesAndResourcesService.getResources().length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24 md:pb-16">
      {/* 1. Hub Header Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 border border-slate-800 shadow-lg overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Academic Knowledge Vault · Notes, Decks & Library</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display text-white">
              Notes, Flashcards & Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Your centralized workspace for Cornell study notes, spaced-repetition flashcards, curriculum PDFs, and saved AI research syntheses.
            </p>
          </div>

          {/* Quick Stats Pill Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              {notesCount} Structured Notes
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              {decksCount} Active Flashcard Decks
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              {resourcesCount} Academic Materials & PDFs
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Navigation Tabs: Notes, Flashcards, Resources */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Notes ({notesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Flashcard Decks ({decksCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Academic Resources & PDFs ({resourcesCount})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'notes' && (
        <NotesManager onNavigateToStudyTools={onNavigateToStudyTools} />
      )}

      {activeTab === 'flashcards' && (
        <FlashcardsManager onNavigateToStudyTools={onNavigateToStudyTools} />
      )}

      {activeTab === 'resources' && (
        <AcademicResourcesManager
          onNavigateToSubjects={onNavigateToSubjects}
          onNavigateToAITutor={onNavigateToAITutor}
        />
      )}
    </div>
  );
};

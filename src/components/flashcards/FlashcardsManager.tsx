import React, { useState } from 'react';
import { FlashcardDeck } from '../../types/notesAndResources';
import { notesAndResourcesService } from '../../services/notesAndResourcesService';
import { DeckCreatorModal } from './DeckCreatorModal';
import { CardEditorModal } from './CardEditorModal';
import { FlashcardReviewModal } from './FlashcardReviewModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Layers,
  Plus,
  Play,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  BookOpen,
  Award,
} from 'lucide-react';

interface FlashcardsManagerProps {
  onNavigateToStudyTools?: () => void;
}

export const FlashcardsManager: React.FC<FlashcardsManagerProps> = ({ onNavigateToStudyTools }) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => notesAndResourcesService.getDecks());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [addingCardToDeck, setAddingCardToDeck] = useState<FlashcardDeck | null>(null);
  const [reviewingDeck, setReviewingDeck] = useState<FlashcardDeck | null>(null);
  const { showToast } = useToast();

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Economics'];

  const filteredDecks = decks.filter((deck) => {
    const matchesSubject = selectedSubject === 'all' || deck.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCreateDeck = (data: { title: string; subject: string; description: string; badgeColor?: string }) => {
    const newDeck = notesAndResourcesService.createDeck(data);
    setDecks(notesAndResourcesService.getDecks());
    showToast({
      type: 'success',
      title: 'Deck Created',
      message: `"${newDeck.title}" added to your study library.`,
    });
  };

  const handleAddCard = (cardData: { front: string; back: string; hint?: string }) => {
    if (!addingCardToDeck) return;
    notesAndResourcesService.addCardToDeck(addingCardToDeck.id, cardData);
    setDecks(notesAndResourcesService.getDecks());
    showToast({
      type: 'success',
      title: 'Card Added',
      message: `Added new card to "${addingCardToDeck.title}".`,
    });
  };

  const handleUpdateCardStatus = (deckId: string, cardId: string, status: 'known' | 'difficult') => {
    notesAndResourcesService.updateCardStatus(deckId, cardId, status);
    setDecks(notesAndResourcesService.getDecks());
  };

  const handleDeleteDeck = (deckId: string, title: string) => {
    if (confirm(`Are you sure you want to delete deck "${title}"?`)) {
      notesAndResourcesService.deleteDeck(deckId);
      setDecks(notesAndResourcesService.getDecks());
      showToast({
        type: 'info',
        title: 'Deck Deleted',
        message: `"${title}" has been deleted.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks by subject, title or theorem..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToStudyTools && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToStudyTools}
              className="text-xs h-9 gap-1.5 cursor-pointer bg-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Flashcard Generator</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDeckModalOpen(true)}
            className="text-xs h-9 gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deck</span>
          </Button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === subj
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {subj === 'all' ? 'All Subjects' : subj}
          </button>
        ))}
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredDecks.map((deck) => {
          const total = deck.cards.length;
          const known = deck.knownCount || 0;
          const difficult = deck.difficultCount || 0;
          const masteryPercentage = total > 0 ? Math.round((known / total) * 100) : 0;

          return (
            <div
              key={deck.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-display">
                    {deck.subject}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteDeck(deck.id, deck.title)}
                    className="p-1 rounded text-slate-300 hover:text-rose-600 cursor-pointer transition-colors"
                    title="Delete deck"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {deck.description}
                  </p>
                </div>

                {/* Mastery Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Mastery Progress</span>
                    <span className="font-mono font-bold text-emerald-700">{masteryPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${masteryPercentage}%` }}
                      title={`${known} known cards`}
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${total > 0 ? (difficult / total) * 100 : 0}%` }}
                      title={`${difficult} difficult cards`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                    <span>{total} Total Cards</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-semibold">{known} Known</span>
                      <span>·</span>
                      <span className="text-amber-700 font-semibold">{difficult} Difficult</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingCardToDeck(deck)}
                  className="text-xs h-8 px-3 gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add Card</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setReviewingDeck(deck)}
                  disabled={deck.cards.length === 0}
                  className="text-xs h-8 px-4 gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Review Deck ({deck.cards.length})</span>
                </Button>
              </div>
            </div>
          );
        })}

        {filteredDecks.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-3">
            <Layers className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 font-display">No flashcard decks found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create a custom flashcard deck or generate decks automatically using the AI Flashcard Generator.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDeckModalOpen(true)}
              className="cursor-pointer"
            >
              Create New Deck
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <DeckCreatorModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        onCreateDeck={handleCreateDeck}
      />

      <CardEditorModal
        isOpen={Boolean(addingCardToDeck)}
        deckTitle={addingCardToDeck?.title || ''}
        onClose={() => setAddingCardToDeck(null)}
        onAddCard={handleAddCard}
      />

      <FlashcardReviewModal
        isOpen={Boolean(reviewingDeck)}
        deck={reviewingDeck}
        onClose={() => setReviewingDeck(null)}
        onUpdateCardStatus={handleUpdateCardStatus}
      />
    </div>
  );
};

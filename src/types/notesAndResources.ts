/**
 * Study Zone - Notes, Flashcards & Academic Resources Types
 */

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  category?: string;
  content: string;
  summary?: string;
  cues?: string[]; // Cornell note cues
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isAiGenerated: boolean;
  aiToolSource?: string; // e.g., 'AI Notes Generator', 'AI Summarizer', 'AI Tutor'
  isPinned?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  status: 'unseen' | 'known' | 'difficult';
  reviewCount: number;
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  description: string;
  cards: Flashcard[];
  createdAt: string;
  updatedAt: string;
  badgeColor?: string;
  totalCards: number;
  knownCount: number;
  difficultCount: number;
}

export type ResourceType = 'pdf' | 'saved_lesson' | 'saved_ai_response' | 'study_material' | 'important_link';

export interface AcademicResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  subject: string;
  description: string;
  dateAdded: string;
  fileSizeOrFormat?: string; // e.g. '2.4 MB PDF', 'Interactive Lesson', 'Web Resource'
  url?: string;
  tags: string[];
  isBookmarked?: boolean;
  previewContent?: string;
  externalLinkText?: string;
}

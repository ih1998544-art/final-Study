/**
 * Study Zone - Authentication & User Profile Management Service
 * Secure client-side authentication architecture with persistent state,
 * profile synchronization, study history tracking, and settings preferences.
 */

import { UserProfile, UserSettings, StudyHistoryEntry } from '../types/auth';

const PROFILE_STORAGE_KEY = 'sz_user_profile_v1';
const SETTINGS_STORAGE_KEY = 'sz_user_settings_v1';
const AUTH_TOKEN_KEY = 'sz_auth_token_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_849201',
  name: 'Jordan Diaz',
  email: 'jordan.diaz@stanford.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  academicLevel: 'Undergraduate (College)',
  universityOrSchool: 'Stanford University · Department of Computer Science & Mathematics',
  joinedDate: 'August 2026',
  enrolledSubjects: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Economics'],
  learningGoals: [
    'Score >92% on University Term Finals',
    'Eliminate Eigenvalues & Organic Chemistry weak topics',
    'Maintain daily active recall study streak',
    'Complete all 24 Computer Science syllabus chapters',
  ],
  preferredLearningStyle: 'Visual',
  studyPreferences: {
    dailyTargetMinutes: 120,
    preferredSessionDurationMinutes: 45,
    breakIntervalMinutes: 10,
    preferredStudyTime: 'Evening',
    focusIntensity: 'Balanced',
    aiAssistanceLevel: 'Socratic Questioning',
  },
  progress: {
    totalHoursStudied: 118.5,
    currentStreakDays: 7,
    longestStreakDays: 19,
    completedLessonsCount: 42,
    totalQuizzesTaken: 28,
    averageAccuracyPercentage: 88.4,
    scholarLevel: 'Senior Scholar (Level 4)',
    xpPoints: 3420,
  },
  studyHistory: [
    {
      id: 'hist-1',
      timestamp: 'Today · 10:30 AM',
      activityTitle: 'Mechanics: Rotational Dynamics Problem Set',
      activityType: 'Quiz',
      subject: 'Physics',
      durationMinutes: 30,
      scorePercentage: 92,
      notesSummary: 'Mastered parallel axis theorem problems with zero hints.',
    },
    {
      id: 'hist-2',
      timestamp: 'Yesterday · 4:15 PM',
      activityTitle: 'Linear Algebra: Eigenvalues & Diagonalization',
      activityType: 'AI Tutor',
      subject: 'Mathematics',
      durationMinutes: 45,
      scorePercentage: 84,
      notesSummary: 'Socratic inquiry on characteristic polynomial roots det(A - λI) = 0.',
    },
    {
      id: 'hist-3',
      timestamp: 'Sep 25 · 7:00 PM',
      activityTitle: 'Organic Chemistry: SN1 vs SN2 Mechanisms',
      activityType: 'Flashcards',
      subject: 'Chemistry',
      durationMinutes: 25,
      scorePercentage: 88,
      notesSummary: 'Reviewed 10 reaction pathway cards; flagged solvent polarities.',
    },
    {
      id: 'hist-4',
      timestamp: 'Sep 24 · 2:30 PM',
      activityTitle: 'Algorithms: Dynamic Programming Knapsack Derivation',
      activityType: 'Lesson',
      subject: 'Computer Science',
      durationMinutes: 50,
      scorePercentage: 96,
      notesSummary: 'Implemented bottom-up 2D tabulation matrix and memory compression.',
    },
    {
      id: 'hist-5',
      timestamp: 'Sep 23 · 8:15 PM',
      activityTitle: 'Macroeconomics: IS-LM Liquidity Trap Simulation',
      activityType: 'Practice Drill',
      subject: 'Economics',
      durationMinutes: 35,
      scorePercentage: 82,
      notesSummary: 'Monetary transmission breakdown at zero nominal lower bound.',
    },
  ],
  savedContent: {
    notesCount: 5,
    flashcardDecksCount: 4,
    resourcesCount: 12,
    bookmarkedLessonsCount: 8,
  },
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  account: {
    fullName: 'Jordan Diaz',
    email: 'jordan.diaz@stanford.edu',
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
  },
  learningPreferences: {
    dailyTargetMinutes: 120,
    preferredSessionDurationMinutes: 45,
    breakIntervalMinutes: 10,
    preferredStudyTime: 'Evening',
    focusIntensity: 'Balanced',
    aiAssistanceLevel: 'Socratic Questioning',
    autoSpacedRepetition: true,
    soundFeedbackEnabled: true,
    defaultCornellNotes: true,
  },
  notifications: {
    emailDailyDigest: true,
    dailyStudyReminder: true,
    reminderTime: '18:00',
    streakAlerts: true,
    quizMilestones: true,
    weeklyProgressDigest: true,
  },
  appearance: {
    theme: 'light',
    compactDensity: false,
    fontSize: 'normal',
    highContrastMode: false,
  },
};

class AuthService {
  // USER PROFILE
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_USER_PROFILE;
  }

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to storage', e);
    }
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
    };
    this.saveProfile(updated);
    return updated;
  }

  // SETTINGS
  getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_USER_SETTINGS;
  }

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }

  updateSettings(updates: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated: UserSettings = {
      ...current,
      ...updates,
    };
    this.saveSettings(updated);
    return updated;
  }

  // AUTHENTICATION
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      return Boolean(token);
    } catch {
      return true; // default logged-in experience for app demo
    }
  }

  login(email: string, _password: string, _rememberMe: boolean = true): { success: boolean; profile: UserProfile } {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid university or personal email address.');
    }

    // Set simulated session token
    const token = `sz_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Update profile email if different
    const profile = this.getProfile();
    if (email !== profile.email) {
      profile.email = email;
      this.saveProfile(profile);
    }

    return { success: true, profile };
  }

  signup(
    name: string,
    email: string,
    password: string,
    academicLevel: UserProfile['academicLevel']
  ): { success: boolean; profile: UserProfile } {
    if (!name.trim()) throw new Error('Name is required.');
    if (!email || !email.includes('@')) throw new Error('Valid email address is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const token = `sz_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    const newProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      academicLevel,
      joinedDate: 'September 2026',
    };

    this.saveProfile(newProfile);
    return { success: true, profile: newProfile };
  }

  forgotPassword(email: string): { success: boolean; message: string; mockResetCode: string } {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid registered email address.');
    }

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: `Password reset verification token sent to ${email}.`,
      mockResetCode: mockCode,
    };
  }

  resetPassword(email: string, code: string, newPassword: string): { success: boolean; message: string } {
    if (!code || code.length < 4) {
      throw new Error('Please provide a valid 6-digit verification code.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    return {
      success: true,
      message: `Your password for ${email} has been updated securely. You may now log in.`,
    };
  }

  logout(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  addStudyHistoryEntry(entry: Omit<StudyHistoryEntry, 'id' | 'timestamp'>): void {
    const profile = this.getProfile();
    const newEntry: StudyHistoryEntry = {
      ...entry,
      id: `hist_${Date.now()}`,
      timestamp: 'Just now',
    };

    profile.studyHistory.unshift(newEntry);
    if (profile.studyHistory.length > 20) {
      profile.studyHistory = profile.studyHistory.slice(0, 20);
    }
    profile.progress.totalHoursStudied = Number(
      (profile.progress.totalHoursStudied + entry.durationMinutes / 60).toFixed(1)
    );

    this.saveProfile(profile);
  }
}

export const authService = new AuthService();

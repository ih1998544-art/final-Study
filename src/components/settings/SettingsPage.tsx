import React, { useState } from 'react';
import { UserSettings, StudyPreferences } from '../../types/auth';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Settings,
  User,
  Bell,
  Palette,
  BrainCircuit,
  Lock,
  ShieldCheck,
  Clock,
  Sparkles,
  Save,
  RotateCcw,
  LogOut,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface SettingsPageProps {
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onLogout,
  onNavigateToProfile,
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => authService.getSettings());
  const [activeTab, setActiveTab] = useState<'account' | 'learning' | 'notifications' | 'appearance'>('account');

  // Account password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { showToast } = useToast();

  const handleSaveAll = () => {
    authService.saveSettings(settings);
    // Also sync account name and email back to profile
    authService.updateProfile({
      name: settings.account.fullName,
      email: settings.account.email,
      studyPreferences: {
        dailyTargetMinutes: settings.learningPreferences.dailyTargetMinutes,
        preferredSessionDurationMinutes: settings.learningPreferences.preferredSessionDurationMinutes,
        breakIntervalMinutes: settings.learningPreferences.breakIntervalMinutes,
        preferredStudyTime: settings.learningPreferences.preferredStudyTime,
        focusIntensity: settings.learningPreferences.focusIntensity,
        aiAssistanceLevel: settings.learningPreferences.aiAssistanceLevel,
      },
    });

    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences and account settings have been updated.',
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast({
        type: 'error',
        title: 'Password Too Short',
        message: 'New password must be at least 6 characters.',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast({
        type: 'error',
        title: 'Passwords Mismatch',
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
    showToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your account password has been updated securely.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24 md:pb-16">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Configuration & Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Settings & Workspace Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure learning velocity, AI assistance behaviors, notifications, and profile security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToProfile}
              className="text-xs h-9 gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>View Profile</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            className="text-xs h-9 gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </div>

      {/* 2. Settings Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'account', label: 'Account & Security', icon: User },
          { id: 'learning', label: 'Learning Preferences', icon: BrainCircuit },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'appearance', label: 'Appearance & UI', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SETTINGS TAB CONTENT */}

      {/* TAB 1: ACCOUNT SETTINGS */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={settings.account.fullName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      account: { ...settings.account, fullName: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      account: { ...settings.account, email: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Security & Credentials
                </h3>
                <p className="text-xs text-slate-500">
                  Update your authentication credentials and session security.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 mr-1" />
                <span>{isChangingPassword ? 'Cancel' : 'Change Password'}</span>
              </Button>
            </div>

            {/* Password Change Subform */}
            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button type="submit" variant="primary" size="sm" className="text-xs cursor-pointer">
                    Update Password
                  </Button>
                </div>
              </form>
            )}

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-xs text-slate-500">
                  Protect account sign-ins with an authenticator app.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.account.twoFactorEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    account: { ...settings.account, twoFactorEnabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-rose-900 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Signing out terminates your current active session on this device.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="bg-white text-rose-700 border-rose-300 hover:bg-rose-50 text-xs gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Session</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEARNING PREFERENCES */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-display pb-2 border-b border-slate-100">
              Study Velocity & Pacing Targets
            </h3>

            {/* Daily Target Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 font-display">
                  Daily Study Target
                </label>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {settings.learningPreferences.dailyTargetMinutes} minutes / day ({(settings.learningPreferences.dailyTargetMinutes / 60).toFixed(1)} hrs)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="360"
                step="15"
                value={settings.learningPreferences.dailyTargetMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    learningPreferences: {
                      ...settings.learningPreferences,
                      dailyTargetMinutes: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>30 min (Light)</span>
                <span>120 min (Standard)</span>
                <span>240 min (Intensive)</span>
                <span>360 min (Mastery)</span>
              </div>
            </div>

            {/* Session Block & Break Durations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display">
                  Preferred Pomodoro Session Block
                </label>
                <select
                  value={settings.learningPreferences.preferredSessionDurationMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learningPreferences: {
                        ...settings.learningPreferences,
                        preferredSessionDurationMinutes: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  <option value={25}>25 minutes (Standard Pomodoro)</option>
                  <option value={45}>45 minutes (University Lecture Block)</option>
                  <option value={60}>60 minutes (Deep Focus Hour)</option>
                  <option value={90}>90 minutes (Ultradian Focus Block)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display">
                  Break Interval
                </label>
                <select
                  value={settings.learningPreferences.breakIntervalMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learningPreferences: {
                        ...settings.learningPreferences,
                        breakIntervalMinutes: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes (Recommended)</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
            </div>

            {/* AI Tutoring Persona */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 font-display">
                AI Study Tutor Pedagogy Style
              </label>
              <select
                value={settings.learningPreferences.aiAssistanceLevel}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    learningPreferences: {
                      ...settings.learningPreferences,
                      aiAssistanceLevel: e.target.value as any,
                    },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="Socratic Questioning">
                  Socratic Questioning (Guides with probing questions; encourages independent proof)
                </option>
                <option value="Direct Step-by-Step">
                  Direct Step-by-Step (Clear analytical walkthroughs with formula derivations)
                </option>
                <option value="Conceptual Analogies">
                  Conceptual Analogies (Feynman method with real-world mental models)
                </option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Automatic Spaced Repetition Scheduling
                  </span>
                  <span className="text-xs text-slate-500">
                    Automatically inject weak quiz topics into upcoming study planner days.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.learningPreferences.autoSpacedRepetition}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learningPreferences: {
                        ...settings.learningPreferences,
                        autoSpacedRepetition: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Default to Cornell Note Format
                  </span>
                  <span className="text-xs text-slate-500">
                    Generate cue questions and executive summary boxes on all AI-synthesized notes.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.learningPreferences.defaultCornellNotes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learningPreferences: {
                        ...settings.learningPreferences,
                        defaultCornellNotes: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATION SETTINGS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display pb-2 border-b border-slate-100">
              Daily Reminders & Email Digests
            </h3>

            {/* Daily Reminder Time */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Daily Study Reminder Notification
                </span>
                <span className="text-xs text-slate-500">
                  Sends scheduled desktop prompt to maintain study streak.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        reminderTime: e.target.value,
                      },
                    })
                  }
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono"
                />

                <input
                  type="checkbox"
                  checked={settings.notifications.dailyStudyReminder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        dailyStudyReminder: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Streak Alerts */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Streak Protection Alerts
                </span>
                <span className="text-xs text-slate-500">
                  Get notified 2 hours before midnight if your daily study goal is incomplete.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.streakAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      streakAlerts: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </label>

            {/* Weekly Progress Digest */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Weekly Performance Digest Email
                </span>
                <span className="text-xs text-slate-500">
                  Sunday report featuring hours studied, quiz trajectory, and weak topics resolved.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.weeklyProgressDigest}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      weeklyProgressDigest: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* TAB 4: APPEARANCE SETTINGS */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-display pb-2 border-b border-slate-100">
              Workspace Appearance & Accessibility
            </h3>

            {/* Theme Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 font-display">
                Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light Studio' },
                  { id: 'dark', label: 'Dark Charcoal' },
                  { id: 'system', label: 'System Sync' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: t.id as any },
                      })
                    }
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      settings.appearance.theme === t.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Density & Font Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Compact Table Density
                  </span>
                  <span className="text-xs text-slate-500">
                    Reduces vertical padding across flashcard matrices and quiz banks.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.compactDensity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        compactDensity: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    High Contrast Accessibility
                  </span>
                  <span className="text-xs text-slate-500">
                    Enhances border visibility and color vibrancy for formula reading.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.highContrastMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        highContrastMode: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

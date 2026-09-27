import React, { useState, useEffect } from 'react';
import { AuthMode, AcademicLevel, UserProfile } from '../../types/auth';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess: (profile: UserProfile, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('Undergraduate (College)');
  const [resetCode, setResetCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mockSentCode, setMockSentCode] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setMockSentCode(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initialMode, isOpen, onClose]);

  if (!isOpen) return null;

  const academicLevels: AcademicLevel[] = [
    'Middle School',
    'High School (AP / IB)',
    'Undergraduate (College)',
    'Graduate / Master\'s',
    'Doctorate / Research',
    'Professional / Lifelong Learner',
  ];

  const handleGoogleLoginPlaceholder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        const { profile } = authService.login('jordan.diaz@stanford.edu', 'demo_scholar_session', true);
        showToast({
          type: 'info',
          title: 'Google OAuth SSO Configuration',
          message: 'Google Workspace Single Sign-On requires GOOGLE_CLIENT_ID configuration. Initialized verified scholar demo session.',
        });
        onSuccess(profile, 'Demo Scholar Session Initialized');
        onClose();
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { profile } = authService.login(email, password, rememberMe);
        setIsLoading(false);
        onSuccess(profile, `Welcome back, ${profile.name}!`);
        onClose();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }
        const { profile } = authService.signup(name, email, password, academicLevel);
        setIsLoading(false);
        onSuccess(profile, `Welcome to Study Zone, ${profile.name}!`);
        onClose();
      } else if (mode === 'forgot_password') {
        const res = authService.forgotPassword(email);
        setIsLoading(false);
        setMockSentCode(res.mockResetCode);
        setResetCode(res.mockResetCode); // auto-fill for frictionless UX
        setMode('reset_password');
        showToast({
          type: 'info',
          title: 'Reset Code Sent',
          message: `Verification code dispatched to ${email}.`,
        });
      } else if (mode === 'reset_password') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const res = authService.resetPassword(email, resetCode, password);
        setIsLoading(false);
        showToast({
          type: 'success',
          title: 'Password Reset',
          message: res.message,
        });
        setMode('login');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-display font-black text-lg shrink-0">
              S
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {mode === 'login' && 'Log In to Study Zone'}
                {mode === 'signup' && 'Create Your Scholar Account'}
                {mode === 'forgot_password' && 'Reset Your Password'}
                {mode === 'reset_password' && 'Enter New Password'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login' && 'Access your personalized AI tutor, study planner, and notes.'}
                {mode === 'signup' && 'Join thousands of students learning with AI.'}
                {mode === 'forgot_password' && 'Enter your registered email to receive a recovery code.'}
                {mode === 'reset_password' && 'Set a strong password for your account.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Google SSO Button (Login & Signup modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLoginPlaceholder}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer"
            >
              {/* Google 4-Color SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                or with university email
              </span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SIGNUP: Name */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Diaz"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* ALL MODES: Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* SIGNUP: Academic Level Selector */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Academic Level</span>
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {academicLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* RESET PASSWORD: Verification Code */}
          {mode === 'reset_password' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 font-display">
                  6-Digit Verification Code
                </label>
                {mockSentCode && (
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Code: {mockSentCode}
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 582910"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* PASSWORD (LOGIN, SIGNUP, RESET) */}
          {mode !== 'forgot_password' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 font-display">
                  {mode === 'reset_password' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('forgot_password');
                    }}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* CONFIRM PASSWORD (SIGNUP & RESET) */}
          {(mode === 'signup' || mode === 'reset_password') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* LOGIN: Remember Me */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full justify-center text-xs sm:text-sm gap-2 cursor-pointer shadow-xs"
          >
            <span>
              {mode === 'login' && (isLoading ? 'Logging In...' : 'Sign In')}
              {mode === 'signup' && (isLoading ? 'Creating Account...' : 'Create Account')}
              {mode === 'forgot_password' && (isLoading ? 'Sending...' : 'Send Recovery Code')}
              {mode === 'reset_password' && (isLoading ? 'Resetting...' : 'Update Password')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('signup');
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('login');
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Log in
              </button>
            </p>
          )}

          {(mode === 'forgot_password' || mode === 'reset_password') && (
            <p>
              Remembered your credentials?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('login');
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Back to Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

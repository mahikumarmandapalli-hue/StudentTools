import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGooglePopup,
  signInWithEmail,
  signUpWithEmail,
  updateUserName,
  signOutUser,
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  showToast: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  showToast,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGooglePopup();
      showToast('Signed in successfully with Google!');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        showToast('Account created! Welcome to StudentTools.');
      } else {
        await signInWithEmail(email, password);
        showToast('Signed in successfully!');
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMsg(msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateUserName(name.trim());
      showToast('Display name updated!');
    } catch {
      showToast('Could not update name.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    showToast('Signed out of StudentTools.');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl text-[var(--text)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] font-bold text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {currentUser ? (
          /* Profile Mode */
          <div>
            <div className="flex items-center gap-3 mb-5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center">
                  {(currentUser.displayName || currentUser.email || 'S')[0].toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">
                  {currentUser.displayName || 'Student User'}
                </h2>
                <p className="text-xs text-[var(--muted)]">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                  Firebase Sync Active
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted)]">
                  Edit Display Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={currentUser.displayName || ''}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-1">
                <p>• Your learning progress and completed topics sync automatically.</p>
                <p>• Bookmarked questions &amp; problems persist across sessions.</p>
                <p>• Cloud Workspace saves your calculations and resume drafts.</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
              <a
                href="#dashboard"
                onClick={onClose}
                className="text-xs font-bold text-indigo-500 hover:underline"
              >
                Go to Dashboard →
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Mode */
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black mb-1">
                {mode === 'signup' ? 'Create Student Account' : 'Welcome to StudentTools'}
              </h2>
              <p className="text-xs text-[var(--muted)]">
                {mode === 'signup'
                  ? 'Sign up to track progress, bookmark topics & sync across devices'
                  : 'Sign in to access your dashboard, saved topics & resume'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 mb-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--bg)] transition font-bold text-sm shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                or with email
              </span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--muted)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted)]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.edu"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted)]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 mt-2"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'signup'
                  ? 'Create Free Account'
                  : 'Sign In to StudentTools'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg('');
                    }}
                    className="font-bold text-indigo-500 hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg('');
                    }}
                    className="font-bold text-indigo-500 hover:underline"
                  >
                    Create Free Account
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

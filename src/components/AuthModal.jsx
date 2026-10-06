import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { signInUser, signUpUser, signInWithGoogle } from '../services/supabaseService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, theme }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpUser(email.trim(), password);
        setSuccessMsg('Account created! Please check your email to verify or sign in.');
      } else {
        const { user } = await signInUser(email.trim(), password);
        if (user) {
          onAuthSuccess(user);
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-in failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-md border rounded-[30px] shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#1C1721] border-[#322638] text-[#EDE6EE]'
            : 'bg-[#FAF8F5] border-[#E4DCD3] text-[#2E2330]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-[#2D2233]' : 'border-[#E8DFD5]'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#7F6C82] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold">
                {isSignUp ? 'Create DocuMind Account' : 'Welcome to DocuMind'}
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-[#9A8A9D]' : 'text-[#7A6A7D]'}`}>
                {isSignUp ? 'Sync your documents & chat history to cloud' : 'Sign in to access your saved documents'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'text-[#8C7B8E] hover:bg-[#2A2030] hover:text-white' : 'text-[#8C7B8E] hover:bg-[#EDE5DD] hover:text-[#2E2330]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            {successMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full border text-xs font-semibold shadow-xs transition-all ${
              isDark
                ? 'bg-[#241C2B] border-[#382B42] text-[#EDE6EE] hover:bg-[#2C2234]'
                : 'bg-white border-[#DDD4CB] text-[#2E2330] hover:bg-[#FAF8F5]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className={`absolute inset-0 flex items-center ${isDark ? 'border-t border-[#2D2233]' : 'border-t border-[#E8DFD5]'}`} />
          <span className={`relative px-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'bg-[#1C1721] text-[#7D6E80]' : 'bg-[#FAF8F5] text-[#9A8A9D]'}`}>
            or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#C4B7C7]' : 'text-[#4A3B4D]'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#7D6E80]' : 'text-[#9A8A9D]'}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#151118] border-[#34273E] text-[#EDE6EE] placeholder-[#7D6E80] focus:border-[#7F6C82]'
                    : 'bg-white border-[#DDD4CB] text-[#2E2330] placeholder-[#9D8E9F] focus:border-[#7F6C82]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#C4B7C7]' : 'text-[#4A3B4D]'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#7D6E80]' : 'text-[#9A8A9D]'}`} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#151118] border-[#34273E] text-[#EDE6EE] placeholder-[#7D6E80] focus:border-[#7F6C82]'
                    : 'bg-white border-[#DDD4CB] text-[#2E2330] placeholder-[#9D8E9F] focus:border-[#7F6C82]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#7F6C82] hover:bg-[#6D5A70] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" /> Create Free Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign in & Sign Up */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`text-xs ${isDark ? 'text-[#B8AAB9] hover:text-white' : 'text-[#6E5D70] hover:text-[#2E2330]'} transition-colors`}
          >
            {isSignUp ? (
              <>Already have an account? <strong className="underline font-semibold">Sign In</strong></>
            ) : (
              <>Don't have an account? <strong className="underline font-semibold">Sign Up Free</strong></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

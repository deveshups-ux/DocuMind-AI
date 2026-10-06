import React from 'react';
import { Menu, FileText, Sun, Moon, Key, RotateCcw, User, LogIn, LogOut } from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  activeDoc,
  onResetDoc,
  theme,
  onToggleTheme,
  onOpenSettings,
  hasKey,
  user,
  onOpenAuth,
  onSignOut,
}) {
  const isDark = theme === 'dark';

  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? 'bg-[#18131B] border-[#2A2030] text-[#EDE6EE]'
          : 'bg-[#FAF8F5] border-[#E8DFD5] text-[#2E2330]'
      }`}
    >
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className={`p-2.5 rounded-xl transition-colors ${
            isDark
              ? 'hover:bg-[#251D2A] text-[#B8AAB9]'
              : 'hover:bg-[#EAE3DA] text-[#6E5D70]'
          }`}
          title="Toggle History Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onResetDoc}>
          <span className="text-xl font-black tracking-tight">
            DocuMind
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isDark
                ? 'bg-[#2A2030] text-[#D0C2D3] border-[#3E3048]'
                : 'bg-[#EFEAE2] text-[#6E5D70] border-[#DCD3C7]'
            }`}
          >
            Cloud RAG
          </span>
        </div>
      </div>

      {/* Middle: Active Document Badge (if loaded) */}
      {activeDoc && (
        <div
          className={`hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-medium ${
            isDark
              ? 'bg-[#221B27] border-[#34273E] text-[#D0C2D3]'
              : 'bg-[#EFE9E2] border-[#DDD4CA] text-[#4A3B4D]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#A594AB] shrink-0" />
          <span className="font-semibold max-w-[180px] md:max-w-[240px] truncate" title={activeDoc.name || activeDoc.title}>
            {activeDoc.name || activeDoc.title}
          </span>
          <span className="opacity-40">•</span>
          <span className="text-[11px] font-mono opacity-80">{activeDoc.numPages} pgs</span>
          <button
            onClick={onResetDoc}
            className="ml-1 p-1 opacity-60 hover:opacity-100 hover:text-rose-400 transition-all rounded-md"
            title="Upload new file"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Right: User Auth, Theme Toggle & API Key */}
      <div className="flex items-center gap-2.5">
        {/* User Account Button */}
        {user ? (
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                isDark ? 'bg-[#241C2B] border-[#382B42] text-[#EDE6EE]' : 'bg-[#EFEAE2] border-[#DDD4CA] text-[#2E2330]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#7F6C82] text-white flex items-center justify-center text-[10px] font-bold">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:inline max-w-[110px] truncate text-xs font-semibold">
                {user.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-xs opacity-60 hover:opacity-100 hover:text-rose-500 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7F6C82] hover:bg-[#6D5A70] text-white text-xs font-bold shadow-xs transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        {/* Dark/Light Switch */}
        <button
          onClick={onToggleTheme}
          className={`p-2.5 rounded-xl transition-colors ${
            isDark
              ? 'hover:bg-[#251D2A] text-[#B8AAB9]'
              : 'hover:bg-[#EAE3DA] text-[#6E5D70]'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-[#D0C2D3]" /> : <Moon className="w-4 h-4 text-[#7F6C82]" />}
        </button>

        {/* API Key Modal Trigger */}
        <button
          onClick={onOpenSettings}
          className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
            hasKey
              ? isDark
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              : isDark
              ? 'bg-[#221B27] border-[#34273E] text-[#B8AAB9] hover:bg-[#2A2030]'
              : 'bg-[#EFEAE2] border-[#DDD4CA] text-[#6E5D70] hover:bg-[#E5DFD5]'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasKey ? 'AI Ready' : 'API Key'}</span>
          <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400' : 'bg-[#8F7D93]'}`} />
        </button>
      </div>
    </header>
  );
}

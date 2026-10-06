import React from 'react';
import { Plus, FileText, Trash2, Moon, Sun, Key, Sparkles, Clock, X, Layers, Cloud, LogIn, LogOut, User } from 'lucide-react';
import { SAMPLE_DOCS } from '../data/sampleDocs';

export default function Sidebar({
  isOpen,
  onClose,
  onToggle,
  history = [],
  activeDocId,
  onSelectDoc,
  onNewDoc,
  onDeleteDoc,
  onClearHistory,
  theme,
  onToggleTheme,
  onOpenSettings,
  hasKey,
  onSelectSample,
  user,
  onOpenAuth,
  onSignOut,
}) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r ${
          isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:overflow-hidden'
        } ${
          isDark
            ? 'bg-[#18131B] border-[#2A2030] text-[#EDE6EE]'
            : 'bg-[#F9F6F0] border-[#E5DDD4] text-[#2E2330]'
        }`}
      >
        {/* Top Header & Close (Mobile) */}
        <div className="p-4 border-b flex items-center justify-between border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7F6C82] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">DocuMind</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Cloud className={`w-3.5 h-3.5 ${user ? 'text-emerald-400' : 'text-[#8A798D]'}`} />
                <p className={`text-[11px] ${user ? 'text-emerald-400 font-semibold' : isDark ? 'text-[#9A8A9D]' : 'text-[#7F6C82]'}`}>
                  {user ? 'Cloud Synced' : 'Local Storage'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg lg:hidden ${
              isDark ? 'hover:bg-[#251D2A] text-[#9A8A9D]' : 'hover:bg-[#EAE3DA] text-[#6E5D70]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Status / Login Banner if not logged in */}
        {!user && (
          <div className="mx-3 mt-3.5 p-3.5 rounded-2xl bg-[#7F6C82]/10 border border-[#7F6C82]/20 text-xs flex flex-col gap-2.5">
            <span className={`leading-relaxed ${isDark ? 'text-[#D0C2D3]' : 'text-[#4E3E50]'}`}>
              Sign in to sync your PDFs & chat history across devices.
            </span>
            <button
              onClick={() => {
                onOpenAuth();
                if (window.innerWidth < 1024) onClose();
              }}
              className="py-2 px-3.5 rounded-xl bg-[#7F6C82] text-white text-xs font-semibold hover:bg-[#6D5A70] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In / Sign Up
            </button>
          </div>
        )}

        {/* New Upload CTA Button */}
        <div className="p-3.5">
          <button
            onClick={() => {
              onNewDoc();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#7F6C82] hover:bg-[#6D5A70] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>

        {/* Document History List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1.5">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-[#857588]' : 'text-[#8A798D]'}`}>
              {user ? 'Cloud Documents' : 'Recent Documents'} ({history.length})
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[11px] font-medium text-[#A67B88] hover:text-rose-500 transition-colors"
                title="Clear all history"
              >
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className={`p-6 text-center text-xs leading-relaxed ${isDark ? 'text-[#7D6E80]' : 'text-[#948396]'}`}>
              <Clock className="w-5 h-5 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No documents yet.</p>
              <p className="text-[11px] mt-1 opacity-80">Uploaded files will appear here.</p>
            </div>
          ) : (
            history.map((doc) => {
              const isActive = activeDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDoc(doc);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#2A2030] text-white font-semibold border border-[#3E3048] shadow-xs'
                        : 'bg-[#EDE5DC] text-[#2E2330] font-semibold border border-[#D9CEBF] shadow-xs'
                      : isDark
                      ? 'hover:bg-[#201925] text-[#C4B7C7]'
                      : 'hover:bg-[#F0EAE1] text-[#554558]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A594AB]' : 'opacity-60'}`} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{doc.name || doc.title}</p>
                      <p className={`text-[10px] mt-0.5 ${isDark ? 'text-[#837486]' : 'text-[#8A7A8D]'}`}>
                        {doc.numPages} {doc.numPages === 1 ? 'Page' : 'Pages'} • {doc.messages?.length || 0} chats
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(doc.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-opacity ${
                      isDark ? 'hover:bg-[#34283C] text-rose-400' : 'hover:bg-[#E5DCD1] text-rose-600'
                    }`}
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}

          {/* Quick Samples */}
          <div className="pt-4 mt-4 border-t border-inherit">
            <span className={`px-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-[#857588]' : 'text-[#8A798D]'}`}>
              Sample Research
            </span>
            <div className="mt-1.5 space-y-1">
              {SAMPLE_DOCS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
                    isDark ? 'hover:bg-[#201925] text-[#B8AAB9]' : 'hover:bg-[#F0EAE1] text-[#6E5D70]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Preferences / Settings & Theme Toggle */}
        <div className="p-3.5 border-t border-inherit space-y-2">
          {/* User profile row if logged in */}
          {user && (
            <div className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${isDark ? 'bg-[#201925]' : 'bg-[#EFEAE2]'}`}>
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-6 h-6 rounded-full bg-[#7F6C82] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span className="truncate text-xs font-semibold">{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="text-[#A67B88] hover:text-rose-500 p-1.5 rounded-lg"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
              isDark ? 'bg-[#201925] hover:bg-[#282030] text-[#EDE6EE]' : 'bg-[#EFEAE2] hover:bg-[#E5DFD5] text-[#2E2330]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isDark ? <Moon className="w-4 h-4 text-[#A694AB]" /> : <Sun className="w-4 h-4 text-[#7F6C82]" />}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#302538] text-[#D0C2D3]' : 'bg-[#DFD7CC] text-[#554658]'}`}>
              Toggle
            </span>
          </button>

          {/* API Key Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors border ${
              hasKey
                ? isDark
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-950/60'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : isDark
                ? 'bg-[#201925] border-[#34273E] text-[#B8AAB9] hover:bg-[#282030]'
                : 'bg-[#EFEAE2] border-[#DDD4CA] text-[#5E4D61] hover:bg-[#E5DFD5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>{hasKey ? 'AI Connected' : 'API Key Settings'}</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400' : 'bg-[#8F7D93]'}`} />
          </button>
        </div>
      </aside>
    </>
  );
}

import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, Check, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, config, onSaveConfig, theme }) {
  const [provider, setProvider] = useState(config.provider || 'gemini');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [isSaved, setIsSaved] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({ provider, apiKey: apiKey.trim() });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    onSaveConfig({ provider, apiKey: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-md border rounded-[28px] shadow-2xl p-6 sm:p-7 relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#1C1721] border-[#322638] text-[#EDE6EE]'
            : 'bg-[#FAF8F5] border-[#E4DCD3] text-[#2E2330]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-[#2D2233]' : 'border-[#E8DFD5]'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#7F6C82] text-white flex items-center justify-center shadow-md">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold">AI Engine Settings</h3>
              <p className={`text-[11px] ${isDark ? 'text-[#9A8A9D]' : 'text-[#7A6A7D]'}`}>Connect Gemini or OpenAI API</p>
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

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          {/* Provider Selector */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-[#C4B7C7]' : 'text-[#4A3B4D]'}`}>Select Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  provider === 'gemini'
                    ? 'bg-[#7F6C82] text-white border-[#7F6C82] shadow-xs'
                    : isDark
                    ? 'bg-[#221B27] border-[#34273E] text-[#B8AAB9] hover:bg-[#2A2030]'
                    : 'bg-white border-[#E4DCD3] text-[#6E5D70] hover:bg-[#F9F5F9]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Google Gemini
              </button>
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  provider === 'openai'
                    ? 'bg-[#7F6C82] text-white border-[#7F6C82] shadow-xs'
                    : isDark
                    ? 'bg-[#221B27] border-[#34273E] text-[#B8AAB9] hover:bg-[#2A2030]'
                    : 'bg-white border-[#E4DCD3] text-[#6E5D70] hover:bg-[#F9F5F9]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                OpenAI (GPT-4o)
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-xs font-semibold ${isDark ? 'text-[#C4B7C7]' : 'text-[#4A3B4D]'}`}>
                {provider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
              </label>
              {provider === 'gemini' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#9D88A3] hover:underline flex items-center gap-1 font-medium"
                >
                  Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                isDark
                  ? 'bg-[#151118] border-[#34273E] text-[#EDE6EE] placeholder-[#7D6E80] focus:border-[#7F6C82]'
                  : 'bg-white border-[#DDD4CB] text-[#2E2330] placeholder-[#9D8E9F] focus:border-[#7F6C82]'
              }`}
            />
            <p className={`text-[11px] mt-1.5 flex items-center gap-1.5 ${isDark ? 'text-[#8C7B8E]' : 'text-[#7A6A7D]'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Stored strictly in your local browser storage.
            </p>
          </div>

          {/* Zero key info */}
          <div
            className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
              isDark
                ? 'bg-[#221B27] border-[#34273E] text-[#A698A9]'
                : 'bg-[#F4EDE5] border-[#E3D9CD] text-[#6E5A70]'
            }`}
          >
            💡 <strong className={isDark ? 'text-[#EDE6EE]' : 'text-[#3E2F40]'}>No API key right now?</strong> You can still use the built-in Smart Local RAG mode for instant offline summaries and QA!
          </div>

          {/* Action buttons */}
          <div className={`flex items-center justify-end gap-2 pt-2.5 border-t ${isDark ? 'border-[#2D2233]' : 'border-[#E8DFD5]'}`}>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${
                isDark ? 'text-[#A698A9] hover:bg-[#251D2A] hover:text-white' : 'text-[#6E5D70] hover:bg-[#EDE5DD] hover:text-[#2E2330]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7F6C82] hover:bg-[#6D5A70] rounded-full shadow-md transition-all flex items-center gap-1.5"
            >
              {isSaved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

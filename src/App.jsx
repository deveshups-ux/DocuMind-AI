import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import DocumentViewer from './components/DocumentViewer';
import ChatInterface from './components/ChatInterface';
import InsightsPanel from './components/InsightsPanel';
import ApiKeyModal from './components/ApiKeyModal';
import AuthModal from './components/AuthModal';
import { extractTextFromPDF, extractTextFromTxt } from './services/pdfService';
import {
  askDocumentQuestion,
  generateFlashcards,
  generateQuiz,
} from './services/aiService';
import {
  supabase,
  getCurrentUser,
  signOutUser,
  saveDocumentToCloud,
  fetchUserDocumentsFromCloud,
  saveChatMessageToCloud,
  deleteDocumentFromCloud,
} from './services/supabaseService';
import { SAMPLE_DOCS } from './data/sampleDocs';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('documind_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // User Auth State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sidebar Open State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Document History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('documind_doc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Document State
  const [activeDoc, setActiveDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // LLM Config
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('documind_ai_config');
      return saved ? JSON.parse(saved) : { provider: 'gemini', apiKey: '' };
    } catch {
      return { provider: 'gemini', apiKey: '' };
    }
  });

  // Views & State
  const [rightView, setRightView] = useState('chat'); // 'chat' | 'insights'
  const [highlightedPage, setHighlightedPage] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Insights State
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Check Supabase Auth Session on Mount
  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      if (u) {
        loadCloudHistory(u.id);
      }
    });

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          loadCloudHistory(currentUser.id);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Load history from Supabase
  const loadCloudHistory = async (userId) => {
    try {
      const cloudDocs = await fetchUserDocumentsFromCloud(userId);
      if (cloudDocs && cloudDocs.length > 0) {
        setHistory(cloudDocs);
        localStorage.setItem('documind_doc_history', JSON.stringify(cloudDocs));
      }
    } catch (e) {
      console.warn('Could not load cloud history:', e);
    }
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('documind_theme', nextTheme);
    } catch (e) {
      console.warn(e);
    }
  };

  // Save history helper
  const saveHistoryToStorage = (updatedHistory) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem('documind_doc_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  // Save config helper
  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('documind_ai_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Config save error', e);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  // Process Document & generate initial summary
  const initializeDocInsights = async (doc) => {
    setIsSummarizing(true);
    try {
      const summaryResult = await askDocumentQuestion({
        query: 'Provide a structured executive summary of this entire document with core key takeaways in clean markdown.',
        document: doc,
        config,
      });
      setSummary(summaryResult.text);
    } catch (err) {
      console.warn('Initial summary error', err);
    } finally {
      setIsSummarizing(false);
    }

    generateFlashcards(doc, config).then(res => setFlashcards(res || []));
    generateQuiz(doc, config).then(res => setQuiz(res || []));
  };

  // Select / Upload a document
  const handleSetLoadedDoc = async (doc, existingMessages = []) => {
    // 1. If user is logged in, save to Cloud database first to get real DB UUID
    let cloudId = doc.id;
    if (user) {
      const saved = await saveDocumentToCloud(doc, user.id);
      if (saved && saved.id) {
        cloudId = saved.id;
      }
    }

    const docWithId = {
      ...doc,
      id: cloudId || `doc-${Date.now()}`,
    };

    setActiveDoc(docWithId);
    setMessages(existingMessages);
    setSummary('');
    setFlashcards([]);
    setQuiz([]);
    setRightView('chat');
    initializeDocInsights(docWithId);

    // Update history list
    const docEntry = {
      id: docWithId.id,
      name: docWithId.name || docWithId.title,
      numPages: docWithId.numPages,
      wordCount: docWithId.wordCount,
      pages: docWithId.pages,
      fullText: docWithId.fullText,
      messages: existingMessages,
      timestamp: new Date().toISOString(),
    };

    const existingIdx = history.findIndex(h => h.id === docEntry.id || h.name === docEntry.name);
    let updated;
    if (existingIdx >= 0) {
      updated = [...history];
      updated[existingIdx] = docEntry;
    } else {
      updated = [docEntry, ...history.slice(0, 19)];
    }
    saveHistoryToStorage(updated);
  };

  // Upload Handler
  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    try {
      let docData;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        docData = await extractTextFromPDF(file);
      } else {
        docData = await extractTextFromTxt(file);
      }
      
      await handleSetLoadedDoc(docData);
    } catch (err) {
      console.error('File parsing error:', err);
      alert(`Failed to parse file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sample Selection
  const handleSelectSample = (sample) => {
    handleSetLoadedDoc(sample);
  };

  // Chat message send
  const handleSendMessage = async (text) => {
    if (!activeDoc) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsChatLoading(true);

    // Save user message to cloud if logged in
    if (user && activeDoc.id) {
      saveChatMessageToCloud(activeDoc.id, user.id, userMessage);
    }

    try {
      const response = await askDocumentQuestion({
        query: text,
        document: activeDoc,
        history: messages,
        config,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.text,
        citations: response.citations,
      };

      const updatedWithAI = [...newMessages, assistantMessage];
      setMessages(updatedWithAI);

      // Save assistant message to cloud if logged in
      if (user && activeDoc.id) {
        saveChatMessageToCloud(activeDoc.id, user.id, assistantMessage);
      }

      // Auto-update history with latest chat messages
      if (activeDoc) {
        const docIdx = history.findIndex(h => h.id === activeDoc.id || h.name === (activeDoc.name || activeDoc.title));
        if (docIdx >= 0) {
          const updatedHistory = [...history];
          updatedHistory[docIdx].messages = updatedWithAI;
          saveHistoryToStorage(updatedHistory);
        }
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err.message}`,
          citations: [],
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // New Document / Reset
  const handleNewDoc = () => {
    setActiveDoc(null);
    setMessages([]);
    setSummary('');
    setFlashcards([]);
    setQuiz([]);
    setHighlightedPage(null);
  };

  // Select document from History
  const handleSelectFromHistory = (histDoc) => {
    setActiveDoc(histDoc);
    setMessages(histDoc.messages || []);
    setSummary('');
    setFlashcards([]);
    setQuiz([]);
    setRightView('chat');
    initializeDocInsights(histDoc);
  };

  // Delete from History
  const handleDeleteFromHistory = (docId) => {
    const filtered = history.filter(h => h.id !== docId);
    saveHistoryToStorage(filtered);
    if (user) {
      deleteDocumentFromCloud(docId);
    }
    if (activeDoc && activeDoc.id === docId) {
      handleNewDoc();
    }
  };

  // Clear All History
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your document history?')) {
      saveHistoryToStorage([]);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark
          ? 'bg-[#131015] text-[#EDE6EE] selection:bg-[#7F6C82] selection:text-white'
          : 'bg-[#FAF8F5] text-[#2E2330] selection:bg-[#7F6C82] selection:text-white'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeDoc={activeDoc}
        onResetDoc={handleNewDoc}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasKey={Boolean(config.apiKey && config.apiKey.length > 5)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Body with Sidebar Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left History Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          history={history}
          activeDocId={activeDoc?.id}
          onSelectDoc={handleSelectFromHistory}
          onNewDoc={handleNewDoc}
          onDeleteDoc={handleDeleteFromHistory}
          onClearHistory={handleClearAllHistory}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasKey={Boolean(config.apiKey && config.apiKey.length > 5)}
          onSelectSample={handleSelectSample}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!activeDoc ? (
            <FileUpload
              onFileUpload={handleFileUpload}
              onSelectSample={handleSelectSample}
              isProcessing={isProcessing}
              theme={theme}
            />
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
              {/* Left Panel: Document Viewer (45% width on desktop) */}
              <div className="w-full lg:w-[45%] h-1/2 lg:h-full overflow-hidden">
                <DocumentViewer
                  document={activeDoc}
                  highlightedPage={highlightedPage}
                  onPageSelect={(page) => setHighlightedPage(page)}
                  theme={theme}
                />
              </div>

              {/* Right Panel: AI Assistant & Insights (55% width) */}
              <div
                className={`w-full lg:w-[55%] h-1/2 lg:h-full flex flex-col transition-colors ${
                  isDark ? 'bg-[#151118]' : 'bg-[#FAF8F5]'
                }`}
              >
                {/* View Switcher Header */}
                <div
                  className={`p-2 border-b flex items-center justify-between transition-colors ${
                    isDark ? 'bg-[#18131B] border-[#2A2030]' : 'bg-[#FAF8F5] border-[#E8DFD5]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 p-1 rounded-full border ${
                      isDark ? 'bg-[#1F1824] border-[#2E2335]' : 'bg-[#EDE5DD] border-[#DDD3CB]'
                    }`}
                  >
                    <button
                      onClick={() => setRightView('chat')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        rightView === 'chat'
                          ? 'bg-[#7F6C82] text-white shadow-xs'
                          : isDark
                          ? 'text-[#A698A9] hover:text-[#EDE6EE]'
                          : 'text-[#6E5D70] hover:text-[#2E2330]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>AI Chat & QA</span>
                    </button>

                    <button
                      onClick={() => setRightView('insights')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        rightView === 'insights'
                          ? 'bg-[#7F6C82] text-white shadow-xs'
                          : isDark
                          ? 'text-[#A698A9] hover:text-[#EDE6EE]'
                          : 'text-[#6E5D70] hover:text-[#2E2330]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Executive Insights & Tools</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic View Content */}
                <div className="flex-1 overflow-hidden">
                  {rightView === 'chat' ? (
                    <ChatInterface
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isLoading={isChatLoading}
                      onCitationClick={(pageNum) => setHighlightedPage(pageNum)}
                      onClearChat={() => {
                        setMessages([]);
                        if (activeDoc) {
                          const docIdx = history.findIndex(h => h.id === activeDoc.id);
                          if (docIdx >= 0) {
                            const updated = [...history];
                            updated[docIdx].messages = [];
                            saveHistoryToStorage(updated);
                          }
                        }
                      }}
                      document={activeDoc}
                      theme={theme}
                    />
                  ) : (
                    <InsightsPanel
                      document={activeDoc}
                      summary={summary}
                      isSummarizing={isSummarizing}
                      flashcards={flashcards}
                      isGeneratingFlashcards={isGeneratingFlashcards}
                      quiz={quiz}
                      isGeneratingQuiz={isGeneratingQuiz}
                      onGenerateSummary={() => initializeDocInsights(activeDoc)}
                      onGenerateFlashcards={() => {
                        setIsGeneratingFlashcards(true);
                        generateFlashcards(activeDoc, config)
                          .then(res => setFlashcards(res || []))
                          .finally(() => setIsGeneratingFlashcards(false));
                      }}
                      onGenerateQuiz={() => {
                        setIsGeneratingQuiz(true);
                        generateQuiz(activeDoc, config)
                          .then(res => setQuiz(res || []))
                          .finally(() => setIsGeneratingQuiz(false));
                      }}
                      onPageClick={(pageNum) => setHighlightedPage(pageNum)}
                      theme={theme}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Settings / API Key Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        theme={theme}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          loadCloudHistory(u.id);
        }}
        theme={theme}
      />
    </div>
  );
}

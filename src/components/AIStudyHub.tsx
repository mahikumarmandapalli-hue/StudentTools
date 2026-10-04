import React, { useState, useRef, useEffect } from 'react';
import { SavedCalculationItem } from '../firebase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
  modelUsed?: string;
}

interface AIStudyHubProps {
  user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null;
  savedItems: SavedCalculationItem[];
  savedNotes: string;
  onUpdateNotes: (notes: string) => void;
  onSyncWorkspace: () => Promise<void>;
  onSaveItemToCloud: (item: {
    toolName: string;
    summary: string;
    details: string;
    category: 'academic' | 'finance' | 'utility' | 'ai_note';
  }) => Promise<void>;
  onDeleteSavedItem: (id: string) => Promise<void>;
  onSignIn: () => Promise<void>;
  showToast: (msg: string) => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export default function AIStudyHub({
  user,
  savedItems,
  savedNotes,
  onUpdateNotes,
  onSyncWorkspace,
  onSaveItemToCloud,
  onDeleteSavedItem,
  onSignIn,
  showToast,
  externalPrompt,
  onClearExternalPrompt,
}: AIStudyHubProps) {
  // Multi-turn Gemini Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi! I am your StudentTools AI Assistant. Ask me about CGPA planning, Java & DSA code, fresher interview prep, resume optimization, or live exam updates!',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [rolePersona, setRolePersona] = useState<
    'study_mentor' | 'java_tutor' | 'interview_coach' | 'resume_reviewer'
  >('study_mentor');
  const [modelTier, setModelTier] = useState<'lite' | 'flash' | 'pro'>('flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const chatThreadRef = useRef<HTMLDivElement | null>(null);

  // Audio Transcription State (gemini-3.5-transcribe)
  const [isRecordingChat, setIsRecordingChat] = useState(false);
  const [isRecordingNote, setIsRecordingNote] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Dedicated Google Search Grounding Tab State
  const [rightTab, setRightTab] = useState<'search' | 'voice' | 'cloud'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    text: string;
    sources: { title: string; uri: string }[];
    modelUsed?: string;
  } | null>(null);

  // Scroll chat thread on new messages
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  // Handle external prompt from Java / Interview sections
  useEffect(() => {
    if (externalPrompt) {
      setChatInput(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt, onClearExternalPrompt]);

  const sendChatMessage = async (customText?: string) => {
    const textToSend = (customText ?? chatInput).trim();
    if (!textToSend || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!customText) setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          rolePersona,
          modelTier,
          useSearchGrounding,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const modelMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: data.text,
        sources: data.sources || [],
        modelUsed: data.modelUsed,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Chat request failed';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        msg = 'Gemini API rate limit reached. Please wait a few seconds and try again, or switch to the Lite model tier.';
      }
      showToast(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: `⚠️ ${msg}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Microphone recording & transcription with gemini-3.5-transcribe
  const toggleMicRecording = async (target: 'chat' | 'note') => {
    const currentlyRecording = target === 'chat' ? isRecordingChat : isRecordingNote;

    if (currentlyRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingChat(false);
      setIsRecordingNote(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        setTranscribing(true);
        showToast('🎙️ Transcribing audio with gemini-3.5-transcribe...');

        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const resStr = String(reader.result || '');
              const base64 = resStr.includes(',') ? resStr.split(',')[1] : resStr;
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });

          const response = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: (recorder.mimeType || 'audio/webm').split(';')[0],
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Transcription failed');
          }

          const transcribedText = (data.text || '').trim();
          if (!transcribedText) {
            showToast('No speech detected. Please try speaking closer to the mic.');
          } else if (target === 'chat') {
            setChatInput((prev) => (prev ? `${prev} ${transcribedText}` : transcribedText));
            showToast('✅ Audio transcribed into chat input!');
          } else {
            const updated = savedNotes
              ? `${savedNotes}\n• ${transcribedText}`
              : `• ${transcribedText}`;
            onUpdateNotes(updated);
            showToast('✅ Voice note transcribed!');
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Audio transcription failed';
          showToast(msg);
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      if (target === 'chat') {
        setIsRecordingChat(true);
      } else {
        setIsRecordingNote(true);
      }
      showToast('🎙️ Recording started... Click the mic again to stop & transcribe.');
    } catch {
      showToast('Microphone permission is required for audio transcription.');
    }
  };

  // Dedicated Google Search Grounding handler
  const handleGroundedSearch = async (presetQuery?: string) => {
    const q = (presetQuery ?? searchQuery).trim();
    if (!q || searchLoading) {
      if (!q) showToast('Enter a topic or question to search with Google.');
      return;
    }
    if (presetQuery) setSearchQuery(presetQuery);
    setSearchLoading(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setSearchResult({
        text: data.text,
        sources: data.sources || [],
        modelUsed: data.modelUsed,
      });
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Google Search request failed';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        msg = 'Gemini search rate limit reached. Please wait a moment and try again.';
      }
      showToast(msg);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <section className="section" id="ai-assistant">
      <div className="container">
        <div className="section-title">
          <h2>🤖 AI Study Hub, Voice Transcriber &amp; Cloud Workspace</h2>
          <p>
            Multi-turn Gemini Tutor, real-time Google Search grounding, microphone voice
            transcription, and Firebase cloud persistence.
          </p>
        </div>

        <div className="ai-hub-grid">
          {/* LEFT COLUMN: MULTI-TURN GEMINI CHATBOT */}
          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <span>💬 Gemini Multi-Turn Study &amp; Career Chat</span>
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Switch roles and models anytime — conversation context is preserved.
                </p>
              </div>
              <button
                type="button"
                className="small-outline-btn"
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome_${Date.now()}`,
                      role: 'model',
                      text: 'Chat cleared! How can I help you with your studies, Java coding, or career prep today?',
                    },
                  ]);
                  showToast('Chat history cleared.');
                }}
              >
                🗑️ Clear Chat
              </button>
            </div>

            <div className="chat-controls-bar">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rolePersonaSelect" className="text-xs font-bold text-[var(--muted)]">
                  Role:
                </label>
                <select
                  id="rolePersonaSelect"
                  className="chat-select"
                  value={rolePersona}
                  onChange={(e) =>
                    setRolePersona(
                      e.target.value as
                        | 'study_mentor'
                        | 'java_tutor'
                        | 'interview_coach'
                        | 'resume_reviewer'
                    )
                  }
                >
                  <option value="study_mentor">🎓 Study &amp; CGPA Mentor</option>
                  <option value="java_tutor">☕ Java &amp; DSA Tutor</option>
                  <option value="interview_coach">🎯 Mock Interviewer</option>
                  <option value="resume_reviewer">📄 Resume &amp; Career Coach</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <label htmlFor="modelTierSelect" className="text-xs font-bold text-[var(--muted)]">
                  Model:
                </label>
                <select
                  id="modelTierSelect"
                  className="chat-select"
                  value={modelTier}
                  onChange={(e) => setModelTier(e.target.value as 'lite' | 'flash' | 'pro')}
                >
                  <option value="lite">⚡ Fast (gemini-3.1-flash-lite)</option>
                  <option value="flash">✨ General (gemini-3.5-flash)</option>
                  <option value="pro">🧠 Complex Pro (gemini-3.1-pro-preview)</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={useSearchGrounding}
                  onChange={(e) => setUseSearchGrounding(e.target.checked)}
                  className="accent-indigo-600"
                />
                <span>🌐 Google Search Grounding</span>
              </label>
            </div>

            {/* Scrollable Chat Thread */}
            <div className="chat-thread" ref={chatThreadRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.role}`}>
                  <div>{msg.text}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="chat-sources">
                      <span className="text-[11px] font-bold opacity-75 w-full">
                        🔍 Grounded Web Sources:
                      </span>
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="source-chip"
                        >
                          🔗 {src.title}
                        </a>
                      ))}
                    </div>
                  )}

                  {msg.role === 'model' && msg.id !== 'welcome' && (
                    <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] opacity-80">
                      <span>Model: {msg.modelUsed || modelTier}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="underline font-semibold"
                          onClick={() => {
                            navigator.clipboard?.writeText(msg.text);
                            showToast('Copied AI response!');
                          }}
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          className="underline font-semibold"
                          onClick={() =>
                            onSaveItemToCloud({
                              toolName: 'AI Study Tutor',
                              summary: msg.text.slice(0, 120),
                              details: msg.text,
                              category: 'ai_note',
                            })
                          }
                        >
                          ☁️ Save Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="chat-bubble model opacity-80">
                  ⏳ Thinking with{' '}
                  {modelTier === 'pro'
                    ? 'gemini-3.1-pro-preview'
                    : modelTier === 'lite'
                    ? 'gemini-3.1-flash-lite'
                    : 'gemini-3.5-flash'}
                  ...
                </div>
              )}
            </div>

            {/* Quick Prompt Starters */}
            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] flex gap-2 overflow-x-auto">
              <button
                type="button"
                className="small-outline-btn text-xs whitespace-nowrap"
                onClick={() =>
                  sendChatMessage('How can I raise my CGPA from 7.4 to 8.5 in the next 2 semesters?')
                }
              >
                📈 Raise CGPA Plan
              </button>
              <button
                type="button"
                className="small-outline-btn text-xs whitespace-nowrap"
                onClick={() =>
                  sendChatMessage('Explain Java HashMap internal working for fresher interviews.')
                }
              >
                ☕ HashMap Internals
              </button>
              <button
                type="button"
                className="small-outline-btn text-xs whitespace-nowrap"
                onClick={() =>
                  sendChatMessage('Ask me a mock HR & Java technical interview question.')
                }
              >
                🎯 Start Mock Interview
              </button>
            </div>

            {/* Composer with Mic Transcription + Send */}
            <div className="chat-composer">
              <button
                type="button"
                className={`mic-btn ${isRecordingChat ? 'recording' : ''}`}
                onClick={() => toggleMicRecording('chat')}
                disabled={transcribing}
                title="Voice Input (gemini-3.5-transcribe)"
              >
                {isRecordingChat ? '⏹️' : '🎙️'}
              </button>
              <input
                type="text"
                placeholder={
                  transcribing
                    ? 'Transcribing audio with gemini-3.5-transcribe...'
                    : 'Ask anything or click 🎙️ to speak...'
                }
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendChatMessage();
                }}
              />
              <button
                type="button"
                className="primary-btn"
                disabled={chatLoading || !chatInput.trim()}
                onClick={() => sendChatMessage()}
              >
                Send
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: GOOGLE SEARCH GROUNDING, VOICE TRANSCRIBER & CLOUD WORKSPACE */}
          <div className="card">
            <div className="tool-mode-nav mb-4">
              <button
                type="button"
                className={rightTab === 'search' ? 'active' : ''}
                onClick={() => setRightTab('search')}
              >
                🌐 Live Search
              </button>
              <button
                type="button"
                className={rightTab === 'voice' ? 'active' : ''}
                onClick={() => setRightTab('voice')}
              >
                🎙️ Voice Notes
              </button>
              <button
                type="button"
                className={rightTab === 'cloud' ? 'active' : ''}
                onClick={() => setRightTab('cloud')}
              >
                ☁️ Saved ({savedItems.length})
              </button>
            </div>

            {/* TAB 1: GOOGLE SEARCH GROUNDING */}
            {rightTab === 'search' && (
              <div>
                <h3 className="font-extrabold text-lg mb-1">
                  🌐 Google Search Grounded Research
                </h3>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Powered by <code>gemini-3.5-flash</code> with <code>googleSearch</code> for live
                  facts, exam dates, tech documentation, and fresher salary benchmarks.
                </p>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="e.g. Latest Java LTS features or GATE CSE syllabus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGroundedSearch();
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={searchLoading}
                    onClick={() => handleGroundedSearch()}
                  >
                    {searchLoading ? 'Searching Google...' : '🔍 Search with Google'}
                  </button>
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleGroundedSearch(
                        'Top skills and average salary for entry-level Java Software Engineer in 2026'
                      )
                    }
                  >
                    💼 2026 Java Salary Trends
                  </button>
                </div>

                {searchResult && (
                  <div className="result show !mt-3">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {searchResult.text}
                    </div>
                    {searchResult.sources.length > 0 && (
                      <div className="chat-sources mt-3">
                        <span className="text-xs font-bold block w-full mb-1">
                          Verified Google Web Citations:
                        </span>
                        {searchResult.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-chip"
                          >
                            🌐 {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="result-actions">
                      <button
                        type="button"
                        className="small-outline-btn"
                        onClick={() =>
                          onSaveItemToCloud({
                            toolName: 'Google Grounded Search',
                            summary: searchQuery || 'Live Research',
                            details: searchResult.text,
                            category: 'ai_note',
                          })
                        }
                      >
                        ☁️ Save Research
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AUDIO TRANSCRIPTION STUDIO */}
            {rightTab === 'voice' && (
              <div>
                <h3 className="font-extrabold text-lg mb-1">
                  🎙️ Audio Lecture &amp; Study Note Transcriber
                </h3>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Record spoken study summaries or interview answers using your microphone and
                  transcribe them with <code>gemini-3.5-transcribe</code>.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-4">
                  <button
                    type="button"
                    className={`primary-btn ${
                      isRecordingNote ? '!bg-red-600 hover:!bg-red-700' : ''
                    }`}
                    disabled={transcribing}
                    onClick={() => toggleMicRecording('note')}
                  >
                    {isRecordingNote
                      ? '⏹️ Stop & Transcribe Audio'
                      : transcribing
                      ? '⏳ Transcribing...'
                      : '🎙️ Record Microphone Audio'}
                  </button>
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() => {
                      if (!savedNotes.trim()) {
                        showToast('No study notes to copy yet.');
                        return;
                      }
                      navigator.clipboard?.writeText(savedNotes);
                      showToast('Copied transcribed study notes!');
                    }}
                  >
                    📋 Copy Notes
                  </button>
                </div>

                <div className="form-group">
                  <label>Transcribed Study &amp; Voice Notes</label>
                  <textarea
                    rows={6}
                    placeholder="Your transcribed audio notes will appear here. You can also type or edit directly..."
                    value={savedNotes}
                    onChange={(e) => onUpdateNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={onSyncWorkspace}
                  >
                    ☁️ Sync Notes to Cloud
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      if (!savedNotes.trim()) {
                        showToast('Record or type a note first.');
                        return;
                      }
                      sendChatMessage(
                        `Summarize and create flashcards from my study notes:\n${savedNotes}`
                      );
                    }}
                  >
                    ✨ Summarize in AI Chat
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: FIREBASE CLOUD WORKSPACE & SAVED CALCULATIONS */}
            {rightTab === 'cloud' && (
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-lg">☁️ Firebase Cloud Workspace</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {user
                        ? `Signed in as ${user.displayName || user.email}`
                        : 'Sign in with Google to sync your calculations & resume across devices.'}
                    </p>
                  </div>
                  {user ? (
                    <button
                      type="button"
                      className="primary-btn text-xs !py-2 !px-3"
                      onClick={onSyncWorkspace}
                    >
                      🔄 Sync All Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-btn text-xs !py-2 !px-3"
                      onClick={onSignIn}
                    >
                      🔐 Sign In with Google
                    </button>
                  )}
                </div>

                {savedItems.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--muted)]">
                    No saved calculations or notes yet. Click <strong>“☁️ Save Result”</strong> on
                    any calculator or AI response to store it here!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex justify-between items-start gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-indigo-500 uppercase">
                            {item.toolName}
                          </div>
                          <div className="font-bold text-sm truncate">{item.summary}</div>
                          {item.details && (
                            <div className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">
                              {item.details}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="row-del-btn flex-shrink-0"
                          title="Delete saved record"
                          onClick={() => onDeleteSavedItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

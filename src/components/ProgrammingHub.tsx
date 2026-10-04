import React, { useState, useEffect, useMemo } from 'react';
import { JAVA_TOPICS, ProgrammingTopic, TopicLevel } from '../data/javaTopics';
import { PYTHON_TOPICS } from '../data/pythonTopics';

interface ProgrammingHubProps {
  activeLang: 'java' | 'python';
  onSelectLang: (lang: 'java' | 'python') => void;
  onAskAiTutor: (promptText: string) => void;
  onSaveProgressToCloud: (item: {
    toolName: string;
    summary: string;
    details: string;
    category: 'academic' | 'finance' | 'utility' | 'ai_note';
  }) => Promise<void>;
  showToast: (msg: string) => void;
  bookmarkedTopics?: string[];
  onToggleBookmark?: (topicId: string, title: string) => void;
  onTopicVisited?: (lang: 'java' | 'python', topicId: string) => void;
}

export default function ProgrammingHub({
  activeLang,
  onSelectLang,
  onAskAiTutor,
  onSaveProgressToCloud,
  showToast,
  bookmarkedTopics = [],
  onToggleBookmark,
  onTopicVisited,
}: ProgrammingHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | TopicLevel>('All');
  const [viewMode, setViewMode] = useState<'split' | 'cards'>('split');

  const [selectedJavaId, setSelectedJavaId] = useState<string>(JAVA_TOPICS[0].id);
  const [selectedPythonId, setSelectedPythonId] = useState<string>(PYTHON_TOPICS[0].id);

  // Progress tracking stored in localStorage
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('studentToolsProgProgress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Expandable state for coding practice solutions and interview answers
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [openInterviewQA, setOpenInterviewQA] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('studentToolsProgProgress', JSON.stringify(completedIds));
  }, [completedIds]);

  const currentTopics = activeLang === 'java' ? JAVA_TOPICS : PYTHON_TOPICS;
  const selectedTopicId = activeLang === 'java' ? selectedJavaId : selectedPythonId;

  const setSelectedTopicId = (id: string) => {
    if (activeLang === 'java') {
      setSelectedJavaId(id);
    } else {
      setSelectedPythonId(id);
    }
    onTopicVisited?.(activeLang, id);
  };

  // Filtered topics by search and difficulty level
  const filteredTopics = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return currentTopics.filter((topic) => {
      const matchesLevel = levelFilter === 'All' || topic.level === levelFilter;
      if (!matchesLevel) return false;
      if (!q) return true;
      const inTitle = topic.title.toLowerCase().includes(q);
      const inSummary = topic.summary.toLowerCase().includes(q);
      const inExplanation = topic.explanation.some((p) => p.toLowerCase().includes(q));
      const inCode =
        topic.syntax.toLowerCase().includes(q) || topic.exampleCode.toLowerCase().includes(q);
      const inQuestions =
        topic.practiceQuestions.some((pq) => pq.problem.toLowerCase().includes(q)) ||
        topic.interviewQuestions.some((iq) => iq.question.toLowerCase().includes(q));
      return inTitle || inSummary || inExplanation || inCode || inQuestions;
    });
  }, [currentTopics, searchTerm, levelFilter]);

  const activeTopic: ProgrammingTopic =
    currentTopics.find((t) => t.id === selectedTopicId) ||
    filteredTopics[0] ||
    currentTopics[0];

  const activeIndex = currentTopics.findIndex((t) => t.id === activeTopic.id);

  // Compute progress percentages
  const javaCompletedCount = JAVA_TOPICS.filter((t) => completedIds[t.id]).length;
  const javaProgressPct = Math.round((javaCompletedCount / JAVA_TOPICS.length) * 100);

  const pythonCompletedCount = PYTHON_TOPICS.filter((t) => completedIds[t.id]).length;
  const pythonProgressPct = Math.round((pythonCompletedCount / PYTHON_TOPICS.length) * 100);

  const toggleCompleted = (id: string, title: string) => {
    setCompletedIds((prev) => {
      const nextState = !prev[id];
      showToast(nextState ? `✅ Marked "${title}" as completed!` : `Marked "${title}" as incomplete.`);
      return { ...prev, [id]: nextState };
    });
  };

  const getLevelBadgeStyle = (level: TopicLevel) => {
    if (level === 'Beginner') {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/50';
    }
    if (level === 'Intermediate') {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50';
    }
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/50';
  };

  return (
    <section className="section" id="programming">
      {/* Anchor targets so both #java and #python scroll smoothly here */}
      <div id="java" className="scroll-mt-20" />
      <div id="python" className="scroll-mt-20" />

      <div className="container">
        <div className="section-title">
          <div className="badge">💻 Structured Programming Tracks</div>
          <h2>Learn Java &amp; Python Programming</h2>
          <p>
            Step-by-step tutorials organized from Beginner to Intermediate to Advanced with syntax,
            examples, expected output, coding practice, and interview Q&amp;A.
          </p>
        </div>

        {/* ======================================================
            LANGUAGE TRACK SELECTOR CARDS (1. JAVA | 2. PYTHON)
            ====================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
          {/* Option 1: JAVA */}
          <div
            onClick={() => onSelectLang('java')}
            className={`card cursor-pointer transition-all ${
              activeLang === 'java'
                ? 'ring-2 ring-indigo-500 border-indigo-500'
                : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="tool-icon !mb-0">☕</div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">
                    Option 1 • 41 Modules
                  </span>
                  <h3 className="text-xl font-extrabold">JAVA Programming</h3>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeLang === 'java'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                {activeLang === 'java' ? 'Active Track' : 'Switch to Java'}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Core Java, Data Types, Loops, Arrays, Strings, OOP Pillars, Collections,
              Multithreading, Interview Q&amp;A &amp; Coding Problems.
            </p>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>
                  Java Progress: {javaCompletedCount} / {JAVA_TOPICS.length} Topics
                </span>
                <span className="text-indigo-500">{javaProgressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${javaProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Option 2: PYTHON */}
          <div
            onClick={() => onSelectLang('python')}
            className={`card cursor-pointer transition-all ${
              activeLang === 'python'
                ? 'ring-2 ring-indigo-500 border-indigo-500'
                : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="tool-icon !mb-0">🐍</div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">
                    Option 2 • 35 Modules
                  </span>
                  <h3 className="text-xl font-extrabold">PYTHON Programming</h3>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeLang === 'python'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                {activeLang === 'python' ? 'Active Track' : 'Switch to Python'}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Python 3 Basics, Lists, Tuples, Sets, Dictionaries, Lambdas, File Handling, Python
              OOP, Interview Q&amp;A &amp; Coding Problems.
            </p>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>
                  Python Progress: {pythonCompletedCount} / {PYTHON_TOPICS.length} Topics
                </span>
                <span className="text-indigo-500">{pythonProgressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${pythonProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            SEARCH, LEVEL FILTER & VIEW MODE BAR
            ====================================================== */}
        <div className="card mb-6 !p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`🔍 Search ${
                  activeLang === 'java' ? '26 Java' : '23 Python'
                } topics, syntax, examples, or interview questions...`}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--text)] font-bold"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Difficulty Filter Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    levelFilter === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] hover:border-indigo-500'
                  }`}
                >
                  {lvl === 'All' ? `All (${currentTopics.length})` : lvl}
                </button>
              ))}
            </div>

            {/* View Toggle & Cloud Sync */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                className="small-outline-btn"
                onClick={() => setViewMode((v) => (v === 'split' ? 'cards' : 'split'))}
              >
                {viewMode === 'split' ? '🗂️ All Topic Cards' : '📖 Lesson Reader'}
              </button>
              <button
                type="button"
                className="small-outline-btn"
                onClick={() =>
                  onSaveProgressToCloud({
                    toolName: `${activeLang.toUpperCase()} Track Progress`,
                    summary: `Java: ${javaCompletedCount}/${JAVA_TOPICS.length} (${javaProgressPct}%) | Python: ${pythonCompletedCount}/${PYTHON_TOPICS.length} (${pythonProgressPct}%)`,
                    details: `Current Topic: ${activeTopic.title} (${activeTopic.level})`,
                    category: 'academic',
                  })
                }
              >
                ☁️ Save Progress
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
            MODE A: TOPIC CARDS GRID OVERVIEW
            ====================================================== */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredTopics.map((topic) => {
              const isDone = !!completedIds[topic.id];
              const isCurrent = topic.id === activeTopic.id;
              return (
                <div
                  key={topic.id}
                  className={`card !p-5 flex flex-col justify-between transition hover:-translate-y-1 ${
                    isCurrent ? 'border-indigo-500 ring-1 ring-indigo-500' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-extrabold text-indigo-500">
                        #{topic.number} • {activeLang.toUpperCase()}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getLevelBadgeStyle(
                          topic.level
                        )}`}
                      >
                        {topic.level}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base mb-1.5 flex items-center gap-1.5">
                      <span>{topic.title}</span>
                      {isDone && <span title="Completed">✅</span>}
                    </h3>
                    <p className="text-xs text-[var(--muted)] mb-4 line-clamp-2">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
                    <button
                      type="button"
                      className="link-btn text-xs"
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setViewMode('split');
                      }}
                    >
                      Open Lesson →
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompleted(topic.id, topic.title)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border transition ${
                        isDone
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-[var(--border)] text-[var(--muted)] hover:border-indigo-500'
                      }`}
                    >
                      {isDone ? '✓ Completed' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================
            MODE B: INTERACTIVE SIDEBAR + FULL LESSON VIEW
            ====================================================== */}
        {viewMode === 'split' && (
          <div className="java-layout">
            {/* Left Topic List Sidebar */}
            <div className="topic-list max-h-[760px] lg:overflow-y-auto pr-1">
              {filteredTopics.length === 0 ? (
                <div className="p-4 text-xs text-[var(--muted)] border border-dashed border-[var(--border)] rounded-xl text-center">
                  No topics match &ldquo;{searchTerm}&rdquo;.
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const isSelected = topic.id === activeTopic.id;
                  const isDone = !!completedIds[topic.id];
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`topic-btn flex items-center justify-between gap-2 ${
                        isSelected ? 'active' : ''
                      }`}
                      onClick={() => setSelectedTopicId(topic.id)}
                    >
                      <span className="truncate text-sm">
                        {topic.number}. {topic.title}
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0 text-xs">
                        {isDone ? (
                          <span>✅</span>
                        ) : (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[var(--bg)] text-[var(--muted)]'
                            }`}
                          >
                            {topic.level.slice(0, 3)}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Detailed Lesson Content */}
            <div className="java-content">
              {/* Lesson Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">
                      {activeLang === 'java' ? '☕ Java Module' : '🐍 Python Module'} #
                      {activeTopic.number}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getLevelBadgeStyle(
                        activeTopic.level
                      )}`}
                    >
                      {activeTopic.level}
                    </span>
                  </div>
                  <h2 className="!mb-1">{activeTopic.title}</h2>
                  <p className="text-sm">{activeTopic.summary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleBookmark?.(activeTopic.id, activeTopic.title)
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      bookmarkedTopics.includes(activeTopic.id)
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                        : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] hover:border-amber-500'
                    }`}
                  >
                    <span>{bookmarkedTopics.includes(activeTopic.id) ? '★' : '☆'}</span>
                    <span>
                      {bookmarkedTopics.includes(activeTopic.id)
                        ? 'Bookmarked'
                        : 'Bookmark'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompleted(activeTopic.id, activeTopic.title)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                      completedIds[activeTopic.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] hover:border-indigo-500'
                    }`}
                  >
                    {completedIds[activeTopic.id]
                      ? '✅ Topic Completed'
                      : '☐ Mark as Completed'}
                  </button>
                </div>
              </div>

              {/* 1. Beginner-Friendly Explanation */}
              <div className="mb-6">
                <h3 className="!mt-0 text-base font-extrabold mb-2">
                  📘 Concept Explanation
                </h3>
                <div className="space-y-2 text-sm leading-relaxed">
                  {activeTopic.explanation.map((para, i) => (
                    <p key={i}>• {para}</p>
                  ))}
                </div>
              </div>

              {/* 2. Syntax Block */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="!m-0 text-base font-extrabold">🧩 Syntax</h3>
                  <button
                    type="button"
                    className="small-outline-btn !py-1 !px-2.5 text-xs"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeTopic.syntax);
                      showToast('Copied syntax to clipboard!');
                    }}
                  >
                    📋 Copy Syntax
                  </button>
                </div>
                <div className="code !my-0">{activeTopic.syntax}</div>
              </div>

              {/* 3. Simple Working Example */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="!m-0 text-base font-extrabold">
                    💻 Example ({activeLang === 'java' ? 'Main.java' : 'main.py'})
                  </h3>
                  <button
                    type="button"
                    className="small-outline-btn !py-1 !px-2.5 text-xs"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeTopic.exampleCode);
                      showToast('Copied example code!');
                    }}
                  >
                    📋 Copy Code
                  </button>
                </div>
                <div className="code !my-0">{activeTopic.exampleCode}</div>
              </div>

              {/* 4. Expected Output */}
              <div className="mb-6">
                <h3 className="!mt-0 text-base font-extrabold mb-1.5">🖥️ Expected Output</h3>
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap border border-slate-700">
                  {activeTopic.expectedOutput}
                </div>
              </div>

              {/* 5. Coding Practice Questions */}
              <div className="mb-6">
                <h3 className="!mt-0 text-base font-extrabold mb-2.5">
                  🏋️ Hands-On Coding Practice
                </h3>
                <div className="space-y-3">
                  {activeTopic.practiceQuestions.map((pq, idx) => {
                    const solKey = `${activeTopic.id}_sol_${idx}`;
                    const isOpen = !!openSolutions[solKey];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                      >
                        <div className="font-bold text-sm mb-1">{pq.problem}</div>
                        <div className="text-xs text-[var(--muted)] mb-2.5">
                          💡 <strong>Hint:</strong> {pq.hint}
                        </div>
                        <button
                          type="button"
                          className="small-outline-btn text-xs"
                          onClick={() =>
                            setOpenSolutions((prev) => ({ ...prev, [solKey]: !prev[solKey] }))
                          }
                        >
                          {isOpen ? 'Hide Solution ▲' : 'Show Solution & Output ▼'}
                        </button>

                        {isOpen && (
                          <div className="mt-3">
                            <div className="code !my-2">{pq.solution}</div>
                            <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs">
                              Output: {pq.output}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Topic Interview Questions & Answers */}
              <div className="mb-6">
                <h3 className="!mt-0 text-base font-extrabold mb-2.5">
                  🎯 Topic Interview Questions
                </h3>
                <div className="space-y-2.5">
                  {activeTopic.interviewQuestions.map((iq, idx) => {
                    const qaKey = `${activeTopic.id}_qa_${idx}`;
                    const isOpen = !!openInterviewQA[qaKey];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-sm">Q: {iq.question}</div>
                          <button
                            type="button"
                            className="small-outline-btn !py-1 !px-2.5 text-xs flex-shrink-0"
                            onClick={() =>
                              setOpenInterviewQA((prev) => ({ ...prev, [qaKey]: !prev[qaKey] }))
                            }
                          >
                            {isOpen ? 'Hide' : 'Answer'}
                          </button>
                        </div>
                        {isOpen && (
                          <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] text-sm text-[var(--muted)]">
                            <strong className="text-indigo-500">Answer:</strong> {iq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation & AI Tutor Action Bar */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="secondary-btn text-xs !py-2 !px-3.5"
                    disabled={activeIndex <= 0}
                    onClick={() => {
                      if (activeIndex > 0) {
                        setSelectedTopicId(currentTopics[activeIndex - 1].id);
                      }
                    }}
                  >
                    ← Previous Topic
                  </button>
                  <button
                    type="button"
                    className="primary-btn text-xs !py-2 !px-3.5"
                    disabled={activeIndex >= currentTopics.length - 1}
                    onClick={() => {
                      if (activeIndex < currentTopics.length - 1) {
                        setSelectedTopicId(currentTopics[activeIndex + 1].id);
                      }
                    }}
                  >
                    Next Topic →
                  </button>
                </div>

                <button
                  type="button"
                  className="small-outline-btn"
                  onClick={() =>
                    onAskAiTutor(
                      `Explain ${activeLang.toUpperCase()} "${activeTopic.title}" with an extra practice problem and interview tip.`
                    )
                  }
                >
                  🤖 Ask Gemini AI Tutor about {activeTopic.title}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

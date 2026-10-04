import React from 'react';
import { User } from 'firebase/auth';
import { JAVA_TOPICS } from '../data/javaTopics';
import { PYTHON_TOPICS } from '../data/pythonTopics';
import { CODING_PROBLEMS } from '../data/codingProblems';
import { INTERVIEW_QUESTIONS_DATABASE } from '../data/interviewQuestions';

interface StudentDashboardProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  completedTopics: Record<string, boolean>;
  bookmarkedTopics: string[];
  recentlyViewedTopicIds: string[];
  lastVisitedTopicId: string | null;
  lastVisitedLang: 'java' | 'python';
  completedProblemIds: string[];
  practicedInterviewIds: Record<string, boolean>;
  onNavigateToTopic: (lang: 'java' | 'python', topicId: string) => void;
  onNavigateToProblem: (problemId: string) => void;
  showToast: (msg: string) => void;
}

export default function StudentDashboard({
  currentUser,
  onOpenAuth,
  completedTopics,
  bookmarkedTopics,
  recentlyViewedTopicIds,
  lastVisitedTopicId,
  lastVisitedLang,
  completedProblemIds,
  practicedInterviewIds,
  onNavigateToTopic,
  onNavigateToProblem,
  showToast,
}: StudentDashboardProps) {
  // Real stats calculation
  const javaCompleted = JAVA_TOPICS.filter((t) => completedTopics[t.id]).length;
  const javaPct = Math.round((javaCompleted / JAVA_TOPICS.length) * 100);

  const pythonCompleted = PYTHON_TOPICS.filter((t) => completedTopics[t.id]).length;
  const pythonPct = Math.round((pythonCompleted / PYTHON_TOPICS.length) * 100);

  const problemsSolved = completedProblemIds.length;
  const totalProblems = CODING_PROBLEMS.length;
  const problemsPct = Math.round((problemsSolved / totalProblems) * 100);

  const interviewSolved = Object.keys(practicedInterviewIds).filter(
    (k) => practicedInterviewIds[k]
  ).length;
  const totalInterview = INTERVIEW_QUESTIONS_DATABASE.length;
  const interviewPct = Math.round((interviewSolved / totalInterview) * 100);

  // Determine last visited or default first lesson for Continue Learning
  const currentList = lastVisitedLang === 'python' ? PYTHON_TOPICS : JAVA_TOPICS;
  const lastTopic =
    currentList.find((t) => t.id === lastVisitedTopicId) ||
    currentList[0];

  // Bookmarked topic objects
  const allTopics = [...JAVA_TOPICS, ...PYTHON_TOPICS];
  const bookmarkedItems = allTopics.filter((t) => bookmarkedTopics.includes(t.id));

  // Recently viewed topic objects
  const recentItems = allTopics.filter((t) =>
    recentlyViewedTopicIds.includes(t.id)
  );

  return (
    <section className="section" id="dashboard">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--border)]">
          <div>
            <div className="badge !mb-2">📊 Real-Time Academic Center</div>
            <h2 className="text-2xl md:text-3xl font-black">Student Learning Dashboard</h2>
            <p className="text-sm text-[var(--muted)]">
              {currentUser
                ? `Logged in as ${currentUser.displayName || currentUser.email} · Progress synced with Firebase`
                : 'Local browser session active. Sign in to sync your progress across mobile, tablet & desktop.'}
            </p>
          </div>

          {!currentUser ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="primary-btn !py-2.5 !px-5 text-sm self-start md:self-auto flex items-center gap-2"
            >
              <span>🔐</span>
              <span>Sign In / Create Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="small-outline-btn !py-2 !px-4 text-xs self-start md:self-auto flex items-center gap-2"
            >
              <span>👤</span>
              <span>Manage Profile</span>
            </button>
          )}
        </div>

        {/* ================= CONTINUE LEARNING BANNER ================= */}
        <div className="card mb-8 !p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border-indigo-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-1.5">
                <span>⏱️ Continue Learning Where You Left Off</span>
              </span>
              <h3 className="text-xl font-black mb-1">
                {lastVisitedLang === 'python' ? '🐍 Python' : '☕ Java'} Module #{lastTopic.number}:{' '}
                {lastTopic.title}
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-2xl">
                {lastTopic.summary}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onNavigateToTopic(lastVisitedLang, lastTopic.id);
                  showToast(`Resuming "${lastTopic.title}"`);
                }}
                className="primary-btn !py-3 !px-6 text-sm font-black whitespace-nowrap shadow-lg"
              >
                Resume Lesson →
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4 REAL PROGRESS METRICS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Java Progress */}
          <div className="card !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">☕</span>
                <div>
                  <h4 className="font-bold text-sm">Java Track</h4>
                  <span className="text-xs text-[var(--muted)]">
                    {javaCompleted} of {JAVA_TOPICS.length} Completed
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-indigo-500">{javaPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${javaPct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTopic('java', JAVA_TOPICS[0].id)}
              className="mt-3 text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              Open Java Track →
            </button>
          </div>

          {/* Python Progress */}
          <div className="card !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🐍</span>
                <div>
                  <h4 className="font-bold text-sm">Python Track</h4>
                  <span className="text-xs text-[var(--muted)]">
                    {pythonCompleted} of {PYTHON_TOPICS.length} Completed
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-indigo-500">{pythonPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${pythonPct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTopic('python', PYTHON_TOPICS[0].id)}
              className="mt-3 text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              Open Python Track →
            </button>
          </div>

          {/* Coding Practice Progress */}
          <div className="card !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💻</span>
                <div>
                  <h4 className="font-bold text-sm">Coding Practice</h4>
                  <span className="text-xs text-[var(--muted)]">
                    {problemsSolved} of {totalProblems} Solved
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-indigo-500">{problemsPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${problemsPct}%` }}
              />
            </div>
            <a
              href="#coding-practice"
              className="mt-3 text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              Practice Problems →
            </a>
          </div>

          {/* Interview Prep Progress */}
          <div className="card !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold text-sm">Interview Q&amp;A</h4>
                  <span className="text-xs text-[var(--muted)]">
                    {interviewSolved} of {totalInterview} Reviewed
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-indigo-500">{interviewPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${interviewPct}%` }}
              />
            </div>
            <a
              href="#interview"
              className="mt-3 text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
            >
              Review Questions →
            </a>
          </div>
        </div>

        {/* ================= SAVED / BOOKMARKED TOPICS & RECENTLY VIEWED ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookmarks */}
          <div className="card !p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>🔖</span>
                <span>Saved &amp; Bookmarked Topics</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
                {bookmarkedItems.length} Saved
              </span>
            </div>

            {bookmarkedItems.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted)]">
                <p className="mb-2">No bookmarks saved yet.</p>
                <p>
                  Click the <strong>🔖 Bookmark</strong> button on any Java or Python lesson to
                  save it here for quick revision!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {bookmarkedItems.map((item) => {
                  const isJava = JAVA_TOPICS.some((j) => j.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center justify-between gap-3 hover:border-indigo-500 transition"
                    >
                      <div className="truncate">
                        <span className="text-[11px] font-black uppercase text-indigo-500 block">
                          {isJava ? '☕ Java' : '🐍 Python'} • #{item.number}
                        </span>
                        <h4 className="text-sm font-bold truncate">{item.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateToTopic(isJava ? 'java' : 'python', item.id)
                        }
                        className="small-outline-btn !py-1 !px-3 text-xs flex-shrink-0"
                      >
                        Open →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Viewed */}
          <div className="card !p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>👁️</span>
                <span>Recently Viewed Topics</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
                {recentItems.length} Recent
              </span>
            </div>

            {recentItems.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted)]">
                <p className="mb-2">No history recorded yet.</p>
                <p>
                  As you browse Java and Python lessons, your latest visited modules will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {recentItems.map((item) => {
                  const isJava = JAVA_TOPICS.some((j) => j.id === item.id);
                  const isDone = !!completedTopics[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center justify-between gap-3 hover:border-indigo-500 transition"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase text-indigo-500">
                            {isJava ? '☕ Java' : '🐍 Python'} • #{item.number}
                          </span>
                          {isDone && <span className="text-xs text-emerald-500 font-bold">✓ Completed</span>}
                        </div>
                        <h4 className="text-sm font-bold truncate">{item.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateToTopic(isJava ? 'java' : 'python', item.id)
                        }
                        className="small-outline-btn !py-1 !px-3 text-xs flex-shrink-0"
                      >
                        Review →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

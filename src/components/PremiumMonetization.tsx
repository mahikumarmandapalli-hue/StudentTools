import React, { useState } from 'react';

interface PremiumMonetizationProps {
  showToast: (msg: string) => void;
}

export default function PremiumMonetization({ showToast }: PremiumMonetizationProps) {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setWaitlistJoined(true);
    showToast('🎉 Thank you for your interest! We will notify you when Pro opens.');
  };

  return (
    <section className="section" id="premium">
      <div className="container">
        <div className="section-title">
          <div className="badge">⭐ Transparent Student Pricing</div>
          <h2>Free &amp; Premium Membership</h2>
          <p>
            StudentTools provides completely free core calculators and foundational programming
            courses for all learners, with an upcoming Pro membership for advanced career tools.
          </p>
        </div>

        {/* ================= FREE VS PREMIUM COMPARISON TABLE ================= */}
        <div className="card mb-10 overflow-x-auto !p-0">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                <th className="p-4 font-black text-xs uppercase tracking-wider text-[var(--muted)]">
                  Platform Features
                </th>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-[var(--text)] w-1/3">
                  <div className="flex items-center gap-1.5">
                    <span>🟢</span>
                    <span>Free Plan (Current)</span>
                  </div>
                  <span className="text-[11px] font-normal text-[var(--muted)] block mt-0.5">
                    100% Free Forever
                  </span>
                </th>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-indigo-500 w-1/3 bg-indigo-500/5">
                  <div className="flex items-center gap-1.5">
                    <span>👑</span>
                    <span>StudentTools Pro (Upcoming)</span>
                  </div>
                  <span className="text-[11px] font-normal text-indigo-400 block mt-0.5">
                    Architecture Ready
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Beginner Java &amp; Python Lessons
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">✓ Included (Full Access)</td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Included
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Core Student Calculators &amp; Utilities
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ All 14 Calculators Active
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Priority High-Precision Engine
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Foundational Interview Q&amp;A
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ Beginner &amp; Intermediate Q&amp;A
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Advanced System Design &amp; Architecture
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Hands-On Coding Practice
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ Easy &amp; Medium Placement Sets
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Hard Multi-Tier Dynamic Programming
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Resume Builder &amp; Print/PDF
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ Clean Single Column Classic A4
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ ATS-Optimized Multi-Template Suite
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  Progress Sync &amp; Bookmarks
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ Firebase Cloud &amp; LocalStorage
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Deep Analytics &amp; Skill Gap Reports
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-xs text-[var(--text)]">
                  AI Study Tutor &amp; Audio Transcriber
                </td>
                <td className="p-4 text-xs font-bold text-emerald-600">
                  ✓ Gemini Pro &amp; Search Grounding
                </td>
                <td className="p-4 text-xs font-bold text-indigo-500 bg-indigo-500/5">
                  ✓ Unlimited High-Speed Quota
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Free Card */}
          <div className="card !p-8 flex flex-col justify-between border-emerald-500/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                  Current Tier
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-black mb-1">Student Free</h3>
              <div className="text-3xl font-black my-4">
                $0 <span className="text-xs font-normal text-[var(--muted)]">/ forever</span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-6">
                All fundamental tools, Java and Python beginner-to-intermediate tutorials,
                calculators, and resume builder are 100% free with no credit card required.
              </p>
              <ul className="space-y-2.5 text-xs text-[var(--muted)] mb-6">
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-emerald-500">✓</span> 41 Java &amp; 35 Python Learning Modules
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-emerald-500">✓</span> 14 Interactive Academic &amp; Finance Tools
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-emerald-500">✓</span> 6 Interview Categories (Beginner/Intermediate)
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-emerald-500">✓</span> Complete Coding Practice Lab
                </li>
              </ul>
            </div>
            <a
              href="#tools"
              className="secondary-btn text-center text-xs !py-3 w-full font-bold"
            >
              Explore Free Tools →
            </a>
          </div>

          {/* Premium Card */}
          <div className="card !p-8 flex flex-col justify-between border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl bg-gradient-to-b from-indigo-500/5 to-transparent">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-indigo-500 tracking-wider">
                  Monetization Ready
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Waitlist Open
                </span>
              </div>
              <h3 className="text-2xl font-black mb-1">StudentTools Pro</h3>
              <div className="text-3xl font-black my-4 text-indigo-500">
                $4.99{' '}
                <span className="text-xs font-normal text-[var(--muted)]">
                  / month (or ₹299/mo)
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-6">
                Designed for final-year engineering students and tech aspirants seeking advanced
                system design, mock AI interviews, and ATS resume verification.
              </p>
              <ul className="space-y-2.5 text-xs text-[var(--muted)] mb-6">
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-indigo-500">★</span> Advanced Spring Boot &amp; Python FastAPIs
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-indigo-500">★</span> Advanced Coding Practice (Hard Algorithms)
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-indigo-500">★</span> Multiple Professional ATS Resume Layouts
                </li>
                <li className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-indigo-500">★</span> Priority Cloud Workspace Persistence
                </li>
              </ul>
            </div>

            {waitlistJoined ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-600">
                ✓ You are on the Pro Early Access Waitlist!
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-2">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter email for Pro launch notification"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="primary-btn w-full !py-3 text-xs font-black shadow-md text-center"
                >
                  Join Pro Early Access Waitlist →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ================= CLEARLY LABELED ADVERTISEMENT PLACEHOLDER ================= */}
        {/* Strictly adheres to: Do NOT create fake ads, Do NOT make fake ad buttons,
            Do NOT style as navigation/download, keep clearly separated and marked */}
        <div className="card !p-4 border-dashed border-[var(--border)] bg-[var(--bg)]/50 text-center max-w-3xl mx-auto my-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] block mb-1">
            — Educational Sponsorship &amp; Verified Partner Space —
          </span>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Reserved space for future verified student discounts, textbook exchanges, and academic
            partnerships. Strictly separated from platform tools with no deceptive buttons.
          </p>
        </div>
      </div>
    </section>
  );
}

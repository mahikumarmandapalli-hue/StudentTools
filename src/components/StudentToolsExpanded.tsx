import React, { useState, useEffect, useRef } from 'react';

interface StudentToolsExpandedProps {
  onSaveToCloud: (item: {
    toolName: string;
    summary: string;
    details: string;
    category: 'academic' | 'finance' | 'utility' | 'ai_note';
  }) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function StudentToolsExpanded({
  onSaveToCloud,
  showToast,
}: StudentToolsExpandedProps) {
  // 1. Percentage Calculator
  const [percObtained, setPercObtained] = useState('');
  const [percTotal, setPercTotal] = useState('');
  const [percResult, setPercResult] = useState<string | null>(null);

  // 2. CGPA Calculator
  const [cgpaList, setCgpaList] = useState<string[]>(['8.5', '8.8', '9.0', '']);
  const [cgpaAvgResult, setCgpaAvgResult] = useState<string | null>(null);

  // 3. GPA Calculator
  const [gpaInputs, setGpaInputs] = useState<string[]>(['9', '8.5', '9.2', '']);
  const [gpaResult, setGpaResult] = useState<string | null>(null);

  // 4. Age Calculator
  const [dob, setDob] = useState('2003-05-15');
  const [ageCalcResult, setAgeCalcResult] = useState<string | null>(null);

  // 5. Unit Converter
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'data' | 'temp'>('length');
  const [unitFromVal, setUnitFromVal] = useState('10');
  const [unitFrom, setUnitFrom] = useState('meters');
  const [unitTo, setUnitTo] = useState('feet');

  // 6. Study Timer / Stopwatch
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // 7. Word & Character Counter
  const [counterText, setCounterText] = useState(
    'StudentTools is an all-in-one educational platform engineered for college students and developers.'
  );

  // 8. Quick Notes
  const [quickNotes, setQuickNotes] = useState(() => {
    return localStorage.getItem('studentToolsQuickNotes') || '1. Revise Java OOP and Streams\n2. Solve Two Sum on Coding Practice\n3. Review SQL window functions';
  });

  // 9. To-Do List
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean; priority: 'low' | 'med' | 'high' }[]>(() => {
    try {
      const saved = localStorage.getItem('studentToolsTodoList');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: '1', text: 'Complete Semester 6 Project Submission', done: false, priority: 'high' },
      { id: '2', text: 'Review Python Decorators & Generators', done: true, priority: 'med' },
      { id: '3', text: 'Format resume for upcoming campus drive', done: false, priority: 'high' },
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'med' | 'high'>('med');

  // Persist notes & todos locally
  useEffect(() => {
    localStorage.setItem('studentToolsQuickNotes', quickNotes);
  }, [quickNotes]);

  useEffect(() => {
    localStorage.setItem('studentToolsTodoList', JSON.stringify(todos));
  }, [todos]);

  // Stopwatch interval
  useEffect(() => {
    let timer: number | null = null;
    if (stopwatchRunning) {
      timer = window.setInterval(() => {
        setStopwatchTime((t) => t + 10);
      }, 10);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stopwatchRunning]);

  // Calculations
  const handleCalcPercentage = () => {
    const obt = parseFloat(percObtained);
    const tot = parseFloat(percTotal);
    if (isNaN(obt) || isNaN(tot) || tot <= 0 || obt < 0) {
      showToast('Enter valid marks.');
      return;
    }
    const pct = (obt / tot) * 100;
    setPercResult(`${pct.toFixed(2)}%`);
  };

  const handleCalcCGPA = () => {
    const valid = cgpaList.map(parseFloat).filter((n) => !isNaN(n) && n >= 0 && n <= 10);
    if (!valid.length) {
      showToast('Enter valid CGPA values (0 - 10).');
      return;
    }
    const sum = valid.reduce((a, b) => a + b, 0);
    setCgpaAvgResult((sum / valid.length).toFixed(2));
  };

  const handleCalcGPA = () => {
    const valid = gpaInputs.map(parseFloat).filter((n) => !isNaN(n) && n >= 0 && n <= 10);
    if (!valid.length) {
      showToast('Enter valid GPA scores.');
      return;
    }
    const sum = valid.reduce((a, b) => a + b, 0);
    setGpaResult((sum / valid.length).toFixed(2));
  };

  const handleCalcAge = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += 30;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAgeCalcResult(`${years} Years, ${months} Months, ${days} Days`);
  };

  // Unit converter logic
  const getConvertedUnit = () => {
    const val = parseFloat(unitFromVal);
    if (isNaN(val)) return 'Invalid Number';

    if (unitCategory === 'length') {
      // Base: meters
      const toMeters: Record<string, number> = { meters: 1, km: 1000, feet: 0.3048, miles: 1609.34 };
      const m = val * (toMeters[unitFrom] || 1);
      const res = m / (toMeters[unitTo] || 1);
      return `${res.toFixed(4)} ${unitTo}`;
    }
    if (unitCategory === 'weight') {
      // Base: kg
      const toKg: Record<string, number> = { kg: 1, grams: 0.001, lbs: 0.453592, ounces: 0.0283495 };
      const kg = val * (toKg[unitFrom] || 1);
      const res = kg / (toKg[unitTo] || 1);
      return `${res.toFixed(4)} ${unitTo}`;
    }
    if (unitCategory === 'data') {
      // Base: MB
      const toMB: Record<string, number> = { MB: 1, GB: 1024, TB: 1048576, KB: 0.0009765625 };
      const mb = val * (toMB[unitFrom] || 1);
      const res = mb / (toMB[unitTo] || 1);
      return `${res.toFixed(4)} ${unitTo}`;
    }
    // temp
    if (unitFrom === 'celsius' && unitTo === 'fahrenheit') return `${((val * 9) / 5 + 32).toFixed(2)} °F`;
    if (unitFrom === 'fahrenheit' && unitTo === 'celsius') return `${(((val - 32) * 5) / 9).toFixed(2)} °C`;
    return `${val} ${unitTo}`;
  };

  // Stopwatch formatting
  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  // Word counter stats
  const wordCount = counterText.trim() ? counterText.trim().split(/\s+/).length : 0;
  const charCountWithSpaces = counterText.length;
  const charCountNoSpaces = counterText.replace(/\s+/g, '').length;
  const sentenceCount = counterText.trim() ? (counterText.match(/[.!?]+(?:\s+|$)/g) || []).length || 1 : 0;
  const readingTimeMins = Math.ceil(wordCount / 200);

  // Todo handlers
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: String(Date.now()), text: newTodoText.trim(), done: false, priority: newTodoPriority },
    ]);
    setNewTodoText('');
    showToast('Task added to checklist!');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed.');
  };

  return (
    <div className="space-y-8 mt-10">
      <div className="section-title !mb-6">
        <div className="badge">🛠️ Academic &amp; Productivity Toolkit</div>
        <h2>All Student Tools &amp; Utilities</h2>
        <p>
          Calculators, counters, study timers, notes, and task checklists designed for everyday student productivity.
        </p>
      </div>

      {/* Grid of All Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Percentage Calculator */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📊</span>
              <h3 className="font-extrabold text-base">Percentage Calculator</h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              Calculate percentage from obtained and total marks.
            </p>
            <div className="space-y-2 mb-3">
              <input
                type="number"
                placeholder="Obtained Marks (e.g. 465)"
                value={percObtained}
                onChange={(e) => setPercObtained(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)]"
              />
              <input
                type="number"
                placeholder="Total Marks (e.g. 500)"
                value={percTotal}
                onChange={(e) => setPercTotal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>
          </div>
          <div>
            <button type="button" onClick={handleCalcPercentage} className="primary-btn w-full !py-2 text-xs font-bold mb-2">
              Calculate Percentage
            </button>
            {percResult && (
              <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center text-xs font-bold">
                Result: <span className="text-indigo-500 font-black">{percResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. CGPA Calculator */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧮</span>
              <h3 className="font-extrabold text-base">CGPA Calculator</h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              Average your semester CGPAs into an overall score.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {cgpaList.map((val, idx) => (
                <input
                  key={idx}
                  type="number"
                  step="0.01"
                  placeholder={`Sem ${idx + 1}`}
                  value={val}
                  onChange={(e) => {
                    const next = [...cgpaList];
                    next[idx] = e.target.value;
                    setCgpaList(next);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCgpaList((prev) => [...prev, ''])}
              className="text-[11px] font-bold text-indigo-500 hover:underline mb-2 block"
            >
              + Add Semester
            </button>
          </div>
          <div>
            <button type="button" onClick={handleCalcCGPA} className="primary-btn w-full !py-2 text-xs font-bold mb-2">
              Calculate Average CGPA
            </button>
            {cgpaAvgResult && (
              <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center text-xs font-bold">
                Cumulative CGPA: <span className="text-indigo-500 font-black">{cgpaAvgResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. GPA Calculator */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎓</span>
              <h3 className="font-extrabold text-base">GPA Calculator</h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              Subject grade point average calculator.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {gpaInputs.map((val, idx) => (
                <input
                  key={idx}
                  type="number"
                  step="0.01"
                  placeholder={`Subj ${idx + 1}`}
                  value={val}
                  onChange={(e) => {
                    const next = [...gpaInputs];
                    next[idx] = e.target.value;
                    setGpaInputs(next);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setGpaInputs((prev) => [...prev, ''])}
              className="text-[11px] font-bold text-indigo-500 hover:underline mb-2 block"
            >
              + Add Subject
            </button>
          </div>
          <div>
            <button type="button" onClick={handleCalcGPA} className="primary-btn w-full !py-2 text-xs font-bold mb-2">
              Calculate GPA
            </button>
            {gpaResult && (
              <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center text-xs font-bold">
                GPA Score: <span className="text-indigo-500 font-black">{gpaResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Age Calculator */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎂</span>
              <h3 className="font-extrabold text-base">Age Calculator</h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              Calculate exact age in years, months, and days.
            </p>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] mb-3"
            />
          </div>
          <div>
            <button type="button" onClick={handleCalcAge} className="primary-btn w-full !py-2 text-xs font-bold mb-2">
              Calculate Age
            </button>
            {ageCalcResult && (
              <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center text-xs font-bold">
                {ageCalcResult}
              </div>
            )}
          </div>
        </div>

        {/* 5. Unit Converter */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔄</span>
              <h3 className="font-extrabold text-base">Unit Converter</h3>
            </div>
            <div className="flex gap-1 mb-3">
              {(['length', 'weight', 'data'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setUnitCategory(cat);
                    if (cat === 'length') { setUnitFrom('meters'); setUnitTo('feet'); }
                    if (cat === 'weight') { setUnitFrom('kg'); setUnitTo('lbs'); }
                    if (cat === 'data') { setUnitFrom('MB'); setUnitTo('GB'); }
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                    unitCategory === cat ? 'bg-indigo-600 text-white' : 'bg-[var(--bg)] text-[var(--muted)]'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                value={unitFromVal}
                onChange={(e) => setUnitFromVal(e.target.value)}
                className="px-2 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--bg)]"
              />
              <span className="text-xs font-mono font-bold flex items-center px-1">
                {unitFrom} → {unitTo}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center text-xs font-bold">
            Converted: <span className="text-indigo-500 font-mono">{getConvertedUnit()}</span>
          </div>
        </div>

        {/* 6. Study Timer / Stopwatch */}
        <div className="card !p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <h3 className="font-extrabold text-base">Study Stopwatch</h3>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">Precision Timer</span>
            </div>
            <div className="p-4 my-2 rounded-xl bg-slate-950 text-emerald-400 font-mono text-center text-2xl font-black border border-slate-800 tracking-wider">
              {formatStopwatch(stopwatchTime)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStopwatchRunning((r) => !r)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg text-white ${
                stopwatchRunning ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
            >
              {stopwatchRunning ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStopwatchRunning(false);
                setStopwatchTime(0);
                setLaps([]);
              }}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 7. Word & Character Counter */}
        <div className="card !p-5 md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h3 className="font-extrabold text-base">Word &amp; Character Counter</h3>
            </div>
            <button
              type="button"
              onClick={() => setCounterText('')}
              className="text-xs text-[var(--muted)] hover:text-rose-500"
            >
              Clear Text
            </button>
          </div>

          <textarea
            value={counterText}
            onChange={(e) => setCounterText(e.target.value)}
            rows={3}
            placeholder="Type or paste essay, resume summary, or study notes..."
            className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs outline-none focus:border-indigo-500 mb-3"
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)] block">Words</span>
              <strong className="text-base text-indigo-500">{wordCount}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)] block">Characters</span>
              <strong className="text-base text-indigo-500">{charCountWithSpaces}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)] block">No Spaces</span>
              <strong className="text-base text-indigo-500">{charCountNoSpaces}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)] block">Sentences</span>
              <strong className="text-base text-indigo-500">{sentenceCount}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--muted)] block">Reading Time</span>
              <strong className="text-base text-indigo-500">~{readingTimeMins} min</strong>
            </div>
          </div>
        </div>

        {/* 8. Quick Notes */}
        <div className="card !p-5 md:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📒</span>
              <h3 className="font-extrabold text-base">Quick Study Scratchpad</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                onSaveToCloud({
                  toolName: 'Study Notes',
                  summary: `${quickNotes.slice(0, 40)}...`,
                  details: quickNotes,
                  category: 'utility',
                });
              }}
              className="small-outline-btn !py-1 !px-2.5 text-xs"
            >
              ☁️ Save to Cloud
            </button>
          </div>
          <textarea
            value={quickNotes}
            onChange={(e) => setQuickNotes(e.target.value)}
            rows={5}
            placeholder="Jot down quick lecture formulas, interview notes, or algorithms..."
            className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-mono text-xs outline-none focus:border-indigo-500"
          />
        </div>

        {/* 9. To-Do List */}
        <div className="card !p-5 md:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <h3 className="font-extrabold text-base">Student Checklist</h3>
            </div>
            <span className="text-xs font-bold text-[var(--muted)]">
              {todos.filter((t) => t.done).length}/{todos.length} Done
            </span>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add task..."
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] outline-none"
            />
            <button type="submit" className="primary-btn !py-1 !px-3 text-xs font-bold">
              Add
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {todos.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between gap-2 text-xs"
              >
                <div
                  onClick={() => toggleTodo(item.id)}
                  className={`cursor-pointer truncate flex items-center gap-2 ${
                    item.done ? 'line-through text-[var(--muted)]' : 'font-semibold'
                  }`}
                >
                  <span>{item.done ? '☑️' : '◻️'}</span>
                  <span className="truncate">{item.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTodo(item.id)}
                  className="text-xs text-[var(--muted)] hover:text-rose-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

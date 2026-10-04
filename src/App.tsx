/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  auth,
  signInWithGooglePopup,
  signOutUser,
  ensureAndSyncWorkspace,
  saveWorkspaceState,
  addSavedCalculation,
  removeSavedCalculation,
  subscribeUserCalculations,
  SavedCalculationItem,
} from './firebase';
import AIStudyHub from './components/AIStudyHub';
import ProgrammingHub from './components/ProgrammingHub';
import AuthModal from './components/AuthModal';
import StudentDashboard from './components/StudentDashboard';
import CodingPracticeArea from './components/CodingPracticeArea';
import StudentToolsExpanded from './components/StudentToolsExpanded';
import PremiumMonetization from './components/PremiumMonetization';
import {
  INTERVIEW_QUESTIONS_DATABASE,
  InterviewCategory,
  InterviewDifficulty,
} from './data/interviewQuestions';

type ScaleMode = 'cgpa_to_perc' | 'perc_to_cgpa' | 'gpa_to_cgpa' | 'cgpa_to_gpa';
type FormulaPreset = 'cbse' | 'direct' | 'vtu' | 'custom';
type WeightedScale = '10' | '4' | 'customNum';
type WeightedFormula = 'cbse' | 'direct' | 'vtu';
type PomoMode = 'focus' | 'short' | 'long';
type UnitCategory = 'length' | 'mass' | 'temp' | 'storage';
type JavaTopic = 'basics' | 'variables' | 'oops' | 'strings' | 'arrays' | 'exceptions';

interface SubjectItem {
  id: number;
  name: string;
  grade: number;
  credits: number;
}

const GRADE_MAP_10 = [
  { label: 'O / A++ (10.0 - Outstanding)', val: 10.0 },
  { label: 'A+ (9.0 - Excellent)', val: 9.0 },
  { label: 'A (8.0 - Very Good)', val: 8.0 },
  { label: 'B+ (7.0 - Good)', val: 7.0 },
  { label: 'B (6.0 - Above Average)', val: 6.0 },
  { label: 'C (5.0 - Average)', val: 5.0 },
  { label: 'P (4.0 - Pass)', val: 4.0 },
  { label: 'F / Ab (0.0 - Fail)', val: 0.0 },
];

const GRADE_MAP_4 = [
  { label: 'A (4.0 - Outstanding)', val: 4.0 },
  { label: 'A- (3.7 - Excellent)', val: 3.7 },
  { label: 'B+ (3.3 - Very Good)', val: 3.3 },
  { label: 'B (3.0 - Good)', val: 3.0 },
  { label: 'B- (2.7 - Above Average)', val: 2.7 },
  { label: 'C+ (2.3 - Average)', val: 2.3 },
  { label: 'C (2.0 - Satisfactory)', val: 2.0 },
  { label: 'D (1.0 - Minimal Pass)', val: 1.0 },
  { label: 'F (0.0 - Fail)', val: 0.0 },
];

const UNIT_DATA: Record<
  UnitCategory,
  {
    units: { id: string; name: string; factor?: number }[];
    defaultFrom: string;
    defaultTo: string;
  }
> = {
  length: {
    units: [
      { id: 'm', name: 'Meters (m)', factor: 1 },
      { id: 'km', name: 'Kilometers (km)', factor: 1000 },
      { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
      { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
      { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
      { id: 'in', name: 'Inches (in)', factor: 0.0254 },
      { id: 'mi', name: 'Miles (mi)', factor: 1609.344 },
    ],
    defaultFrom: 'm',
    defaultTo: 'ft',
  },
  mass: {
    units: [
      { id: 'kg', name: 'Kilograms (kg)', factor: 1 },
      { id: 'g', name: 'Grams (g)', factor: 0.001 },
      { id: 'mg', name: 'Milligrams (mg)', factor: 0.000001 },
      { id: 'lb', name: 'Pounds (lbs)', factor: 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', factor: 0.02834952 },
    ],
    defaultFrom: 'kg',
    defaultTo: 'lb',
  },
  temp: {
    units: [
      { id: 'c', name: 'Celsius (°C)' },
      { id: 'f', name: 'Fahrenheit (°F)' },
      { id: 'k', name: 'Kelvin (K)' },
    ],
    defaultFrom: 'c',
    defaultTo: 'f',
  },
  storage: {
    units: [
      { id: 'b', name: 'Bytes (B)', factor: 1 },
      { id: 'kb', name: 'Kilobytes (KB)', factor: 1024 },
      { id: 'mb', name: 'Megabytes (MB)', factor: 1048576 },
      { id: 'gb', name: 'Gigabytes (GB)', factor: 1073741824 },
      { id: 'tb', name: 'Terabytes (TB)', factor: 1099511627776 },
    ],
    defaultFrom: 'mb',
    defaultTo: 'gb',
  },
};

const INTERVIEW_QUESTIONS = [
  {
    lang: 'java' as const,
    q: '1. What is Java?',
    a: 'Java is a high-level, object-oriented, class-based programming language designed to have minimal implementation dependencies ("write once, run anywhere").',
  },
  {
    lang: 'java' as const,
    q: '2. What is JVM?',
    a: 'JVM (Java Virtual Machine) executes Java bytecode and handles memory management, garbage collection, and platform abstraction.',
  },
  {
    lang: 'java' as const,
    q: '3. What is OOP?',
    a: 'Object-Oriented Programming (OOP) structures code into objects with four pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
  },
  {
    lang: 'java' as const,
    q: '4. What is method overloading?',
    a: 'Having multiple methods in the same class with identical names but differing argument counts or parameter data types.',
  },
  {
    lang: 'java' as const,
    q: '5. What is method overriding?',
    a: 'When a child class redefines a parent method with the exact same signature using the @Override annotation.',
  },
  {
    lang: 'java' as const,
    q: '6. Why is String immutable in Java?',
    a: 'Strings are cached in the String Constant Pool for memory saving, thread safety, and security when passing credentials and URLs.',
  },
  {
    lang: 'java' as const,
    q: '7. Difference between == and equals()?',
    a: '== checks reference equality (memory location), whereas equals() checks semantic value content.',
  },
  {
    lang: 'java' as const,
    q: '8. What is inheritance?',
    a: 'Inheritance allows one class to acquire properties and behavior from another class using the extends keyword.',
  },
  {
    lang: 'java' as const,
    q: '9. What is an exception?',
    a: 'An exception is an event that disrupts the normal flow of program execution. Java provides try, catch, finally, throw, and throws for exception handling.',
  },
  {
    lang: 'java' as const,
    q: '10. What is an interface?',
    a: 'An interface defines a contract that classes can implement. It is commonly used to achieve abstraction and support multiple inheritance of type.',
  },
  {
    lang: 'python' as const,
    q: '11. What is the difference between a List and a Tuple in Python?',
    a: 'Lists [...] are mutable (can be modified after creation) and use slightly more memory. Tuples (...) are immutable, faster to iterate, and can be used as dictionary keys.',
  },
  {
    lang: 'python' as const,
    q: '12. What are *args and **kwargs in Python functions?',
    a: '*args collects extra positional arguments as a tuple, while **kwargs collects extra keyword arguments as a dictionary.',
  },
  {
    lang: 'python' as const,
    q: '13. What is a Lambda function in Python?',
    a: 'A lambda function is a small anonymous single-expression function defined using the lambda keyword: lambda x, y: x + y.',
  },
  {
    lang: 'python' as const,
    q: '14. How is memory managed in Python?',
    a: 'Python manages memory automatically using a private heap, reference counting for every object, and a cyclic garbage collector to reclaim reference cycles.',
  },
  {
    lang: 'python' as const,
    q: '15. What is the difference between is and == in Python?',
    a: '== compares whether two objects have the same value, whereas is checks whether two variables point to the exact same object in memory (id(a) == id(b)).',
  },
  {
    lang: 'python' as const,
    q: '16. What are Decorators and Generators in Python?',
    a: 'A decorator (@wrap) modifies or extends a function without changing its code. A generator uses yield to produce a sequence of values lazily one at a time, saving memory.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is StudentTools free?',
    a: 'Yes, all core tools including Scale & Grade Converter, Pomodoro, Unit Converter, Calculators, and Java guides are 100% free to use.',
  },
  {
    q: 'Does the tool store my confidential details?',
    a: 'No backend database is used. Calculations run locally in your browser, and resume data is stored in your private browser localStorage.',
  },
  {
    q: 'Can I use the Pomodoro timer while studying offline?',
    a: 'Yes, the timer runs purely client-side with sound chimes and screen alerts.',
  },
  {
    q: 'Can I use this website on mobile?',
    a: 'Yes. The website is designed to work smoothly on phones, tablets, and desktop browsers.',
  },
  {
    q: 'Will more tools be added?',
    a: 'Yes. Additional student, career, and developer tools are continuously added to the platform.',
  },
];

const POMO_CIRCUMFERENCE = 2 * Math.PI * 90;

export default function App() {
  // Theme & Navigation
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('studentToolsDark') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatorAreaActive, setCalculatorAreaActive] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  // Firebase Auth & Cloud Persistence State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedItems, setSavedItems] = useState<SavedCalculationItem[]>([]);
  const [savedNotes, setSavedNotes] = useState<string>(() => {
    return localStorage.getItem('studentToolsNotes') || '';
  });
  const [externalAiPrompt, setExternalAiPrompt] = useState<string | null>(null);

  // 0. Scale & Grade Converter State
  const [converterFeature, setConverterFeature] = useState<'quick' | 'weighted'>('quick');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('cgpa_to_perc');
  const [scalePreset, setScalePreset] = useState<FormulaPreset>('cbse');
  const [scaleCustomFactor, setScaleCustomFactor] = useState<string>('9.5');
  const [scaleInputValue, setScaleInputValue] = useState<string>('');
  const [refTableOpen, setRefTableOpen] = useState(false);

  // Weighted Subject-Wise Credit Calculator State
  const [weightedScale, setWeightedScale] = useState<WeightedScale>('10');
  const [weightedFormula, setWeightedFormula] = useState<WeightedFormula>('cbse');
  const [priorOpen, setPriorOpen] = useState(false);
  const [priorCredits, setPriorCredits] = useState<string>('');
  const [priorCGPA, setPriorCGPA] = useState<string>('');
  const [subjects, setSubjects] = useState<SubjectItem[]>([
    { id: 1, name: 'Data Structures', grade: 10.0, credits: 4 },
    { id: 2, name: 'Database Systems', grade: 9.0, credits: 4 },
    { id: 3, name: 'Operating Systems', grade: 8.0, credits: 3 },
    { id: 4, name: 'Applied Mathematics', grade: 9.0, credits: 4 },
  ]);

  // 1. Pomodoro State
  const [pomoMode, setPomoMode] = useState<PomoMode>('focus');
  const [pomoDuration, setPomoDuration] = useState(25 * 60);
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusedSeconds, setTotalFocusedSeconds] = useState(0);

  // 2. Unit Converter State
  const [unitCategory, setUnitCategory] = useState<UnitCategory>('length');
  const [unitFromVal, setUnitFromVal] = useState<string>('1');
  const [unitFromId, setUnitFromId] = useState<string>('m');
  const [unitToId, setUnitToId] = useState<string>('ft');

  // 3. CGPA Calculator State
  const [cgpa1, setCgpa1] = useState('');
  const [cgpa2, setCgpa2] = useState('');
  const [cgpaResult, setCgpaResult] = useState<string | null>(null);

  // 4. Attendance Calculator State
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [attendanceResult, setAttendanceResult] = useState<string | null>(null);

  // 5. Percentage Calculator State
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [percentageResult, setPercentageResult] = useState<string | null>(null);

  // 6. EMI Calculator State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanYears, setLoanYears] = useState('');
  const [emiResult, setEmiResult] = useState<{
    emi: string;
    totalInterest: string;
    totalPayment: string;
  } | null>(null);

  // 7. Age Calculator State
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState<string | null>(null);

  // 8. Discount Calculator State
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountResult, setDiscountResult] = useState<{
    saved: string;
    finalPrice: string;
  } | null>(null);

  // 9. GPA Calculator State
  const [gpaInputs, setGpaInputs] = useState<string[]>(['', '', '', '', '']);
  const [gpaResult, setGpaResult] = useState<string | null>(null);

  // 10. Salary Calculator State
  const [annualCTC, setAnnualCTC] = useState('');
  const [salaryResult, setSalaryResult] = useState<{
    monthly: string;
    annualFormatted: string;
  } | null>(null);

  // Learn Java & Python State
  const [javaTopic, setJavaTopic] = useState<JavaTopic>('basics');
  const [activeProgLang, setActiveProgLang] = useState<'java' | 'python'>('java');
  const [interviewCategory, setInterviewCategory] = useState<InterviewCategory | 'all'>('all');
  const [interviewLevel, setInterviewLevel] = useState<InterviewDifficulty | 'all'>('all');

  // User Account System & Auth Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Student Dashboard & Learning Progress State (with localStorage persistence)
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('studentToolsBookmarks');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [completedProgTopics, setCompletedProgTopics] = useState<Record<string, boolean>>(() => {
    try {
      const s = localStorage.getItem('studentToolsProgProgress');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  const [recentlyViewedTopicIds, setRecentlyViewedTopicIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('studentToolsRecentlyViewed');
      return s ? JSON.parse(s) : ['java-intro', 'py-intro'];
    } catch {
      return ['java-intro', 'py-intro'];
    }
  });

  const [lastVisitedTopicId, setLastVisitedTopicId] = useState<string | null>(() => {
    return localStorage.getItem('studentToolsLastVisitedTopic') || 'java-intro';
  });

  const [lastVisitedLang, setLastVisitedLang] = useState<'java' | 'python'>(() => {
    return (localStorage.getItem('studentToolsLastVisitedLang') as 'java' | 'python') || 'java';
  });

  const [completedProblemIds, setCompletedProblemIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('studentToolsCompletedProblems');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [practicedInterviewIds, setPracticedInterviewIds] = useState<Record<string, boolean>>(() => {
    try {
      const s = localStorage.getItem('studentToolsPracticedInterviews');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  // Sync dashboard persistence
  useEffect(() => {
    localStorage.setItem('studentToolsBookmarks', JSON.stringify(bookmarkedTopics));
  }, [bookmarkedTopics]);

  useEffect(() => {
    localStorage.setItem('studentToolsRecentlyViewed', JSON.stringify(recentlyViewedTopicIds));
  }, [recentlyViewedTopicIds]);

  useEffect(() => {
    if (lastVisitedTopicId) localStorage.setItem('studentToolsLastVisitedTopic', lastVisitedTopicId);
  }, [lastVisitedTopicId]);

  useEffect(() => {
    localStorage.setItem('studentToolsLastVisitedLang', lastVisitedLang);
  }, [lastVisitedLang]);

  useEffect(() => {
    localStorage.setItem('studentToolsCompletedProblems', JSON.stringify(completedProblemIds));
  }, [completedProblemIds]);

  useEffect(() => {
    localStorage.setItem('studentToolsPracticedInterviews', JSON.stringify(practicedInterviewIds));
  }, [practicedInterviewIds]);

  // Interview Questions Open State
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  // FAQ Open State
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  // Resume Builder State
  const [resumeData, setResumeData] = useState({
    resumeName: '',
    resumeEmail: '',
    resumePhone: '',
    resumeLocation: '',
    resumeObjective: '',
    resumeEducation: '',
    resumeSkills: '',
    resumeProjects: '',
    resumeExperience: '',
    resumeCertifications: '',
    resumeAchievements: '',
  });
  const [resumeMobileTab, setResumeMobileTab] = useState<'both' | 'form' | 'preview'>('both');
  const [resumeTemplate, setResumeTemplate] = useState<'modern' | 'classic'>(() => {
    const saved = localStorage.getItem('studentToolsResumeTemplate');
    return saved === 'classic' ? 'classic' : 'modern';
  });
  const [autoFormatBullets, setAutoFormatBullets] = useState<boolean>(() => {
    const saved = localStorage.getItem('studentToolsAutoFormatBullets');
    return saved !== null ? saved === 'true' : true;
  });
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportProgress, setPdfExportProgress] = useState(0);
  const [pdfExportStatus, setPdfExportStatus] = useState('');

  // Smoothly increment progress while exporting PDF to provide real-time visual feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExportingPdf) {
      interval = setInterval(() => {
        setPdfExportProgress((prev) => {
          if (prev >= 92) return prev;
          return prev + 2;
        });
      }, 100);
    } else {
      setPdfExportProgress(0);
      setPdfExportStatus('');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExportingPdf]);

  useEffect(() => {
    localStorage.setItem('studentToolsResumeTemplate', resumeTemplate);
  }, [resumeTemplate]);

  useEffect(() => {
    localStorage.setItem('studentToolsAutoFormatBullets', String(autoFormatBullets));
  }, [autoFormatBullets]);

  // Sync dark mode class with document.body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('studentToolsDark', String(darkMode));
  }, [darkMode]);

  // Load saved resume from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studentToolsResume');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore invalid json
      }
    }
  }, []);

  // Persist study notes locally
  useEffect(() => {
    localStorage.setItem('studentToolsNotes', savedNotes);
  }, [savedNotes]);

  // Listen to Firebase Auth state and load Cloud Workspace + Saved Calculations
  useEffect(() => {
    let unsubCalculations: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (unsubCalculations) {
        unsubCalculations();
        unsubCalculations = null;
      }
      if (user) {
        try {
          const ws = await ensureAndSyncWorkspace(user.uid, {
            displayName: user.displayName || user.email || 'Student',
            pomodoroSessions: completedSessions,
            pomodoroMinutes: Math.floor(totalFocusedSeconds / 60),
            resumeFullName: resumeData.resumeName,
            resumeTitle: resumeData.resumeLocation,
            resumeSummary: resumeData.resumeObjective,
            resumeEducation: resumeData.resumeEducation,
            resumeExperience: resumeData.resumeExperience,
            resumeProjects: resumeData.resumeProjects,
            resumeSkillsText: resumeData.resumeSkills,
            resumeColor: '#6366f1',
            savedNotes,
          });
          if (ws) {
            if (ws.pomodoroSessions > 0 && completedSessions === 0) {
              setCompletedSessions(ws.pomodoroSessions);
            }
            if (ws.pomodoroMinutes > 0 && totalFocusedSeconds === 0) {
              setTotalFocusedSeconds(ws.pomodoroMinutes * 60);
            }
            if (ws.savedNotes && !savedNotes) {
              setSavedNotes(ws.savedNotes);
            }
            if (ws.resumeFullName && !resumeData.resumeName) {
              setResumeData((prev) => ({
                ...prev,
                resumeName: ws.resumeFullName || prev.resumeName,
                resumeLocation: ws.resumeTitle || prev.resumeLocation,
                resumeObjective: ws.resumeSummary || prev.resumeObjective,
                resumeEducation: ws.resumeEducation || prev.resumeEducation,
                resumeExperience: ws.resumeExperience || prev.resumeExperience,
                resumeProjects: ws.resumeProjects || prev.resumeProjects,
                resumeSkills: ws.resumeSkillsText || prev.resumeSkills,
              }));
            }
          }
          unsubCalculations = subscribeUserCalculations(user.uid, (items) => {
            setSavedItems(items);
          });
        } catch (err) {
          console.error('Failed to initialize user workspace:', err);
        }
      } else {
        setSavedItems([]);
      }
    });
    return () => {
      unsubAuth();
      if (unsubCalculations) unsubCalculations();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  const openTool = (toolId: string) => {
    setCalculatorAreaActive(true);
    setTimeout(() => {
      const el = document.getElementById(toolId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleGlobalSearch = () => {
    const val = searchQuery.toLowerCase().trim();
    if (!val) {
      showToast('Type something to search.');
      return;
    }
    if (
      val.includes('scale') ||
      val.includes('grade') ||
      val.includes('weighted') ||
      val.includes('credit') ||
      val.includes('gpa to percentage') ||
      val.includes('cgpa to percentage') ||
      (val.includes('cgpa') && val.includes('percentage'))
    ) {
      openTool('scaleConverterTool');
      return;
    }
    if (val.includes('pomo') || val.includes('timer') || val.includes('focus') || val.includes('study')) {
      openTool('pomodoroTool');
      return;
    }
    if (
      val.includes('unit') ||
      val.includes('convert') ||
      val.includes('meter') ||
      val.includes('kg') ||
      val.includes('temp')
    ) {
      openTool('unitTool');
      return;
    }
    if (val.includes('cgpa') || val.includes('calc')) {
      openTool('cgpaTool');
      return;
    }
    if (val.includes('attendance')) {
      openTool('attendanceTool');
      return;
    }
    if (val.includes('percentage') || val.includes('marks')) {
      openTool('percentageTool');
      return;
    }
    if (val.includes('emi') || val.includes('loan')) {
      openTool('emiTool');
      return;
    }
    if (val.includes('age')) {
      openTool('ageTool');
      return;
    }
    if (val.includes('discount')) {
      openTool('discountTool');
      return;
    }
    if (val.includes('gpa')) {
      openTool('gpaTool');
      return;
    }
    if (val.includes('salary') || val.includes('ctc')) {
      openTool('salaryTool');
      return;
    }
    if (
      val.includes('python') ||
      val.includes('tuple') ||
      val.includes('dict') ||
      val.includes('lambda') ||
      val.includes('elif')
    ) {
      setActiveProgLang('python');
      document.getElementById('python')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (
      val.includes('java') ||
      val.includes('oop') ||
      val.includes('inheritance') ||
      val.includes('polymorphism') ||
      val.includes('multithreading') ||
      val.includes('collection')
    ) {
      setActiveProgLang('java');
      document.getElementById('java')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('dashboard') || val.includes('progress') || val.includes('profile')) {
      document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('coding') || val.includes('practice') || val.includes('problem') || val.includes('leetcode')) {
      document.getElementById('coding-practice')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('premium') || val.includes('pro') || val.includes('price') || val.includes('plan')) {
      document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('interview') || val.includes('sql') || val.includes('javascript') || val.includes('html')) {
      document.getElementById('interview')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('resume')) {
      document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (val.includes('ai') || val.includes('chat') || val.includes('voice') || val.includes('transcribe')) {
      document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    showToast("No tool matched. Try 'Dashboard', 'Java', 'Python', 'Coding Practice', 'CGPA', or 'Resume'.");
  };

  // ================= DASHBOARD & BOOKMARK HANDLERS =================
  const handleToggleBookmark = (topicId: string, title: string) => {
    setBookmarkedTopics((prev) => {
      const exists = prev.includes(topicId);
      const next = exists ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      showToast(exists ? `Removed bookmark for "${title}"` : `🔖 Bookmarked "${title}"! View in Dashboard.`);
      return next;
    });
  };

  const handleTopicVisited = (lang: 'java' | 'python', topicId: string) => {
    setLastVisitedLang(lang);
    setLastVisitedTopicId(topicId);
    setRecentlyViewedTopicIds((prev) => {
      const filtered = prev.filter((id) => id !== topicId);
      return [topicId, ...filtered].slice(0, 10);
    });
  };

  const handleToggleProblemSolved = (problemId: string, title: string) => {
    setCompletedProblemIds((prev) => {
      const exists = prev.includes(problemId);
      const next = exists ? prev.filter((id) => id !== problemId) : [...prev, problemId];
      showToast(exists ? `Marked "${title}" as unsolved.` : `🎉 Solved "${title}"! Progress recorded in Dashboard.`);
      return next;
    });
  };

  const handleToggleInterviewPracticed = (questionId: string) => {
    setPracticedInterviewIds((prev) => {
      const next = !prev[questionId];
      return { ...prev, [questionId]: next };
    });
  };

  const handleNavigateToTopic = (lang: 'java' | 'python', topicId: string) => {
    setActiveProgLang(lang);
    handleTopicVisited(lang, topicId);
    setTimeout(() => {
      document.getElementById(lang)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDownloadResumeJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(resumeData.resumeName || 'Student').replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded resume data as JSON!');
  };

  // ================= FIREBASE CLOUD HANDLERS =================
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      showToast('✅ Signed in with Google! Cloud sync is active.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in cancelled or failed.';
      showToast(msg);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOutUser();
      showToast('Signed out of Cloud Workspace.');
    } catch {
      showToast('Failed to sign out.');
    }
  };

  const handleSyncWorkspaceToCloud = async () => {
    localStorage.setItem('studentToolsResume', JSON.stringify(resumeData));
    localStorage.setItem('studentToolsNotes', savedNotes);
    if (!currentUser) {
      showToast('Saved locally! Sign in with Google to sync to Firebase Cloud.');
      return;
    }
    try {
      await saveWorkspaceState(currentUser.uid, {
        displayName: currentUser.displayName || currentUser.email || 'Student',
        pomodoroSessions: completedSessions,
        pomodoroMinutes: Math.floor(totalFocusedSeconds / 60),
        resumeFullName: resumeData.resumeName,
        resumeTitle: resumeData.resumeLocation,
        resumeSummary: resumeData.resumeObjective,
        resumeEducation: resumeData.resumeEducation,
        resumeExperience: resumeData.resumeExperience,
        resumeProjects: resumeData.resumeProjects,
        resumeSkillsText: resumeData.resumeSkills,
        resumeColor: '#6366f1',
        savedNotes,
      });
      showToast('☁️ Workspace, Resume & Study Notes synced to Firestore!');
    } catch {
      showToast('Failed to sync workspace to Firestore.');
    }
  };

  const handleSaveResultToCloud = async (item: {
    toolName: string;
    summary: string;
    details: string;
    category: 'academic' | 'finance' | 'utility' | 'ai_note';
  }) => {
    if (!currentUser) {
      showToast('Please Sign In with Google (top right) to save calculations to Firestore!');
      return;
    }
    try {
      await addSavedCalculation(currentUser.uid, item);
      showToast(`☁️ Saved ${item.toolName} result to your Cloud Workspace!`);
    } catch {
      showToast('Could not save calculation to Cloud.');
    }
  };

  const handleDeleteCloudItem = async (id: string) => {
    try {
      await removeSavedCalculation(id);
      showToast('Removed saved record from Cloud.');
    } catch {
      showToast('Could not delete record.');
    }
  };

  const askAiAboutTopic = (promptText: string) => {
    setExternalAiPrompt(promptText);
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Prompt loaded into Gemini AI Tutor below!');
  };

  // ================= POMODORO TIMER EFFECT =================
  const playTimerChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch {
      // ignore audio context errors
    }
  };

  useEffect(() => {
    if (!pomoIsRunning) return;
    const interval = window.setInterval(() => {
      setPomoTimeLeft((prev) => {
        if (prev > 1) {
          if (pomoMode === 'focus') {
            setTotalFocusedSeconds((s) => s + 1);
          }
          return prev - 1;
        } else {
          setPomoIsRunning(false);
          playTimerChime();
          if (pomoMode === 'focus') {
            setCompletedSessions((c) => c + 1);
            showToast('🎉 Great focus session finished! Time for a short break.');
            setPomoMode('short');
            setPomoDuration(5 * 60);
            return 5 * 60;
          } else {
            showToast('⏰ Break finished! Ready to focus again?');
            setPomoMode('focus');
            setPomoDuration(25 * 60);
            return 25 * 60;
          }
        }
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [pomoIsRunning, pomoMode]);

  const handleSelectPomoMode = (mode: PomoMode, mins: number) => {
    setPomoIsRunning(false);
    setPomoMode(mode);
    setPomoDuration(mins * 60);
    setPomoTimeLeft(mins * 60);
  };

  const handleResetPomodoro = () => {
    setPomoIsRunning(false);
    setPomoTimeLeft(pomoDuration);
    showToast('Pomodoro timer reset.');
  };

  // ================= SCALE & GRADE CONVERTER COMPUTATION =================
  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return 'Grade O / A+ (Outstanding)';
    if (percentage >= 80) return 'Grade A+ (Distinction)';
    if (percentage >= 70) return 'Grade A (First Class)';
    if (percentage >= 60) return 'Grade B+ (High 2nd Class)';
    if (percentage >= 50) return 'Grade B (Second Class)';
    if (percentage >= 40) return 'Grade C (Pass Class)';
    return 'Grade F (Needs Improvement)';
  };

  const computeQuickScale = () => {
    const val = parseFloat(scaleInputValue);
    if (isNaN(val)) return null;
    const customFactor = parseFloat(scaleCustomFactor) || 9.5;
    let resultPrimary = '';
    let resultSecondary = '';
    let formulaNote = '';
    let approxPerc = 0;

    if (scaleMode === 'cgpa_to_perc') {
      let perc = 0;
      if (scalePreset === 'cbse') {
        perc = val * 9.5;
        formulaNote = `Formula: CGPA × 9.5 = ${val} × 9.5`;
      } else if (scalePreset === 'direct') {
        perc = val * 10.0;
        formulaNote = `Formula: CGPA × 10 = ${val} × 10`;
      } else if (scalePreset === 'vtu') {
        perc = Math.max(0, (val - 0.75) * 10);
        formulaNote = `Formula: (CGPA - 0.75) × 10 = (${val} - 0.75) × 10`;
      } else {
        perc = val * customFactor;
        formulaNote = `Formula: CGPA × ${customFactor} = ${val} × ${customFactor}`;
      }
      approxPerc = Math.min(100, Math.max(0, perc));
      const usGpa = ((val / 10) * 4).toFixed(2);
      resultPrimary = `${approxPerc.toFixed(2)}%`;
      resultSecondary = `Equivalent 4.0 US GPA: ~${usGpa} / 4.0`;
    } else if (scaleMode === 'perc_to_cgpa') {
      let cgpa = 0;
      if (scalePreset === 'cbse') {
        cgpa = val / 9.5;
        formulaNote = `Formula: Percentage / 9.5 = ${val} / 9.5`;
      } else if (scalePreset === 'direct') {
        cgpa = val / 10.0;
        formulaNote = `Formula: Percentage / 10 = ${val} / 10`;
      } else if (scalePreset === 'vtu') {
        cgpa = val / 10 + 0.75;
        formulaNote = `Formula: (Percentage / 10) + 0.75 = (${val} / 10) + 0.75`;
      } else {
        cgpa = val / customFactor;
        formulaNote = `Formula: Percentage / ${customFactor} = ${val} / ${customFactor}`;
      }
      approxPerc = val;
      const boundedCgpa = Math.min(10, Math.max(0, cgpa)).toFixed(2);
      const usGpa = ((cgpa / 10) * 4).toFixed(2);
      resultPrimary = `${boundedCgpa} CGPA`;
      resultSecondary = `Equivalent 4.0 Scale: ~${usGpa} / 4.0`;
    } else if (scaleMode === 'gpa_to_cgpa') {
      const cgpa = (val / 4.0) * 10;
      const perc = cgpa * 9.5;
      approxPerc = perc;
      formulaNote = `Formula: (GPA / 4.0) × 10 = (${val} / 4.0) × 10 | CBSE % = CGPA × 9.5`;
      resultPrimary = `${cgpa.toFixed(2)} CGPA`;
      resultSecondary = `Approx CBSE Percentage: ${perc.toFixed(2)}%`;
    } else {
      const usGpa = (val / 10) * 4.0;
      approxPerc = val * 9.5;
      formulaNote = `Formula: (CGPA / 10) × 4.0 = (${val} / 10) × 4.0`;
      resultPrimary = `${usGpa.toFixed(2)} / 4.0 GPA`;
      resultSecondary = `Approx CBSE Equivalent: ${(val * 9.5).toFixed(2)}%`;
    }

    return {
      resultPrimary,
      resultSecondary,
      formulaNote,
      badge: getGradeBadge(approxPerc),
    };
  };

  const quickScaleResult = computeQuickScale();

  // ================= WEIGHTED SUBJECT-WISE CREDIT CALCULATOR =================
  const handleWeightedScaleChange = (newScale: WeightedScale) => {
    setWeightedScale(newScale);
    setSubjects((prev) =>
      prev.map((s) => ({
        ...s,
        grade: newScale === '4' ? Math.min(4.0, Number(((s.grade / 10) * 4).toFixed(1))) : s.grade <= 4 ? 9.0 : s.grade,
      }))
    );
  };

  const addSubjectRow = () => {
    const defaultGrade = weightedScale === '4' ? 4.0 : weightedScale === '10' ? 9.0 : 8.5;
    setSubjects((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: '',
        grade: defaultGrade,
        credits: 3,
      },
    ]);
  };

  const removeSubjectRow = (index: number) => {
    if (subjects.length <= 1) {
      showToast('Keep at least one subject in the list.');
      return;
    }
    setSubjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateSubjectField = (index: number, field: keyof SubjectItem, value: string) => {
    setSubjects((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        if (field === 'credits' || field === 'grade') {
          return { ...item, [field]: parseFloat(value) || 0 };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const loadSampleSubjects = () => {
    if (weightedScale === '4') {
      setSubjects([
        { id: 1, name: 'Data Structures & Algorithms', grade: 4.0, credits: 4 },
        { id: 2, name: 'Database Systems', grade: 3.7, credits: 3 },
        { id: 3, name: 'Computer Networks', grade: 3.3, credits: 3 },
        { id: 4, name: 'Discrete Mathematics', grade: 3.0, credits: 4 },
        { id: 5, name: 'Web Application Lab', grade: 4.0, credits: 2 },
      ]);
    } else {
      setSubjects([
        { id: 1, name: 'Data Structures & Algorithms', grade: 10.0, credits: 4 },
        { id: 2, name: 'Database Management Systems', grade: 9.0, credits: 4 },
        { id: 3, name: 'Operating Systems', grade: 8.0, credits: 3 },
        { id: 4, name: 'Engineering Mathematics III', grade: 9.0, credits: 4 },
        { id: 5, name: 'Software Engineering Lab', grade: 10.0, credits: 2 },
      ]);
    }
    showToast('Loaded sample semester curriculum!');
  };

  const resetSubjects = () => {
    const defaultGrade = weightedScale === '4' ? 3.7 : 9.0;
    setSubjects([
      { id: 1, name: 'Subject 1', grade: defaultGrade, credits: 4 },
      { id: 2, name: 'Subject 2', grade: weightedScale === '4' ? 3.3 : 8.0, credits: 3 },
      { id: 3, name: 'Subject 3', grade: defaultGrade, credits: 3 },
    ]);
    setPriorCredits('');
    setPriorCGPA('');
    showToast('Subject list reset.');
  };

  const computeWeightedResult = () => {
    if (!subjects.length) return null;
    let totalCredits = 0;
    let totalQualityPoints = 0;
    let hasFail = false;

    subjects.forEach((s) => {
      const c = Number(s.credits) || 0;
      const g = Number(s.grade) || 0;
      if (g === 0) hasFail = true;
      totalCredits += c;
      totalQualityPoints += c * g;
    });

    if (totalCredits <= 0) return null;

    const semesterGPA = totalQualityPoints / totalCredits;

    const priorC = parseFloat(priorCredits);
    const priorG = parseFloat(priorCGPA);
    let combinedCGPA: number | null = null;
    if (!isNaN(priorC) && priorC > 0 && !isNaN(priorG) && priorG >= 0) {
      combinedCGPA = (priorC * priorG + totalQualityPoints) / (priorC + totalCredits);
    }

    let cgpa10 = 0;
    let gpa4 = 0;
    let perc = 0;

    if (weightedScale === '4') {
      gpa4 = semesterGPA;
      cgpa10 = (semesterGPA / 4.0) * 10.0;
    } else {
      cgpa10 = semesterGPA;
      gpa4 = (semesterGPA / 10.0) * 4.0;
    }

    if (weightedFormula === 'cbse') {
      perc = cgpa10 * 9.5;
    } else if (weightedFormula === 'vtu') {
      perc = Math.max(0, (cgpa10 - 0.75) * 10);
    } else {
      perc = cgpa10 * 10;
    }
    perc = Math.min(100, Math.max(0, perc));

    let classTitle = 'First Class with Distinction';
    if (hasFail) {
      classTitle = 'Backlog / Arrears Detected';
    } else if (cgpa10 >= 9.0 || gpa4 >= 3.8) {
      classTitle = weightedScale === '4' ? 'Summa Cum Laude / High Distinction' : 'Outstanding / First Class with Distinction';
    } else if (cgpa10 >= 8.0 || gpa4 >= 3.5) {
      classTitle = weightedScale === '4' ? 'Magna Cum Laude' : 'First Class with Distinction';
    } else if (cgpa10 >= 6.5 || gpa4 >= 3.0) {
      classTitle = 'First Class';
    } else if (cgpa10 >= 5.5 || gpa4 >= 2.5) {
      classTitle = 'Second Class';
    } else if (cgpa10 >= 4.0 || gpa4 >= 2.0) {
      classTitle = 'Pass Division';
    } else {
      classTitle = 'Fail / Needs Improvement';
    }

    return {
      semesterGPA,
      totalCredits,
      totalQualityPoints,
      hasFail,
      combinedCGPA,
      cgpa10,
      gpa4,
      perc,
      classTitle,
    };
  };

  const weightedResult = computeWeightedResult();

  // ================= UNIT CONVERTER =================
  const handleUnitCategoryChange = (cat: UnitCategory) => {
    setUnitCategory(cat);
    setUnitFromId(UNIT_DATA[cat].defaultFrom);
    setUnitToId(UNIT_DATA[cat].defaultTo);
  };

  const handleSwapUnits = () => {
    setUnitFromId(unitToId);
    setUnitToId(unitFromId);
  };

  const computeUnitConversion = () => {
    const fromVal = parseFloat(unitFromVal);
    if (isNaN(fromVal)) {
      return { toValue: '', formula: 'Please enter a valid number' };
    }
    let result = 0;
    if (unitCategory === 'temp') {
      let c = 0;
      if (unitFromId === 'c') c = fromVal;
      else if (unitFromId === 'f') c = (fromVal - 32) * (5 / 9);
      else if (unitFromId === 'k') c = fromVal - 273.15;

      if (unitToId === 'c') result = c;
      else if (unitToId === 'f') result = c * (9 / 5) + 32;
      else if (unitToId === 'k') result = c + 273.15;
    } else {
      const cat = UNIT_DATA[unitCategory];
      const uFrom = cat.units.find((u) => u.id === unitFromId);
      const uTo = cat.units.find((u) => u.id === unitToId);
      const baseVal = fromVal * (uFrom?.factor || 1);
      result = baseVal / (uTo?.factor || 1);
    }

    const rounded = Number.isInteger(result) ? result : parseFloat(result.toPrecision(6));
    return {
      toValue: String(rounded),
      formula: `${fromVal} ${unitFromId} = ${rounded} ${unitToId}`,
    };
  };

  const unitConversion = computeUnitConversion();

  // ================= OTHER CALCULATORS =================
  const handleCalculateCGPA = () => {
    const a = parseFloat(cgpa1);
    const b = parseFloat(cgpa2);
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 10 || b > 10) {
      showToast('Enter valid CGPA values between 0 and 10.');
      return;
    }
    setCgpaResult(((a + b) / 2).toFixed(2));
  };

  const handleCalculateAttendance = () => {
    const total = parseFloat(totalClasses);
    const attended = parseFloat(attendedClasses);
    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0 || attended > total) {
      showToast('Enter valid attendance values.');
      return;
    }
    setAttendanceResult(((attended / total) * 100).toFixed(2));
  };

  const handleCalculatePercentage = () => {
    const obt = parseFloat(obtainedMarks);
    const tot = parseFloat(totalMarks);
    if (isNaN(obt) || isNaN(tot) || tot <= 0 || obt < 0 || obt > tot) {
      showToast('Enter valid marks.');
      return;
    }
    setPercentageResult(((obt / tot) * 100).toFixed(2));
  };

  const handleCalculateEMI = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate);
    const y = parseFloat(loanYears);
    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r < 0 || y <= 0) {
      showToast('Enter valid loan details.');
      return;
    }
    const mRate = r / 12 / 100;
    const months = y * 12;
    const emi =
      mRate === 0
        ? p / months
        : (p * mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - p;
    setEmiResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    });
  };

  const handleCalculateAge = () => {
    if (!birthDate) {
      showToast('Please select your date of birth.');
      return;
    }
    const dob = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    if (today.getDate() < dob.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAgeResult(`${years} Years ${months} Months`);
  };

  const handleCalculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const disc = parseFloat(discountPercent);
    if (isNaN(price) || isNaN(disc) || price < 0 || disc < 0 || disc > 100) {
      showToast('Enter valid price and discount.');
      return;
    }
    const saved = (price * disc) / 100;
    setDiscountResult({
      saved: saved.toFixed(2),
      finalPrice: (price - saved).toFixed(2),
    });
  };

  const handleCalculateGPA = () => {
    let total = 0;
    let count = 0;
    gpaInputs.forEach((valStr) => {
      const val = parseFloat(valStr);
      if (!isNaN(val)) {
        total += val;
        count++;
      }
    });
    if (count === 0) {
      showToast('Enter at least one grade point.');
      return;
    }
    setGpaResult((total / count).toFixed(2));
  };

  const handleCalculateSalary = () => {
    const ctc = parseFloat(annualCTC);
    if (isNaN(ctc) || ctc <= 0) {
      showToast('Enter a valid annual CTC.');
      return;
    }
    setSalaryResult({
      monthly: (ctc / 12).toFixed(2),
      annualFormatted: ctc.toLocaleString('en-IN'),
    });
  };

  // ================= RESUME HANDLERS =================
  const handleSaveResume = () => {
    localStorage.setItem('studentToolsResume', JSON.stringify(resumeData));
    showToast('Resume saved locally in browser!');
  };

  const handlePrintResume = () => {
    window.print();
  };

  const handleExportResumePdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfExportProgress(12);
    setPdfExportStatus('Preparing resume layout...');
    showToast('📄 Generating high-resolution PDF document...');

    try {
      const previewEl = document.getElementById('resumePreview');
      if (!previewEl) {
        throw new Error('Resume preview element not found.');
      }

      setPdfExportProgress(28);
      setPdfExportStatus('Formatting A4 typography & structure...');

      // Clone preview element to render in a standard A4 format (794px = 210mm at 96 DPI)
      // This ensures consistent layout across both mobile and desktop screens,
      // and works smoothly even if the mobile tab is currently switched to form mode.
      const clone = previewEl.cloneNode(true) as HTMLElement;
      clone.id = 'resumePreviewExportClone';
      clone.classList.remove('mobile-hidden');

      // Remove UI action toolbar from the generated document
      const topbar = clone.querySelector('.resume-preview-topbar');
      if (topbar) {
        topbar.remove();
      }

      // Remove export progress indicator from the generated document
      const progressIndicator = clone.querySelector('.resume-pdf-export-progress');
      if (progressIndicator) {
        progressIndicator.remove();
      }

      // Apply clean, print-accurate document styling
      Object.assign(clone.style, {
        position: 'fixed',
        top: '-10000px',
        left: '-10000px',
        width: '794px',
        minHeight: '1123px',
        padding: '48px 44px',
        margin: '0',
        background: '#ffffff',
        color: '#1e293b',
        boxShadow: 'none',
        border: 'none',
        borderRadius: '0px',
        display: 'block',
        visibility: 'visible',
        zIndex: '-9999',
        boxSizing: 'border-box',
      });

      document.body.appendChild(clone);

      // Brief delay to ensure browser paints typography and elements
      await new Promise((resolve) => setTimeout(resolve, 80));

      setPdfExportProgress(55);
      setPdfExportStatus('Rendering high-DPI canvas (2x resolution)...');

      const canvas = await html2canvas(clone, {
        scale: 2, // 2x DPI for crisp text and sharp printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });

      // Cleanup cloned DOM node
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }

      setPdfExportProgress(82);
      setPdfExportStatus('Compiling pages into A4 PDF format...');

      // Build PDF document using jsPDF (A4 standard: 210mm x 297mm)
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // Multi-page handling for extensive resumes
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }
      }

      setPdfExportProgress(96);
      setPdfExportStatus('Finalizing download...');

      const sanitizedName = (resumeData.resumeName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${sanitizedName || 'Student'}_Resume.pdf`;
      pdf.save(filename);

      setPdfExportProgress(100);
      setPdfExportStatus('Download complete!');
      showToast(`✅ Saved "${filename}" directly to your downloads!`);

      // Brief delay so user sees 100% complete
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err: unknown) {
      console.error('PDF export error:', err);
      const msg = err instanceof Error ? err.message : 'PDF generation failed.';
      showToast(`PDF generation failed: ${msg}`);
    } finally {
      setIsExportingPdf(false);
      setPdfExportProgress(0);
      setPdfExportStatus('');
    }
  };

  // Converts markdown-like bullet points (*, -, +, •, or 1., 2.) into clean HTML bullet lists
  const renderFormattedResumeContent = (rawText: string, fallbackText: string) => {
    const text = (rawText || '').trim();
    if (!text) {
      return fallbackText ? <p className="resume-empty-placeholder">{fallbackText}</p> : null;
    }

    if (!autoFormatBullets) {
      return <p className="resume-paragraph">{text}</p>;
    }

    const lines = text.split('\n');
    const blocks: { type: 'paragraph' | 'bullet-list'; lines: string[] }[] = [];
    let currentBlock: { type: 'paragraph' | 'bullet-list'; lines: string[] } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        currentBlock = null;
        continue;
      }

      // Check for bullet prefixes: '*', '-', '+', '•', or '1.', '2.', etc.
      const isBullet = /^([-*+•]|\d+[.)])\s+/.test(trimmed);

      if (isBullet) {
        const cleanContent = trimmed.replace(/^([-*+•]|\d+[.)])\s+/, '');
        if (currentBlock && currentBlock.type === 'bullet-list') {
          currentBlock.lines.push(cleanContent);
        } else {
          currentBlock = { type: 'bullet-list', lines: [cleanContent] };
          blocks.push(currentBlock);
        }
      } else {
        if (currentBlock && currentBlock.type === 'paragraph') {
          currentBlock.lines.push(trimmed);
        } else {
          currentBlock = { type: 'paragraph', lines: [trimmed] };
          blocks.push(currentBlock);
        }
      }
    }

    // Support inline bold formatting like **keyword**
    const formatInline = (str: string) => {
      const parts = str.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    return (
      <div className="resume-section-content">
        {blocks.map((block, bIdx) => {
          if (block.type === 'bullet-list') {
            return (
              <ul key={bIdx} className="resume-bullet-list">
                {block.lines.map((item, lIdx) => (
                  <li key={lIdx}>{formatInline(item)}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={bIdx} className="resume-paragraph">
              {block.lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {formatInline(line)}
                  {lIdx < block.lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  };

  // Pomodoro formatting
  const pomoMins = Math.floor(pomoTimeLeft / 60);
  const pomoSecs = pomoTimeLeft % 60;
  const pomoFormatted = `${String(pomoMins).padStart(2, '0')}:${String(pomoSecs).padStart(2, '0')}`;
  const pomoFraction = pomoDuration > 0 ? pomoTimeLeft / pomoDuration : 1;
  const pomoDashOffset = POMO_CIRCUMFERENCE * (1 - pomoFraction);

  return (
    <div className={darkMode ? 'dark-theme' : ''}>
      {/* ======================================================
          NAVBAR
          ====================================================== */}
      <header className="navbar">
        <a href="#home" className="logo">
          Student<span>Tools</span>
        </a>
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="navLinks">
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>
          <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </a>
          <a href="#tools" onClick={() => setMobileMenuOpen(false)}>
            Tools
          </a>
          <a
            href="#java"
            onClick={() => {
              handleNavigateToTopic('java', 'java-intro');
              setMobileMenuOpen(false);
            }}
          >
            Java
          </a>
          <a
            href="#python"
            onClick={() => {
              handleNavigateToTopic('python', 'py-intro');
              setMobileMenuOpen(false);
            }}
          >
            Python
          </a>
          <a href="#interview" onClick={() => setMobileMenuOpen(false)}>
            Interview
          </a>
          <a href="#coding-practice" onClick={() => setMobileMenuOpen(false)}>
            Coding Practice
          </a>
          <a href="#resume" onClick={() => setMobileMenuOpen(false)}>
            Resume
          </a>
          <a href="#premium" onClick={() => setMobileMenuOpen(false)}>
            Premium
          </a>
          <a href="#ai-assistant" onClick={() => setMobileMenuOpen(false)}>
            🤖 AI Hub
          </a>
        </nav>
        <div className="nav-actions">
          {currentUser ? (
            <button
              type="button"
              className="auth-btn"
              onClick={() => setAuthModalOpen(true)}
              title={`Signed in as ${currentUser.displayName || currentUser.email}. Click to view profile.`}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="auth-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>👤</span>
              )}
              <span className="auth-label">
                {currentUser.displayName?.split(' ')[0] || 'Account'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="auth-btn"
              onClick={() => setAuthModalOpen(true)}
              title="Sign in or create account"
            >
              <span>🔐</span>
              <span className="auth-label">Sign In</span>
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle Dark / Light Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="icon-btn mobile-menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
            title="Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ======================================================
          HERO
          ====================================================== */}
      <section className="hero" id="home">
        <div className="badge">🚀 Verified Student Platform</div>
        <h1>
          Everything Students Need
          <br />
          <span className="gradient">In One Place</span>
        </h1>
        <p>
          Calculate your marks, manage focused study sessions with Pomodoro, convert units, learn
          41 Java &amp; 35 Python modules, practice placement coding problems, and build your resume.
        </p>
        <div className="search">
          <input
            id="globalSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGlobalSearch();
            }}
            placeholder="Search Dashboard, Pomodoro, CGPA, Java, Python, Coding Practice, Resume..."
          />
          <button type="button" className="primary-btn" onClick={handleGlobalSearch}>
            Search
          </button>
        </div>
        <div className="stats">
          <div className="stat">
            <h3>14+</h3>
            <p>Free Tools</p>
          </div>
          <div className="stat">
            <h3>76+</h3>
            <p>Java &amp; Python Modules</p>
          </div>
          <div className="stat">
            <h3>25+</h3>
            <p>Interview Q&amp;A</p>
          </div>
          <div className="stat">
            <h3>100%</h3>
            <p>Free to Start</p>
          </div>
        </div>
      </section>

      {/* ======================================================
          STUDENT DASHBOARD (REAL USER METRICS & CONTINUE LEARNING)
          ====================================================== */}
      <StudentDashboard
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        completedTopics={completedProgTopics}
        bookmarkedTopics={bookmarkedTopics}
        recentlyViewedTopicIds={recentlyViewedTopicIds}
        lastVisitedTopicId={lastVisitedTopicId}
        lastVisitedLang={lastVisitedLang}
        completedProblemIds={completedProblemIds}
        practicedInterviewIds={practicedInterviewIds}
        onNavigateToTopic={handleNavigateToTopic}
        onNavigateToProblem={() => {
          document.getElementById('coding-practice')?.scrollIntoView({ behavior: 'smooth' });
        }}
        showToast={showToast}
      />

      {/* ======================================================
          POPULAR STUDENT TOOLS
          ====================================================== */}
      <section className="section" id="tools">
        <div className="container">
          <div className="section-title">
            <h2>Popular Student Tools</h2>
            <p>Practical, interactive tools built to make student life easier.</p>
          </div>
          <div className="grid">
            {/* Scale & Grade Converter */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">🔄</div>
                <h3>
                  Scale &amp; Grade Converter <span className="badge-new">Updated</span>
                </h3>
                <p>
                  Convert scales or calculate subject-wise weighted GPA &amp; CGPA with credit hour
                  weighting and university formulas.
                </p>
              </div>
              <button
                type="button"
                className="link-btn"
                onClick={() => openTool('scaleConverterTool')}
              >
                Convert Scale →
              </button>
            </div>

            {/* Pomodoro Study Timer */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">⏱️</div>
                <h3>
                  Pomodoro Timer <span className="badge-new">New</span>
                </h3>
                <p>Stay focused with timed 25-minute study sprints and scheduled breaks.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('pomodoroTool')}>
                Start Timer →
              </button>
            </div>

            {/* Unit Converter */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">📐</div>
                <h3>
                  Unit Converter <span className="badge-new">New</span>
                </h3>
                <p>Convert units for length, mass, temperature, and digital storage.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('unitTool')}>
                Convert Now →
              </button>
            </div>

            {/* CGPA */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">🧮</div>
                <h3>CGPA Calculator</h3>
                <p>Calculate your average CGPA from semester scores.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('cgpaTool')}>
                Calculate →
              </button>
            </div>

            {/* Attendance */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">📅</div>
                <h3>Attendance</h3>
                <p>Calculate your attendance percentage and shortage threshold.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('attendanceTool')}>
                Calculate →
              </button>
            </div>

            {/* Percentage */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">📊</div>
                <h3>Percentage</h3>
                <p>Calculate score percentage from total and obtained marks.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('percentageTool')}>
                Calculate →
              </button>
            </div>

            {/* EMI */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">💰</div>
                <h3>EMI Calculator</h3>
                <p>Calculate monthly education or gadget loan installment.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('emiTool')}>
                Calculate →
              </button>
            </div>

            {/* Age */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">🎂</div>
                <h3>Age Calculator</h3>
                <p>Calculate your exact current age in years and months.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('ageTool')}>
                Calculate →
              </button>
            </div>

            {/* Discount */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">🏷️</div>
                <h3>Discount Calculator</h3>
                <p>Calculate final price and total savings after discount.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('discountTool')}>
                Calculate →
              </button>
            </div>

            {/* GPA */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">🎓</div>
                <h3>GPA Calculator</h3>
                <p>Calculate GPA from individual subject grade points.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('gpaTool')}>
                Calculate →
              </button>
            </div>

            {/* Salary */}
            <div className="card tool-card">
              <div>
                <div className="tool-icon">💼</div>
                <h3>Salary Calculator</h3>
                <p>Estimate monthly take-home salary from annual CTC package.</p>
              </div>
              <button type="button" className="link-btn" onClick={() => openTool('salaryTool')}>
                Calculate →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTERACTIVE TOOLS WORKSPACE
          ====================================================== */}
      <section className={`tool-section ${calculatorAreaActive ? 'active' : ''}`} id="calculatorArea">
        <div className="container">
          <div className="workspace-quick-nav">
            <button
              type="button"
              className="workspace-pill"
              onClick={() => openTool('scaleConverterTool')}
            >
              🔄 Scale &amp; Weighted GPA
            </button>
            <button
              type="button"
              className="workspace-pill"
              onClick={() => openTool('pomodoroTool')}
            >
              ⏱️ Pomodoro
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('unitTool')}>
              📐 Unit Converter
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('cgpaTool')}>
              🧮 CGPA
            </button>
            <button
              type="button"
              className="workspace-pill"
              onClick={() => openTool('attendanceTool')}
            >
              📅 Attendance
            </button>
            <button
              type="button"
              className="workspace-pill"
              onClick={() => openTool('percentageTool')}
            >
              📊 Percentage
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('emiTool')}>
              💰 EMI
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('ageTool')}>
              🎂 Age
            </button>
            <button
              type="button"
              className="workspace-pill"
              onClick={() => openTool('discountTool')}
            >
              🏷️ Discount
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('gpaTool')}>
              🎓 GPA
            </button>
            <button type="button" className="workspace-pill" onClick={() => openTool('salaryTool')}>
              💼 Salary
            </button>
          </div>
          {/* 0. SCALE & GRADE CONVERTER WITH SUBJECT-WISE CREDIT WEIGHTING */}
          <div className="tool-box" id="scaleConverterTool">
            <h2>🔄 GPA, CGPA &amp; Grade Converter</h2>
            <p className="description">
              Calculate weighted semester GPA/CGPA with credit hours or convert between 10.0 scale,
              US 4.0 scale, and percentages.
            </p>

            {/* Top Mode Switcher */}
            <div className="tool-mode-nav">
              <button
                type="button"
                className={converterFeature === 'quick' ? 'active' : ''}
                onClick={() => setConverterFeature('quick')}
              >
                ⚡ Quick Scale Conversion
              </button>
              <button
                type="button"
                className={converterFeature === 'weighted' ? 'active' : ''}
                onClick={() => setConverterFeature('weighted')}
              >
                📚 Subject-Wise Weighted GPA / CGPA
              </button>
            </div>

            {/* SUB-PANEL 1: QUICK SCALE CONVERSION */}
            {converterFeature === 'quick' && (
              <div id="quickScalePanel">
                <div className="scale-tabs">
                  <button
                    type="button"
                    className={`scale-tab-btn ${scaleMode === 'cgpa_to_perc' ? 'active' : ''}`}
                    onClick={() => setScaleMode('cgpa_to_perc')}
                  >
                    CGPA (10.0) → Percentage
                  </button>
                  <button
                    type="button"
                    className={`scale-tab-btn ${scaleMode === 'perc_to_cgpa' ? 'active' : ''}`}
                    onClick={() => setScaleMode('perc_to_cgpa')}
                  >
                    Percentage → CGPA (10.0)
                  </button>
                  <button
                    type="button"
                    className={`scale-tab-btn ${scaleMode === 'gpa_to_cgpa' ? 'active' : ''}`}
                    onClick={() => setScaleMode('gpa_to_cgpa')}
                  >
                    4.0 US GPA → 10.0 &amp; %
                  </button>
                  <button
                    type="button"
                    className={`scale-tab-btn ${scaleMode === 'cgpa_to_gpa' ? 'active' : ''}`}
                    onClick={() => setScaleMode('cgpa_to_gpa')}
                  >
                    10.0 CGPA → 4.0 US Scale
                  </button>
                </div>

                {(scaleMode === 'cgpa_to_perc' || scaleMode === 'perc_to_cgpa') && (
                  <div className="form-group">
                    <label htmlFor="scaleFormulaPreset">Formula Preset / University</label>
                    <select
                      id="scaleFormulaPreset"
                      value={scalePreset}
                      onChange={(e) => setScalePreset(e.target.value as FormulaPreset)}
                    >
                      <option value="cbse">CBSE / AICTE Standard (CGPA × 9.5)</option>
                      <option value="direct">Direct 10x Scale (CGPA × 10.0)</option>
                      <option value="vtu">VTU / Mumbai Univ Formula ((CGPA - 0.75) × 10)</option>
                      <option value="custom">Custom Multiplier</option>
                    </select>
                  </div>
                )}

                {(scaleMode === 'cgpa_to_perc' || scaleMode === 'perc_to_cgpa') &&
                  scalePreset === 'custom' && (
                    <div className="form-group">
                      <label htmlFor="scaleCustomFactor">Custom Multiplier / Factor</label>
                      <input
                        id="scaleCustomFactor"
                        type="number"
                        step="0.01"
                        value={scaleCustomFactor}
                        onChange={(e) => setScaleCustomFactor(e.target.value)}
                      />
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="scaleInputValue">
                    {scaleMode === 'cgpa_to_perc' && 'Enter 10-Point CGPA (e.g., 8.8)'}
                    {scaleMode === 'perc_to_cgpa' && 'Enter Percentage % (e.g., 83.6)'}
                    {scaleMode === 'gpa_to_cgpa' && 'Enter US GPA on 4.0 Scale (e.g., 3.6)'}
                    {scaleMode === 'cgpa_to_gpa' && 'Enter 10-Point CGPA (e.g., 8.5)'}
                  </label>
                  <input
                    id="scaleInputValue"
                    type="number"
                    step="any"
                    value={scaleInputValue}
                    onChange={(e) => setScaleInputValue(e.target.value)}
                    placeholder={
                      scaleMode === 'perc_to_cgpa'
                        ? 'Example: 83.6'
                        : scaleMode === 'gpa_to_cgpa'
                        ? 'Example: 3.6'
                        : 'Example: 8.8'
                    }
                  />
                </div>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (!scaleInputValue) {
                      showToast('Please enter a value to convert.');
                    }
                  }}
                >
                  Calculate Conversion
                </button>

                {quickScaleResult && (
                  <div className="scale-result-card show">
                    <div className="scale-main-value">
                      <span>{quickScaleResult.resultPrimary}</span>
                      <span className="grade-badge">{quickScaleResult.badge}</span>
                    </div>
                    <div className="mt-1.5 font-semibold text-sm">
                      {quickScaleResult.resultSecondary}
                    </div>
                    <div className="scale-formula-note">{quickScaleResult.formulaNote}</div>
                    <div className="result-actions">
                      <button
                        type="button"
                        className="small-outline-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            `${quickScaleResult.resultPrimary} (${quickScaleResult.resultSecondary})`
                          );
                          showToast('Copied conversion result!');
                        }}
                      >
                        📋 Copy Result
                      </button>
                      <button
                        type="button"
                        className="small-outline-btn"
                        onClick={() =>
                          handleSaveResultToCloud({
                            toolName: 'Scale Converter',
                            summary: `${quickScaleResult.resultPrimary} — ${quickScaleResult.badge}`,
                            details: `${quickScaleResult.resultSecondary} | ${quickScaleResult.formulaNote}`,
                            category: 'academic',
                          })
                        }
                      >
                        ☁️ Save Result
                      </button>
                    </div>
                  </div>
                )}

                <div className="mini-reference-wrap">
                  <button
                    type="button"
                    className="reference-toggle"
                    onClick={() => setRefTableOpen((o) => !o)}
                  >
                    <span>📊 Quick Conversion Reference Guide</span>{' '}
                    <span>{refTableOpen ? '▲' : '▼'}</span>
                  </button>
                  <div className="table-scroll-container">
                    <table className={`reference-table ${refTableOpen ? 'show' : ''}`}>
                    <thead>
                      <tr>
                        <th>10.0 CGPA</th>
                        <th>Approx % (×9.5)</th>
                        <th>4.0 US GPA</th>
                        <th>Standard Grade</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>9.5 - 10.0</td>
                        <td>90% - 95%+</td>
                        <td>3.8 - 4.0</td>
                        <td>O / A+</td>
                        <td>Outstanding / Distinction</td>
                      </tr>
                      <tr>
                        <td>8.5 - 9.4</td>
                        <td>80.7% - 89.3%</td>
                        <td>3.5 - 3.7</td>
                        <td>A</td>
                        <td>Excellent / First Class Dist.</td>
                      </tr>
                      <tr>
                        <td>7.5 - 8.4</td>
                        <td>71.2% - 79.8%</td>
                        <td>3.0 - 3.4</td>
                        <td>B+</td>
                        <td>Very Good / First Class</td>
                      </tr>
                      <tr>
                        <td>6.5 - 7.4</td>
                        <td>61.7% - 70.3%</td>
                        <td>2.5 - 2.9</td>
                        <td>B</td>
                        <td>Good / High Second Class</td>
                      </tr>
                      <tr>
                        <td>5.5 - 6.4</td>
                        <td>52.2% - 60.8%</td>
                        <td>2.0 - 2.4</td>
                        <td>C</td>
                        <td>Above Average / Second Class</td>
                      </tr>
                      <tr>
                        <td>&lt; 5.5</td>
                        <td>&lt; 52.2%</td>
                        <td>&lt; 2.0</td>
                        <td>D / F</td>
                        <td>Pass / Needs Improvement</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PANEL 2: SUBJECT-WISE CREDIT HOUR WEIGHTED GPA/CGPA */}
            {converterFeature === 'weighted' && (
              <div id="weightedCreditPanel">
                <div className="weighted-config-grid">
                  <div className="form-group mb-0">
                    <label htmlFor="weightedGradingScale">Grading System / Scale</label>
                    <select
                      id="weightedGradingScale"
                      value={weightedScale}
                      onChange={(e) => handleWeightedScaleChange(e.target.value as WeightedScale)}
                    >
                      <option value="10">10.0 Scale (O, A+, A, B+, B, C, P, F)</option>
                      <option value="4">4.0 US Scale (A, A-, B+, B, B-, C+, C, D, F)</option>
                      <option value="customNum">Custom Direct Numeric Points (e.g. 8.5 / 3.7)</option>
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label htmlFor="weightedFormulaPreset">
                      Conversion Formula for % Equivalent
                    </label>
                    <select
                      id="weightedFormulaPreset"
                      value={weightedFormula}
                      onChange={(e) => setWeightedFormula(e.target.value as WeightedFormula)}
                    >
                      <option value="cbse">CBSE / AICTE (10-Scale × 9.5)</option>
                      <option value="direct">Direct 10x Scale (CGPA × 10.0)</option>
                      <option value="vtu">VTU / Mumbai ((CGPA - 0.75) × 10)</option>
                    </select>
                  </div>
                </div>

                {/* Optional Prior Cumulative Academics */}
                <div className="prior-academic-box">
                  <div
                    className="prior-toggle-header"
                    onClick={() => setPriorOpen((p) => !p)}
                  >
                    <span>➕ Include Prior Cumulative CGPA &amp; Credits (Optional)</span>
                    <span className="text-indigo-500 text-base">{priorOpen ? '−' : '+'}</span>
                  </div>
                  <div className={`prior-inputs ${priorOpen ? 'show' : ''}`}>
                    <div className="form-group mb-0">
                      <label htmlFor="priorCredits" className="text-xs">
                        Prior Completed Credits
                      </label>
                      <input
                        id="priorCredits"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 48"
                        value={priorCredits}
                        onChange={(e) => setPriorCredits(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="priorCGPA" className="text-xs">
                        Prior Cumulative CGPA / GPA
                      </label>
                      <input
                        id="priorCGPA"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 8.45"
                        value={priorCGPA}
                        onChange={(e) => setPriorCGPA(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Subject Table */}
                <div className="subject-table-wrap">
                  <table className="subject-table">
                    <thead>
                      <tr>
                        <th className="w-[38%]">Subject / Course Name</th>
                        <th className="w-[32%]">Grade / Points</th>
                        <th className="w-[20%]">Credit Hours</th>
                        <th className="w-[10%] text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subj, idx) => (
                        <tr key={subj.id}>
                          <td>
                            <input
                              type="text"
                              placeholder={`Subject ${idx + 1} (e.g. Data Structures)`}
                              value={subj.name}
                              onChange={(e) => updateSubjectField(idx, 'name', e.target.value)}
                            />
                          </td>
                          <td>
                            {weightedScale === '10' ? (
                              <select
                                value={subj.grade}
                                onChange={(e) => updateSubjectField(idx, 'grade', e.target.value)}
                              >
                                {GRADE_MAP_10.map((g) => (
                                  <option key={g.val} value={g.val}>
                                    {g.label}
                                  </option>
                                ))}
                              </select>
                            ) : weightedScale === '4' ? (
                              <select
                                value={subj.grade}
                                onChange={(e) => updateSubjectField(idx, 'grade', e.target.value)}
                              >
                                {GRADE_MAP_4.map((g) => (
                                  <option key={g.val} value={g.val}>
                                    {g.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Points (e.g. 8.5)"
                                value={subj.grade}
                                onChange={(e) => updateSubjectField(idx, 'grade', e.target.value)}
                              />
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              placeholder="Credits"
                              value={subj.credits}
                              onChange={(e) => updateSubjectField(idx, 'credits', e.target.value)}
                            />
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="row-del-btn"
                              title="Remove Subject"
                              onClick={() => removeSubjectRow(idx)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-action-bar">
                  <div className="table-btn-group">
                    <button type="button" className="small-outline-btn" onClick={addSubjectRow}>
                      ➕ Add Subject
                    </button>
                    <button
                      type="button"
                      className="small-outline-btn"
                      onClick={loadSampleSubjects}
                    >
                      📋 Load Sample Subjects
                    </button>
                    <button type="button" className="small-outline-btn" onClick={resetSubjects}>
                      🔄 Reset
                    </button>
                  </div>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => showToast('Weighted GPA calculated!')}
                  >
                    Calculate Weighted GPA
                  </button>
                </div>

                {/* Result Card for Weighted Calculator */}
                {weightedResult && (
                  <div className="weighted-result-box show">
                    <div className="flex justify-between items-start flex-wrap gap-2.5">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                          Semester Weighted Score
                        </div>
                        <div className="scale-main-value mt-0.5">
                          <span>
                            {weightedResult.semesterGPA.toFixed(2)}{' '}
                            {weightedScale === '4' ? '/ 4.0' : '/ 10.0'}
                          </span>
                          <span className="grade-badge">{weightedResult.classTitle}</span>
                        </div>
                      </div>
                      {weightedResult.combinedCGPA !== null && (
                        <div className="text-right">
                          <div className="text-xs font-bold opacity-75">New Cumulative CGPA</div>
                          <div className="text-2xl font-extrabold text-indigo-500">
                            {weightedResult.combinedCGPA.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="metrics-summary-grid">
                      <div className="metric-pill">
                        <span>Total Credits</span>
                        <strong>{weightedResult.totalCredits.toFixed(1)}</strong>
                      </div>
                      <div className="metric-pill">
                        <span>Quality Points</span>
                        <strong>{weightedResult.totalQualityPoints.toFixed(2)}</strong>
                      </div>
                      <div className="metric-pill">
                        <span>Total Subjects</span>
                        <strong>{subjects.length}</strong>
                      </div>
                      <div className="metric-pill">
                        <span>Status</span>
                        <strong
                          className={
                            weightedResult.hasFail ? '!text-red-600' : '!text-green-600'
                          }
                        >
                          {weightedResult.hasFail ? 'Fail in Subj' : 'All Cleared'}
                        </strong>
                      </div>
                    </div>

                    {/* Multi Scale Conversion Equivalents */}
                    <div className="scale-equivalencies-grid">
                      <div className="equiv-item">
                        <small>10.0 Scale CGPA</small>
                        <b>{weightedResult.cgpa10.toFixed(2)} CGPA</b>
                      </div>
                      <div className="equiv-item">
                        <small>US 4.0 Scale GPA</small>
                        <b>{weightedResult.gpa4.toFixed(2)} / 4.0</b>
                      </div>
                      <div className="equiv-item">
                        <small>Percentage Equivalent</small>
                        <b>{weightedResult.perc.toFixed(2)}%</b>
                      </div>
                    </div>

                    {/* Subject breakdown table */}
                    <div className="mt-4">
                      <div className="text-xs font-bold opacity-75 mb-1.5">
                        Subject Contribution Breakdown
                      </div>
                      <div className="table-scroll-container">
                        <table className="subject-breakdown-table">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Credits</th>
                              <th>Points</th>
                              <th>Contribution (Credits × Pts)</th>
                              <th>Weight %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjects.map((s, idx) => {
                              const c = Number(s.credits) || 0;
                              const g = Number(s.grade) || 0;
                              const qp = c * g;
                              const weightShare =
                                weightedResult.totalQualityPoints > 0
                                  ? ((qp / weightedResult.totalQualityPoints) * 100).toFixed(1)
                                  : '0.0';
                              return (
                                <tr key={s.id}>
                                  <td className="font-semibold">
                                    {s.name || `Subject ${idx + 1}`}
                                  </td>
                                  <td>{c} credits</td>
                                  <td>{g} pts</td>
                                  <td>
                                    <strong>{qp.toFixed(1)}</strong>
                                  </td>
                                  <td>{weightShare}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="result-actions">
                        <button
                          type="button"
                          className="small-outline-btn"
                          onClick={() =>
                            handleSaveResultToCloud({
                              toolName: 'Weighted Semester GPA',
                              summary: `${weightedResult.semesterGPA.toFixed(2)} (${weightedResult.classTitle})`,
                              details: `Credits: ${weightedResult.totalCredits.toFixed(1)} | 10-Scale: ${weightedResult.cgpa10.toFixed(2)} | %: ${weightedResult.perc.toFixed(2)}%`,
                              category: 'academic',
                            })
                          }
                        >
                          ☁️ Save Weighted GPA to Cloud
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 1. POMODORO TIMER */}
          <div className="tool-box" id="pomodoroTool">
            <h2>⏱️ Pomodoro Study Timer</h2>
            <p className="description">
              Increase study concentration with structured focus blocks and restorative intervals.
            </p>
            <div className="pomo-modes">
              <button
                type="button"
                className={`pomo-mode-btn ${pomoMode === 'focus' ? 'active' : ''}`}
                onClick={() => handleSelectPomoMode('focus', 25)}
              >
                Focus (25m)
              </button>
              <button
                type="button"
                className={`pomo-mode-btn ${pomoMode === 'short' ? 'active' : ''}`}
                onClick={() => handleSelectPomoMode('short', 5)}
              >
                Short Break (5m)
              </button>
              <button
                type="button"
                className={`pomo-mode-btn ${pomoMode === 'long' ? 'active' : ''}`}
                onClick={() => handleSelectPomoMode('long', 15)}
              >
                Long Break (15m)
              </button>
            </div>
            <div className="pomo-display-wrapper">
              <div className="pomo-circle-wrap">
                <svg height="210" viewBox="0 0 200 200" width="210">
                  <circle className="pomo-track" cx="100" cy="100" r="90"></circle>
                  <circle
                    className="pomo-progress"
                    cx="100"
                    cy="100"
                    r="90"
                    strokeDashoffset={pomoDashOffset}
                  ></circle>
                </svg>
                <div className="pomo-time-center">
                  <div className="pomo-timer-text">{pomoFormatted}</div>
                  <div className="pomo-timer-status">
                    {pomoMode === 'focus'
                      ? 'Focus Mode'
                      : pomoMode === 'short'
                      ? 'Short Break'
                      : 'Long Break'}
                  </div>
                </div>
              </div>
            </div>
            <div className="pomo-controls">
              <button
                type="button"
                className="primary-btn"
                onClick={() => setPomoIsRunning((r) => !r)}
              >
                {pomoIsRunning
                  ? 'Pause'
                  : pomoTimeLeft < pomoDuration
                  ? 'Resume'
                  : pomoMode === 'focus'
                  ? 'Start Focus'
                  : 'Start Break'}
              </button>
              <button type="button" className="secondary-btn" onClick={handleResetPomodoro}>
                Reset
              </button>
            </div>
            <div className="pomo-stats">
              <div>
                <h4>{completedSessions}</h4>
                <p>Completed Cycles</p>
              </div>
              <div>
                <h4>{Math.floor(totalFocusedSeconds / 60)} min</h4>
                <p>Total Time Focused</p>
              </div>
            </div>
          </div>

          {/* 2. UNIT CONVERTER */}
          <div className="tool-box" id="unitTool">
            <h2>📐 Academic &amp; Scientific Unit Converter</h2>
            <p className="description">
              Fast conversions across length, mass, temperature, and digital storage.
            </p>
            <div className="form-group">
              <label htmlFor="converterCategory">Category</label>
              <select
                id="converterCategory"
                value={unitCategory}
                onChange={(e) => handleUnitCategoryChange(e.target.value as UnitCategory)}
              >
                <option value="length">Length &amp; Distance</option>
                <option value="mass">Mass &amp; Weight</option>
                <option value="temp">Temperature</option>
                <option value="storage">Digital Storage</option>
              </select>
            </div>
            <div className="converter-grid">
              <div className="form-group mb-0">
                <label htmlFor="unitFromValue">From</label>
                <input
                  id="unitFromValue"
                  type="number"
                  step="any"
                  value={unitFromVal}
                  onChange={(e) => setUnitFromVal(e.target.value)}
                />
                <select
                  id="unitFromSelect"
                  className="mt-2"
                  value={unitFromId}
                  onChange={(e) => setUnitFromId(e.target.value)}
                >
                  {UNIT_DATA[unitCategory].units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="swap-btn"
                onClick={handleSwapUnits}
                title="Swap Units"
              >
                ⇄
              </button>
              <div className="form-group mb-0">
                <label htmlFor="unitToValue">To</label>
                <input
                  id="unitToValue"
                  type="text"
                  readOnly
                  placeholder="Result"
                  className="font-bold"
                  value={unitConversion.toValue}
                />
                <select
                  id="unitToSelect"
                  className="mt-2"
                  value={unitToId}
                  onChange={(e) => setUnitToId(e.target.value)}
                >
                  {UNIT_DATA[unitCategory].units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="converter-result">
              <span>Result:</span>
              <strong>{unitConversion.formula}</strong>
              <button
                type="button"
                className="small-outline-btn"
                onClick={() =>
                  handleSaveResultToCloud({
                    toolName: 'Unit Converter',
                    summary: unitConversion.formula,
                    details: `Category: ${unitCategory}`,
                    category: 'utility',
                  })
                }
              >
                ☁️ Save
              </button>
            </div>
          </div>

          {/* 3. CGPA */}
          <div className="tool-box" id="cgpaTool">
            <h2>🧮 CGPA Calculator</h2>
            <p className="description">Enter your semester CGPAs to calculate average CGPA.</p>
            <div className="form-group">
              <label>Semester 1 CGPA</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Example: 8.5"
                value={cgpa1}
                onChange={(e) => setCgpa1(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Semester 2 CGPA</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Example: 8.8"
                value={cgpa2}
                onChange={(e) => setCgpa2(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateCGPA}>
                Calculate CGPA
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setCgpa1('');
                  setCgpa2('');
                  setCgpaResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {cgpaResult && (
              <div className="result show">
                Your Average CGPA
                <br />
                <strong>{cgpaResult}</strong>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'CGPA Calculator',
                        summary: `${cgpaResult} CGPA`,
                        details: `Sem 1: ${cgpa1} | Sem 2: ${cgpa2}`,
                        category: 'academic',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Attendance */}
          <div className="tool-box" id="attendanceTool">
            <h2>📅 Attendance Calculator</h2>
            <p className="description">Calculate your current attendance percentage.</p>
            <div className="form-group">
              <label>Total Classes</label>
              <input
                type="number"
                placeholder="Example: 60"
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Classes Attended</label>
              <input
                type="number"
                placeholder="Example: 48"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateAttendance}>
                Calculate Attendance
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setTotalClasses('');
                  setAttendedClasses('');
                  setAttendanceResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {attendanceResult && (
              <div className="result show">
                Attendance
                <br />
                <strong>{attendanceResult}%</strong>
                <div className="mt-1 text-xs font-semibold">
                  {parseFloat(attendanceResult) >= 75
                    ? '✅ Above 75% safe threshold!'
                    : '⚠️ Below 75% threshold — attend upcoming classes regularly.'}
                </div>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'Attendance Calculator',
                        summary: `${attendanceResult}% Attendance`,
                        details: `Attended ${attendedClasses} of ${totalClasses} classes`,
                        category: 'academic',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Percentage */}
          <div className="tool-box" id="percentageTool">
            <h2>📊 Percentage Calculator</h2>
            <p className="description">Calculate percentage from obtained and total marks.</p>
            <div className="form-group">
              <label>Obtained Marks</label>
              <input
                type="number"
                placeholder="Example: 450"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Total Marks</label>
              <input
                type="number"
                placeholder="Example: 500"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculatePercentage}>
                Calculate Percentage
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setObtainedMarks('');
                  setTotalMarks('');
                  setPercentageResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {percentageResult && (
              <div className="result show">
                Percentage
                <br />
                <strong>{percentageResult}%</strong>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'Percentage Calculator',
                        summary: `${percentageResult}%`,
                        details: `Marks: ${obtainedMarks} / ${totalMarks}`,
                        category: 'academic',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. EMI */}
          <div className="tool-box" id="emiTool">
            <h2>💰 EMI Calculator</h2>
            <p className="description">Estimate your monthly loan payment.</p>
            <div className="form-group">
              <label>Loan Amount (₹)</label>
              <input
                type="number"
                placeholder="Example: 500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Example: 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Loan Period (Years)</label>
              <input
                type="number"
                placeholder="Example: 5"
                value={loanYears}
                onChange={(e) => setLoanYears(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateEMI}>
                Calculate EMI
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setLoanAmount('');
                  setInterestRate('');
                  setLoanYears('');
                  setEmiResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {emiResult && (
              <div className="result show">
                Monthly EMI
                <br />
                <strong>₹{emiResult.emi}</strong>
                <br />
                <br />
                Total Interest: ₹{emiResult.totalInterest}
                <br />
                Total Payment: ₹{emiResult.totalPayment}
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'EMI Calculator',
                        summary: `₹${emiResult.emi}/month`,
                        details: `Loan: ₹${loanAmount} @ ${interestRate}% for ${loanYears} yrs | Total: ₹${emiResult.totalPayment}`,
                        category: 'finance',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 7. AGE */}
          <div className="tool-box" id="ageTool">
            <h2>🎂 Age Calculator</h2>
            <p className="description">Enter your date of birth to calculate your exact age.</p>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateAge}>
                Calculate Age
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setBirthDate('');
                  setAgeResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {ageResult && (
              <div className="result show">
                Your Age
                <br />
                <strong>{ageResult}</strong>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'Age Calculator',
                        summary: ageResult,
                        details: `DOB: ${birthDate}`,
                        category: 'utility',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 8. DISCOUNT */}
          <div className="tool-box" id="discountTool">
            <h2>🏷️ Discount Calculator</h2>
            <p className="description">Calculate the final price after discount.</p>
            <div className="form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                placeholder="Example: 2000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                placeholder="Example: 20"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateDiscount}>
                Calculate
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setOriginalPrice('');
                  setDiscountPercent('');
                  setDiscountResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {discountResult && (
              <div className="result show">
                You Save: ₹{discountResult.saved}
                <br />
                <br />
                Final Price
                <br />
                <strong>₹{discountResult.finalPrice}</strong>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'Discount Calculator',
                        summary: `Final: ₹${discountResult.finalPrice} (Saved ₹${discountResult.saved})`,
                        details: `Original: ₹${originalPrice} | Discount: ${discountPercent}%`,
                        category: 'finance',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 9. GPA */}
          <div className="tool-box" id="gpaTool">
            <h2>🎓 GPA Calculator</h2>
            <p className="description">Enter grade points for your subjects.</p>
            {gpaInputs.map((val, idx) => (
              <div className="form-group" key={idx}>
                <label>Subject {idx + 1}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="Example: 9"
                  value={val}
                  onChange={(e) => {
                    const next = [...gpaInputs];
                    next[idx] = e.target.value;
                    setGpaInputs(next);
                  }}
                />
              </div>
            ))}
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateGPA}>
                Calculate GPA
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setGpaInputs((prev) => [...prev, ''])}
              >
                ➕ Add Subject
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setGpaInputs(['', '', '', '', '']);
                  setGpaResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {gpaResult && (
              <div className="result show">
                Your GPA
                <br />
                <strong>{gpaResult}</strong>
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'GPA Calculator',
                        summary: `${gpaResult} GPA`,
                        details: `Subjects entered: ${gpaInputs.filter(Boolean).join(', ')}`,
                        category: 'academic',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 10. SALARY */}
          <div className="tool-box" id="salaryTool">
            <h2>💼 Salary Calculator</h2>
            <p className="description">Estimate monthly salary from annual CTC.</p>
            <div className="form-group">
              <label>Annual CTC (₹)</label>
              <input
                type="number"
                placeholder="Example: 600000"
                value={annualCTC}
                onChange={(e) => setAnnualCTC(e.target.value)}
              />
            </div>
            <div className="tool-btn-row">
              <button type="button" className="primary-btn" onClick={handleCalculateSalary}>
                Calculate
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setAnnualCTC('');
                  setSalaryResult(null);
                }}
              >
                Reset
              </button>
            </div>
            {salaryResult && (
              <div className="result show">
                Estimated Monthly CTC
                <br />
                <strong>₹{salaryResult.monthly}</strong>
                <br />
                <br />
                Annual CTC: ₹{salaryResult.annualFormatted}
                <div className="result-actions">
                  <button
                    type="button"
                    className="small-outline-btn"
                    onClick={() =>
                      handleSaveResultToCloud({
                        toolName: 'Salary Calculator',
                        summary: `₹${salaryResult.monthly} / month`,
                        details: `Annual CTC: ₹${salaryResult.annualFormatted}`,
                        category: 'finance',
                      })
                    }
                  >
                    ☁️ Save Result
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          EXPANDED STUDENT TOOLS SUITE (11 ESSENTIAL TOOLS)
          ====================================================== */}
      <StudentToolsExpanded onSaveToCloud={handleSaveResultToCloud} showToast={showToast} />

      {/* ======================================================
          PROGRAMMING HUB: 1. JAVA (41 MODULES) & 2. PYTHON (35 MODULES)
          ====================================================== */}
      <div id="java" />
      <div id="python" />
      <ProgrammingHub
        activeLang={activeProgLang}
        onSelectLang={setActiveProgLang}
        onAskAiTutor={askAiAboutTopic}
        onSaveProgressToCloud={handleSaveResultToCloud}
        showToast={showToast}
        bookmarkedTopics={bookmarkedTopics}
        onToggleBookmark={handleToggleBookmark}
        onTopicVisited={handleTopicVisited}
      />

      {/* ======================================================
          CODING PRACTICE AREA (JAVA, PYTHON, SQL, JAVASCRIPT)
          ====================================================== */}
      <div id="coding-practice">
        <CodingPracticeArea
          completedProblemIds={completedProblemIds}
          onToggleProblemSolved={handleToggleProblemSolved}
          showToast={showToast}
        />
      </div>

      {/* ======================================================
          INTERVIEW PREPARATION (COMPREHENSIVE MULTI-CATEGORY & MULTI-DIFFICULTY)
          ====================================================== */}
      <section className="section" id="interview">
        <div className="container">
          <div className="section-title">
            <h2>🎯 Technical Interview Preparation</h2>
            <p>
              In-depth questions, expert answers, code examples, and practice trackers across
              fresher, intermediate, and advanced levels.
            </p>
            
            {/* Category Filter */}
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'java', label: '☕ Java' },
                { id: 'python', label: '🐍 Python' },
                { id: 'sql', label: '🗄️ SQL' },
                { id: 'html-css', label: '🎨 HTML & CSS' },
                { id: 'javascript', label: '⚡ JavaScript' },
                { id: 'fullstack', label: '🌐 Full Stack' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setInterviewCategory(cat.id as InterviewCategory | 'all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    interviewCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-indigo-500'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty Level Filter */}
            <div className="mt-2.5 flex justify-center flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'Beginner', label: '🟢 Beginner' },
                { id: 'Intermediate', label: '🟡 Intermediate' },
                { id: 'Advanced', label: '🔴 Advanced' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setInterviewLevel(lvl.id as InterviewDifficulty | 'all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    interviewLevel === lvl.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              <button
                type="button"
                className="small-outline-btn"
                onClick={() => {
                  const allOpen: Record<string, boolean> = {};
                  INTERVIEW_QUESTIONS_DATABASE.forEach((item) => {
                    allOpen[item.id] = true;
                  });
                  setOpenAnswers(allOpen);
                }}
              >
                📂 Expand All Answers
              </button>
              <button
                type="button"
                className="small-outline-btn"
                onClick={() => setOpenAnswers({})}
              >
                📁 Collapse All
              </button>
              <button
                type="button"
                className="small-outline-btn"
                onClick={() =>
                  askAiAboutTopic(
                    `Conduct a technical interview session with me for ${
                      interviewCategory === 'all' ? 'Full Stack Developer' : interviewCategory.toUpperCase()
                    } role at ${interviewLevel === 'all' ? 'Intermediate' : interviewLevel} level. Ask me 1 question at a time.`
                  )
                }
              >
                🤖 Practice with AI Mock Interviewer
              </button>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {INTERVIEW_QUESTIONS_DATABASE.filter((q) => {
              if (interviewCategory !== 'all' && q.category !== interviewCategory) return false;
              if (interviewLevel !== 'all' && q.level !== interviewLevel) return false;
              return true;
            }).map((item) => {
              const isOpen = !!openAnswers[item.id];
              const isPracticed = !!practicedInterviewIds[item.id];

              return (
                <div
                  className={`question rounded-xl p-5 border transition ${
                    isPracticed
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-[var(--border)] bg-[var(--card)]'
                  }`}
                  key={item.id}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 uppercase">
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          item.level === 'Beginner'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : item.level === 'Intermediate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleInterviewPracticed(item.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition flex items-center gap-1.5 self-start sm:self-auto ${
                        isPracticed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--border)] text-[var(--muted)] hover:text-emerald-600'
                      }`}
                    >
                      {isPracticed ? '✓ Practiced' : '○ Mark Practiced'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[var(--foreground)] mt-1">{item.question}</h3>

                  <div className={`answer ${isOpen ? 'show' : ''} mt-3 pt-3 border-t border-[var(--border)]`}>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{item.answer}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                      💡 <strong>In Plain English:</strong> {item.explanation}
                    </p>

                    {item.codeExample && (
                      <div className="mt-2 mb-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Code Example:
                        </div>
                        <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto font-mono">
                          <code>{item.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      className="small-btn text-xs font-bold"
                      onClick={() =>
                        setOpenAnswers((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                    >
                      {isOpen ? '▲ Hide Answer' : '▼ Show Answer & Code'}
                    </button>

                    <button
                      type="button"
                      className="text-xs text-indigo-500 font-bold hover:underline"
                      onClick={() =>
                        askAiAboutTopic(`Explain this technical interview question in depth: "${item.question}". Give practical interview tips on how to answer it impressed by tech recruiters.`)
                      }
                    >
                      Ask AI Tutor →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          RESUME BUILDER
          ====================================================== */}
      <section className="section" id="resume">
        <div className="container">
          <div className="section-title">
            <h2>📄 Free Resume Builder</h2>
            <p>Enter your details, preview in real time, and download directly as a high-resolution PDF file or print ready document.</p>
          </div>

          {/* Mobile & Tablet View Selector + Template Selector */}
          <div className="resume-top-controls">
            <div className="resume-mobile-segmented">
              <button
                type="button"
                className={resumeMobileTab === 'form' ? 'active' : ''}
                onClick={() => setResumeMobileTab('form')}
              >
                ✏️ Edit Details
              </button>
              <button
                type="button"
                className={resumeMobileTab === 'preview' ? 'active' : ''}
                onClick={() => setResumeMobileTab('preview')}
              >
                👁️ Document Preview
              </button>
              <button
                type="button"
                className={resumeMobileTab === 'both' ? 'active' : ''}
                onClick={() => setResumeMobileTab('both')}
              >
                📄 Both (Stacked)
              </button>
            </div>

            {/* Template Selector Button Group */}
            <div className="resume-template-selector-group">
              <span className="template-selector-label">🎨 Layout Template:</span>
              <button
                type="button"
                className={`template-btn ${resumeTemplate === 'modern' ? 'active' : ''}`}
                onClick={() => setResumeTemplate('modern')}
                title="Switch to Modern layout (Clean sans-serif with modern accents)"
              >
                ✨ Modern
              </button>
              <button
                type="button"
                className={`template-btn ${resumeTemplate === 'classic' ? 'active' : ''}`}
                onClick={() => setResumeTemplate('classic')}
                title="Switch to Classic layout (Formal serif font with single-column Harvard/Ivy League style)"
              >
                📜 Classic
              </button>
            </div>
          </div>

          <div className="resume-grid">
            {/* Form Section */}
            <div className={`resume-form ${resumeMobileTab === 'preview' ? 'mobile-hidden' : ''}`}>
              <div className="resume-autoformat-tip">
                <span className="tip-icon">✨</span>
                <div>
                  <strong>Markdown Bullet Auto-Format:</strong> Start lines with <code>*</code>, <code>-</code>, or numbers to automatically render clean, formatted bullet lists in your preview &amp; PDF!
                </div>
              </div>

              <div className="resume-form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    placeholder="Your Name"
                    value={resumeData.resumeName}
                    onChange={(e) =>
                      setResumeData((prev) => ({ ...prev, resumeName: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={resumeData.resumeEmail}
                    onChange={(e) =>
                      setResumeData((prev) => ({ ...prev, resumeEmail: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="resume-form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={resumeData.resumePhone}
                    onChange={(e) =>
                      setResumeData((prev) => ({ ...prev, resumePhone: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location / City</label>
                  <input
                    placeholder="Hyderabad, India"
                    value={resumeData.resumeLocation}
                    onChange={(e) =>
                      setResumeData((prev) => ({ ...prev, resumeLocation: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Career Objective</label>
                <textarea
                  placeholder="Motivated computer science student seeking an entry-level software engineering role..."
                  value={resumeData.resumeObjective}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeObjective: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Education <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* B.Tech in Computer Science & Engineering (2022 – 2026) | CGPA: 8.9 / 10.0&#10;* Higher Secondary (CBSE) | 94.6%"
                  value={resumeData.resumeEducation}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeEducation: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Technical Skills <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* Languages: Java, Python, TypeScript, SQL&#10;* Frameworks: React, Spring Boot, Node.js&#10;* Tools: Git, Docker, VS Code, Linux"
                  value={resumeData.resumeSkills}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeSkills: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Projects <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* StudentTools Portal — Full-stack academic calculator suite, Gemini AI Tutor & Resume Builder.&#10;* Smart Attendance Tracker — Automated shortage alert system."
                  value={resumeData.resumeProjects}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeProjects: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Experience / Internships <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* Software Engineering Intern — Built REST APIs and optimized database queries reducing latency by 30%.&#10;* Open Source Contributor — Authored documentation and unit tests."
                  value={resumeData.resumeExperience}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeExperience: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Certifications <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* Oracle Certified Professional: Java SE Developer&#10;* AWS Certified Cloud Practitioner"
                  value={resumeData.resumeCertifications}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeCertifications: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Achievements &amp; Extracurricular <span className="label-tip">(* or - for bullets)</span>
                </label>
                <textarea
                  placeholder="* 1st Place at National Smart Campus Hackathon&#10;* Solved 300+ LeetCode problems (Top 10% rating)"
                  value={resumeData.resumeAchievements}
                  onChange={(e) =>
                    setResumeData((prev) => ({ ...prev, resumeAchievements: e.target.value }))
                  }
                />
              </div>

              <div className="resume-actions">
                <button
                  type="button"
                  className="primary-btn export-pdf-btn"
                  onClick={handleExportResumePdf}
                  disabled={isExportingPdf}
                  title="Directly save and download resume as a PDF file"
                >
                  {isExportingPdf ? `⏳ Generating PDF (${pdfExportProgress}%)...` : '📄 Download PDF'}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handlePrintResume}
                  title="Open system print dialog"
                >
                  🖨️ Print
                </button>
                <button
                  type="button"
                  className="secondary-btn resume-template-btn"
                  onClick={() => setResumeTemplate((t) => (t === 'modern' ? 'classic' : 'modern'))}
                  title="Switch resume template between Modern and Classic layout"
                >
                  🎨 {resumeTemplate === 'modern' ? 'Classic (Serif)' : 'Modern (Clean)'}
                </button>
                <button
                  type="button"
                  className="secondary-btn resume-autoformat-btn"
                  onClick={() => {
                    setAutoFormatBullets((v) => !v);
                    showToast(`Bullet auto-formatting ${!autoFormatBullets ? 'enabled' : 'disabled'}.`);
                  }}
                  title="Toggle automatic conversion of * or - lines into clean bullet lists"
                >
                  ✨ Bullets: {autoFormatBullets ? 'ON' : 'OFF'}
                </button>
                <button type="button" className="primary-btn" onClick={handleSaveResume}>
                  💾 Save
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSyncWorkspaceToCloud}
                >
                  ☁️ Sync
                </button>
                <button type="button" className="secondary-btn" onClick={handleDownloadResumeJson}>
                  📥 JSON
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setResumeData({
                      resumeName: 'Aarav Sharma',
                      resumeEmail: 'aarav.sharma@student.edu',
                      resumePhone: '+91 98765 43210',
                      resumeLocation: 'Hyderabad, India',
                      resumeObjective:
                        'Final-year B.Tech Computer Science student with strong foundations in Java, Data Structures, and Full-Stack Web Development seeking a Software Engineer role.',
                      resumeEducation:
                        '* B.Tech in Computer Science & Engineering (2022 – 2026) | CGPA: 8.9 / 10.0\n* Higher Secondary Education (CBSE) | Aggregate: 94.6%',
                      resumeSkills:
                        '* Languages: Java, Python, TypeScript, SQL\n* Frameworks & Libraries: Spring Boot, React, Tailwind CSS, Node.js\n* Core Competencies: Data Structures & Algorithms, REST APIs, Git, Cloud Computing',
                      resumeProjects:
                        '* StudentTools Portal — Full-stack academic calculator suite, Gemini AI Tutor & Resume Builder.\n* Smart Attendance Tracker — Automated attendance shortage alert system with predictive analytics.\n* Algorithm Visualizer — Interactive step-by-step pathfinding and sorting simulator built with React.',
                      resumeExperience:
                        '- Software Engineering Intern (Acme Tech) — Built REST APIs and optimized database queries reducing latency by 30%.\n- Open Source Contributor — Authored documentation and unit test coverage for community web tools.',
                      resumeCertifications:
                        '* Oracle Certified Professional: Java SE Developer\n* AWS Certified Cloud Practitioner',
                      resumeAchievements:
                        '- 1st Place at National Smart Campus Hackathon (500+ competing engineering teams)\n- Solved 300+ LeetCode problems (Top 10% global contest rating)',
                    });
                    showToast('Loaded sample student resume with markdown bullets!');
                  }}
                >
                  📋 Sample
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setResumeData({
                      resumeName: '',
                      resumeEmail: '',
                      resumePhone: '',
                      resumeLocation: '',
                      resumeObjective: '',
                      resumeEducation: '',
                      resumeSkills: '',
                      resumeProjects: '',
                      resumeExperience: '',
                      resumeCertifications: '',
                      resumeAchievements: '',
                    });
                    showToast('Resume form cleared.');
                  }}
                >
                  🔄 Clear
                </button>
              </div>
            </div>

            {/* Resume Preview */}
            <div
              className={`resume-preview template-${resumeTemplate} ${resumeMobileTab === 'form' ? 'mobile-hidden' : ''}`}
              id="resumePreview"
            >
              <div className="resume-preview-topbar">
                <span className="resume-preview-tag">
                  {isExportingPdf ? (
                    <>
                      <span className="dot-live exporting"></span>
                      <span>Exporting PDF ({pdfExportProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <span className="dot-live"></span> A4 Live Document Preview ({resumeTemplate === 'modern' ? 'Modern' : 'Classic'})
                    </>
                  )}
                </span>
                <div className="resume-preview-topbar-actions">
                  <button
                    type="button"
                    className="resume-template-toggle-btn"
                    onClick={() => setResumeTemplate((t) => (t === 'modern' ? 'classic' : 'modern'))}
                    title="Toggle layout template between Modern and Classic"
                  >
                    🎨 Layout: {resumeTemplate === 'modern' ? 'Modern' : 'Classic'}
                  </button>
                  <button
                    type="button"
                    className={`resume-autoformat-toggle-btn ${autoFormatBullets ? 'active' : ''}`}
                    onClick={() => {
                      setAutoFormatBullets((v) => !v);
                      showToast(`Bullet auto-format ${!autoFormatBullets ? 'activated' : 'deactivated'}.`);
                    }}
                    title="Toggle auto-formatting for markdown bullets (* or -)"
                  >
                    ✨ Bullets: {autoFormatBullets ? 'ON' : 'OFF'}
                  </button>
                  <button
                    type="button"
                    className="resume-quick-pdf-btn"
                    onClick={handleExportResumePdf}
                    disabled={isExportingPdf}
                    title="Export directly as PDF document"
                  >
                    {isExportingPdf ? `⏳ ${pdfExportProgress}%` : '📄 Export PDF'}
                  </button>
                  <button
                    type="button"
                    className="resume-quick-print-btn"
                    onClick={handlePrintResume}
                    title="Print Document"
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>

              {/* PDF Generation Visual Progress Bar & Spinner Animation within Preview Area */}
              {isExportingPdf && (
                <div
                  className="resume-pdf-export-progress"
                  role="progressbar"
                  aria-valuenow={pdfExportProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="PDF Export Progress"
                >
                  <div className="export-progress-top">
                    <div className="export-spinner-container">
                      <div className="resume-pdf-spinner" aria-label="Exporting PDF spinner"></div>
                    </div>
                    <div className="export-progress-details">
                      <div className="export-progress-title-row">
                        <span className="export-progress-label">Generating High-Resolution PDF</span>
                        <span className="export-progress-percent">{Math.min(100, Math.max(0, pdfExportProgress))}%</span>
                      </div>
                      <div className="export-progress-status">
                        {pdfExportStatus || 'Rendering high-resolution A4 document...'}
                      </div>
                    </div>
                  </div>
                  <div className="resume-pdf-progress-track">
                    <div
                      className="resume-pdf-progress-bar"
                      style={{ width: `${Math.min(100, Math.max(6, pdfExportProgress))}%` }}
                    >
                      <div className="resume-pdf-progress-shimmer"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="resume-preview-header">
                <h1>{resumeData.resumeName || 'Your Name'}</h1>
                <div className="resume-contact-row">
                  {resumeData.resumeEmail && <span>📧 {resumeData.resumeEmail}</span>}
                  {resumeData.resumePhone && <span>📱 {resumeData.resumePhone}</span>}
                  {resumeData.resumeLocation && <span>📍 {resumeData.resumeLocation}</span>}
                </div>
              </div>

              <h2>Career Objective</h2>
              {renderFormattedResumeContent(
                resumeData.resumeObjective,
                'Your career objective will appear here.'
              )}

              <h2>Education</h2>
              {renderFormattedResumeContent(
                resumeData.resumeEducation,
                'Your education details will appear here.'
              )}

              <h2>Skills</h2>
              {renderFormattedResumeContent(
                resumeData.resumeSkills,
                'Your skills will appear here.'
              )}

              <h2>Projects</h2>
              {renderFormattedResumeContent(
                resumeData.resumeProjects,
                'Your projects will appear here.'
              )}

              <h2>Experience</h2>
              {renderFormattedResumeContent(
                resumeData.resumeExperience,
                'Your experience will appear here.'
              )}

              {resumeData.resumeCertifications && (
                <>
                  <h2>Certifications</h2>
                  {renderFormattedResumeContent(resumeData.resumeCertifications, '')}
                </>
              )}

              {resumeData.resumeAchievements && (
                <>
                  <h2>Achievements</h2>
                  {renderFormattedResumeContent(resumeData.resumeAchievements, '')}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          AI STUDY HUB, VOICE TRANSCRIBER & CLOUD WORKSPACE
          ====================================================== */}
      <AIStudyHub
        user={
          currentUser
            ? {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
              }
            : null
        }
        savedItems={savedItems}
        savedNotes={savedNotes}
        onUpdateNotes={setSavedNotes}
        onSyncWorkspace={handleSyncWorkspaceToCloud}
        onSaveItemToCloud={handleSaveResultToCloud}
        onDeleteSavedItem={handleDeleteCloudItem}
        onSignIn={handleGoogleSignIn}
        showToast={showToast}
        externalPrompt={externalAiPrompt}
        onClearExternalPrompt={() => setExternalAiPrompt(null)}
      />

      {/* ======================================================
          PREMIUM MONETIZATION SECTION
          ====================================================== */}
      <div id="premium">
        <PremiumMonetization showToast={showToast} />
      </div>

      {/* ======================================================
          FAQ
          ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = !!openFaqs[idx];
              return (
                <div className="faq-item" key={idx}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  >
                    <span>{faq.q}</span>
                    <span>{isOpen ? '-' : '+'}</span>
                  </button>
                  <div className={`faq-answer ${isOpen ? 'show' : ''}`}>{faq.a}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
          ====================================================== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>StudentTools</h3>
              <p>
                Free, fast tools and resources designed for engineering students, freshers, and
                developers.
              </p>
            </div>
            <div>
              <h3>Tools</h3>
              <button
                type="button"
                className="footer-link"
                onClick={() => openTool('scaleConverterTool')}
              >
                Scale &amp; Grade Converter
              </button>
              <button
                type="button"
                className="footer-link"
                onClick={() => openTool('pomodoroTool')}
              >
                Pomodoro Timer
              </button>
              <button type="button" className="footer-link" onClick={() => openTool('unitTool')}>
                Unit Converter
              </button>
              <button type="button" className="footer-link" onClick={() => openTool('cgpaTool')}>
                CGPA Calculator
              </button>
              <button
                type="button"
                className="footer-link"
                onClick={() => openTool('attendanceTool')}
              >
                Attendance
              </button>
              <button type="button" className="footer-link" onClick={() => openTool('emiTool')}>
                Loan EMI
              </button>
            </div>
            <div>
              <h3>Learning</h3>
              <a
                href="#java"
                onClick={() => {
                  setActiveProgLang('java');
                }}
              >
                Java Guide (41 Modules)
              </a>
              <a
                href="#python"
                onClick={() => {
                  setActiveProgLang('python');
                }}
              >
                Python Guide (35 Modules)
              </a>
              <a href="#interview">Interview Q&amp;A</a>
              <a href="#coding-practice">Coding Practice</a>
              <a href="#resume">Resume Builder</a>
              <a href="#premium">Premium Plans</a>
            </div>
            <div>
              <h3>Company</h3>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('StudentTools — Free Student Utility & Learning Platform');
                }}
              >
                About Us
              </a>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('100% browser-local privacy. No personal data leaves your device.');
                }}
              >
                Privacy
              </a>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Free for personal and educational student use.');
                }}
              >
                Terms
              </a>
            </div>
          </div>
          <div className="copyright">© 2026 StudentTools. All rights reserved.</div>
        </div>
      </footer>

      {/* User Account System Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        showToast={showToast}
      />

      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}


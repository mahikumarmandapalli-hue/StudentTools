import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore on boot as required
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Verbatim validation & truncation constants from firebase-blueprint.json
export const BLUEPRINT_CONSTRAINTS = {
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
  ID_MAX_LEN: 128,
  DISPLAY_NAME_MAX: 100,
  RESUME_NAME_MAX: 120,
  RESUME_TITLE_MAX: 120,
  RESUME_SUMMARY_MAX: 2000,
  RESUME_EDUCATION_MAX: 2000,
  RESUME_EXPERIENCE_MAX: 3000,
  RESUME_PROJECTS_MAX: 3000,
  RESUME_SKILLS_MAX: 1000,
  RESUME_COLOR_MAX: 20,
  SAVED_NOTES_MAX: 5000,
  CALC_TOOL_NAME_MAX: 80,
  CALC_SUMMARY_MAX: 500,
  CALC_DETAILS_MAX: 2000,
  CALC_CATEGORIES: ['academic', 'finance', 'utility', 'ai_note'] as const,
};

export function clampString(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const clean = String(val ?? fallback);
  return clean.slice(0, maxLen);
}

export function sanitizeDocId(rawId: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, BLUEPRINT_CONSTRAINTS.ID_MAX_LEN);
  return cleaned.length > 0 ? cleaned : `id_${Date.now()}`;
}

export interface UserWorkspaceDoc {
  ownerId: string;
  displayName: string;
  pomodoroSessions: number;
  pomodoroMinutes: number;
  resumeFullName: string;
  resumeTitle: string;
  resumeSummary: string;
  resumeEducation: string;
  resumeExperience: string;
  resumeProjects: string;
  resumeSkillsText: string;
  resumeColor: string;
  savedNotes: string;
}

export interface SavedCalculationItem {
  id: string;
  ownerId: string;
  toolName: string;
  summary: string;
  details: string;
  category: 'academic' | 'finance' | 'utility' | 'ai_note';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

export async function signUpWithEmail(email: string, pass: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim() && cred.user) {
    try {
      await updateProfile(cred.user, { displayName: name.trim() });
    } catch {
      // non-blocking
    }
  }
  return cred.user;
}

export async function signInWithEmail(email: string, pass: string) {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function updateUserName(name: string) {
  if (auth.currentUser && name.trim()) {
    await updateProfile(auth.currentUser, { displayName: name.trim() });
  }
}

export async function signOutUser() {
  return await signOut(auth);
}

export async function ensureAndSyncWorkspace(
  uid: string,
  payload: Omit<UserWorkspaceDoc, 'ownerId'>
): Promise<UserWorkspaceDoc | null> {
  const safeUid = sanitizeDocId(uid);
  const path = `userWorkspaces/${safeUid}`;
  const ref = doc(db, 'userWorkspaces', safeUid);

  const sanitizedData = {
    ownerId: safeUid,
    displayName: clampString(payload.displayName || 'Student', BLUEPRINT_CONSTRAINTS.DISPLAY_NAME_MAX, 'Student') || 'Student',
    pomodoroSessions: Math.max(0, Math.min(100000, Math.floor(Number(payload.pomodoroSessions) || 0))),
    pomodoroMinutes: Math.max(0, Math.min(5000000, Math.floor(Number(payload.pomodoroMinutes) || 0))),
    resumeFullName: clampString(payload.resumeFullName, BLUEPRINT_CONSTRAINTS.RESUME_NAME_MAX),
    resumeTitle: clampString(payload.resumeTitle, BLUEPRINT_CONSTRAINTS.RESUME_TITLE_MAX),
    resumeSummary: clampString(payload.resumeSummary, BLUEPRINT_CONSTRAINTS.RESUME_SUMMARY_MAX),
    resumeEducation: clampString(payload.resumeEducation, BLUEPRINT_CONSTRAINTS.RESUME_EDUCATION_MAX),
    resumeExperience: clampString(payload.resumeExperience, BLUEPRINT_CONSTRAINTS.RESUME_EXPERIENCE_MAX),
    resumeProjects: clampString(payload.resumeProjects, BLUEPRINT_CONSTRAINTS.RESUME_PROJECTS_MAX),
    resumeSkillsText: clampString(payload.resumeSkillsText, BLUEPRINT_CONSTRAINTS.RESUME_SKILLS_MAX),
    resumeColor: clampString(payload.resumeColor || '#6366f1', BLUEPRINT_CONSTRAINTS.RESUME_COLOR_MAX, '#6366f1'),
    savedNotes: clampString(payload.savedNotes, BLUEPRINT_CONSTRAINTS.SAVED_NOTES_MAX),
  };

  let snap;
  try {
    snap = await getDoc(ref);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }

  if (!snap.exists()) {
    try {
      await setDoc(ref, {
        ...sanitizedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return sanitizedData;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  } else {
    const existing = snap.data() as UserWorkspaceDoc;
    return existing;
  }
}

export async function saveWorkspaceState(
  uid: string,
  payload: Omit<UserWorkspaceDoc, 'ownerId'>
) {
  const safeUid = sanitizeDocId(uid);
  const path = `userWorkspaces/${safeUid}`;
  const ref = doc(db, 'userWorkspaces', safeUid);

  const sanitizedUpdate = {
    displayName: clampString(payload.displayName || 'Student', BLUEPRINT_CONSTRAINTS.DISPLAY_NAME_MAX, 'Student') || 'Student',
    pomodoroSessions: Math.max(0, Math.min(100000, Math.floor(Number(payload.pomodoroSessions) || 0))),
    pomodoroMinutes: Math.max(0, Math.min(5000000, Math.floor(Number(payload.pomodoroMinutes) || 0))),
    resumeFullName: clampString(payload.resumeFullName, BLUEPRINT_CONSTRAINTS.RESUME_NAME_MAX),
    resumeTitle: clampString(payload.resumeTitle, BLUEPRINT_CONSTRAINTS.RESUME_TITLE_MAX),
    resumeSummary: clampString(payload.resumeSummary, BLUEPRINT_CONSTRAINTS.RESUME_SUMMARY_MAX),
    resumeEducation: clampString(payload.resumeEducation, BLUEPRINT_CONSTRAINTS.RESUME_EDUCATION_MAX),
    resumeExperience: clampString(payload.resumeExperience, BLUEPRINT_CONSTRAINTS.RESUME_EXPERIENCE_MAX),
    resumeProjects: clampString(payload.resumeProjects, BLUEPRINT_CONSTRAINTS.RESUME_PROJECTS_MAX),
    resumeSkillsText: clampString(payload.resumeSkillsText, BLUEPRINT_CONSTRAINTS.RESUME_SKILLS_MAX),
    resumeColor: clampString(payload.resumeColor || '#6366f1', BLUEPRINT_CONSTRAINTS.RESUME_COLOR_MAX, '#6366f1'),
    savedNotes: clampString(payload.savedNotes, BLUEPRINT_CONSTRAINTS.SAVED_NOTES_MAX),
    updatedAt: serverTimestamp(),
  };

  let snap;
  try {
    snap = await getDoc(ref);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }

  if (!snap.exists()) {
    try {
      await setDoc(ref, {
        ownerId: safeUid,
        ...sanitizedUpdate,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  } else {
    try {
      await updateDoc(ref, sanitizedUpdate);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

export async function addSavedCalculation(
  uid: string,
  item: {
    toolName: string;
    summary: string;
    details: string;
    category: 'academic' | 'finance' | 'utility' | 'ai_note';
  }
) {
  const safeUid = sanitizeDocId(uid);
  const calcId = sanitizeDocId(`calc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const path = `savedCalculations/${calcId}`;
  const ref = doc(db, 'savedCalculations', calcId);

  const validCategory = BLUEPRINT_CONSTRAINTS.CALC_CATEGORIES.includes(item.category)
    ? item.category
    : 'academic';

  const payload = {
    ownerId: safeUid,
    toolName: clampString(item.toolName || 'Tool', BLUEPRINT_CONSTRAINTS.CALC_TOOL_NAME_MAX, 'Tool') || 'Tool',
    summary: clampString(item.summary || 'Result', BLUEPRINT_CONSTRAINTS.CALC_SUMMARY_MAX, 'Result') || 'Result',
    details: clampString(item.details || '', BLUEPRINT_CONSTRAINTS.CALC_DETAILS_MAX, ''),
    category: validCategory,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(ref, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function removeSavedCalculation(calcId: string) {
  const safeId = sanitizeDocId(calcId);
  const path = `savedCalculations/${safeId}`;
  try {
    await deleteDoc(doc(db, 'savedCalculations', safeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeUserCalculations(
  uid: string,
  onData: (items: SavedCalculationItem[]) => void
) {
  const safeUid = sanitizeDocId(uid);
  const q = query(
    collection(db, 'savedCalculations'),
    where('ownerId', '==', safeUid)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedCalculationItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SavedCalculationItem, 'id'>),
      }));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'savedCalculations');
    }
  );
}

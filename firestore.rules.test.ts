/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads defined in security_spec.md
 * return PERMISSION_DENIED.
 */

export interface TestPayload {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email_verified: boolean } | null;
  data?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const dirtyDozenPayloads: TestPayload[] = [
  {
    id: 1,
    name: 'Unauthenticated Write',
    operation: 'create',
    path: '/userWorkspaces/user_123',
    auth: null,
    data: { ownerId: 'user_123', displayName: 'Anon' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Spoof',
    operation: 'create',
    path: '/userWorkspaces/user_123',
    auth: { uid: 'user_123', email_verified: false },
    data: { ownerId: 'user_123', displayName: 'Unverified' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity Spoofing on Workspace',
    operation: 'create',
    path: '/userWorkspaces/victim_1',
    auth: { uid: 'attacker_1', email_verified: true },
    data: { ownerId: 'victim_1', displayName: 'Spoofer' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Create',
    operation: 'create',
    path: '/userWorkspaces/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'user_123', displayName: 'Student', isAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Shadow Field Injection on Update',
    operation: 'update',
    path: '/userWorkspaces/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { displayName: 'Updated', isVerified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Immortal Field Mutation',
    operation: 'update',
    path: '/savedCalculations/calc_1',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'another_user' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Forged Client Timestamp',
    operation: 'create',
    path: '/savedCalculations/calc_1',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'user_123', createdAt: '1999-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Denial of Wallet / Oversized String',
    operation: 'create',
    path: '/savedCalculations/calc_1',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'user_123', details: 'x'.repeat(2500) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'ID Poisoning Attack',
    operation: 'create',
    path: '/savedCalculations/invalid$id!bad',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'user_123', toolName: 'CGPA' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Invalid Enum Value',
    operation: 'create',
    path: '/savedCalculations/calc_1',
    auth: { uid: 'user_123', email_verified: true },
    data: { ownerId: 'user_123', category: 'hacked_category' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Cross-Tenant Read / PII Leak',
    operation: 'get',
    path: '/userWorkspaces/victim_1',
    auth: { uid: 'attacker_1', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Orphaned Relational Write',
    operation: 'create',
    path: '/savedCalculations/calc_1',
    auth: { uid: 'user_without_workspace', email_verified: true },
    data: { ownerId: 'user_without_workspace', toolName: 'CGPA' },
    expectedResult: 'PERMISSION_DENIED',
  },
];

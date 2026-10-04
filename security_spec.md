# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default Deny**: All paths not explicitly matched in `firestore.rules` are denied for both `read` and `write`.
2. **Verified Authentication**: Every write operation (`create`, `update`, `delete`) requires an authenticated user (`request.auth != null`) with a verified email (`request.auth.token.email_verified == true`).
3. **Strict Ownership & PII Isolation**:
   - `/userWorkspaces/{userId}`: The document ID `{userId}` must strictly equal `request.auth.uid` and match `isValidId(userId)`. Only the owner can `get`, `create`, `update`, or `delete` their workspace. `list` is disallowed on `/userWorkspaces` to prevent user enumeration.
   - `/savedCalculations/{calcId}`: The `ownerId` field must strictly equal `request.auth.uid` and reference an existing `/userWorkspaces/$(request.auth.uid)` document on creation. Both `get` and `list` enforce `resource.data.ownerId == request.auth.uid`.
4. **Immortal Fields**: `ownerId` and `createdAt` cannot be modified during an `update`.
5. **Temporal Integrity**: `createdAt` must equal `request.time` on `create`, and `updatedAt` must equal `request.time` on `create` and `update`.
6. **Strict Schema & Volumetric Bounds**: All fields must match exact types, `minLength`/`maxLength` constraints, and `hasAll`/`hasOnly` key sets from `firebase-blueprint.json`.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Unauthenticated Write)**: `auth = null`, attempting `create` on `/userWorkspaces/user_123`.
2. **Payload 2 (Unverified Email Spoof)**: `auth = { uid: 'user_123', token: { email_verified: false } }`, attempting `create` on `/userWorkspaces/user_123`.
3. **Payload 3 (Identity Spoofing on Workspace)**: `auth = { uid: 'attacker_1', token: { email_verified: true } }`, attempting `create` on `/userWorkspaces/victim_1` with `ownerId: 'victim_1'`.
4. **Payload 4 (Shadow Field Injection on Create)**: `create` on `/userWorkspaces/user_123` including an undeclared field `"isAdmin": true`.
5. **Payload 5 (Shadow Field Injection on Update)**: `update` on `/userWorkspaces/user_123` modifying `displayName` alongside undeclared field `"isVerified": true`.
6. **Payload 6 (Immortal Field Mutation)**: `update` on `/savedCalculations/calc_1` attempting to change `ownerId` or `createdAt`.
7. **Payload 7 (Forged Client Timestamp)**: `create` on `/savedCalculations/calc_1` with `createdAt` set to a past timestamp (`request.time - 1000s`) instead of `request.time`.
8. **Payload 8 (Denial of Wallet / Oversized String)**: `create` on `/savedCalculations/calc_1` with `details` length > 2000 characters.
9. **Payload 9 (ID Poisoning Attack)**: `create` on `/savedCalculations/invalid$id!with*bad^chars` with invalid document ID characters.
10. **Payload 10 (Invalid Enum Value)**: `create` on `/savedCalculations/calc_1` with `category: "hacked_category"` outside `["academic", "finance", "utility", "ai_note"]`.
11. **Payload 11 (Cross-Tenant Read / PII Leak)**: `get` on `/userWorkspaces/victim_1` by `auth.uid = 'attacker_1'`.
12. **Payload 12 (Orphaned Relational Write)**: `create` on `/savedCalculations/calc_1` when the parent `/userWorkspaces/$(request.auth.uid)` document does not exist.

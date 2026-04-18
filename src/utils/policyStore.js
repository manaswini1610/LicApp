/**
 * Pure helpers to update the policy list (easy to test, reuse in the provider).
 * These mirror add / update / delete behaviour for localStorage-backed state.
 */

/** Add a new policy holder row */
export function addPolicy(policies, data, generateId) {
  const row = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  return [...policies, row]
}

/** Patch one row by id */
export function updatePolicy(policies, id, patch) {
  return policies.map((p) => (p.id === id ? { ...p, ...patch } : p))
}

/** Remove one row by id */
export function deletePolicy(policies, id) {
  return policies.filter((p) => p.id !== id)
}

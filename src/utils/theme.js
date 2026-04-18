/** Whether the UI should use dark palette (includes “system” → OS). */
export function resolveDark(theme) {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

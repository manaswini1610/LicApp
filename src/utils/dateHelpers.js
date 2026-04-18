/** Today as YYYY-MM-DD (local calendar) */
export function getTodayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDaysString(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** End of current week (Sunday), same week as todayStr */
export function getWeekEndString(todayStr = getTodayString()) {
  const [y, m, d] = todayStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const day = dt.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  return addDaysString(todayStr, daysUntilSunday)
}

export function compareDateStrings(a, b) {
  return a.localeCompare(b)
}

export function isToday(dateStr, todayStr = getTodayString()) {
  return dateStr === todayStr
}

export function isThisWeek(dateStr, todayStr = getTodayString()) {
  const end = getWeekEndString(todayStr)
  return (
    compareDateStrings(dateStr, todayStr) >= 0 &&
    compareDateStrings(dateStr, end) <= 0
  )
}

export function isOverdue(dateStr, todayStr = getTodayString()) {
  return compareDateStrings(dateStr, todayStr) < 0
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

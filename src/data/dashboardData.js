export const targetPlan = {
  yearlyTarget: 360,
  completedPolicies: 248,
  currentMonth: 'Apr',
}

export const monthOrder = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** LIC financial year: April → March (next calendar year). */
export const licFinancialYearMonthOrder = [
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
]

/** Maps calendar month index (Jan=0 … Dec=11) to LIC FY slot (Apr=0 … Mar=11). */
const CALENDAR_INDEX_TO_LIC_INDEX = [
  9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8,
]

function monthLabelMatches(shortMonth, label) {
  const s = String(label).trim()
  return (
    s === shortMonth ||
    s.startsWith(shortMonth) ||
    s.toLowerCase().startsWith(shortMonth.toLowerCase())
  )
}

/**
 * LIC FY month slot 0–11 (Apr=0 … Mar=11). Resolves by month name when possible;
 * otherwise maps a Jan-first row index to the correct LIC slot.
 */
export function getLicFinancialYearMonthIndex(monthLabel, rowIndex) {
  if (monthLabel != null) {
    const s = String(monthLabel).trim()
    if (s) {
      let i = licFinancialYearMonthOrder.findIndex((m) => monthLabelMatches(m, s))
      if (i >= 0) return i
      i = monthOrder.findIndex((m) => monthLabelMatches(m, s))
      if (i >= 0) return CALENDAR_INDEX_TO_LIC_INDEX[i]
    }
  }
  if (rowIndex >= 0 && rowIndex < 12) return CALENDAR_INDEX_TO_LIC_INDEX[rowIndex]
  return 0
}

/** Integer split of yearly target across 12 LIC FY months (remainder to earliest FY months, starting April). */
export function distributeYearlyTargetAcrossMonths(yearly) {
  const y = Math.max(0, Math.floor(Number(yearly) || 0))
  const base = Math.floor(y / 12)
  const extra = y % 12
  return licFinancialYearMonthOrder.map((_, index) => base + (index < extra ? 1 : 0))
}

export const monthlySubmissions = [
  { month: 'Jan', submitted: 18 },
  { month: 'Feb', submitted: 20 },
  { month: 'Mar', submitted: 23 },
  { month: 'Apr', submitted: 24 },
  { month: 'May', submitted: 0 },
  { month: 'Jun', submitted: 0 },
  { month: 'Jul', submitted: 0 },
  { month: 'Aug', submitted: 0 },
  { month: 'Sep', submitted: 0 },
  { month: 'Oct', submitted: 0 },
  { month: 'Nov', submitted: 0 },
  { month: 'Dec', submitted: 0 },
]

export const pendingFollowUps = 34
export const renewalRate = '87%'

export const upcomingData = [
  {
    key: 1,
    name: 'Ravi Kumar',
    policyType: 'Term Plan',
    date: '12 Apr 2026',
    priority: 'High',
  },
  {
    key: 2,
    name: 'Neha Sharma',
    policyType: 'Health Plan',
    date: '13 Apr 2026',
    priority: 'Medium',
  },
  {
    key: 3,
    name: 'Arjun Patel',
    policyType: 'ULIP',
    date: '14 Apr 2026',
    priority: 'Low',
  },
]

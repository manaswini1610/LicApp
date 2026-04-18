import { STATUS } from '../constants/policyConstants'
import {
  compareDateStrings,
  getTodayString,
  isOverdue,
  isToday,
} from './dateHelpers'

/**
 * Split policies into follow-up buckets for the timeline page.
 * - today: pending clients due today OR overdue (needs attention)
 * - upcoming: pending with a future follow-up date
 * - completed: completed policies (shown as a separate column)
 */
export function filterFollowUps(policies) {
  const today = getTodayString()
  const pending = policies.filter((p) => p.status === STATUS.PENDING)
  const completed = policies.filter((p) => p.status === STATUS.COMPLETED)

  const todayList = pending
    .filter((p) => {
      const d = p.nextFollowUpDate
      return isToday(d) || isOverdue(d)
    })
    .sort((a, b) =>
      compareDateStrings(a.nextFollowUpDate, b.nextFollowUpDate),
    )

  const upcoming = pending
    .filter((p) => compareDateStrings(p.nextFollowUpDate, today) > 0)
    .sort((a, b) =>
      compareDateStrings(a.nextFollowUpDate, b.nextFollowUpDate),
    )

  const completedSorted = [...completed].sort((a, b) =>
    String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
  )

  return {
    today: todayList,
    upcoming,
    completed: completedSorted,
  }
}

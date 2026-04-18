import { useMemo } from 'react'
import { monthOrder, monthlySubmissions, targetPlan } from '../data/dashboardData'

export function useDashboardMetrics(yearlyTarget) {
  const safeYearlyTarget = Math.max(Number(yearlyTarget) || 0, 1)

  const targetOverview = useMemo(() => {
    const yearlyTargetForCalc = safeYearlyTarget
    const completedPolicies = targetPlan.completedPolicies
    const remainingPolicies = Math.max(yearlyTargetForCalc - completedPolicies, 0)
    const annualProgress = Number(
      ((completedPolicies / yearlyTargetForCalc) * 100).toFixed(1),
    )
    const activeMonthIndex =
      monthOrder.findIndex((month) => month === targetPlan.currentMonth) + 1
    const monthsLeft = Math.max(12 - activeMonthIndex, 1)
    const requiredPerMonth = Math.ceil(remainingPolicies / monthsLeft)

    return {
      yearlyTarget: yearlyTargetForCalc,
      completedPolicies,
      remainingPolicies,
      annualProgress,
      requiredPerMonth,
      monthsLeft,
    }
  }, [safeYearlyTarget])

  const monthlyRows = useMemo(() => {
    const baseTarget = Math.floor(targetOverview.yearlyTarget / 12)
    const extraTargets = targetOverview.yearlyTarget % 12

    return monthlySubmissions.map((item, index) => {
      const monthTarget = baseTarget + (index < extraTargets ? 1 : 0)
      const progressPercent =
        monthTarget === 0
          ? 0
          : Math.min(Math.round((item.submitted / monthTarget) * 100), 100)

      return {
        key: item.month,
        month: item.month,
        submitted: item.submitted,
        target: monthTarget,
        progressPercent,
      }
    })
  }, [targetOverview.yearlyTarget])

  return { targetOverview, monthlyRows }
}

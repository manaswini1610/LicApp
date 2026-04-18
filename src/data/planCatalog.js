/**
 * LIC-style plan groups: first dropdown = category, second = specific plan (saved as policyType).
 */
export const PLANS_BY_CATEGORY = {
  'CHILD PLANS': [
    'Child Money Back - 732',
    'Jeevan Tarun - 734',
    'Amritbaal - 774',
  ],
  'TERM PLANS': [
    'Saral Jeevan Bima 859',
    'Yuva Term - 875',
    'Yuva Credit Life - 877',
    'Bima Kavach - 887',
    'New Jeevan Amar 955',
  ],
  'PENSION PLANS': [
    'New Jeevan Shanti 758',
    'Saral Pension 862',
    'Jeevan Akshay-VII 857',
    'Smart Pension - 879',
  ],
  'ULIP PLANS': [
    'Nivesh Plus 749',
    'SIIP 752',
    'New Pension Plus 867',
    'Index Plus 873',
    'Protection Plus 886',
  ],
  'NEW PLANS': [
    'Jan Suraksha - 880',
    'Bima Lakshmi - 881',
  ],
  'MONEYBACK PLANS': [
    'MoneyBack (20 Year) - 720',
    'MoneyBack (25 Year) - 721',
    'Bima Shree - 748',
  ],
  'WHOLELIFE PLANS': [
    'Jeevan Umang - 745',
    'Jeevan Utsav - 771',
    'Jeevan Utsav (Single) - 883',
  ],
  'ENDOWMENT PLANS': [
    'New Endowment - 714',
    'New Jeevan Anand - 715',
    'Single Premium Endowment - 717',
    'Jeevan Lakshya 733',
    'Jeevan Labh - 736',
    'Bima Jyoti - 760',
    'Nav Jeevan Shree(Single) - 911',
    'Nav Jeevan Shree(Limited) - 912',
  ],
  'MICRO INSURANCE': ['Micro Bachat 751'],
  'OTHER (GENERIC)': [
    'Term Insurance',
    'Whole Life',
    'Endowment',
    'Money Back',
    'ULIP',
    'Pension / Annuity',
    'Child Plan',
    'Other',
  ],
}

export const PLAN_CATEGORIES = Object.keys(PLANS_BY_CATEGORY)

export function getPlansForCategory(category) {
  return PLANS_BY_CATEGORY[category] ?? []
}

/** Options for the plan dropdown; keeps unknown saved values visible when editing. */
export function getPlanOptionsForCategory(category, currentPlan) {
  const base = getPlansForCategory(category)
  if (currentPlan && !base.includes(currentPlan)) {
    return [currentPlan, ...base]
  }
  return base
}

/** Resolve saved policyType to category + plan for the two dropdowns. */
export function resolvePlanSelection(policyType) {
  const firstCat = PLAN_CATEGORIES[0]
  if (!policyType) {
    return {
      planCategory: firstCat,
      policyType: PLANS_BY_CATEGORY[firstCat][0],
    }
  }
  for (const [cat, plans] of Object.entries(PLANS_BY_CATEGORY)) {
    if (plans.includes(policyType)) {
      return { planCategory: cat, policyType }
    }
  }
  const generic = PLANS_BY_CATEGORY['OTHER (GENERIC)']
  if (generic.includes(policyType)) {
    return { planCategory: 'OTHER (GENERIC)', policyType }
  }
  return {
    planCategory: 'OTHER (GENERIC)',
    policyType,
  }
}

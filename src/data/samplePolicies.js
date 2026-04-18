import { STATUS } from '../constants/policyConstants'

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** Dummy rows so the first open looks realistic */
export function getSamplePolicies(todayStr) {
  return [
    {
      id: 'sample-1',
      fullName: 'Priya Sharma',
      phone: '9876543210',
      policyType: 'Endowment',
      policyPremium: 500000,
      status: STATUS.PENDING,
      nextFollowUpDate: todayStr,
      notes: 'Will discuss premium mode next visit.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      fullName: 'Ramesh Iyer',
      phone: '9123456789',
      policyType: 'Term Insurance',
      policyPremium: 1000000,
      status: STATUS.COMPLETED,
      nextFollowUpDate: todayStr,
      notes: 'Policy issued — thank you call next month.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      fullName: 'Anita Desai',
      phone: '9988776655',
      policyType: 'Money Back',
      policyPremium: 300000,
      status: STATUS.PENDING,
      nextFollowUpDate: addDays(todayStr, 3),
      notes: 'Waiting for salary credit.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-4',
      fullName: 'Vikram Patel',
      phone: '9090909090',
      policyType: 'ULIP',
      policyPremium: 200000,
      status: STATUS.PENDING,
      nextFollowUpDate: addDays(todayStr, -2),
      notes: 'Urgent — competitor quote shared.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-5',
      fullName: 'Sunita Nair',
      phone: '9812345678',
      policyType: 'Pension / Annuity',
      policyPremium: 400000,
      status: STATUS.PENDING,
      nextFollowUpDate: addDays(todayStr, 10),
      notes: 'Retirement planning — follow after festival.',
      createdAt: new Date().toISOString(),
    },
  ]
}

import { STATUS } from '../../constants/policyConstants'

/** Color-coded pill for Pending vs Completed */
export default function StatusBadge({ status }) {
  const isDone = status === STATUS.COMPLETED
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        isDone
          ? 'bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/40'
          : 'bg-rose-500/15 text-rose-800 ring-1 ring-rose-500/40 dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-400/40'
      }`}
    >
      {isDone ? 'Completed' : 'Pending'}
    </span>
  )
}

import { motion } from 'framer-motion'

/** Friendly empty state with icon slot */
export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/50 px-6 py-12 text-center dark:border-white/20 dark:bg-white/5"
    >
      {Icon ? (
        <Icon
          className="mb-3 text-4xl text-slate-400 dark:text-white/40"
          aria-hidden
        />
      ) : null}
      <p className="text-lg font-semibold text-slate-800 dark:text-white">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  )
}

import { motion } from 'framer-motion'

/** Shimmer placeholder while the first paint / mock load finishes */
export function SkeletonLine({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-200/80 dark:bg-white/10 ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonLine key={i} className="h-28" />
        ))}
      </div>
      <SkeletonLine className="h-40" />
    </div>
  )
}

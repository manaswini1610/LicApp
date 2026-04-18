/**
 * Glassmorphism surface — works in light & dark via `glass-panel` + overrides.
 */
export default function GlassCard({ className = '', children, ...rest }) {
  return (
    <div
      className={`glass-panel p-5 shadow-xl transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-300/25 dark:hover:shadow-teal-500/10 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

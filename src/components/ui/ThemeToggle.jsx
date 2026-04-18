import { HiComputerDesktop, HiMoon, HiSun } from 'react-icons/hi2'
import { useTheme } from '../../hooks/useTheme'

const modes = [
  { id: 'light', label: 'Light mode', icon: HiSun },
  { id: 'dark', label: 'Dark mode', icon: HiMoon },
  { id: 'system', label: 'Match device', icon: HiComputerDesktop },
]

/**
 * Three-way control: light, dark, or follow system setting.
 * @param {boolean} spread — stretch to fill width (e.g. sidebar)
 */
export default function ThemeToggle({ className = '', spread = false }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-slate-900/60 ${
        spread ? 'flex w-full' : 'inline-flex'
      } ${className}`}
      role="group"
      aria-label="Color theme"
    >
      {modes.map(({ id, label, icon: Icon }) => {
        const active = theme === id
        return (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(id)}
            className={`flex min-h-[40px] items-center justify-center rounded-xl transition-all ${
              spread ? 'min-w-0 flex-1' : 'min-w-[40px]'
            } ${
              active
                ? 'bg-teal-500 text-white shadow-md dark:bg-teal-500/90'
                : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-white/10'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}

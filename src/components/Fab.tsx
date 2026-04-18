interface FabProps {
  onClick: () => void
  open?: boolean
  label?: string
}

export function Fab({ onClick, open = false, label = 'Add stamp' }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : label}
      aria-expanded={open}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] shadow-xl flex items-center justify-center text-4xl leading-none active:scale-95 transition-transform"
    >
      <span
        className={`-mt-1 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
      >
        +
      </span>
    </button>
  )
}

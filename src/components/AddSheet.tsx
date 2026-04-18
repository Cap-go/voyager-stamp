interface AddSheetProps {
  open: boolean
  onClose: () => void
  onPickCamera: () => void
  onPickGallery: () => void
  error?: string | null
}

export function AddSheet({ open, onClose, onPickCamera, onPickGallery, error }: AddSheetProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-20 bg-black/10"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="menu"
        aria-label="Add stamp"
        className="fixed bottom-24 right-6 z-30 flex flex-col items-end gap-3 stamp-speed-dial"
      >
        <SpeedDialItem icon="📷" label="Take Photo" onClick={onPickCamera} />
        <SpeedDialItem icon="🖼️" label="Choose from Gallery" onClick={onPickGallery} />
        {error && (
          <p
            role="alert"
            className="bg-red-100 text-red-700 text-sm rounded-xl px-3 py-2 shadow-md max-w-[80vw]"
          >
            {error}
          </p>
        )}
      </div>
    </>
  )
}

interface SpeedDialItemProps {
  icon: string
  label: string
  onClick: () => void
}

function SpeedDialItem({ icon, label, onClick }: SpeedDialItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 bg-[var(--color-paper)] text-[var(--color-ink)] pl-4 pr-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
    >
      <span className="text-xl leading-none" aria-hidden>{icon}</span>
      <span className="text-base font-medium whitespace-nowrap">{label}</span>
    </button>
  )
}

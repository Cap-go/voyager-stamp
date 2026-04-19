import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listStamps, addStamp, type Stamp } from '../lib/storage'
import { capturePhoto, pickFromGallery } from '../lib/capture'
import { StampTile } from '../components/StampTile'
import { Fab } from '../components/Fab'
import { AddSheet } from '../components/AddSheet'

export function GridPage() {
  const navigate = useNavigate()
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [loaded, setLoaded] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listStamps()
      .then(setStamps)
      .finally(() => setLoaded(true))
  }, [])

  async function handlePick(source: 'camera' | 'gallery') {
    setError(null)
    try {
      const file = source === 'camera' ? await capturePhoto() : await pickFromGallery()
      if (!file) {
        setSheetOpen(false)
        return
      }
      const stamp = await addStamp(file)
      setStamps((prev) => [stamp, ...prev])
      setSheetOpen(false)
    } catch {
      setError('Could not save photo. Try again.')
    }
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-8 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Voyager Stamp</h1>
        <p className="text-sm text-black/60 mt-1">Your travel collection</p>
      </header>

      <main className="px-5">
        {loaded && stamps.length === 0 && <EmptyState />}

        {stamps.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {stamps.map((stamp) => (
              <StampTile
                key={stamp.id}
                stamp={stamp}
                onClick={() => navigate(`/stamp/${stamp.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Fab
        open={sheetOpen}
        onClick={() => {
          setSheetOpen((prev) => !prev)
          setError(null)
        }}
      />

      <AddSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false)
          setError(null)
        }}
        onPickCamera={() => handlePick('camera')}
        onPickGallery={() => handlePick('gallery')}
        error={error}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center text-black/50 mt-24">
      <div className="text-5xl mb-3" aria-hidden>✉️</div>
      <p className="text-lg">No stamps yet.</p>
      <p className="text-sm mt-1">Tap + to add your first one.</p>
    </div>
  )
}

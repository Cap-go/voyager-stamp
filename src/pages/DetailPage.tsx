import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStamp, deleteStamp, type Stamp } from '../lib/storage'
import { useObjectUrl } from '../lib/useObjectUrl'
import { StampFrame } from '../components/StampFrame'

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [stamp, setStamp] = useState<Stamp | null | undefined>(undefined)

  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true })
      return
    }
    getStamp(id).then((s) => setStamp(s ?? null))
  }, [id, navigate])

  useEffect(() => {
    if (stamp === null) navigate('/', { replace: true })
  }, [stamp, navigate])

  async function handleDelete() {
    if (!stamp) return
    const ok = window.confirm('Delete this stamp?')
    if (!ok) return
    await deleteStamp(stamp.id)
    navigate('/', { replace: true })
  }

  if (!stamp) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 pt-6 pb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Back"
          className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center text-xl active:scale-95 transition-transform"
        >
          ←
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete stamp"
          className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center text-xl active:scale-95 transition-transform"
        >
          🗑
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-10">
        <FullStamp stamp={stamp} />
      </div>
    </div>
  )
}

function FullStamp({ stamp }: { stamp: Stamp }) {
  const url = useObjectUrl(stamp.blob)
  if (!url) return null
  return (
    <StampFrame>
      <img
        src={url}
        alt=""
        className="block max-w-[78vw] max-h-[68vh] object-contain"
      />
    </StampFrame>
  )
}

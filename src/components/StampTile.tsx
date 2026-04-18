import type { Stamp } from '../lib/storage'
import { useObjectUrl } from '../lib/useObjectUrl'
import { StampFrame } from './StampFrame'

interface StampTileProps {
  stamp: Stamp
  onClick: () => void
}

export function StampTile({ stamp, onClick }: StampTileProps) {
  const url = useObjectUrl(stamp.blob)
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full p-0 m-0 border-0 bg-transparent cursor-pointer text-left active:scale-[0.98] transition-transform"
    >
      <StampFrame className="w-full">
        {url ? (
          <img src={url} alt="" className="block w-full aspect-square object-cover" />
        ) : (
          <div className="block w-full aspect-square" />
        )}
      </StampFrame>
    </button>
  )
}

import type { ReactNode } from 'react'

interface StampFrameProps {
  children: ReactNode
  className?: string
}

export function StampFrame({ children, className = '' }: StampFrameProps) {
  return <div className={`stamp-frame inline-block ${className}`}>{children}</div>
}

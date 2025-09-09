import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import NavBar from './NavBar'

interface PageProps {
  title?: ReactNode
  children: ReactNode
  showNavBar?: boolean
  hasPadding?: boolean
}

export default function Page({ title, children, showNavBar = true, hasPadding = true }: PageProps) {
  return (
    <div className="flex h-full flex-col">
      {showNavBar && <NavBar title={title} className="h-12" />}

      <div className={cn('flex-1 overflow-y-auto', hasPadding ? 'p-4' : '')}>{children}</div>
    </div>
  )
}

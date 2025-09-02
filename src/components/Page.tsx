import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import NavBar from './NavBar'

interface PageProps {
  title?: string
  children: ReactNode
  showNavBar?: boolean
  hasPadding?: boolean
}

export default function Page({ title, children, showNavBar = true, hasPadding = true }: PageProps) {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {showNavBar && <NavBar title={title} />}

      <div className={cn('flex-1 overflow-y-auto', hasPadding ? 'p-4' : '')}>{children}</div>
    </div>
  )
}

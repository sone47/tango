import type { ReactNode } from 'react'

import NavBar from './NavBar'

interface PageProps {
  title?: string
  children: ReactNode
  showNavBar?: boolean
}

export default function Page({ title, children, showNavBar = true }: PageProps) {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {showNavBar && <NavBar title={title} />}

      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  )
}

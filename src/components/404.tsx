import { Link } from 'react-router'

import Button from './Button'

export default function Component() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tighter transition-transform hover:scale-110 sm:text-5xl">
          404
        </h1>
        <p className="text-gray-500">页面不存在</p>
      </div>
      <Link to="/" replace>
        <Button className="px-8">回到首页</Button>
      </Link>
    </div>
  )
}

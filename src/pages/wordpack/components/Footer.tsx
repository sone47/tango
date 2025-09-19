import { Link } from 'react-router'

import Button from '@/components/Button'

const Footer = () => {
  return (
    <div className="bg-card p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <Link to="/recommended-packs">
        <Button size="xl" className="w-full rounded-full">
          新增词包
        </Button>
      </Link>
    </div>
  )
}

export default Footer

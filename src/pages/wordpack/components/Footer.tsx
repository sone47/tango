import { Link } from 'react-router'

import Button from '@/components/Button'

const Footer = () => {
  return (
    <div className="bg-muted p-4">
      <Link to="/recommended-packs">
        <Button size="xl" className="w-full rounded-full">
          新增词包
        </Button>
      </Link>
    </div>
  )
}

export default Footer

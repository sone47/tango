import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Drawer from '@/components/Drawer'
import ImportSection from '@/pages/profile/components/ImportSection'

const Footer = () => {
  const navigate = useNavigate()

  const handleImportFromLibrary = () => {
    navigate('/recommended-packs')
  }

  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full" onClick={handleImportFromLibrary}>
        从词包库导入词包
      </Button>
      <Drawer
        title="导入自定义词包"
        trigger={
          <Button variant="outline" className="w-full">
            导入自定义词包
          </Button>
        }
      >
        <ImportSection />
      </Drawer>
    </div>
  )
}

export default Footer

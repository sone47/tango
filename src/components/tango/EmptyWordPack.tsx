import { FolderSearch } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'

interface EmptyWordPackProps {
  showImportButton: boolean
}

export default function EmptyWordPack({ showImportButton }: EmptyWordPackProps) {
  const navigate = useNavigate()

  const handleCreateWordPack = () => {
    navigate('/recommended-packs')
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-gray-500">
        <FolderSearch className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground text-lg font-medium">暂无词包</h3>
      </div>
      {showImportButton && (
        <Button variant="primary" size="lg" round onClick={handleCreateWordPack}>
          新增词包
        </Button>
      )}
    </div>
  )
}

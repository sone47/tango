import { FolderSearch } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'

interface EmptyWordPackProps {
  showImportButton: boolean
}

export default function EmptyWordPack({ showImportButton }: EmptyWordPackProps) {
  const navigate = useNavigate()

  const handleImportRecommendedCardPack = () => {
    navigate('/recommended-packs')
  }

  const handleImportCustomCardPack = () => {
    navigate('/wordpack', { state: { action: 'import' } })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-gray-500">
        <FolderSearch className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-foreground mb-2 text-lg font-medium">暂无词包</h3>
        <p className="text-secondary-foreground text-center text-sm">请先导入词包数据</p>
      </div>
      {showImportButton && (
        <div className="flex flex-col justify-center gap-2">
          <Button variant="primary" onClick={handleImportRecommendedCardPack}>
            从词包库导入
          </Button>
          <Button variant="outline" onClick={handleImportCustomCardPack}>
            导入自定义词包
          </Button>
        </div>
      )}
    </div>
  )
}

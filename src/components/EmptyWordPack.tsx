import { ListX } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from './Button'

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
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-8 text-gray-500">
        <ListX className="h-12 w-12 mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无词包</h3>
        <p className="text-sm text-gray-600 text-center">请先导入词包数据</p>
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

import { MoreHorizontal, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Card from '@/components/Card'

import WordPackSelector from './WordPackSelector'

const ProgressSection = () => {
  const navigate = useNavigate()

  const handleViewMore = () => {
    navigate('/wordpack-management')
  }

  const customTitle = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
          <Package size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">词包管理</h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={MoreHorizontal}
        onClick={handleViewMore}
        className="text-gray-600 hover:text-gray-800"
      >
        查看更多
      </Button>
    </div>
  )

  return (
    <Card title={customTitle}>
      <WordPackSelector />
    </Card>
  )
}

export default ProgressSection

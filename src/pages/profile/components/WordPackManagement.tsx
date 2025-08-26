import { MoreHorizontal, Package } from 'lucide-react'
import { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyWordPack from '@/components/EmptyWordPack'
import Typography from '@/components/Typography'
import WordPackItem from '@/components/WordPackItem'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useWordPackStore } from '@/stores/wordPackStore'

const ProgressSection = () => {
  const navigate = useNavigate()
  const wordPackStore = useWordPackStore()
  const { currentWordPack } = useCurrentWordPack()

  const handleViewMore = () => {
    navigate('/wordpack')
  }

  let content: ReactElement | null = null
  if (!wordPackStore.hasData) {
    content = <EmptyWordPack showImportButton />
  }

  if (!content) {
    if (currentWordPack) {
      content = (
        <WordPackItem
          wordPack={currentWordPack}
          isSelected
          className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-primary shadow-lg rounded-2xl"
        />
      )
    } else {
      content = (
        <Typography.Text type="secondary" className="text-md">
          未选择词包，请前往
          <Link to="/wordpack">
            <Button variant="link" className="p-0 text-md">
              词包管理页
            </Button>
          </Link>
          选择词包
        </Typography.Text>
      )
    }
  }

  const customTitle = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
          <Package size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">词包管理</h2>
      </div>
      <Button variant="ghost" size="sm" icon={MoreHorizontal} onClick={handleViewMore}>
        查看更多
      </Button>
    </div>
  )

  return <Card title={customTitle}>{content}</Card>
}

export default ProgressSection

import { MoreHorizontal, Package, SquareCheckBig } from 'lucide-react'
import { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router'

import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyWordPack from '@/components/EmptyWordPack'
import Typography from '@/components/Typography'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { cn } from '@/lib/utils'
import { useWordPackStore } from '@/stores/wordPackStore'
import { toLocaleDateString } from '@/utils/date'

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
        <div
          className={cn(
            'bg-muted/50 flex items-center justify-between w-full text-left p-4 rounded-2xl'
          )}
        >
          <div className="flex flex-col items-start gap-1">
            <Typography.Title level={6}>{currentWordPack.name}</Typography.Title>
            <p className="text-sm text-muted-foreground">
              创建时间:{' '}
              {currentWordPack.createdAt ? toLocaleDateString(currentWordPack.createdAt) : '未知'}
            </p>
          </div>
          <SquareCheckBig className="size-4 text-primary"></SquareCheckBig>
        </div>
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background text-primary">
          <Package size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">词包管理</h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-secondary-foreground"
        icon={MoreHorizontal}
        onClick={handleViewMore}
      >
        查看更多
      </Button>
    </div>
  )

  return <Card title={customTitle}>{content}</Card>
}

export default ProgressSection

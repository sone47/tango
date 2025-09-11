import { MoreHorizontal, Package, SquareCheckBig } from 'lucide-react'
import { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router'

import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyWordPack from '@/components/tango/EmptyWordPack'
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

  const handleViewWordPack = () => {
    navigate(`/wordpack/${currentWordPack?.id}`)
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
            'bg-muted/50 flex items-center justify-betwee gap-2 w-full text-left p-4 rounded-2xl cursor-pointer'
          )}
          onClick={handleViewWordPack}
        >
          <div className="flex flex-1 flex-col items-start gap-1">
            <Typography.Title level={6}>{currentWordPack.name}</Typography.Title>
            <p className="text-muted-foreground text-sm">
              创建时间:{' '}
              {currentWordPack.createdAt ? toLocaleDateString(currentWordPack.createdAt) : '未知'}
            </p>
          </div>
          <SquareCheckBig className="text-primary size-6"></SquareCheckBig>
        </div>
      )
    } else {
      content = (
        <Typography.Text type="secondary" className="text-md">
          未选择词包，请前往
          <Link to="/wordpack">
            <Button variant="link" className="text-md p-0">
              词包管理页
            </Button>
          </Link>
          选择词包
        </Typography.Text>
      )
    }
  }

  const customTitle = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-background text-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <Package size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">词包管理</h2>
      </div>
      {wordPackStore.hasData && (
        <Button
          variant="ghost"
          size="sm"
          className="text-secondary-foreground"
          icon={MoreHorizontal}
          onClick={handleViewMore}
        >
          查看更多
        </Button>
      )}
    </div>
  )

  return <Card title={customTitle}>{content}</Card>
}

export default ProgressSection

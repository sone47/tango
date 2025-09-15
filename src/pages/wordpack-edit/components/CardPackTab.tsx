import { useRef, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Drawer, { useDrawer } from '@/components/Drawer'
import Input from '@/components/Input'
import { cardPackService } from '@/services/cardPackService'
import { WordPackEntity } from '@/types'

import CardpackList, { CardpackListRef } from './CardpackList'

interface CardPackTabProps {
  wordPack: WordPackEntity
  isEdit: boolean
  onSetIsEdit: (isEdit: boolean) => void
  onCreateWord: (cardPackId: number) => void
}

const CardPackTab = ({ wordPack, isEdit, onSetIsEdit, onCreateWord }: CardPackTabProps) => {
  const drawer = useDrawer()
  const cardpackListRef = useRef<CardpackListRef>(null)

  const [cardPackName, setCardPackName] = useState('')

  const handleCreateCardPack = async () => {
    if (!cardPackName) {
      toast.error('卡包名称不能为空')
      return
    }

    try {
      const newCardPack = await cardPackService.createCardPack({
        wordPackId: wordPack.id,
        name: cardPackName,
      })

      cardpackListRef.current?.appendCardPack({
        ...newCardPack,
        words: [],
      })

      requestAnimationFrame(() => {
        cardpackListRef.current?.scrollToCardPack(newCardPack.id)
      })

      setCardPackName('')
      drawer.close()

      toast.success('卡包创建成功')
    } catch (e) {
      toast.error('新增卡包失败')
      console.error(e)
    }
  }

  const handleOpenCreateDrawer = () => {
    drawer.open()

    onSetIsEdit(true)
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {isEdit && (
        <Drawer
          title="新增卡包"
          open={drawer.isOpen}
          onOpenChange={drawer.setIsOpen}
          trigger={<Button variant="outline">添加卡包</Button>}
          onConfirm={handleCreateCardPack}
          showConfirm
          showCancel
        >
          <Input
            placeholder="请输入卡包名称"
            autoFocus
            value={cardPackName}
            onChange={(e) => setCardPackName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateCardPack()
              }
            }}
          />
        </Drawer>
      )}
      <Card className="flex-1 overflow-y-auto py-0" contentClassName="h-full pt-4">
        <CardpackList
          ref={cardpackListRef}
          wordPack={wordPack}
          editable={isEdit}
          onAddCardPack={handleOpenCreateDrawer}
          onAddWord={onCreateWord}
        />
      </Card>
    </div>
  )
}

export default CardPackTab

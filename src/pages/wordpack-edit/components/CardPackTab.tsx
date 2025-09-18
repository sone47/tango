import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Input from '@/components/Input'
import { cardPackService } from '@/services/cardPackService'
import { WordPackEntity } from '@/types'

import CardpackList, { CardpackListRef } from './CardpackList'

interface CardPackTabProps {
  ref: React.RefObject<CardpackListRef | null>
  wordPack: WordPackEntity
  isEdit: boolean
  onSetIsEdit: (isEdit: boolean) => void
  onCreateWord: (cardPackId: number) => void
}

const CardPackTab = ({ ref, wordPack, isEdit, onSetIsEdit, onCreateWord }: CardPackTabProps) => {
  const drawer = useDrawer()

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

      ref?.current?.appendCardPack({
        ...newCardPack,
        words: [],
      })

      requestAnimationFrame(() => {
        ref?.current?.scrollToCardPack(newCardPack.id)
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
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
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
      <CardpackList
        ref={ref}
        wordPack={wordPack}
        editable={isEdit}
        onAddCardPack={handleOpenCreateDrawer}
        onAddWord={onCreateWord}
      />
    </div>
  )
}

export default CardPackTab

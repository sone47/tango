import { OctagonX } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import SwipeAction from '@/components/common/SwipeAction'
import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import WordPackItem from '@/components/WordPackItem'
import { spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { wordPackService } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'
import { WordPack } from '@/types'

const WordPackList = () => {
  const navigate = useNavigate()
  const { currentWordPackId, currentWordPack, setCurrentWordPackId } = useCurrentWordPack()
  const { allWordPacks, loading, error, hasData, fetchWordPacks } = useWordPackStore()
  const deleteAlertDialog = useAlertDialog()

  const activeWordPack = useRef<WordPack | null>(null)

  useEffect(() => {
    if (currentWordPack || !hasData) return

    // if deleted pack is a selected pack, then pick a existing pack
    setCurrentWordPackId(allWordPacks[0].id!)
  }, [allWordPacks])

  if (loading) {
    return (
      <div className="flex-1">
        <Loading text="词包加载中..." size="md" />
      </div>
    )
  }

  if (error) {
    console.error(error)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-destructive text-lg font-semibold">
        <OctagonX size={48} />
        <p>加载失败，请重试</p>
      </div>
    )
  }

  if (!hasData) {
    return <EmptyWordPack showImportButton={false} />
  }

  const handleWordPackSelect = (wordPack: WordPack) => {
    toast.success(`已切换到词包：${wordPack.name}`)

    setCurrentWordPackId(wordPack.id!)
    activeWordPack.current = wordPack
  }

  const handleDelete = (wordPack: WordPack) => {
    activeWordPack.current = wordPack
    deleteAlertDialog.show()
  }

  const handleEdit = (wordPack: WordPack) => {
    navigate(`/wordpack/edit/${wordPack.id}`)
  }

  const handleDeleteConfirm = async () => {
    toast.promise(
      async () => {
        try {
          await wordPackService.deleteWordPack(activeWordPack.current!.id)

          activeWordPack.current = null
          fetchWordPacks()
          setCurrentWordPackId(null)
        } catch (error) {
          console.error(error)
          throw error
        }
      },
      {
        loading: '删除中...',
        success: '删除成功',
        error: '删除失败',
      }
    )
  }

  const list = allWordPacks.map((wordPack) => {
    const isSelected = wordPack.id === currentWordPackId

    return {
      node: (
        <div key={wordPack.id} className="w-full" onClick={() => handleWordPackSelect(wordPack)}>
          <WordPackItem wordPack={wordPack} isSelected={isSelected} className="bg-background" />
        </div>
      ),
      item: wordPack,
      className: isSelected ? 'border-primary border-2' : 'w-full',
    }
  })

  return (
    <>
      <SwipeAction
        trailingActions={[
          {
            key: 'edit',
            text: '编辑',
            className: 'bg-primary text-primary-foreground min-w-[72px] !justify-center',
            onClick: handleEdit,
          },
          {
            key: 'delete',
            text: '删除',
            className: 'bg-destructive text-destructive-foreground min-w-[72px] !justify-center',
            onClick: handleDelete,
          },
        ]}
        list={list}
        className={spacing.listItems}
        itemClassName="rounded-2xl border-1"
      ></SwipeAction>

      <AlertDialog
        open={deleteAlertDialog.isOpen}
        onOpenChange={deleteAlertDialog.setIsOpen}
        title="确定要删除该词包吗？"
        description="删除后不可恢复，请谨慎操作"
        confirmText="确认删除"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default WordPackList

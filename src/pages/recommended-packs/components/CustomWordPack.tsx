import { CirclePlus, FolderPlus, Import, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Dialog, { useDialog } from '@/components/Dialog'
import Drawer, { useDrawer } from '@/components/Drawer'
import Typography from '@/components/Typography'
import { useModalState } from '@/hooks/useModalState'
import { cardPackService } from '@/services/cardPackService'
import { ImportResult, wordPackService } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'

import ImportSection from './ImportSection'
import UploadResultModal from './UploadResultModal'
import WordPackCreatingForm, { type WordPackFormData } from './WordPackCreatingForm'

const CustomWordPack = () => {
  const navigate = useNavigate()

  const wordPackStore = useWordPackStore()
  const uploadResultModal = useModalState()

  const customWordPackDialog = useDialog()
  const importDrawer = useDrawer()
  const createWordPackDrawer = useDrawer()
  const [uploadResult, setUploadResult] = useState<ImportResult | null>(null)
  const [isCreatingWordPack, setIsCreatingWordPack] = useState(false)

  const handleImportFinish = (importResult: ImportResult) => {
    setUploadResult(importResult)
    uploadResultModal.open()
    importDrawer.close()

    if (importResult.success) {
      wordPackStore.fetchWordPacks()
    }
  }

  const handleUploadResultModalClose = () => {
    uploadResultModal.close()
  }

  const handleCreateWordPack = async (data: WordPackFormData) => {
    setIsCreatingWordPack(true)
    try {
      const wordPackId = await wordPackService.createWordPack(data.name, data.language)
      await cardPackService.createCardPack({
        wordPackId,
        name: '默认卡包',
      })

      toast.success(`词包 "${data.name}" 创建成功`)

      navigate(`/wordpack/${wordPackId}`)
    } catch (error) {
      console.error('创建词包失败:', error)
      toast.error(error instanceof Error ? error.message : '创建词包失败')
    } finally {
      setIsCreatingWordPack(false)
    }
  }

  const handleCreateWordPackClick = () => {
    createWordPackDrawer.open()
    customWordPackDialog.close()
  }

  const handleImportWordPackClick = () => {
    importDrawer.open()
    customWordPackDialog.close()
  }

  return (
    <>
      <Dialog
        open={customWordPackDialog.isOpen}
        onOpenChange={customWordPackDialog.setIsOpen}
        title="自定义词包"
        trigger={
          <Button variant="link" className="p-0">
            自定义
          </Button>
        }
      >
        <div className="mt-2 flex flex-col items-center gap-4">
          <FolderPlus className="text-primary size-10" />
          <Typography.Text type="secondary" size="sm" className="!text-muted-foreground">
            请选择创建或导入自定义词包
          </Typography.Text>
          <div className="flex w-full gap-2">
            <Button
              variant="primary"
              size="lg"
              round
              className="flex-1"
              onClick={handleCreateWordPackClick}
            >
              <CirclePlus className="size-4" />
              新建词包
            </Button>
            <Button
              variant="outline"
              size="lg"
              round
              className="flex-1"
              onClick={handleImportWordPackClick}
            >
              <Upload className="size-4" />
              导入词包文件
            </Button>
          </div>
        </div>
      </Dialog>

      <Drawer
        open={createWordPackDrawer.isOpen}
        onOpenChange={createWordPackDrawer.setIsOpen}
        contentClassName="pb-6"
        title="新建词包"
        showCancel={false}
        showCloseButton={false}
      >
        <WordPackCreatingForm
          onSubmit={handleCreateWordPack}
          onCancel={() => createWordPackDrawer.close()}
          loading={isCreatingWordPack}
        />
      </Drawer>

      <Drawer
        open={importDrawer.isOpen}
        onOpenChange={importDrawer.setIsOpen}
        contentClassName="pb-0"
        title="导入词包文件"
        cancelText="取消"
        showCancel={true}
        showCloseButton={false}
      >
        <ImportSection onFinish={handleImportFinish} />
      </Drawer>

      <UploadResultModal
        isOpen={uploadResultModal.isOpen}
        onClose={handleUploadResultModalClose}
        wordPackId={uploadResult?.wordPackId}
        isSuccess={uploadResult?.success}
        message={uploadResult?.message}
        stats={uploadResult?.stats}
        errors={uploadResult?.errors}
      />
    </>
  )
}

export default CustomWordPack

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import { useModalState } from '@/hooks/useModalState'
import ImportSection from '@/pages/wordpack/components/ImportSection'
import { ImportResult, wordPackService } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'

import UploadResultModal from './UploadResultModal'
import WordPackCreatingForm, { type WordPackFormData } from './WordPackCreatingForm'
import { cardPackService } from '@/services/cardPackService'

const Footer = () => {
  const navigate = useNavigate()
  const wordPackStore = useWordPackStore()
  const uploadResultModal = useModalState()

  const importDrawer = useDrawer()
  const createWordPackDrawer = useDrawer()
  const [uploadResult, setUploadResult] = useState<ImportResult | null>(null)
  const [isCreatingWordPack, setIsCreatingWordPack] = useState(false)

  const handleImportFromLibrary = () => {
    navigate('/recommended-packs')
  }

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

  return (
    <div className="bg-muted/50 flex flex-col gap-2 p-4">
      <Button size="lg" className="w-full rounded-full" onClick={handleImportFromLibrary}>
        从词包库导入词包
      </Button>

      <Drawer
        open={createWordPackDrawer.isOpen}
        onOpenChange={createWordPackDrawer.setIsOpen}
        contentClassName="pb-6"
        title="新建词包"
        showCancel={false}
        showCloseButton={false}
        trigger={
          <Button variant="outline" size="lg" className="w-full rounded-full">
            新建词包
          </Button>
        }
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
        trigger={
          <Button variant="outline" size="lg" className="w-full rounded-full">
            导入词包文件
          </Button>
        }
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
    </div>
  )
}

export default Footer

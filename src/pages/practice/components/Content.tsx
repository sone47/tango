import { LibraryBig } from 'lucide-react'
import { motion } from 'motion/react'

import Button from '@/components/Button'
import Typography from '@/components/Typography'
import { usePracticeStore } from '@/stores/practiceStore'

const PracticeContent = () => {
  const { updateState } = usePracticeStore()

  const handleShowCardPackSelector = () => {
    updateState({ showCardPackSelector: true })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <LibraryBig className="size-16 text-primary"></LibraryBig>
        <div className="flex flex-col items-center justify-center gap-1">
          <Typography.Title level={4}>未选择卡包</Typography.Title>
          <Typography.Text type="secondary">点击下方按钮选择一个卡包开始学习</Typography.Text>
        </div>
        <Button variant="primary" size="xl" className="w-full" onClick={handleShowCardPackSelector}>
          开始学习
        </Button>
      </motion.div>
    </div>
  )
}

export default PracticeContent

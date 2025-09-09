import { isNil } from 'lodash'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { wordPackService } from '@/services/wordPackService'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  importedWordPackId?: number
}

export default function SuccessModal({ isOpen, importedWordPackId, onClose }: SuccessModalProps) {
  const navigate = useNavigate()
  const { setCurrentWordPackId, currentWordPackId } = useCurrentWordPack()
  const [wordPackName, setWordPackName] = useState<string>('')

  useEffect(() => {
    if (isNil(importedWordPackId)) {
      return
    }

    wordPackService.getWordPackById(importedWordPackId).then((wordPack) => {
      setWordPackName(wordPack?.name || '')
    })
  }, [importedWordPackId])

  const handleStartLearning = () => {
    if (!isNil(importedWordPackId)) {
      setCurrentWordPackId(importedWordPackId)
    }

    navigate('/')
  }

  const handleClose = () => {
    if (!isNil(importedWordPackId) && isNil(currentWordPackId)) {
      setCurrentWordPackId(importedWordPackId)
    }

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="导入成功">
      <div className="flex flex-col items-center gap-8">
        <Typography.Text type="secondary">「{wordPackName}」导入成功！</Typography.Text>
        <Button variant="primary" onClick={handleStartLearning} className="w-full">
          开始学习
        </Button>
      </div>
    </Modal>
  )
}

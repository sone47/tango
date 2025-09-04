import { Check, Edit, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import Input from '@/components/Input'
import Typography from '@/components/Typography'

interface TextEditorProps {
  value: string
  isEdit: boolean
  onConfirm: (text: string) => void
  onEditStateChange: (isEdit: boolean) => void
}

const TextEditor = ({
  value: originalText,
  isEdit,
  onConfirm,
  onEditStateChange,
}: TextEditorProps) => {
  const [text, setText] = useState('')

  useEffect(() => {
    if (originalText) {
      setText(originalText)
    }
  }, [originalText])

  const handleEditConfirm = async () => {
    onConfirm(text)
  }

  const handleExitEdit = () => {
    setText(originalText)
    onEditStateChange(false)
  }

  const handleEditStateChange = (isEdit: boolean) => {
    onEditStateChange(isEdit)
  }

  const handleEditClick = () => {
    handleEditStateChange(true)
  }

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      {isEdit ? (
        <div className="relative flex">
          <Input
            className="w-48 !ring-0 shadow-none border-x-0 border-t-0 !border-b-1 border-primary rounded-none p-0 text-lg h-7"
            size="md"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditConfirm()
              }
            }}
          />
          <div className="flex items-center gap-2 absolute right-0 top-1/2 translate-x-full -translate-y-1/2 pl-2">
            <Check className="size-5 text-primary cursor-pointer" onClick={handleEditConfirm} />
            <X
              className="size-5 text-secondary-foreground cursor-pointer"
              onClick={handleExitEdit}
            />
          </div>
        </div>
      ) : (
        <div className="relative flex flex-row gap-2">
          <Typography.Title level={5} className="max-w-56 truncate">
            {text}
          </Typography.Title>
          <div>
            <Edit
              className="size-5 text-primary cursor-pointer absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
              onClick={handleEditClick}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TextEditor

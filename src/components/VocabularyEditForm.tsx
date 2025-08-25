import React, { useEffect, useState } from 'react'

import { type CardPackEntity, type VocabularyEntity } from '@/schemas'
import { cardPackService } from '@/services/cardPackService'

import Button from './Button'
import Form, { type FormFieldConfig, useFormHelper } from './Form'
import Input from './Input'
import Select, { type SelectOption } from './Select'
import Textarea from './Textarea'

export interface VocabularyFormData {
  cardPackId: number
  phonetic: string
  word: string
  definition: string
  example: string
  wordAudio: string
  exampleAudio: string
}

export interface VocabularyEditFormProps {
  vocabulary?: VocabularyEntity
  wordPackId?: number
  isCreate?: boolean
  onSubmit: (data: VocabularyFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  className?: string
}

const VocabularyEditForm: React.FC<VocabularyEditFormProps> = ({
  vocabulary,
  isCreate = false,
  onSubmit,
  onCancel,
  loading = false,
  className = '',
}) => {
  const [cardPacks, setCardPacks] = useState<CardPackEntity[]>([])
  const [loadingCardPacks, setLoadingCardPacks] = useState(false)

  const defaultValues: VocabularyFormData = {
    cardPackId: vocabulary?.cardPackId || 0,
    phonetic: vocabulary?.phonetic || '',
    word: vocabulary?.word || '',
    definition: vocabulary?.definition || '',
    example: vocabulary?.example || '',
    wordAudio: vocabulary?.wordAudio || '',
    exampleAudio: vocabulary?.exampleAudio || '',
  }

  const form = useFormHelper<VocabularyFormData>(defaultValues)
  const cardPackId = vocabulary?.cardPackId

  useEffect(() => {
    const loadCardPacks = async () => {
      if (!cardPackId) return

      setLoadingCardPacks(true)
      try {
        const pack = await cardPackService.getCardPackWithWordsById(cardPackId)
        const packs = await cardPackService.getCardPacksByWordPackId(pack!.wordPackId)
        setCardPacks(packs)

        if (isCreate && packs.length === 1) {
          form.setValue('cardPackId', packs[0].id!)
        }
      } catch (error) {
        console.error('加载卡包列表失败:', error)
      } finally {
        setLoadingCardPacks(false)
      }
    }

    loadCardPacks()
  }, [cardPackId, isCreate, form])

  const handleSubmit = async (data: VocabularyFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('提交表单失败:', error)
    }
  }

  const cardPackOptions: SelectOption[] = cardPacks.map((pack) => ({
    value: String(pack.id),
    label: `${pack.name} (${pack.words?.length || 0} 词)`,
  }))

  const formFields: FormFieldConfig<VocabularyFormData>[] = [
    {
      name: 'cardPackId',
      label: '所属卡包',
      required: true,
      render: (field) => (
        <Select
          {...field}
          value={String(field.value)}
          onValueChange={(value) => field.onChange(Number(value))}
          options={cardPackOptions}
          placeholder={loadingCardPacks ? '加载中...' : '请选择卡包'}
          disabled={loadingCardPacks || loading}
          triggerClassName="w-full"
        />
      ),
    },
    {
      name: 'word',
      label: '单词',
      required: true,
      render: (field) => <Input {...field} placeholder="请输入单词" disabled={loading} />,
    },
    {
      name: 'phonetic',
      label: '音标',
      render: (field) => <Input {...field} placeholder="请输入音标" disabled={loading} />,
    },
    {
      name: 'definition',
      label: '释义',
      required: true,
      render: (field) => <Input {...field} placeholder="请输入释义" disabled={loading} />,
    },
    {
      name: 'example',
      label: '例句',
      render: (field) => (
        <Textarea
          {...field}
          placeholder="请输入例句"
          disabled={loading}
          autoResize
          minHeight={60}
          maxHeight={120}
        />
      ),
    },
    {
      name: 'wordAudio',
      label: '单词音频',
      render: (field) => (
        <Textarea
          {...field}
          placeholder="请输入音频URL或Base64编码"
          disabled={loading}
          autoResize
          minHeight={60}
          maxHeight={100}
        />
      ),
    },
    {
      name: 'exampleAudio',
      label: '例句音频',
      render: (field) => (
        <Textarea
          {...field}
          placeholder="请输入例句音频URL或Base64编码"
          disabled={loading}
          autoResize
          minHeight={60}
          maxHeight={100}
        />
      ),
    },
  ]

  return (
    <div className={className}>
      <Form
        form={form}
        onSubmit={handleSubmit}
        fields={formFields}
        disabled={loading}
        className="space-y-4"
      >
        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" loading={loading} variant="primary">
            {isCreate ? '创建词汇' : '保存修改'}
          </Button>

          {onCancel && (
            <Button type="button" onClick={onCancel} disabled={loading} variant="outline">
              取消
            </Button>
          )}
        </div>
      </Form>
    </div>
  )
}

export default VocabularyEditForm

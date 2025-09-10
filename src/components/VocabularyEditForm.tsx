import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'
import { type VocabularyEntity, type WordPackEntity } from '@/schemas'
import { cardPackService } from '@/services/cardPackService'
import { wordPackService } from '@/services/wordPackService'
import { CardPack } from '@/types'

import Button from './Button'
import Form, { type FormFieldConfig, useFormHelper } from './Form'
import Input from './Input'
import Select, { type SelectOption } from './Select'
import Textarea from './Textarea'

const vocabularyFormSchema = z.object({
  cardPackId: z.number().min(1, '请选择所属卡包'),
  phonetic: z.string().optional(),
  word: z.string().min(1, '单词不能为空').max(100, '单词长度不能超过100个字符'),
  definition: z.string().min(1, '释义不能为空').max(500, '释义长度不能超过500个字符'),
  partOfSpeech: z.enum(PartOfSpeechEnum),
  example: z.string().max(1000, '例句长度不能超过1000个字符').optional(),
  wordAudio: z.string().max(2000, '单词音频长度不能超过2000个字符').optional(),
  exampleAudio: z.string().max(2000, '例句音频长度不能超过2000个字符').optional(),
})

export type VocabularyFormData = z.infer<typeof vocabularyFormSchema>

export interface VocabularyEditFormProps {
  vocabulary?: VocabularyEntity
  isCreate?: boolean
  onSubmit: (data: VocabularyFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  className?: string
  wordPackId: number
}

const VocabularyEditForm: React.FC<VocabularyEditFormProps> = ({
  vocabulary,
  isCreate = false,
  onSubmit,
  onCancel,
  loading = false,
  className = '',
  wordPackId,
}) => {
  const [cardPacks, setCardPacks] = useState<CardPack[]>([])
  const [wordPack, setWordPack] = useState<WordPackEntity | null>(null)
  const [loadingCardPacks, setLoadingCardPacks] = useState(false)

  const defaultValues: Partial<VocabularyFormData> = {
    cardPackId: vocabulary?.cardPackId,
    phonetic: vocabulary?.phonetic || '',
    word: vocabulary?.word || '',
    definition: vocabulary?.definition || '',
    partOfSpeech: vocabulary?.partOfSpeech || PartOfSpeechEnum.unknown,
    wordAudio: vocabulary?.wordAudio || '',
  }

  const form = useFormHelper<VocabularyFormData>(defaultValues, zodResolver(vocabularyFormSchema))

  const partOfSpeechOptions = useMemo(() => {
    return (
      Object.entries(
        partOfSpeechToLanguageMap[wordPack?.language as LanguageEnum] ??
          (partOfSpeechToLanguageMap[LanguageEnum.japanese] as Record<PartOfSpeechEnum, string>)
      ).map(([value, label]) => ({
        value: String(value),
        label,
      })) ?? []
    )
  }, [wordPack])

  useEffect(() => {
    loadCardPacks()
    loadWordPack()
  }, [wordPackId])

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

  const loadCardPacks = async () => {
    setLoadingCardPacks(true)
    try {
      const packs = await cardPackService.getCardPacksByWordPackId(wordPackId)
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

  const loadWordPack = async () => {
    const wordPack = await wordPackService.getWordPackById(wordPackId)
    setWordPack(wordPack)
  }

  const formFields: FormFieldConfig<VocabularyFormData>[] = [
    {
      name: 'cardPackId',
      label: '所属卡包',
      required: true,
      render: (field) => (
        <Select
          {...field}
          value={field.value ? String(field.value) : undefined}
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
      name: 'partOfSpeech',
      label: '词性',
      render: (field) => (
        <Select
          {...field}
          value={String(field.value)}
          onValueChange={(value) => field.onChange(Number(value))}
          options={partOfSpeechOptions}
          disabled={loading}
          triggerClassName="w-full"
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
        <div className="flex flex-col gap-2">
          <Button type="submit" loading={loading} variant="primary">
            {isCreate ? '创建单词' : '保存修改'}
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

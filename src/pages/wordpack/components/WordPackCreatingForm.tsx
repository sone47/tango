import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { z } from 'zod'

import Button from '@/components/Button'
import Form, { type FormFieldConfig, useFormHelper } from '@/components/Form'
import Input from '@/components/Input'
import Select, { type SelectOption } from '@/components/Select'
import { LanguageEnum, languageToNameMap } from '@/constants/language'

const wordPackFormSchema = z.object({
  name: z.string().min(1, '词包名称不能为空').max(100, '词包名称长度不能超过100个字符'),
  language: z.enum([LanguageEnum.japanese]),
})

export type WordPackFormData = z.infer<typeof wordPackFormSchema>

export interface WordPackCreatingFormProps {
  onSubmit: (data: WordPackFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  className?: string
}

const WordPackCreatingForm: React.FC<WordPackCreatingFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  className = '',
}) => {
  const defaultValues: Partial<WordPackFormData> = {
    name: '',
    language: LanguageEnum.japanese,
  }

  const form = useFormHelper<WordPackFormData>(defaultValues, zodResolver(wordPackFormSchema))

  const handleSubmit = async (data: WordPackFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('创建词包失败:', error)
    }
  }

  const languageOptions: SelectOption[] = Object.entries(languageToNameMap).map(([key, value]) => ({
    value: key,
    label: value,
  }))

  const formFields: FormFieldConfig<WordPackFormData>[] = [
    {
      name: 'name',
      label: '词包名称',
      required: true,
      render: (field) => (
        <Input {...field} placeholder="请输入词包名称" disabled={loading} autoFocus />
      ),
    },
    {
      name: 'language',
      label: '词包语言',
      required: true,
      render: (field) => (
        <Select
          {...field}
          value={field.value}
          onValueChange={field.onChange}
          options={languageOptions}
          disabled={loading}
          triggerClassName="w-full"
          placeholder="请选择语言"
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
            创建词包
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

export default WordPackCreatingForm

import React from 'react'
import { type DefaultValues, type FieldValues, useForm, type UseFormReturn } from 'react-hook-form'

import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export interface FormFieldConfig<T extends FieldValues> {
  name: keyof T
  label?: string
  description?: string
  required?: boolean
  render: (field: any) => React.ReactNode
}

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void | Promise<void>
  children?: React.ReactNode
  className?: string
  fields?: FormFieldConfig<T>[]
  disabled?: boolean
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = '',
  fields = [],
  disabled = false,
}: FormProps<T>) {
  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <ShadcnForm {...form}>
      <form onSubmit={handleSubmit} className={className}>
        <fieldset disabled={disabled} className="space-y-4">
          {fields.map((fieldConfig) => (
            <FormField
              key={String(fieldConfig.name)}
              control={form.control}
              name={fieldConfig.name as any}
              render={({ field }) => (
                <FormItem>
                  {fieldConfig.label && (
                    <FormLabel>
                      {fieldConfig.label}
                      {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                  )}
                  <FormControl>{fieldConfig.render(field)}</FormControl>
                  {fieldConfig.description && (
                    <FormDescription>{fieldConfig.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {children}
        </fieldset>
      </form>
    </ShadcnForm>
  )
}

// 创建表单的便捷 Hook
export function useFormHelper<T extends FieldValues>(defaultValues?: DefaultValues<T>) {
  return useForm<T>({
    defaultValues,
    mode: 'onChange',
  })
}

export default Form

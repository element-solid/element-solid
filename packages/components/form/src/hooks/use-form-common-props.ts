import { createMemo } from 'solid-js'
import { ComponentSize } from '@element-solid/constants/size'
import { MaybeAccessor, unAccessor } from '@element-solid/hooks/type'
import { useGlobalConfig } from '@element-solid/hooks'
import { useFormItem } from './use-form-item'

export function useSize(
  props: { size?: ComponentSize },
  fallback?: MaybeAccessor<ComponentSize | undefined>
) {
  const { form, formItem } = useFormItem()
  return createMemo(
    () =>
      props.size ||
      unAccessor(fallback) ||
      formItem?.size ||
      form?.size ||
      useGlobalConfig('size')
  )
}

export function useDisabled(
  props: { disabled?: boolean },
  fallback?: MaybeAccessor<boolean | undefined>
) {
  const { form } = useFormItem()
  return createMemo(
    () => props.disabled || unAccessor(fallback) || form?.disabled
  )
}

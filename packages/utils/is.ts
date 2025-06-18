import { JSX } from 'solid-js'

export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}

export function isJSXElement(value: unknown): value is JSX.Element {
  return (
    value !== null &&
    typeof value === 'object' &&
    't' in value && // 检查是否有类型标记
    'props' in value // 检查是否有props属性
  )
}

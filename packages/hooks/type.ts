import { isFunction } from 'lodash-es'
import { Accessor } from 'solid-js'

export type MaybeAccessor<T> = Accessor<T> | T

export type MaybeElementAccessor = MaybeAccessor<Element | undefined>

export type PointerType = 'mouse' | 'touch' | 'pen'

export interface Position {
  x: number
  y: number
}

export function unAccessor<T>(el: MaybeAccessor<T>) {
  return isFunction(el) ? el() : el
}

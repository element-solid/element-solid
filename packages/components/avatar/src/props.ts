import { ComponentSize } from '@element-solid/constants'
import { JSX } from 'solid-js'

export interface AvatarInstance {}
export interface AvatarProps extends JSX.HTMLAttributes<AvatarInstance> {
  size?: ComponentSize | number
  shape?: 'circle' | 'square'
  icon?: string
  src?: string
  alt?: string
  srcSet?: string
  fit?: JSX.CSSProperties['object-fit']
  onError?: (evt: Event) => void
}

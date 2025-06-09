import { JSX } from 'solid-js'
import { ComponentSize } from '@element-solid/constants/size'

export interface RadioProps
  extends Omit<JSX.HTMLAttributes<unknown>, 'value' | 'onChange'> {
  /**
   * @description size of the Radio
   */
  size?: ComponentSize
  /**
   * @description whether Radio is disabled
   */
  disabled?: boolean
  /**
   * @description whether to add a border around Radio
   */
  border?: boolean
  /**
   * @description the label of Radio
   */
  label?: string | number | boolean
  value?: string | number | boolean
  onChange?: (checked: boolean) => void
}
export interface RadioGroupProps extends Omit<RadioProps, 'value'> {
  value: string | number
  onChange?: (label: string | number | boolean) => void
}
export type RadioGroupInstance = RadioGroupProps

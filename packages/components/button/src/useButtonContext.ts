import { createContext, useContext } from 'solid-js'
import { ComponentSize } from '@element-solid/constants'

export interface ButtonGroupInstance {
  size?: ComponentSize
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
}

export const ButtonGroupContext = createContext<ButtonGroupInstance>({})

export const useButtonContext = () => {
  return useContext(ButtonGroupContext)
}

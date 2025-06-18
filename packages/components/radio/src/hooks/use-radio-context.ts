import { createContext, useContext } from 'solid-js'
import { RadioGroupProps } from '../props'

export const RadioGroupContext = createContext<RadioGroupProps>()

export function useRadioGroupContext() {
  return useContext(RadioGroupContext)
}

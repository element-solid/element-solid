import { createContext, useContext } from 'solid-js'
import { RadioGroupInstance } from '../props'

export const RadioGroupContext = createContext<RadioGroupInstance>()

export function useRadioGroupContext() {
  return useContext(RadioGroupContext)
}

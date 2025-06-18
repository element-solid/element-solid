import { createContext, useContext } from 'solid-js'
import { BreadcrumbProps } from '../props'

export const BreadcrumbContext = createContext<BreadcrumbProps>()

export function useBreadcrumbContext() {
  return useContext(BreadcrumbContext)
}

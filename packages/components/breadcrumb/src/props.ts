import { JSX } from 'solid-js'

export interface BreadcrumbProps extends JSX.HTMLAttributes<unknown> {
  separator?: string
  separatorIcon?: string
}

export interface BreadcrumbItemProps extends JSX.HTMLAttributes<unknown> {
  to: string
  replace?: boolean
}

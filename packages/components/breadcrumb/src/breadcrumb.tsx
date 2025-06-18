import { Component, mergeProps, onMount } from 'solid-js'
import { useLocale, useNamespace } from '@element-solid/hooks'
import { classNames } from '@element-solid/utils'
import { BreadcrumbProps } from './props'
import { BreadcrumbContext } from './hooks/use-breadcrumb-context'

const defaultProps: Partial<BreadcrumbProps> = {}

const Breadcrumb: Component<BreadcrumbProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('breadcrumb')
  const { t } = useLocale()
  let breadcrumb!: HTMLDivElement
  onMount(() => {
    const items = breadcrumb.querySelectorAll(`.${ns.e('item')}`)
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page')
    }
  })
  return (
    <BreadcrumbContext.Provider value={props}>
      <div
        ref={breadcrumb}
        class={classNames(ns.b())}
        aria-label={t('el.breadcrumb.label')}
        role="navigation"
      >
        {props.children}
      </div>
    </BreadcrumbContext.Provider>
  )
}

export default Breadcrumb

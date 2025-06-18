import { Component, Show, mergeProps } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useNamespace } from '@element-solid/hooks'
import { Icon } from '../../icon'
import { BreadcrumbItemProps } from './props'
import { useBreadcrumbContext } from './hooks/use-breadcrumb-context'

const defaultProps: Partial<BreadcrumbItemProps> = {}

const BreadcrumbItem: Component<BreadcrumbItemProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('breadcrumb')
  const breadcrumbContext = useBreadcrumbContext()
  const onClick = () => {
    const navigate = useNavigate()
    if (props.to) {
      navigate(props.to, { replace: props.replace })
    }
  }
  return (
    <span class={ns.e('item')}>
      <span
        class={ns.e('link')}
        classList={{ [ns.is('link')]: !!props.to }}
        onClick={onClick}
      >
        {props.children}
      </span>
      <Show
        when={breadcrumbContext?.separatorIcon}
        fallback={
          <span class={ns.e('separator')} role="presentation">
            {breadcrumbContext?.separator}
          </span>
        }
      >
        <Icon
          class={ns.e('separator')}
          icon={breadcrumbContext!.separatorIcon!}
        ></Icon>
      </Show>
    </span>
  )
}

export default BreadcrumbItem

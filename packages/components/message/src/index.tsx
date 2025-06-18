import { Component, Show, createSignal, mergeProps, onMount } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { TypeIconMap } from '@element-solid/constants'
import { useNamespace, useZIndex } from '@element-solid/hooks'
import { addUnit, classNames } from '@element-solid/utils'
import { Icon } from '../../icon'
import { MessageInstance, MessageProps } from './props'

const defaultProps: Partial<MessageProps> = {
  duration: 3000,
  type: 'info',
  offset: 16,
}
type RefGetter = (el: MessageInstance) => void

const Message: Component<MessageProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('message')
  const [visible, setVisible] = createSignal(true)

  const zIndex = useZIndex()

  const icon = props.icon || TypeIconMap[props.type!]
  const style = () => ({ 'z-index': zIndex, top: addUnit(props.offset) })

  onMount(startTimer)

  let timer: number
  function startTimer() {
    if (props.duration! <= 0) {
      return
    }
    clearTimer()
    timer = setTimeout(close, props.duration)
  }
  function clearTimer() {
    timer && clearTimeout(timer)
  }
  function close(e?: MouseEvent) {
    e?.stopPropagation()
    setVisible(false)
    props.onClose?.()
  }
  const ref = props.ref as RefGetter
  ref?.({ close })

  return (
    <Transition name={ns.b('fade')}>
      {visible() && (
        <div
          class={classNames(
            ns.b(),
            ns.m(props.type),
            ns.is('center', props.center),
            ns.is('closable', props.showClose)
          )}
          style={style()}
          onMouseEnter={clearTimer}
          onMouseLeave={startTimer}
        >
          {icon && (
            <Icon
              icon={icon}
              class={classNames(ns.e('icon'), ns.bm('icon', props.type))}
            />
          )}
          <Show
            when={props.dangerouslyUseHTMLString}
            fallback={<p class={ns.e('content')}>{props.message}</p>}
          >
            <p class={ns.e('content')} innerHTML={props.message as string}></p>
          </Show>
          <p class={ns.e('content')}>{props.message}</p>
          {props.showClose && (
            <Icon class={ns.e('closeBtn')} icon="ep:close" onClick={close} />
          )}
        </div>
      )}
    </Transition>
  )
}

export default Message

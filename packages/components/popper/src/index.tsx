import { debounce, isString } from 'lodash-es'
import {
  Component,
  children,
  createEffect,
  createSignal,
  mergeProps,
  on,
  onCleanup,
} from 'solid-js'
import {
  Middleware,
  arrow,
  autoPlacement,
  computePosition,
  offset,
  shift,
} from '@floating-ui/dom'
import { Transition } from 'solid-transition-group'
import { Portal } from 'solid-js/web'
import { useClickOutside, useNamespace } from '@element-solid/hooks'
import { Arrayable, Fn, classNames } from '@element-solid/utils'
import { PopperInstance, PopperProps } from './props'

type BaseDir = 'left' | 'right' | 'top' | 'bottom'
const ns = useNamespace('popper')
const defaultProps: Partial<PopperProps> = {
  strategy: 'absolute',
  trigger: 'hover',
  placement: 'bottom',
  hideAfter: 200,
  offset: 6,
  arrow: true,
  effect: 'light',
  transition: `${ns.namespace}-fade-in-linear`,
  mountTo: document.body,
}

const showEventMap: Record<
  'hover' | 'click' | 'contextmenu',
  keyof HTMLElementEventMap
> = {
  hover: 'mouseenter',
  click: 'click',
  contextmenu: 'contextmenu',
}
const hideEventMap: Record<
  'hover' | 'click' | 'contextmenu',
  Arrayable<keyof HTMLElementEventMap>
> = {
  hover: ['mouseenter', 'click', 'focus'],
  click: ['click', 'focus'],
  contextmenu: ['click', 'focus'],
}
const Popper: Component<PopperProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)

  const [visible, setVisible] = createSignal(false)
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>()

  let contentRef: HTMLElement | null = null
  let arrowRef: HTMLElement | null = null
  let cleanup: Fn | undefined

  const mount = () =>
    isString(props.mountTo)
      ? document.body.querySelector(props.mountTo)
      : props.mountTo

  createEffect(
    on(
      () => props.visible,
      (val) => {
        setVisible(!!val)
      }
    )
  )
  createEffect(
    on(
      visible,
      (val) => {
        if (val && triggerRef() && contentRef) {
          const middleware: Middleware[] = [shift()]
          if (props.arrow) {
            middleware.push(arrow({ element: arrowRef! }))
          }
          if (props.offset) {
            middleware.push(offset(props.offset))
          }
          if (props.autoPlacement) {
            middleware.push(
              autoPlacement({
                allowedPlacements:
                  props.autoPlacement === true
                    ? undefined
                    : props.autoPlacement,
              })
            )
          }

          computePosition(triggerRef()!, contentRef!, {
            placement: props.placement,
            middleware,
            strategy: props.strategy,
          }).then(({ x, y, middlewareData, placement }) => {
            Object.assign(contentRef!.style, {
              position: props.strategy,
              left: `${x}px`,
              top: `${y}px`,
            })

            if (props.arrow) {
              const arrowX = middlewareData.arrow?.x
              const arrowY = middlewareData.arrow?.y
              const dir = placement!.split('-')[0] as BaseDir
              const staticSide = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
              }[dir]

              Object.assign(arrowRef!.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide]: '-4px',
              })
              contentRef!.dataset.popperPlacement = placement
            }
          })
          cleanup?.()
          cleanup = useClickOutside(
            contentRef!,
            debounce(hide, props.hideAfter),
            {
              ignore: [triggerRef],
              cusomEventType: hideEventMap[props.trigger!],
            }
          )
        } else {
          // setContentStyle({ ...props.style, visibility: 'hidden' })
        }
      },
      { defer: !props.visible }
    )
  )

  const instance: PopperInstance = {
    show,
    hide,
    toggle,
    visible,
    setTrigger: setTriggerRef,
  }
  const ref = props.ref as (ref: PopperInstance) => void
  ref?.(instance)
  function show() {
    if (!props.disabled) {
      setVisible(true)
      props.onShow?.()
    }
  }
  function hide() {
    setVisible(false)
    props.onHide?.()
  }
  function toggle() {
    visible() ? hide() : show()
  }
  const resolvedChildren = children(() => props.children!)
  const childrenNode = resolvedChildren() as HTMLElement
  childrenNode.addEventListener(showEventMap[props.trigger!], handleShow)
  setTriggerRef(childrenNode)
  function handleShow(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    show()
  }
  onCleanup(() => cleanup?.())
  return (
    <>
      {resolvedChildren()}
      {!props.disabled && visible() && (
        <Portal mount={mount()!}>
          <Transition name={props.transition}>
            <div
              ref={(ref) => (contentRef = ref)}
              class={classNames(ns.b(), props.class, `is-${props.effect}`)}
              style={props.style}
            >
              {props.content}
              {props.arrow && (
                <div
                  ref={(ref) => (arrowRef = ref)}
                  class={classNames(ns.e('arrow'))}
                ></div>
              )}
            </div>
          </Transition>
        </Portal>
      )}
    </>
  )
}

export default Popper

import {
  Component,
  Show,
  createEffect,
  createSignal,
  mergeProps,
} from 'solid-js'
import { Portal, isServer } from 'solid-js/web'
import { Transition } from 'solid-transition-group'
import {
  useEscapeKeydown,
  useLocale,
  useLockscreen,
  useNamespace,
  useZIndex,
} from '@element-solid/hooks'
import { addUnit, classNames } from '@element-solid/utils'
import { Overlay } from '../../overlay'
import { Icon } from '../../icon'
import { DrawerInstance, DrawerProps } from './props'

const defaultProps: Partial<DrawerProps> = {
  direction: 'rtl',
  size: '30%',
  closeIcon: 'ep:close',
  visible: true,
  mask: true,
  maskClosable: true,
  escClosable: true,
  showClose: true,
  lockScroll: true,
}

const Drawer: Component<DrawerProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('drawer')
  const { t } = useLocale()
  const [zIndex, setZIndex] = createSignal(props.zIndex || useZIndex())
  const [visible, setVisible] = createSignal(!!props.visible)
  // let drawerRef: HTMLDivElement;
  // let draggerRef: HTMLDivElement;

  const isHorizontal = () =>
    props.direction === 'rtl' || props.direction === 'ltr'
  const style = () => {
    const size = addUnit(props.size)
    return isHorizontal() ? { width: size } : { height: size }
  }

  createEffect(() => {
    props.visible ? doOpen() : doClose()
  })

  if (props.escClosable) {
    useEscapeKeydown(handleClose)
  }
  if (props.lockScroll) {
    useLockscreen(visible)
  }

  {
    ;(props.ref as (el: DrawerInstance) => void)?.({
      open: doOpen,
      close: doClose,
      visible,
    })
  }

  function doOpen() {
    if (isServer) return
    setZIndex(props.zIndex || useZIndex())
    setVisible(true)
  }
  function doClose() {
    setVisible(false)
  }
  async function handleClose() {
    const shouldClose = (await props.beforeClose?.()) ?? true
    if (shouldClose) {
      doClose()
      props.onClose?.()
    }
  }
  function handleMaskClick() {
    if (props.maskClosable && props.mask) {
      handleClose()
    }
  }

  return (
    <Show when={visible() && !isServer}>
      <Portal mount={document.body}>
        <Transition
          name={ns.b('fade')}
          appear
          onAfterEnter={props.onOpen}
          onAfterExit={props.onClose}
        >
          <Overlay
            mask={props.mask}
            zIndex={zIndex()}
            onClick={handleMaskClick}
          >
            <div
              role="dialog"
              aria-model="true"
              class={classNames(ns.b(), props.direction, props.class)}
              style={style()}
              onClick={(e) => e.stopPropagation()}
            >
              {/* {props.resizeable && <div class={ns.e('dragger')} ref={ref => draggerRef = ref}></div>} */}
              <header class={ns.e('header')}>
                <Show
                  when={props.header}
                  fallback={
                    <span role="heading" class={ns.e('title')}>
                      {' '}
                      {props.title}
                    </span>
                  }
                >
                  {props.header}
                </Show>
                <Show when={props.closeIcon && props.showClose}>
                  <button
                    aria-label={t('el.drawer.close')}
                    class={ns.e('close-btn')}
                    type="button"
                    onClick={handleClose}
                  >
                    <Icon class={ns.e('close')} icon={props.closeIcon!} />
                  </button>
                </Show>
              </header>
              <div class={ns.e('body')}>{props.children}</div>
              <Show when={props.footer}>
                <footer class={ns.e('footer')}>{props.footer}</footer>
              </Show>
            </div>
          </Overlay>
        </Transition>
      </Portal>
    </Show>
  )
}

export default Drawer

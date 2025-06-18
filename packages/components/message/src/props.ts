import { JSX } from 'solid-js'

export const messageTypes = ['success', 'info', 'warning', 'error'] as const

export type messageType = (typeof messageTypes)[number]

export interface MessageProps extends JSX.HTMLAttributes<MessageInstance> {
  message?: JSX.Element | string
  type?: messageType
  icon?: string
  /**
   * @description whether `message` is treated as HTML string
   */
  dangerouslyUseHTMLString?: boolean
  duration?: number
  showClose?: boolean
  center?: boolean
  offset?: number
  onClose?: () => void
}

export interface MessageInstance {
  /**
   * @description close the Message
   */
  close: () => void
}

export type MessageFn = {
  (options: MessageProps): () => void
}

export type MessageTypedFn = (options: MessageParamsWithType) => () => void

export type MessageParamsWithType = MessageProps | MessageProps['message']
export interface Message extends MessageFn {
  success: MessageTypedFn
  warning: MessageTypedFn
  info: MessageTypedFn
  error: MessageTypedFn
}

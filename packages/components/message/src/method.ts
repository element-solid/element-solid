import { isString } from 'lodash-es'
import { usePopup } from '@element-solid/hooks'
import { isJSXElement } from '@element-solid/utils'
import {
  Message,
  MessageFn,
  MessageParamsWithType,
  MessageProps,
  messageTypes,
} from './props'
import MessageConstructor from './index'

const normalizeOptions = (params?: MessageParamsWithType) => {
  const options: MessageProps =
    isJSXElement(params) || isString(params) ? { message: params } : params
  return options
}
const createMessage: MessageFn = (options: MessageProps) => {
  return usePopup(MessageConstructor, options)
}
const message: MessageFn & Partial<Message> = createMessage
messageTypes.forEach((type) => {
  message[type] = (options) =>
    createMessage({ ...normalizeOptions(options), type })
})

export default message as Message

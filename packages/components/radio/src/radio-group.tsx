import { Component, mergeProps } from 'solid-js'
import { useNamespace } from '@element-solid/hooks'
import { RadioGroupProps } from './props'
import { RadioGroupContext } from './hooks/use-radio-context'

const defaultProps: Partial<RadioGroupProps> = {}

const RadioGroup: Component<RadioGroupProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('radio')
  return (
    <RadioGroupContext.Provider value={props}>
      <div class={ns.b('group')}>{props.children}</div>
    </RadioGroupContext.Provider>
  )
}

export default RadioGroup

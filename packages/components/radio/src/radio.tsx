import { Component, createSignal, mergeProps } from 'solid-js'
import { isNil } from 'lodash-es'
import { useNamespace } from '@element-solid/hooks'
import { useDisabled, useSize } from '@element-solid/components/form'
import { RadioProps } from './props'
import { useRadioGroupContext } from './hooks/use-radio-context'

const defaultProps: Partial<RadioProps> = {}

const Radio: Component<RadioProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)
  const ns = useNamespace('radio')
  const radioGroupContext = useRadioGroupContext()
  const [focus, setFocus] = createSignal(false)
  const disabled = useDisabled(props, radioGroupContext?.disabled)
  const size = useSize(props, radioGroupContext?.size)
  const checked = () =>
    radioGroupContext ? radioGroupContext.value === props.label : !!props.value
  const handleChange = () => {
    props.onChange?.(!checked())
    radioGroupContext?.onChange?.(
      !isNil(props.value) ? props.value : props.label!
    )
  }
  return (
    <label
      class={ns.b()}
      classList={{
        [ns.is('disabled')]: disabled(),
        [ns.is('focus')]: focus(),
        [ns.is('bordered')]: props.border,
        [ns.is('checked')]: !!checked(),
        [ns.m(size())]: true,
      }}
    >
      <span
        class={ns.e('input')}
        classList={{
          [ns.is('disabled')]: disabled(),
          [ns.is('checked')]: !!checked(),
        }}
      >
        <input
          class={ns.e('original')}
          type="radio"
          disabled={disabled()}
          checked={checked()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={handleChange}
        />
        <span class={ns.e('inner')}></span>
      </span>
      <span class={ns.e('label')}>{props.label}</span>
    </label>
  )
}

export default Radio

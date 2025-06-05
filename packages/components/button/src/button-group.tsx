import { Component, mergeProps, splitProps } from "solid-js";
import { useNamespace } from "@element-solid/hooks";
import { classNames } from "@element-solid/utils";
import { ButtonGroupContext } from './useButtonContext';
import { ButtonGroupProps } from "./props";

const defaultProps: Partial<ButtonGroupProps> = { size: 'default', type: 'default' }
const ButtonGroup: Component<ButtonGroupProps> = (_props) => {
  const props = mergeProps<ButtonGroupProps[]>(defaultProps, _props);
  const ns = useNamespace('button');
  const [local, attrs] = splitProps(props, ['class', 'size', 'type']);
  return <ButtonGroupContext.Provider value={local}>
    <div class={classNames(ns.b('group'), props.class)} {...attrs}>
      {props.children}
    </div>
  </ButtonGroupContext.Provider>
}

export default ButtonGroup;

import { Component, JSX, mergeProps } from 'solid-js';
import { useNamespace } from '@element-solid/hooks';
import { classNames } from '@element-solid/utils';
import { SelectProps } from './props';


const defaultProps: Partial<SelectProps> = {};

const Select: Component<SelectProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('select');

  return <div class={classNames(ns.b())}></div>
}

export default Select;


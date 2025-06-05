import { Component, mergeProps } from 'solid-js';
import { useNamespace } from '@element-solid/hooks';
import { classNames } from '@element-solid/utils';
import { RadioProps } from "./props";

const defaultProps: Partial<RadioProps> = {};

const Radio: Component<RadioProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('radio');

  return <div class={classNames(ns.b())}></div>
}

export default Radio;


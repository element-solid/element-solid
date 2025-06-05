import { Component, createEffect, onMount, splitProps } from 'solid-js';
import Iconify from '@purge-icons/generated';
import { useNamespace } from '@element-solid/hooks';
import { throwError } from '@element-solid/utils';
import { classNames } from '@element-solid/utils';
import { IconProps } from './props';

const Icon: Component<IconProps> = (props) => {
  const [local, others] = splitProps(props, ['icon', 'prefix', 'loading', 'color', 'rotate', 'size', 'style', 'class'])
  const ns = useNamespace('icon');
  let el!: HTMLSpanElement;

  const style = () => ({
    color: props.color,
    ...local.style,
    'font-size': props.size + 'px',
    transform: `rotate(${props.rotate || 0}deg)`,
  })

  onMount(() => {
    if (!props.icon) {
      throwError('Icon', 'props.icon is required')
    }
  })
  createEffect(() => {
    const svg = Iconify.renderSVG(props.icon);
    if (!el) return;
    el.innerHTML = '';
    if (svg) {
      el.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = 'iconify';
      span.dataset.icon = props.icon;
      el.textContent = '';
      el.appendChild(span);
    }
  })
  return <span ref={el} style={style()} class={classNames(ns.b(), ns.is('loading', props.loading), local.class, props.icon)} {...others}></span>
}

export default Icon;

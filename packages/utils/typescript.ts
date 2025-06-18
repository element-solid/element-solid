export type HTMLElementCustomized<T> = HTMLElement & T
export type Recordable<T = any> = Record<string, T>
export type Arrayable<T> = T | T[]
export type Awaitable<T> = Promise<T> | T
export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

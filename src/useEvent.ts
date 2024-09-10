import { isBrowser } from "./misc/util";

export interface ListenerType1 {
  addEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  );

  removeEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  );
}

export interface ListenerType2 {
  on(name: string, handler: (event?: any) => void, ...args: any[]);

  off(name: string, handler: (event?: any) => void, ...args: any[]);
}

export type UseEventTarget = ListenerType1 | ListenerType2;

const defaultTarget = isBrowser ? window : null;

const isListenerType1 = (target: any): target is ListenerType1 => {
  return !!target.addEventListener;
};
const isListenerType2 = (target: any): target is ListenerType2 => {
  return !!target.on;
};

type AddEventListener<T> = T extends ListenerType1
  ? T["addEventListener"]
  : T extends ListenerType2
  ? T["on"]
  : never;

export type UseEventOptions<T> = Parameters<AddEventListener<T>>[2];

const useEvent = <T extends UseEventTarget>(
  name: Parameters<AddEventListener<T>>[0],
  handler?: null | undefined | Parameters<AddEventListener<T>>[1],
  target: null | T | Window = defaultTarget,
  options?: UseEventOptions<T>
) => {};

export default useEvent;

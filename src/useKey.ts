import { DependencyList, useMemo } from 'react';

// # `useKey`
// 
// React UI sensor hook that executes a `handler` when a keyboard key is used.
// 
// ## Usage
// 
// ```jsx
// import {useKey} from 'react-use';
// 
// const Demo = () => {
//   const [count, set] = useState(0);
//   const increment = () => set(count => ++count);
//   useKey('ArrowUp', increment);
// 
//   return (
//     <div>
//       Press arrow up: {count}
//     </div>
//   );
// };
// ```
// 
// Or as render-prop:
// 
// ```jsx
// import UseKey from 'react-use/lib/component/UseKey';
// 
// <UseKey filter='a' fn={() => alert('"a" key pressed!')} />
// ```
// 
// 
// ## Reference
// 
// ```js
// useKey(filter, handler, options?, deps?)
// ```
// 
// 
// ## Examples
// 
// ```js
// useKey('a', () => alert('"a" pressed'));
// 
// const predicate = (event) => event.key === 'a'
// useKey(predicate, handler, {event: 'keyup'});
// ```
// 
import useEvent, { UseEventOptions, UseEventTarget } from './useEvent';
import { noop } from './misc/util';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type KeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean);
export type Handler = (event: KeyboardEvent) => void;

export interface UseKeyOptions<T extends UseEventTarget> {
  event?: 'keydown' | 'keypress' | 'keyup';
  target?: T | null;
  options?: UseEventOptions<T>;
}

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate =>
  typeof keyFilter === 'function'
    ? keyFilter
    : typeof keyFilter === 'string'
    ? (event: KeyboardEvent) => event.key === keyFilter
    : keyFilter
    ? () => true
    : () => false;

const useKey = <T extends UseEventTarget>(
  key: KeyFilter,
  fn: Handler = noop,
  opts: UseKeyOptions<T> = {},
  deps: DependencyList = [key]
) => {
  const { event = 'keydown', target, options } = opts;
  const useMemoHandler = useMemo(() => {
    const predicate: KeyPredicate = createKeyPredicate(key);
    const handler: Handler = (handlerEvent) => {
      if (predicate(handlerEvent)) {
        return fn(handlerEvent);
      }
    };
    return handler;
  }, deps);
  useEvent(event, useMemoHandler, target, options);
};

export default useKey;

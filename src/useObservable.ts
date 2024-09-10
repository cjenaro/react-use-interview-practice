import { useState } from 'react';

// # `useObservable`
// 
// React state hook that tracks the latest value of an `Observable`.
// 
// 
// ## Usage
// 
// ```jsx
// import {useObservable} from 'react-use';
// 
// const counter$ = new BehaviorSubject(0);
// const Demo = () => {
//   const value = useObservable(counter$, 0);
// 
//   return (
//     <button onClick={() => counter$.next(value + 1)}>
//       Clicked {value} times
//     </button>
//   );
// };
// ```
// 
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export interface Observable<T> {
  subscribe: (listener: (value: T) => void) => {
    unsubscribe: () => void;
  };
}

function useObservable<T>(observable$: Observable<T>): T | undefined;
function useObservable<T>(observable$: Observable<T>, initialValue: T): T;
function useObservable<T>(observable$: Observable<T>, initialValue?: T): T | undefined {
  const [value, update] = useState<T | undefined>(initialValue);

  useIsomorphicLayoutEffect(() => {
    const s = observable$.subscribe(update);
    return () => s.unsubscribe();
  }, [observable$]);

  return value;
}

export default useObservable;

import { useMemo, useRef } from 'react';

// # `useStateList`
// 
// Provides handles for circular iteration over states list.  
// Supports forward and backward iterations and arbitrary position set.
// 
// ## Usage
// 
// ```jsx
// import { useStateList } from 'react-use';
// import { useRef } from 'react';
// 
// const stateSet = ['first', 'second', 'third', 'fourth', 'fifth'];
// 
// const Demo = () => {
//   const { state, prev, next, setStateAt, setState, currentIndex, isFirst, isLast } = useStateList(stateSet);
//   const indexInput = useRef<HTMLInputElement>(null);
//   const stateInput = useRef<HTMLInputElement>(null);
// 
//   return (
//     <div>
//       <pre>
//         {state} [index: {currentIndex}], [isFirst: {isFirst}], [isLast: {isLast}]
//       </pre>
//       <button onClick={() => prev()}>prev</button>
//       <br />
//       <button onClick={() => next()}>next</button>
//       <br />
//       <input type="text" ref={indexInput} style={{ width: 120 }} />
//       <button onClick={() => setStateAt((indexInput.current!.value as unknown) as number)}>set state by index</button>
//       <br />
//       <input type="text" ref={stateInput} style={{ width: 120 }} />
//       <button onClick={() => setState(stateInput.current!.value)}> set state by value</button>
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// const { state, currentIndex, prev, next, setStateAt, setState, isFirst, isLast } = useStateList<T>(stateSet: T[] = []);
// ```
// 
// If `stateSet` changed, became shorter than before and `currentIndex` left in shrunk gap - the last element of list will be taken as current.
// 
// - **`state`**_`: T`_ &mdash; current state value;
// - **`currentIndex`**_`: number`_ &mdash; current state index;
// - **`prev()`**_`: void`_ &mdash; switches state to the previous one. If first element selected it will switch to the last one;
// - **`next()`**_`: void`_ &mdash; switches state to the next one. If last element selected it will switch to the first one;
// - **`setStateAt(newIndex: number)`**_`: void`_ &mdash; set the arbitrary state by index. Indexes are looped, and can be negative.  
//   _4ex:_ if list contains 5 elements, attempt to set index 9 will bring use to the 5th element, in case of negative index it will start counting from the right, so -17 will bring us to the 4th element.
// - **`setState(state: T)`**_`: void`_ &mdash; set the arbitrary state value that exists in `stateSet`. _In case new state does not exists in `stateSet` an Error will be thrown._
// - **`isFirst`**_`: boolean`_ &mdash; `true` if current state is the first one.
// - **`isLast`**_`: boolean`_ &mdash; `true` if current state is the last one.
// 
import useMountedState from './useMountedState';
import useUpdate from './useUpdate';
import useUpdateEffect from './useUpdateEffect';

export interface UseStateListReturn<T> {
  state: T;
  currentIndex: number;
  setStateAt: (newIndex: number) => void;
  setState: (state: T) => void;
  next: () => void;
  prev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function useStateList<T>(stateSet: T[] = []): UseStateListReturn<T> {
  const isMounted = useMountedState();
  const update = useUpdate();
  const index = useRef(0);

  // If new state list is shorter that before - switch to the last element
  useUpdateEffect(() => {
    if (stateSet.length <= index.current) {
      index.current = stateSet.length - 1;
      update();
    }
  }, [stateSet.length]);

  const actions = useMemo(
    () => ({
      next: () => actions.setStateAt(index.current + 1),
      prev: () => actions.setStateAt(index.current - 1),
      setStateAt: (newIndex: number) => {
        // do nothing on unmounted component
        if (!isMounted()) return;

        // do nothing on empty states list
        if (!stateSet.length) return;

        // in case new index is equal current - do nothing
        if (newIndex === index.current) return;

        // it gives the ability to travel through the left and right borders.
        // 4ex: if list contains 5 elements, attempt to set index 9 will bring use to 5th element
        // in case of negative index it will start counting from the right, so -17 will bring us to 4th element
        index.current =
          newIndex >= 0
            ? newIndex % stateSet.length
            : stateSet.length + (newIndex % stateSet.length);
        update();
      },
      setState: (state: T) => {
        // do nothing on unmounted component
        if (!isMounted()) return;

        const newIndex = stateSet.length ? stateSet.indexOf(state) : -1;

        if (newIndex === -1) {
          throw new Error(`State '${state}' is not a valid state (does not exist in state list)`);
        }

        index.current = newIndex;
        update();
      },
    }),
    [stateSet]
  );

  return {
    state: stateSet[index.current],
    currentIndex: index.current,
    isFirst: index.current === 0,
    isLast: index.current === stateSet.length - 1,
    ...actions,
  };
}

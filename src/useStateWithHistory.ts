import { Dispatch, useCallback, useMemo, useRef, useState } from 'react';

// # `useStateHistory`
// 
// Stores defined amount of previous state values and provides handles to travel through them.
// 
// ## Usage
// 
// ## Reference
// 
// ```typescript
// const [state, setState, stateHistory] = useStateWithHistory<S = undefined>(
//   initialState?: S | (()=>S),
//   capacity?: number = 10,
//   initialHistory?: S
// );
// ```
// 
// - **`state`**, **`setState`** and **`initialState`** are exactly the same with native React's `useState` hook;
// - **`capacity`** - amount of history entries held by storage;
// - **`initialHistory`** - if defined it will be used as initial history value, otherwise history will equal `[ initialState ]`.  
// Initial state will not be pushed to initial history.  
// If entries amount is greater than `capacity` parameter it won't be modified on init but will be trimmed on the next call to `setState`;
// - **`stateHistory`** - an object containing history state:
//     - **`history`**_`: S[]`_ - an array holding history entries. _It will have the same ref all the time so be careful with that one!_;
//     - **`position`**_`: number`_ - current position _index_ in history;
//     - **`capacity`**_`: number = 10`_ - maximum amount of history entries;
//     - **`back`**_`: (amount?: number) => void`_ - go back in state history, it will cause `setState` to be invoked and component re-render.
//     If first element of history reached, the call will have no effect;
//     - **`forward`**_`: (amount?: number) => void`_ - go forward in state history, it will cause `setState` to be invoked and component re-render.  
//     If last element of history is reached, the call will have no effect;
//     - **`go`**_`: (position: number) => void`_ - go to arbitrary position in history.  
//     In case `position` is non-negative ot will count elements from beginning.
//     Negative `position` will cause elements counting from the end, so `go(-2)` equals `go(history.length - 1)`;
//     
// 
import { useFirstMountState } from './useFirstMountState';
import { IHookStateInitAction, IHookStateSetAction, resolveHookState } from './misc/hookState';

interface HistoryState<S> {
  history: S[];
  position: number;
  capacity: number;
  back: (amount?: number) => void;
  forward: (amount?: number) => void;
  go: (position: number) => void;
}

export type UseStateHistoryReturn<S> = [S, Dispatch<IHookStateSetAction<S>>, HistoryState<S>];

export function useStateWithHistory<S, I extends S>(
  initialState: IHookStateInitAction<S>,
  capacity?: number,
  initialHistory?: I[]
): UseStateHistoryReturn<S>;
export function useStateWithHistory<S = undefined>(): UseStateHistoryReturn<S | undefined>;

export function useStateWithHistory<S, I extends S>(
  initialState?: IHookStateInitAction<S>,
  capacity: number = 10,
  initialHistory?: I[]
): UseStateHistoryReturn<S> {
  if (capacity < 1) {
    throw new Error(`Capacity has to be greater than 1, got '${capacity}'`);
  }

  const isFirstMount = useFirstMountState();
  const [state, innerSetState] = useState<S>(initialState as S);
  const history = useRef<S[]>((initialHistory ?? []) as S[]);
  const historyPosition = useRef(0);

  // do the states manipulation only on first mount, no sense to load re-renders with useless calculations
  if (isFirstMount) {
    if (history.current.length) {
      // if last element of history !== initial - push initial to history
      if (history.current[history.current.length - 1] !== initialState) {
        history.current.push(initialState as I);
      }

      // if initial history bigger that capacity - crop the first elements out
      if (history.current.length > capacity) {
        history.current = history.current.slice(history.current.length - capacity);
      }
    } else {
      // initiate the history with initial state
      history.current.push(initialState as I);
    }

    historyPosition.current = history.current.length && history.current.length - 1;
  }

  const setState = useCallback(
    (newState: IHookStateSetAction<S>): void => {
      innerSetState((currentState) => {
        newState = resolveHookState(newState, currentState);

        // is state has changed
        if (newState !== currentState) {
          // if current position is not the last - pop element to the right
          if (historyPosition.current < history.current.length - 1) {
            history.current = history.current.slice(0, historyPosition.current + 1);
          }

          historyPosition.current = history.current.push(newState as I) - 1;

          // if capacity is reached - shift first elements
          if (history.current.length > capacity) {
            history.current = history.current.slice(history.current.length - capacity);
          }
        }

        return newState;
      });
    },
    [state, capacity]
  ) as Dispatch<IHookStateSetAction<S>>;

  const historyState = useMemo(
    () => ({
      history: history.current,
      position: historyPosition.current,
      capacity,
      back: (amount: number = 1) => {
        // don't do anything if we already at the left border
        if (!historyPosition.current) {
          return;
        }

        innerSetState(() => {
          historyPosition.current -= Math.min(amount, historyPosition.current);

          return history.current[historyPosition.current];
        });
      },
      forward: (amount: number = 1) => {
        // don't do anything if we already at the right border
        if (historyPosition.current === history.current.length - 1) {
          return;
        }

        innerSetState(() => {
          historyPosition.current = Math.min(
            historyPosition.current + amount,
            history.current.length - 1
          );

          return history.current[historyPosition.current];
        });
      },
      go: (position: number) => {
        if (position === historyPosition.current) {
          return;
        }

        innerSetState(() => {
          historyPosition.current =
            position < 0
              ? Math.max(history.current.length + position, 0)
              : Math.min(history.current.length - 1, position);

          return history.current[historyPosition.current];
        });
      },
    }),
    [state]
  );

  return [state, setState, historyState];
}

import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

// # `useMediatedState`
// 
// A lot like the standard `useState`, but with mediation process.
// 
// ## Usage
// ```ts
// import * as React from 'react';
// import { useMediatedState } from '../useMediatedState';
// 
// const inputMediator = s => s.replace(/[\s]+/g, ' ');
// const Demo = () => {
//   const [state, setState] = useMediatedState(inputMediator, '');
// 
//   return (
//     <div>
//       <div>You will not be able to enter more than one space</div>
//       <input type="text" min="0" max="10" 
//              value={state}
//              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
//                setState(ev.target.value);
//              }}
//       />
//     </div>
//   );
// };
// ```
// 
// ## Reference
// ```ts
// const [state, setState] = useMediatedState<S=any>(
//   mediator: StateMediator<S>,
//   initialState?: S
// );
// ```
// 
// > Initial state will be set as-is.
// 
// In case mediator expects 2 arguments it will receive the `setState` function as second argument, it is useful for async mediators.  
// >This hook will not cancel previous mediation when new one been invoked, you have to handle it yourself._
// 

export interface StateMediator<S = any> {
  (newState: any): S;

  (newState: any, dispatch: Dispatch<SetStateAction<S>>): void;
}

export type UseMediatedStateReturn<S = any> = [S, Dispatch<SetStateAction<S>>];

export function useMediatedState<S = undefined>(
  mediator: StateMediator<S | undefined>
): UseMediatedStateReturn<S | undefined>;
export function useMediatedState<S = any>(
  mediator: StateMediator<S>,
  initialState: S
): UseMediatedStateReturn<S>;

export function useMediatedState<S = any>(
  mediator: StateMediator<S>,
  initialState?: S
): UseMediatedStateReturn<S> {
  const mediatorFn = useRef(mediator);

  const [state, setMediatedState] = useState<S>(initialState!);
  const setState = useCallback(
    (newState: any) => {
      if (mediatorFn.current.length === 2) {
        mediatorFn.current(newState, setMediatedState);
      } else {
        setMediatedState(mediatorFn.current(newState));
      }
    },
    [state]
  );

  return [state, setState];
}

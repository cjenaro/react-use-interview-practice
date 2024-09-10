import { Reducer, useMemo, useReducer } from 'react';

// # `useMethods`
// 
// React hook that simplifies the `useReducer` implementation.
// 
// ## Usage
// 
// ```jsx
// import { useMethods } from 'react-use';
// 
// const initialState = {
//   count: 0,
// };
// 
// function createMethods(state) {
//   return {
//     reset() {
//       return initialState;
//     },
//     increment() {
//       return { ...state, count: state.count + 1 };
//     },
//     decrement() {
//       return { ...state, count: state.count - 1 };
//     },
//   };
// }
// 
// const Demo = () => {
//   const [state, methods] = useMethods(createMethods, initialState);
// 
//   return (
//     <>
//       <p>Count: {state.count}</p>
//       <button onClick={methods.decrement}>-</button>
//       <button onClick={methods.increment}>+</button>
//     </>
//   );
// };
// ```
// 
// ## Reference
// 
// ```js
// const [state, methods] = useMethods(createMethods, initialState);
// ```
// 
// - `createMethods` &mdash; function that takes current state and return an object containing methods that return updated state.
// - `initialState` &mdash; initial value of the state.
// 

type Action = {
  type: string;
  payload?: any;
};

type CreateMethods<M, T> = (state: T) => {
  [P in keyof M]: (payload?: any) => T;
};

type WrappedMethods<M> = {
  [P in keyof M]: (...payload: any) => void;
};

const useMethods = <M, T>(
  createMethods: CreateMethods<M, T>,
  initialState: T
): [T, WrappedMethods<M>] => {
  const reducer = useMemo<Reducer<T, Action>>(
    () => (reducerState: T, action: Action) => {
      return createMethods(reducerState)[action.type](...action.payload);
    },
    [createMethods]
  );

  const [state, dispatch] = useReducer<Reducer<T, Action>>(reducer, initialState);

  const wrappedMethods: WrappedMethods<M> = useMemo(() => {
    const actionTypes = Object.keys(createMethods(initialState));

    return actionTypes.reduce((acc, type) => {
      acc[type] = (...payload) => dispatch({ type, payload });
      return acc;
    }, {} as WrappedMethods<M>);
  }, [createMethods, initialState]);

  return [state, wrappedMethods];
};

export default useMethods;

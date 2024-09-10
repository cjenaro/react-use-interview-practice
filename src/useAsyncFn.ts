import { DependencyList } from "react";

// # `useAsyncFn`
//
// React hook that returns state and a callback for an `async` function or a
// function that returns a promise. The state is of the same shape as `useAsync`.
//
// ## Usage
//
// ```jsx
// import {useAsyncFn} from 'react-use';
//
// const Demo = ({url}) => {
//   const [state, doFetch] = useAsyncFn(async () => {
//     const response = await fetch(url);
//     const result = await response.text();
//     return result
//   }, [url]);
//
//   return (
//     <div>
//       {state.loading
//         ? <div>Loading...</div>
//         : state.error
//           ? <div>Error: {state.error.message}</div>
//           : <div>Value: {state.value}</div>
//       }
//       <button onClick={() => doFetch()}>Start loading</button>
//     </div>
//   );
// };
// ```
//
// ## Reference
//
// ```ts
// useAsyncFn<Result, Args>(fn, deps?: any[], initialState?: AsyncState<Result>);
// ```
//
import { FunctionReturningPromise, PromiseType } from "./misc/types";

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> =
  AsyncState<PromiseType<ReturnType<T>>>;

export type AsyncFnReturn<
  T extends FunctionReturningPromise = FunctionReturningPromise
> = [StateFromFunctionReturningPromise<T>, T];

export default function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {}

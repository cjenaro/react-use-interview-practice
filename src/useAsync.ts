import { DependencyList, useEffect } from 'react';

// # `useAsync`
// 
// React hook that resolves an `async` function or a function that returns
// a promise;
// 
// ## Usage
// 
// ```jsx
// import {useAsync} from 'react-use';
// 
// const Demo = ({url}) => {
//   const state = useAsync(async () => {
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
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useAsync(fn, args?: any[]);
// ```
// 
import useAsyncFn from './useAsyncFn';
import { FunctionReturningPromise } from './misc/types';

export { AsyncState, AsyncFnReturn } from './useAsyncFn';

export default function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}

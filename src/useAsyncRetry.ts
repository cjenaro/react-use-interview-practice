import { DependencyList, useCallback, useState } from 'react';

// # `useAsyncRetry`
// 
// Uses `useAsync` with an additional `retry` method to easily retry/refresh the async function;
// 
// ## Usage
// 
// ```jsx
// import {useAsyncRetry} from 'react-use';
// 
// const Demo = ({url}) => {
//   const state = useAsyncRetry(async () => {
//     const response = await fetch(url);
//     const result = await response.text();
//     return result;
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
//       {!loading && <button onClick={() => state.retry()}>Start loading</button>}
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useAsyncRetry(fn, args?: any[]);
// ```
// 
import useAsync, { AsyncState } from './useAsync';

export type AsyncStateRetry<T> = AsyncState<T> & {
  retry(): void;
};

const useAsyncRetry = <T>(fn: () => Promise<T>, deps: DependencyList = []) => {
  const [attempt, setAttempt] = useState<number>(0);
  const state = useAsync(fn, [...deps, attempt]);

  const stateLoading = state.loading;
  const retry = useCallback(() => {
    if (stateLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'You are calling useAsyncRetry hook retry() method while loading in progress, this is a no-op.'
        );
      }

      return;
    }

    setAttempt((currentAttempt) => currentAttempt + 1);
  }, [...deps, stateLoading]);

  return { ...state, retry };
};

export default useAsyncRetry;

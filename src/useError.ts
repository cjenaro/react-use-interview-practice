import { useCallback, useEffect, useState } from 'react';

// # `useError`
// 
// React side-effect hook that returns an error dispatcher.
// 
// ## Usage
// 
// ```jsx
// import { useError } from 'react-use';
// 
// const Demo = () => {
//   const dispatchError = useError();
// 
//   const clickHandler = () => {
//     dispatchError(new Error('Some error!'));
//   };
// 
//   return <button onClick={clickHandler}>Click me to throw</button>;
// };
// 
// // In parent app
// const App = () => (
//   <ErrorBoundary>
//     <Demo />
//   </ErrorBoundary>
// );
// ```
// 
// ## Reference
// 
// ```js
// const dispatchError = useError();
// ```
// 
// - `dispatchError` &mdash; Callback of type `(err: Error) => void`
// 

const useError = (): ((err: Error) => void) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const dispatchError = useCallback((err: Error) => {
    setError(err);
  }, []);

  return dispatchError;
};

export default useError;

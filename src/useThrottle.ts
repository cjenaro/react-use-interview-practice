import { useEffect, useRef, useState } from 'react';

// # `useThrottle` and `useThrottleFn`
// 
// React hooks that throttle.
// 
// ## Usage
// 
// ```jsx
// import React, { useState } from 'react';
// import { useThrottle, useThrottleFn } from 'react-use';
// 
// const Demo = ({value}) => {
//   const throttledValue = useThrottle(value);
//   // const throttledValue = useThrottleFn(value => value, 200, [value]);
// 
//   return (
//     <>
//       <div>Value: {value}</div>
//       <div>Throttled value: {throttledValue}</div>
//     </>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useThrottle(value, ms?: number);
// useThrottleFn(fn, ms, args);
// ```
// 
import useUnmount from './useUnmount';

const useThrottle = <T>(value: T, ms: number = 200) => {
  const [state, setState] = useState<T>(value);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextValue = useRef(null) as any;
  const hasNextValue = useRef(0) as any;

  useEffect(() => {
    if (!timeout.current) {
      setState(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setState(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextValue.current = value;
      hasNextValue.current = true;
    }
  }, [value]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
};

export default useThrottle;

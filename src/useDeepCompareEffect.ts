import { DependencyList, EffectCallback } from "react";

// # `useDeepCompareEffect`
// 
// A modified useEffect hook that is using deep comparison on its dependencies instead of reference equality.
// 
// ## Usage
// 
// ```jsx
// import {useCounter, useDeepCompareEffect} from 'react-use';
// 
// const Demo = () => {
//   const [count, {inc: inc}] = useCounter(0);
//   const options = { step: 2 };
// 
//   useDeepCompareEffect(() => {
//     inc(options.step)
//   }, [options]);
// 
//   return (
//     <div>
//       <p>useDeepCompareEffect: {count}</p>
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useDeepCompareEffect(effect: () => void | (() => void | undefined), deps: any[]);
// ```
// 
import useCustomCompareEffect from "./useCustomCompareEffect";
import { isDeepEqual } from "./misc/isDeepEqual";

const isPrimitive = (val: any) => val !== Object(val);

const useDeepCompareEffect = (effect: EffectCallback, deps: DependencyList) => {
  if (process.env.NODE_ENV !== "production") {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn(
        "`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead."
      );
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        "`useDeepCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
      );
    }
  }

  useCustomCompareEffect(effect, deps, isDeepEqual);
};

export default useDeepCompareEffect;

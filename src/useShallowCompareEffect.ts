import { DependencyList, EffectCallback } from "react";

// # `useShallowCompareEffect`
//
// A modified useEffect hook that is using shallow comparison on each of its dependencies instead of reference equality.
//
// ## Usage
//
// ```jsx
// import {useCounter, useShallowCompareEffect} from 'react-use';
//
// const Demo = () => {
//   const [count, {inc: inc}] = useCounter(0);
//   const options = { step: 2 };
//
//   useShallowCompareEffect(() => {
//     inc(options.step)
//   }, [options]);
//
//   return (
//     <div>
//       <p>useShallowCompareEffect: {count}</p>
//     </div>
//   );
// };
// ```
//
// ## Reference
//
// ```ts
// useShallowCompareEffect(effect: () => void | (() => void | undefined), deps: any[]);
// ```
//
import useCustomCompareEffect from "./useCustomCompareEffect";

// implemetn a shallow equal function
function isShallowEqual(a: any, b: any) {
  // handle primitives
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!b[key] || a[key] !== b[key]) return false;
  }

  return true;
}

const isPrimitive = (val: any) => val !== Object(val);
const shallowEqualDepsList = (
  prevDeps: DependencyList,
  nextDeps: DependencyList
) => prevDeps.every((dep, index) => isShallowEqual(dep, nextDeps[index]));

const useShallowCompareEffect = (
  effect: EffectCallback,
  deps: DependencyList
) => {
  if (process.env.NODE_ENV !== "production") {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn(
        "`useShallowCompareEffect` should not be used with no dependencies. Use React.useEffect instead."
      );
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        "`useShallowCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
      );
    }
  }

  useCustomCompareEffect(effect, deps, shallowEqualDepsList);
};

export default useShallowCompareEffect;

import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// # `useCustomCompareEffect`
// 
// A modified useEffect hook that accepts a comparator which is used for comparison on dependencies instead of reference equality.
// 
// ## Usage
// 
// ```jsx
// import {useCounter, useCustomCompareEffect} from 'react-use';
// import isEqual from 'lodash/isEqual';
// 
// const Demo = () => {
//   const [count, {inc: inc}] = useCounter(0);
//   const options = { step: 2 };
// 
//   useCustomCompareEffect(() => {
//     inc(options.step)
//   }, [options], (prevDeps, nextDeps) => isEqual(prevDeps, nextDeps));
// 
//   return (
//     <div>
//       <p>useCustomCompareEffect with deep comparison: {count}</p>
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useCustomCompareEffect(effect: () => void | (() => void | undefined), deps: any[], depsEqual: (prevDeps: any[], nextDeps: any[]) => boolean);
// ```
// 

const isPrimitive = (val: any) => val !== Object(val);

type DepsEqualFnType<TDeps extends DependencyList> = (prevDeps: TDeps, nextDeps: TDeps) => boolean;

const useCustomCompareEffect = <TDeps extends DependencyList>(
  effect: EffectCallback,
  deps: TDeps,
  depsEqual: DepsEqualFnType<TDeps>
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn(
        '`useCustomCompareEffect` should not be used with no dependencies. Use React.useEffect instead.'
      );
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        '`useCustomCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.'
      );
    }

    if (typeof depsEqual !== 'function') {
      console.warn(
        '`useCustomCompareEffect` should be used with depsEqual callback for comparing deps list'
      );
    }
  }

  const ref = useRef<TDeps | undefined>(undefined);

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
};

export default useCustomCompareEffect;

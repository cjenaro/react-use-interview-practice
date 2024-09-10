import { DependencyList, EffectCallback } from "react";

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

type DepsEqualFnType<TDeps extends DependencyList> = (
  prevDeps: TDeps,
  nextDeps: TDeps
) => boolean;

const useCustomCompareEffect = <TDeps extends DependencyList>(
  effect: EffectCallback,
  deps: TDeps,
  depsEqual: DepsEqualFnType<TDeps>
) => {};

export default useCustomCompareEffect;

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
function isShallowEqual(a: any, b: any) {}

const useShallowCompareEffect = (
  effect: EffectCallback,
  deps: DependencyList
) => {};

export default useShallowCompareEffect;

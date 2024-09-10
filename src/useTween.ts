import { easing } from 'ts-easing';

// # `useTween`
// 
// React animation hook that tweens a number between 0 and 1.
// 
// 
// ## Usage
// 
// ```jsx
// import {useTween} from 'react-use';
// 
// const Demo = () => {
//   const t = useTween();
// 
//   return (
//     <div>
//       Tween: {t}
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useTween(easing?: string, ms?: number, delay?: number): number
// ```
// 
// Returns a number that begins with 0 and ends with 1 when animation ends.
// 
// - `easing` &mdash; one of the valid [easing names](https://github.com/streamich/ts-easing/blob/master/src/index.ts), defaults to `inCirc`.
// - `ms` &mdash; milliseconds for how long to keep re-rendering component, defaults to `200`.
// - `delay` &mdash; delay in milliseconds after which to start re-rendering component, defaults to `0`.
// 
import useRaf from './useRaf';

export type Easing = (t: number) => number;

const useTween = (easingName: string = 'inCirc', ms: number = 200, delay: number = 0): number => {
  const fn: Easing = easing[easingName];
  const t = useRaf(ms, delay);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof fn !== 'function') {
      console.error(
        'useTween() expected "easingName" property to be a valid easing function name, like:' +
          '"' +
          Object.keys(easing).join('", "') +
          '".'
      );
      console.trace();
      return 0;
    }
  }

  return fn(t);
};

export default useTween;

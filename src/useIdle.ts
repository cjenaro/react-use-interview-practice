// # `useIdle`
//
// React sensor hook that tracks if user on the page is idle.
//
//
// ## Usage
//
// ```jsx
// import {useIdle} from 'react-use';
//
// const Demo = () => {
//   const isIdle = useIdle(3e3);
//
//   return (
//     <div>
//       <div>User is idle: {isIdle ? 'Yes 😴' : 'Nope'}</div>
//     </div>
//   );
// };
// ```
//
//
// ## Reference
//
// ```js
// useIdle(ms, initialState);
// ```
//
// - `ms` &mdash; time in milliseconds after which to consider use idle, defaults to `60e3` &mdash; one minute.
// - `initialState` &mdash; whether to consider user initially idle, defaults to false.
//

const defaultEvents = [
  "mousemove",
  "mousedown",
  "resize",
  "keydown",
  "touchstart",
  "wheel",
];
const oneMinute = 60e3;

const useIdle = (
  ms: number = oneMinute,
  initialState: boolean = false,
  events: string[] = defaultEvents
): boolean => {};

export default useIdle;

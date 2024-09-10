import { useEffect, useState } from "react";

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
import { off, on } from "./misc/util";
import { throttle } from "./misc/throttle";

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
): boolean => {
  const [state, setState] = useState<boolean>(initialState);

  useEffect(() => {
    let mounted = true;
    let timeout: any;
    let localState: boolean = state;
    const set = (newState: boolean) => {
      if (mounted) {
        localState = newState;
        setState(newState);
      }
    };

    const onEvent = throttle(50, () => {
      if (localState) {
        set(false);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => set(true), ms);
    });
    const onVisibility = () => {
      if (!document.hidden) {
        onEvent();
      }
    };

    for (let i = 0; i < events.length; i++) {
      on(window, events[i], onEvent);
    }
    on(document, "visibilitychange", onVisibility);

    timeout = setTimeout(() => set(true), ms);

    return () => {
      mounted = false;

      for (let i = 0; i < events.length; i++) {
        off(window, events[i], onEvent);
      }
      off(document, "visibilitychange", onVisibility);
    };
  }, [ms, events]);

  return state;
};

export default useIdle;

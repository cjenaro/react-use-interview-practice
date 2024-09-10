import { RefObject, useEffect, useRef } from 'react';

// # `useClickAway`
// 
// React UI hook that triggers a callback when user
// clicks outside the target element.
// 
// 
// ## Usage
// 
// ```jsx
// import {useClickAway} from 'react-use';
// 
// const Demo = () => {
//   const ref = useRef(null);
//   useClickAway(ref, () => {
//     console.log('OUTSIDE CLICKED');
//   });
// 
//   return (
//     <div ref={ref} style={{
//       width: 200,
//       height: 200,
//       background: 'red',
//     }} />
//   );
// };
// ```
// 
// ## Reference
// 
// ```js
// useClickAway(ref, onMouseEvent)
// useClickAway(ref, onMouseEvent, ['click'])
// useClickAway(ref, onMouseEvent, ['mousedown', 'touchstart'])
// ```
// 
import { off, on } from './misc/util';

const defaultEvents = ['mousedown', 'touchstart'];

const useClickAway = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents
) => {
  const savedCallback = useRef(onClickAway);
  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);
  useEffect(() => {
    const handler = (event) => {
      const { current: el } = ref;
      el && !el.contains(event.target) && savedCallback.current(event);
    };
    for (const eventName of events) {
      on(document, eventName, handler);
    }
    return () => {
      for (const eventName of events) {
        off(document, eventName, handler);
      }
    };
  }, [events, ref]);
};

export default useClickAway;

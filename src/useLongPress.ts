import { useCallback, useRef } from 'react';

// # `useLongPress`
// 
// React sensor hook that fires a callback after long pressing.
// 
// ## Usage
// 
// ```jsx
// import { useLongPress } from 'react-use';
// 
// const Demo = () => {
//   const onLongPress = () => {
//     console.log('calls callback after long pressing 300ms');
//   };
// 
//   const defaultOptions = {
//     isPreventDefault: true,
//     delay: 300,
//   };
//   const longPressEvent = useLongPress(onLongPress, defaultOptions);
// 
//   return <button {...longPressEvent}>useLongPress</button>;
// };
// ```
// 
// ## Reference
// 
// ```ts
// const {
//   onMouseDown,
//   onTouchStart,
//   onMouseUp,
//   onMouseLeave,
//   onTouchEnd
// } = useLongPress(
//   callback: (e: TouchEvent | MouseEvent) => void,
//   options?: {
//     isPreventDefault?: true,
//     delay?: 300
//   }
// )
// ```
// 
// - `callback` &mdash; callback function.
// - `options?` &mdash; optional parameter.
//   - `isPreventDefault?` &mdash; whether to call `event.preventDefault()` of `touchend` event, for preventing ghost click on mobile devices in some cases, defaults to `true`.
//   - `delay?` &mdash; delay in milliseconds after which to calls provided callback, defaults to `300`.
// 
import { off, on } from './misc/util';

interface Options {
  isPreventDefault?: boolean;
  delay?: number;
}

const isTouchEvent = (ev: Event): ev is TouchEvent => {
  return 'touches' in ev;
};

const preventDefault = (ev: Event) => {
  if (!isTouchEvent(ev)) return;

  if (ev.touches.length < 2 && ev.preventDefault) {
    ev.preventDefault();
  }
};

const useLongPress = (
  callback: (e: TouchEvent | MouseEvent) => void,
  { isPreventDefault = true, delay = 300 }: Options = {}
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: TouchEvent | MouseEvent) => {
      // prevent ghost click on mobile devices
      if (isPreventDefault && event.target) {
        on(event.target, 'touchend', preventDefault, { passive: false });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => callback(event), delay);
    },
    [callback, delay, isPreventDefault]
  );

  const clear = useCallback(() => {
    // clearTimeout and removeEventListener
    timeout.current && clearTimeout(timeout.current);

    if (isPreventDefault && target.current) {
      off(target.current, 'touchend', preventDefault);
    }
  }, [isPreventDefault]);

  return {
    onMouseDown: (e: any) => start(e),
    onTouchStart: (e: any) => start(e),
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  } as const;
};

export default useLongPress;

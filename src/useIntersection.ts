import { RefObject, useEffect, useState } from 'react';

// # `useIntersection`
// 
// React sensor hook that tracks the changes in the intersection of a target element with an ancestor element or with a top-level document's viewport. Uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and returns a [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).
// 
// ## Usage
// 
// ```jsx
// import * as React from 'react';
// import { useIntersection } from 'react-use';
// 
// const Demo = () => {
//   const intersectionRef = React.useRef(null);
//   const intersection = useIntersection(intersectionRef, {
//     root: null,
//     rootMargin: '0px',
//     threshold: 1
//   });
// 
//   return (
//     <div ref={intersectionRef}>
//       {intersection && intersection.intersectionRatio < 1
//         ? 'Obscured'
//         : 'Fully in view'}
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useIntersection(
//   ref: RefObject<HTMLElement>,
//   options: IntersectionObserverInit,
// ): IntersectionObserverEntry | null;
// ```
// 

const useIntersection = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit
): IntersectionObserverEntry | null => {
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0]);
      };

      const observer = new IntersectionObserver(handler, options);
      observer.observe(ref.current);

      return () => {
        setIntersectionObserverEntry(null);
        observer.disconnect();
      };
    }
    return () => {};
  }, [ref.current, options.threshold, options.root, options.rootMargin]);

  return intersectionObserverEntry;
};

export default useIntersection;

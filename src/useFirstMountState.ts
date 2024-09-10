import { useRef } from 'react';

// # `useFirstMountState`
// 
// Returns `true` if component is just mounted (on first render) and `false` otherwise.
// 
// ## Usage
// 
// ```typescript jsx
// import * as React from 'react';
// import { useFirstMountState } from 'react-use';
// 
// const Demo = () => {
//   const isFirstMount = useFirstMountState();
//   const update = useUpdate();
// 
//   return (
//     <div>
//       <span>This component is just mounted: {isFirstMount ? 'YES' : 'NO'}</span>
//       <br />
//       <button onClick={update}>re-render</button>
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```typescript
// const isFirstMount: boolean = useFirstMountState();
// ```
// 

export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

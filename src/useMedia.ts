import { useEffect, useState } from 'react';

// # `useMedia`
// 
// React sensor hook that tracks state of a CSS media query.
// 
// ## Usage
// 
// ```jsx
// import {useMedia} from 'react-use';
// 
// const Demo = () => {
//   const isWide = useMedia('(min-width: 480px)');
// 
//   return (
//     <div>
//       Screen is wide: {isWide ? 'Yes' : 'No'}
//     </div>
//   );
// };
// ```
// 
// ## Reference
// 
// ```ts
// useMedia(query: string, defaultState: boolean = false): boolean;
// ```
// 
// The `defaultState` parameter is only used as a fallback for server side rendering.
// 
// When server side rendering, it is important to set this parameter because without it the server's initial state will fallback to false, but the client will initialize to the result of the media query. When React hydrates the server render, it may not match the client's state. See the [React docs](https://reactjs.org/docs/react-dom.html#hydrate) for more on why this is can lead to costly bugs 🐛.
// 
import { isBrowser } from './misc/util';

const getInitialState = (query: string, defaultState?: boolean) => {
  // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
  if (defaultState !== undefined) {
    return defaultState;
  }

  if (isBrowser) {
    return window.matchMedia(query).matches;
  }

  // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.'
    );
  }

  return false;
};

const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState(getInitialState(query, defaultState));

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addEventListener('change', onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeEventListener('change', onChange);
    };
  }, [query]);

  return state;
};

export default useMedia;

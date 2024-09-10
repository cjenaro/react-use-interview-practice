import useList, { ListActions } from './useList';

// # `useUpsert`
// 
// > DEPRECATED!  
// > Use `useList` hook's upsert action instead
// 
// Superset of [`useList`](./useList.md). Provides an additional method to upsert (update or insert) an element into the list.
// 
// ## Usage
// 
// ```jsx
// import {useUpsert} from 'react-use';
// 
// const Demo = () => {
//   const comparisonFunction = (a: DemoType, b: DemoType) => {
//     return a.id === b.id;
//   };
//   const [list, { set, upsert, remove }] = useUpsert(comparisonFunction, initialItems);
// 
//   return (
//     <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
//       {list.map((item: DemoType, index: number) => (
//         <div key={item.id}>
//           <input value={item.text} onChange={e => upsert({ ...item, text: e.target.value })} />
//           <button onClick={() => remove(index)}>Remove</button>
//         </div>
//       ))}
//       <button onClick={() => upsert({ id: (list.length + 1).toString(), text: '' })}>Add item</button>
//       <button onClick={() => set([])}>Reset</button>
//     </div>
//   );
// };
// ```
// 
// ## Related hooks
// 
// - [useList](./useList.md)
// 
import { IHookStateInitAction } from './misc/hookState';

export interface UpsertListActions<T> extends Omit<ListActions<T>, 'upsert'> {
  upsert: (newItem: T) => void;
}

/**
 * @deprecated Use `useList` hook's upsert action instead
 */
export default function useUpsert<T>(
  predicate: (a: T, b: T) => boolean,
  initialList: IHookStateInitAction<T[]> = []
): [T[], UpsertListActions<T>] {
  const [list, listActions] = useList(initialList);

  return [
    list,
    {
      ...listActions,
      upsert: (newItem: T) => {
        listActions.upsert(predicate, newItem);
      },
    } as UpsertListActions<T>,
  ];
}

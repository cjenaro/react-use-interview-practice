type Primitive = undefined | null | boolean | number | string | symbol | bigint;
type ComplexObject =
  | object
  | Function
  | Date
  | RegExp
  | Map<any, any>
  | Set<any>
  | Array<any>;

type EqArg = Primitive | ComplexObject;

export function deepEqual(a: EqArg, b: EqArg, visited = new Set()) {
  // Handle primitive values and functions (also handles null/undefined)
  if (a === b) return true;

  // Handle NaN equality (since NaN !== NaN)
  // eslint-disable-next-line no-self-compare
  if (a !== a && b !== b) return true;

  // If a or b is not an object or is null, return false
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false;

  // Handle circular references
  if (visited.has(a) || visited.has(b)) return false;
  visited.add(a);
  visited.add(b);

  // Compare prototype chain
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  // Get object keys and compare their lengths
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // Compare keys and values recursively
  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key], visited))
      return false;
  }

  // Clean up the visited set
  visited.delete(a);
  visited.delete(b);

  return true;
}

import { useEffect } from "react";

export default function useUnmount(unmountFn: () => void) {
  useEffect(() => unmountFn, []);
}

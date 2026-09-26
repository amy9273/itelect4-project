import { useState } from "react";

// Safe, Concurrent-mode and React 19 compliant previous value tracker
function usePrevious<T>(value: T): T | undefined {
    const [tuple, setTuple] = useState<[T, T | undefined]>([value, undefined]);

    if (tuple[0] !== value) {
        setTuple([value, tuple[0]]);
        return tuple[0];
    }

    return tuple[1];
}

export default usePrevious;
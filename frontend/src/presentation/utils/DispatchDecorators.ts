import { Dispatch } from "react";
import { isDeepStrictEqual } from "util";

export function distinctUntilChanged<T>(dispatch: Dispatch<T>): Dispatch<T> {
    var lastValue: T | undefined = undefined
    var hasEmitted = false
    return (value: T) => {
        if (!hasEmitted || !isDeepStrictEqual(lastValue, value)) {
            dispatch(value)
        }
        hasEmitted = true
    }
}
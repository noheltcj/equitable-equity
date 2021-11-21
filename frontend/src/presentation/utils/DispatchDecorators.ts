import { Dispatch } from "react";
import { isDeepStrictEqual, isError } from "util";

export function distinctUntilChanged<T>(dispatch: Dispatch<T>): Dispatch<T> { 
    var lastValue: T | undefined = undefined
    var hasEmitted = false

    return (value: T) => {
        if (!hasEmitted) {
            hasEmitted = true
            dispatch(value)
        } else if (value instanceof Error || lastValue instanceof Error) {
            dispatch(value)
        } else if (!isDeepStrictEqual(lastValue, value)) {
            dispatch(value)
        }

        lastValue = value
    }
}
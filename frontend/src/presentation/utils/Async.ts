/** 
 * Useful for representing asynchronous operations and possible results in application state. 
 */

export type AsyncState = 'uninitialized' | 'loading' | 'success' | 'failure'

function constructInternal<T, E>(
    result: T | E | undefined = undefined,
    state: AsyncState
): Async<T, E> {
    var data = undefined
    var error = undefined
    
    switch (state) {
        case 'uninitialized':
        case 'loading':
            break
        case 'success':
            data = result as T
            break
        case 'failure':
            error = result as E
            break
    }

    return {
        data: data,
        error: error,
        state: state,
        fold<R>({
            onUninitialized = undefined,
            onLoading = undefined,
            onSuccess = undefined,
            onFailure = undefined,
        }: SyncFoldCallbacks<T, E, R>): R | undefined {
            switch (this.state) {
                case 'uninitialized':
                    if (onUninitialized !== undefined) {
                        return onUninitialized()
                    }
                    break
                case 'loading':
                    if (onLoading !== undefined) {
                        return onLoading()
                    }
                    break
                case 'success':
                    if (onSuccess !== undefined) {
                        return onSuccess(this.data!)
                    }
                    break
                case 'failure':
                    if (this.error !== undefined && onFailure !== undefined) {
                        return onFailure(this.error)
                    } else {
                        throw Error("Invalid state; error should not be undefined")
                    }
            }
        },
        successOrUndefined(): T | undefined {
            return this.fold(
                { onSuccess: (data: T) => data }
            )
        },
        requireSuccess(): T {
            const data = this.successOrUndefined()
            if (data !== undefined) {
                return data
            } else {
                throw Error("Async expected to be in 'success' state, but was not")
            }
        }
    }
}

export function success<T, E>(data: T): Async<T, E> {
    return constructInternal<T, E>(data, 'success')
}

export function failure<T, E>(error: E): Async<T, E> {
    return constructInternal<T, E>(error, 'failure')
}

export function loading<T, E>(): Async<T, E> {
    return constructInternal<T, E>(undefined, 'loading')
}

export function uninitialized<T, E>(): Async<T, E> {
    return constructInternal<T, E>(undefined, 'uninitialized')
}

export interface Async<T, E> { 
    readonly data: T | undefined
    readonly error: E | undefined
    
    readonly state: AsyncState

    fold<R>(callbacks: SyncFoldCallbacks<T, E, R>): R | undefined
    successOrUndefined(): T | undefined
    requireSuccess(): T
}

export interface SyncFoldCallbacks<T, E, R> {
    onUninitialized?: (() => R) | undefined,
    onLoading?: (() => R) | undefined,
    onSuccess?: ((data: T) => R) | undefined,
    onFailure?: ((error: E) => R) | undefined,
}
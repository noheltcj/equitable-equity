/** 
 * Useful for representing asynchronous operations and possible results in application state. 
 */

export type AsyncState = 'uninitialized' | 'loading' | 'success' | 'failure'

export class Async<T, E> { 
    data: T | undefined
    error: E | undefined
    
    state: AsyncState

    private constructor(
        result: T | E | undefined = undefined,
        state: AsyncState
    ) {
        this.data = undefined
        this.error = undefined
        this.state = state
        
        switch (this.state) {
            case 'uninitialized':
            case 'loading':
                break
            case 'success':
                this.data = result as T
                break
            case 'failure':
                this.error = result as E
                break
        }
    }

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
    }

    successOrUndefined(): T | undefined {
        return this.fold(
            { onSuccess: (data: T) => data }
        )
    }

    requireSuccess(): T {
        const data = this.successOrUndefined()
        if (data != undefined) {
            return data
        } else {
            throw Error("Async expected to be in 'success' state, but was " + this.state)
        }
    }

    static success<T, E>(data: T): Async<T, E> {
        return new Async<T, E>(data, 'success')
    }

    static failure<T, E>(error: E): Async<T, E> {
        return new Async<T, E>(error, 'failure')
    }

    static loading<T, E>(): Async<T, E> {
        return new Async<T, E>(undefined, 'loading')
    }

    static uninitialized<T, E>(): Async<T, E> {
        return new Async<T, E>(undefined, 'uninitialized')
    }
}

export interface SyncFoldCallbacks<T, E, R> {
    onUninitialized?: (() => R) | undefined,
    onLoading?: (() => R) | undefined,
    onSuccess?: ((data: T) => R) | undefined,
    onFailure?: ((error: E) => R) | undefined,
}
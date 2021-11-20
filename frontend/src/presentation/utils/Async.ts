import { AsyncLocalStorage } from "async_hooks"
import { error } from "console"

/** 
 * Useful for representing asynchronous operations and possible results in application state. 
 */

type AsyncState = 'uninitialized' | 'loading' | 'success' | 'failure'

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

    fold<R>(
        onUninitialized: () => R,
        onLoading: () => R,
        onSuccess: (data: T) => R,
        onFailure: (error: E) => R,
    ): R {
        switch (this.state) {
            case 'uninitialized':
                return onUninitialized()
            case 'loading':
                return onLoading()
            case 'success':
                return onSuccess(this.data!)
            case 'failure':
                if (this.error != undefined) {
                    return onFailure(this.error)
                } else {
                    throw error("Invalid state; error should not be undefined")
                }
        }
    }

    successOrUndefined(): T | undefined {
        return this.fold(
            () => undefined,
            () => undefined,
            (data: T) => data,
            () => undefined
        )
    }

    requireSuccess(): T {
        const data = this.successOrUndefined()
        if (data != undefined) {
            return data
        } else {
            throw error("Async expected to be in 'success' state, but was", this.state)
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

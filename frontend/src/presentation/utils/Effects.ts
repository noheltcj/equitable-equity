import { Component, Context, Dispatch, EffectCallback, Reducer, ReducerState, useEffect } from "react";

export function useEffectOnce<Event, Effect extends SimpleEffect<Event>>(dispatch: Dispatch<Event>, effect: Effect) {
    useEffect(effect(dispatch), [])
}

export type Initializer<State> = (state: State) => State
export type SimpleEffect<Event> = (dispatch: Dispatch<Event>) => EffectCallback
export type MonoEffect<Event, D1> = (dependency: D1) => SimpleEffect<Event>
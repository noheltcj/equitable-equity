import { Component, Dispatch, EffectCallback, Reducer, ReducerState, useEffect } from "react";

export function useEffectOnce<Effect extends SimpleEffect<any>>(component: Component, effect: Effect) {
    useEffect(effect(component.context.dispatch), [])
}

export type Initializer<State, Event> = (dispatch: Dispatch<Event>) => ReducerState<Reducer<State, Event>>
export type SimpleEffect<Event> = (dispatch: Dispatch<Event>) => EffectCallback
export type MonoEffect<Event, D1> = (dependency: D1) => SimpleEffect<Event>
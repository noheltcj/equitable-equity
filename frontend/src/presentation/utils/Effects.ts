import { Dispatch, EffectCallback, Reducer, ReducerState } from "react";

export type EffectDispatchingInitializer<State, Event> = (dispatch: Dispatch<Event>) => ReducerState<Reducer<State, Event>>

export type EffectDispatchingStateReducer<State, Event> = (dispatch: Dispatch<Event>) => Reducer<State, Event>

export type MonoEffect<Event, D1> = (dependency: D1) => (dispatch: Dispatch<Event>) => EffectCallback
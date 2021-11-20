import { Dispatch, EffectCallback } from "react"
import { AnyAppEvent, AppState, OnEthereumNetworkChangedEffectResult, OnEthereumProviderEffectResult } from "../App"

import detectEthereumProvider from "@metamask/detect-provider";
import { Async } from "./utils/Async";
import { MonoEffect } from "./utils/Effects";

export default class AppEffectsService {
    fetchEthereumProvider = (dispatch: Dispatch<OnEthereumProviderEffectResult>) => {
        // This function detects most providers injected at window.ethereum
        detectEthereumProvider({
            mustBeMetaMask: false, 
            silent: false,
            timeout: 3000
        }).then((result) => {
            console.log("window.ethereum:", result)
            dispatch({ 
                type: 'on_ethereum_provider_effect_result',
                payload: Async.success(result) 
            }) 
        }).catch((error) => {
            console.log("window.ethereum (failed):", error)
            dispatch({ 
                type: 'on_ethereum_provider_effect_result',
                payload: Async.failure(error) 
            })
        })
    
        return () => {
            /** Do cleanup of this. */
            dispatch({ 
                type: 'on_ethereum_provider_effect_result',
                payload: Async.uninitialized()
            })
        }
    }
    
    observeNetworkChanges: MonoEffect<OnEthereumNetworkChangedEffectResult, unknown> = (ethereum) => (dispatch) => {
        return () => {
            dispatch({
                type: 'on_ethereum_network_changed_effect_result',
                payload: Async.uninitialized()
            })
        }
    }
}
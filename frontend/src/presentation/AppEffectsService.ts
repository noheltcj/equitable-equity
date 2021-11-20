import { AnyAppEvent, AppState, OnEthereumNetworkChangedEffectResult, OnEthereumProviderEffectResult, OnUserAddressChangedEffectResult } from "../App"
import { Async } from "./utils/Async";
import { MonoEffect, SimpleEffect } from "./utils/Effects";

import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { Dispatch } from "react";

export default class AppEffectsService {
    fetchEthereumProvider: SimpleEffect<OnEthereumProviderEffectResult> = (dispatch) => {
        dispatch({
            type: 'on_ethereum_provider_fetch_effect_result',
            payload: Async.loading()
        })

        // This function detects most providers injected at window.ethereum
        detectEthereumProvider({
            mustBeMetaMask: false, 
            silent: false,
            timeout: 3000
        }).then((result) => {
            dispatch({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: Async.success(result) 
            }) 
        }).catch((error) => {
            dispatch({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: Async.failure(error) 
            })
        })
    
        return () => {
            /** Do cleanup of this. */
            dispatch({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: Async.uninitialized()
            })
        }
    }
    
    observeNetworkChanges: MonoEffect<OnEthereumNetworkChangedEffectResult, AppState> = (state) => (dispatch) => {
        state.ethereum.fold({
            onSuccess: (ethereumProvider: unknown) => {
                dispatch({
                    type: 'on_ethereum_network_changed_effect_result',
                    payload: Async.loading()
                })
            }
        })

        return () => {
            dispatch({
                type: 'on_ethereum_network_changed_effect_result',
                payload: Async.uninitialized()
            })
        }
    }

    observeUserAddressChanges: MonoEffect<OnUserAddressChangedEffectResult, AppState> = (state) => (dispatch) => {
        state.ethereum.fold({
            onSuccess: (ethereumProvider: unknown) => {
                dispatch({
                    type: 'on_user_address_changed_effect_result',
                    payload: Async.loading()
                })
            }
        })

    //     const web3 = ethers.providers.
    //     const accounts = ethereum.invoke(request({ method: "eth_requestAccounts" });
      
    //   if (currentAccount) {
    //     return;
    //   }

    //   console.log("We have the ethereum object", ethereum);

    //   if (accounts.length !== 0 && !currentAccount) {
    //     console.log("Authorized account:", accounts[0]);
    //     setCurrentAccount(accounts[0]);
    //   }

        return () => {
            dispatch({
                type: 'on_user_address_changed_effect_result',
                payload: Async.uninitialized()
            })
        }
    }

    private dispatchSafe<Data>(dispatch: Dispatch<Data>, oldData: Data, newData: Data) {
        if (oldData != newData) {
            dispatch(newData)
        }
    }
}
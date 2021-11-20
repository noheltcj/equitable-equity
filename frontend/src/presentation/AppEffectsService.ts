import { AppState, OnEthereumNetworkChangedEffectResult, OnEthereumProviderEffectResult, OnUserAddressChangedEffectResult } from "../App"
import { failure, loading, success, uninitialized } from "./utils/Async";
import { MonoEffect, SimpleEffect } from "./utils/Effects";

import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { Dispatch } from "react";
import { distinctUntilChanged } from "./utils/DispatchDecorators";

export default class AppEffectsService {
    fetchEthereumProvider: SimpleEffect<OnEthereumProviderEffectResult> = (dispatch) => {
        const dispatchOnlyNewStates = distinctUntilChanged(dispatch)

        dispatchOnlyNewStates({
            type: 'on_ethereum_provider_fetch_effect_result',
            payload: loading()
        })

        // This function detects most providers injected at window.ethereum
        detectEthereumProvider({
            mustBeMetaMask: false, 
            silent: false,
            timeout: 3000
        }).then((result) => {
            dispatchOnlyNewStates({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: success(result) 
            }) 
        }).catch((error) => {
            dispatchOnlyNewStates({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: failure(error) 
            })
        })
    
        return () => {
            /** Do cleanup of this. */
            dispatchOnlyNewStates({ 
                type: 'on_ethereum_provider_fetch_effect_result',
                payload: uninitialized()
            })
        }
    }
    
    observeNetworkChanges: MonoEffect<OnEthereumNetworkChangedEffectResult, AppState> = (state) => (dispatch) => {
        const dispatchOnlyNewStates = distinctUntilChanged(dispatch)

        state.ethereum.fold({
            onSuccess: (ethereumProvider: unknown) => {
                dispatchOnlyNewStates({
                    type: 'on_ethereum_network_changed_effect_result',
                    payload: loading()
                })
            }
        })

        return () => {
            dispatchOnlyNewStates({
                type: 'on_ethereum_network_changed_effect_result',
                payload: uninitialized()
            })
        }
    }

    observeUserAddressChanges: MonoEffect<OnUserAddressChangedEffectResult, AppState> = (state) => (dispatch) => {
        const dispatchOnlyNewStates = distinctUntilChanged(dispatch)

        state.ethereum.fold({
            onSuccess: (ethereumProvider: unknown) => {
                dispatchOnlyNewStates({
                    type: 'on_user_address_changed_effect_result',
                    payload: loading()
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
            dispatchOnlyNewStates({
                type: 'on_user_address_changed_effect_result',
                payload: uninitialized()
            })
        }
    }
}
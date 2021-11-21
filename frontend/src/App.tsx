import React, { Reducer, useEffect, useReducer } from 'react'
import { Async } from './presentation/utils/Async'
import './App.css'
import { Address } from './model/Address'
import AppEffectsService from './presentation/AppEffectsService'
import { Initializer } from './presentation/utils/Effects'

export default function App() {
  const effectsService = new AppEffectsService()

  //   if (provider) {
  //     // From now on, this should always be true:
  //     // provider === window.ethereum
  //     this.setState((state) => {
  //       return state.
  //     })   
  //    } else {
  //     console.log('Please install MetaMask!');
  //     alert("This page requires that metamask be installed");
  //   }

  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       strConnectMetaMaskButton = "MetaMask is not installed"
  //       console.log("MetaMask is not installed");
  //       return;
  //     }

  //     const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
  //     if (currentAccount) {
  //       return;
  //     }

  //     console.log("We have the ethereum object", ethereum);

  //     if (accounts.length !== 0 && !currentAccount) {
  //       console.log("Authorized account:", accounts[0]);
  //       setCurrentAccount(accounts[0]);
  //     }
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  //   return () => {

  //   }  
  // };

  const init: Initializer<AppState> = (state: AppState): AppState => {
    return state
  }

  const reducer: Reducer<AppState, AnyAppEvent> = (state: AppState, event: AnyAppEvent): AppState => {
    console.log("Processing event:", event)

    switch (event.type) {
      case 'on_ethereum_provider_fetch_effect_result':
        return { 
          ethereum: event.payload,
          networkName: state.networkName,
          userAddress: state.userAddress
        }
      case 'on_ethereum_network_changed_effect_result':
        return { 
          ethereum: state.ethereum,
          networkName: event.payload,
          userAddress: state.userAddress
        }
      case 'on_user_address_changed_effect_result':
        return {
          ethereum: state.ethereum,
          networkName: state.networkName,
          userAddress: event.payload
        }
    }
  }

  const [state, dispatch] = useReducer<Reducer<AppState, AnyAppEvent>, AppState>(
    reducer,
    {
      ethereum: Async.uninitialized(),
      networkName: Async.uninitialized(),
      userAddress: Async.uninitialized()
    },
    init
  )

  useEffect(effectsService.fetchEthereumProvider(dispatch), [])
  useEffect(effectsService.observeNetworkChanges(state)(dispatch), [state.ethereum])
  useEffect(effectsService.observeUserAddressChanges(state)(dispatch), [state.ethereum])

  return (
    <div className="container">
      <h1>HI</h1>
    </div>
  )
}

export interface AppState {
  readonly ethereum: Async<unknown, Error>
  readonly networkName: Async<string, Error>
  readonly userAddress: Async<Address | undefined, Error>
}

type AppEventType = 
  | 'on_ethereum_provider_fetch_effect_result'
  | 'on_ethereum_network_changed_effect_result'
  | 'on_user_address_changed_effect_result'

interface AppEvent<Data, Type extends AppEventType> {
  type: Type
  payload: Data
}

export type AnyAppEvent = 
  | OnEthereumProviderEffectResult
  | OnEthereumNetworkChangedEffectResult
  | OnUserAddressChangedEffectResult

export type OnEthereumProviderEffectResult = AppEvent<Async<unknown, Error>, 'on_ethereum_provider_fetch_effect_result'>
export type OnEthereumNetworkChangedEffectResult = AppEvent<Async<string, Error>, 'on_ethereum_network_changed_effect_result'>
export type OnUserAddressChangedEffectResult = AppEvent<Async<string, Error>, 'on_user_address_changed_effect_result'>

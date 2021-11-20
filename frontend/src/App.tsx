import React, { ReactNode, Reducer, ReducerState, ReducerStateWithoutAction, useEffect, useReducer } from 'react';
import { Async } from './presentation/utils/Async'
import './App.css';
import { Address } from './model/Address';
import AppEffectsService from './presentation/AppEffectsService';
import { useEffectOnce } from './presentation/utils/Effects';

export default class App extends React.Component<AppProps, AppState> {
  private effectsService = new AppEffectsService()

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

  init(state: AppState): AppState {
    return state
  }

  reducer: Reducer<AppState, AnyAppEvent> = (state: AppState, event: AnyAppEvent): AppState => {
    console.log("Processing event:", event)

    switch (event.type) {
      case 'on_ethereum_provider_effect_result':
        event.payload.fold({
          onUninitialized: () => { useEffectOnce(this, this.effectsService.fetchEthereumProvider) },
          onSuccess: (data: unknown) => { useEffectOnce(this, this.effectsService.observeNetworkChanges(data)) },
        })
        return { 
          ethereum: event.payload,
          userAddress: state.userAddress
        }
      case 'on_ethereum_network_changed_effect_result':
        return { 
          ethereum: state.ethereum,
          userAddress: state.userAddress
        }
    }
  }

  render(): ReactNode {
    const [state, dispatch] = useReducer<Reducer<AppState, AnyAppEvent>, AppState>(
      this.reducer,
      {
        ethereum: Async.uninitialized(),
        userAddress: Async.uninitialized()
      },
      this.init
    )

    return (
      <div className="container">
        <h1>HI</h1>
      </div>
    )
  }
}

interface AppProps {

}

export interface AppState {
  readonly ethereum: Async<unknown, Error>
  readonly userAddress: Async<Address | undefined, Error>
}

type AppEventType = 
  | 'on_ethereum_provider_effect_result'
  | 'on_ethereum_network_changed_effect_result'

interface AppEvent<Data, Type extends AppEventType> {
  type: Type
  payload: Data
}

export type AnyAppEvent = 
  | OnEthereumProviderEffectResult
  | OnEthereumNetworkChangedEffectResult

export type OnEthereumProviderEffectResult = AppEvent<Async<unknown, Error>, 'on_ethereum_provider_effect_result'>
export type OnEthereumNetworkChangedEffectResult = AppEvent<Async<unknown, Error>, 'on_ethereum_network_changed_effect_result'>

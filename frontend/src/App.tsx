import React, { Dispatch, ReactNode, Reducer, ReducerState, ReducerStateWithoutAction, useEffect, useReducer } from 'react';
import { Async } from './presentation/utils/Async'
import './App.css';
import { MetamaskButton } from './components/MetamaskButton';
import { Address } from './model/Address';
import AppEffectsService from './presentation/AppEffectsService';

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

  reducer: (dispatch: Dispatch<AnyAppEvent>) => Reducer<AppState, AnyAppEvent> = (dispatch) => (state: AppState, event: AnyAppEvent): AppState => {
    console.log("Processing event:", event)

    switch (event.type) {
      case 'on_ethereum_provider_effect_result':
        event.payload.fold(
          onUninitialized: () => { useEffect(this.effectsService.fetchEthereumProvider(dispatch)) },
          onLoading: () => {},
          onSucceeded: (data: unknown) => { useEffect(this.effectsService.observeNetworkChanges(data)) },
          onFailed: (error: any) => {}
        )
        useEffect(this.effectsService.observeNetworkChanges(state.ethereum))
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
      <div className={styles.checkers.container}>
          <div className={styles.checkers.board}>
              <div className={styles.checkers.grid}>
                  /* {
                      /** 
                       * Encoding used the range from 0 to 31 inclusive to represent all possible positions.
                       */
                      [...Array(32)].flatMap((_, encodedPosition: EncodedPosition) => {
                          const occupant = localState.occupantsMap.get(encodedPosition)
                          const decodedPosition = decodePosition(encodedPosition)
                          const darkSquareOffset = decodedPosition.row % 2
                          const isDarkFirst = darkSquareOffset == 0
                          const squareOriginActual = encodedPosition * 2

                          /** Expanded syntax for performance reasons. */
                          if (isDarkFirst) {
                              return [
                                  <Square
                                      key={squareOriginActual}
                                      occupant={occupant}
                                      isUsable={true}
                                  />,
                                  <Square
                                      key={squareOriginActual + 1}
                                      occupant={undefined}
                                      isUsable={false}
                                  />
                              ]
                          } else {
                              return [
                                  <Square
                                      key={squareOriginActual}
                                      occupant={undefined}
                                      isUsable={false}
                                  />,
                                  <Square
                                      key={squareOriginActual + 1}
                                      occupant={occupant}
                                      isUsable={true}
                                  />
                              ]
                          }
                      })
                  } */
              </div>
          </div>
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

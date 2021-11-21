import { useState, useEffect } from 'react';
import abi from './utils/EquitableEquityDAO.json';
import { ethers } from "ethers";

export const MetamaskButton = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [projectDoa, setProjectDoa] = useState(null);
  const [mintingEquityGrant, setMintingEquityGrant] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  let strConnectMetaMaskButton = "Connect Wallet To Get Started"

  const getWalletConnection = async () => {    
    try {
      const { ethereum } = window;

      if (!ethereum) {
        strConnectMetaMaskButton = "MetaMask is not installed"
        console.log("MetaMask is not installed");
        alert("Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      if (currentAccount) {
        return;
      }

      console.log("We have the ethereum object", ethereum);

      if (accounts.length !== 0 && !currentAccount) {
        console.log("Authorized account:", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  async function loginMetaMask() {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      console.log("Set authorized account:", accounts[0]);
      setCurrentAccount(accounts[0]);
    }
    catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    return (
      <div className="connect-wallet-container">
        <button id="login-button" className="metamask-button" onClick={loginMetaMask}>{strConnectMetaMaskButton}</button>
      </div>
    )
  }
}

export default MetamaskButton;
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export const NexaBridgeContext = React.createContext();

export const NexaBridgeProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please connect the wallet");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setAccountBalance(ethers.formatEther(balance));
        console.log("Wallet connected", accounts[0]);
      } else {
        console.log("No Account found");
      }
    } catch (error) {
      console.log("No Account found", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please install Metamask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);

        console.log("Wallet connected", accounts[0]);
      }
    } catch (error) {
      console.log("Wallet connection error", error);
    }
  };
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <NexaBridgeContext.Provider
      value={{
        currentAccount,
        accountBalance,
        connectWallet,
        checkIfWalletConnected,
      }}
    >
      {children}
    </NexaBridgeContext.Provider>
  );
};

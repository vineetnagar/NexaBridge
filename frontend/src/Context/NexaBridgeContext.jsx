import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {
  BridgeTokenAddress,
  BridgeTokenAbi,
  TokenPoolAddress,
  TokenPoolAbi,
  NextBridgeAddress,
  NextBridgeAbi,
} from "./constants";

export const NexaBridgeContext = React.createContext();

export const NexaBridgeProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

  const fetchContract = (address, abi, signerOrProvider) => {
    return new ethers.Contract(address, abi, signerOrProvider);
  };

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

  const getTokenBalance = async () => {
    try {
      if (!currentAccount) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(
        BridgeTokenAddress,
        BridgeTokenAbi,
        provider,
      );

      const balance = await contract.balanceOf(currentAccount);
      const formatBalance = ethers.formatUnits(balance, 18);
      setTokenBalance(formatBalance);
      console.log("NBT balance", formatBalance);
    } catch (error) {
      console.log("Error while fetching token balance", error);
    }
  };

  const approveToken = async (_amount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = fetchContract(
        BridgeTokenAddress,
        BridgeTokenAbi,
        signer,
      );

      const amount = ethers.parseUnits(_amount.toString(), 18);
      const transaction = await contract.approve(NextBridgeAddress, amount);

      await transaction.wait();
      console.log("Token approved successfully");
    } catch (error) {
      console.log("Error while approving token", error);
    }
  };

  const initiateBridge = async (_amount, _destinationChainId, _recipient) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = fetchContract(NextBridgeAddress, NextBridgeAbi, signer);
      const amount = ethers.parseUnits(_amount.toString(), 18);

      const transaction = await contract.initiateBridge(
        amount,
        _destinationChainId,
        _recipient,
      );
      await transaction.wait();
      console.log("Bridge initiated successfully");
    } catch (error) {
      console.log("Error while initiating Bridge", error);
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
        getTokenBalance,
      }}
    >
      {children}
    </NexaBridgeContext.Provider>
  );
};

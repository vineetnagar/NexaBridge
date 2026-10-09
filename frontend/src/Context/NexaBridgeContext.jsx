import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
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
  const verifyContracts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const network = await provider.getNetwork();
      console.log("Connected Chain ID:", network.chainId.toString());

      const contracts = [
        ["BridgeToken", BridgeTokenAddress],
        ["TokenPool", TokenPoolAddress],
        ["NextBridge", NextBridgeAddress],
      ];

      for (const [name, address] of contracts) {
        const code = await provider.getCode(address);

        console.log(`${name} Address:`, address);
        console.log(`${name} Deployed:`, code !== "0x");
      }
    } catch (error) {
      console.error("Contract verification failed:", error);
    }
  };

  const verifyContractFunctions = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const checks = [
        {
          name: "BridgeToken",
          address: BridgeTokenAddress,
          abi: BridgeTokenAbi,
          functions: ["balanceOf", "allowance", "approve"],
        },
        {
          name: "TokenPool",
          address: TokenPoolAddress,
          abi: TokenPoolAbi,
          functions: ["getLiquidity"],
        },
        {
          name: "NextBridge",
          address: NextBridgeAddress,
          abi: NextBridgeAbi,
          functions: ["initiateBridge", "getBridgeTransaction"],
        },
      ];

      for (const item of checks) {
        const contract = new ethers.Contract(item.address, item.abi, provider);

        for (const functionName of item.functions) {
          console.log(
            `${item.name}.${functionName}:`,
            typeof contract[functionName] === "function",
          );
        }
      }
    } catch (error) {
      console.error("ABI verification failed:", error);
    }
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

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7a69" }],
        });
      } catch (error) {
        console.error("Network switch failed:", error);
        throw error;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      console.log("MetaMask chain ID:", chainId);
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        await verifyContracts();
        await verifyContractFunctions();
        const provider = new ethers.BrowserProvider(window.ethereum);

        const balance = await provider.getBalance(accounts[0]);

        setAccountBalance(ethers.formatEther(balance));
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

      const network = await provider.getNetwork();
      const code = await provider.getCode(BridgeTokenAddress);

      console.log("Chain ID:", network.chainId.toString());
      console.log("Token address:", BridgeTokenAddress);
      console.log("Contract deployed:", code !== "0x");
      console.log("Contract code length:", code.length);

      if (code === "0x") {
        throw new Error(
          "BridgeToken is not deployed at this address on the current network",
        );
      }
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
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = fetchContract(
        BridgeTokenAddress,
        BridgeTokenAbi,
        signer,
      );

      const amountInWei = ethers.parseUnits(_amount.toString(), 18);

      const transaction = await contract.approve(
        NextBridgeAddress,
        amountInWei,
      );

      const receipt = await transaction.wait();

      console.log("Token approved successfully");
      return receipt;
    } catch (error) {
      console.error("Error while approving token:", error);
      throw error;
    }
  };
  const initiateBridge = async (_amount, _destinationChainId, _recipient) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 31337) {
        throw new Error("Please switch MetaMask to Hardhat Local (31337)");
      }
      const signer = await provider.getSigner();
      const contract = fetchContract(NextBridgeAddress, NextBridgeAbi, signer);
      const amountInWei = ethers.parseUnits(_amount.toString(), 18);
      const transaction = await contract.initiateBridge(
        amountInWei,
        _destinationChainId,
        _recipient,
      );
      const receipt = await transaction.wait();
      if (!receipt || receipt.status !== 1) {
        throw new Error("Bridge transaction failed");
      }
      const bridgeEvent = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((event) => event?.name === "BridgeInitiated");
      if (!bridgeEvent) {
        throw new Error("BridgeInitiated event not found in transaction");
      }
      const nonce = bridgeEvent.args[0].toString();
      console.log("Bridge initiated successfully");
      console.log("Transaction hash:", receipt.hash);
      console.log("Bridge nonce:", nonce);
      return { receipt, nonce };
    } catch (error) {
      console.error("Error while initiating bridge:", error);
      throw error;
    }
  };

  const getBridgeTransaction = async (_nonce) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(
        NextBridgeAddress,
        NextBridgeAbi,
        provider,
      );
      const bridgeTransaction = await contract.getBridgeTransaction(_nonce);
      console.log("Bridge Transaction fetched", bridgeTransaction);
      return bridgeTransaction;
    } catch (error) {
      console.log("Error in getting Bridge Transaction", error);
    }
  };
  const getPoolLiquidity = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = await fetchContract(
        TokenPoolAddress,
        TokenPoolAbi,
        provider,
      );

      const liquidity = await contract.getLiquidity();

      const formatLiquidity = ethers.formatUnits(liquidity, 18);

      console.log("Pool Liquidity:", formatLiquidity);
      return formatLiquidity;
    } catch (error) {
      console.log("Error in fetch Liquidity", error);
    }
  };

  const checkTokenAllowance = async (_amount) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = fetchContract(
      BridgeTokenAddress,
      BridgeTokenAbi,
      provider,
    );

    const amountInWei = ethers.parseUnits(_amount.toString(), 18);

    const allowance = await contract.allowance(
      currentAccount,
      NextBridgeAddress,
    );

    return allowance >= amountInWei;
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <NexaBridgeContext.Provider
      value={{
        currentAccount,
        accountBalance,
        tokenBalance,
        connectWallet,
        checkIfWalletConnected,
        getTokenBalance,
        approveToken,
        initiateBridge,
        getBridgeTransaction,
        getPoolLiquidity,
        checkTokenAllowance,
      }}
    >
      {children}
    </NexaBridgeContext.Provider>
  );
};

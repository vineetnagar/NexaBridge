import React, { useState, useEffect, useContext } from "react";
import Style from "./swapBarBox.module.css";
import { TbSettings2 } from "react-icons/tb";
import { TbTransferIn } from "react-icons/tb";
import { RiSwap2Line } from "react-icons/ri";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiLink2 } from "react-icons/fi";
import { ethers } from "ethers";
import * as viemChains from "viem/chains";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  bsc,
  avalanche,
  linea,
  scroll,
  zkSync,
} from "viem/chains";
import { NexaBridgeContext } from "../../src/Context/NexaBridgeContext";

const SwapBarBox = () => {
  const {
    currentAccount,
    accountBalance,
    tokenBalance,
    connectWallet,
    getTokenBalance,
    approveToken,
    initiateBridge,
    checkTokenAllowance,
    getBridgeTransaction,
  } = useContext(NexaBridgeContext);

  const [selected, setSelected] = useState(0);
  const [openFromList, setOpenFromList] = useState(false);
  const [openToList, setOpenToList] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedFromChain, setSelectedFromChain] = useState(null);
  const [selectedToChain, setSelectedToChain] = useState(null);
  const [searchChain, setSearchChain] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const chainIdMap = {
    arbitrum: arbitrum.id,
    base: base.id,
    ethereum: mainnet.id,
    optimism: optimism.id,
    polygon: polygon.id,
    bsc: bsc.id,
    avalanche: avalanche.id,
    linea: linea.id,
    scroll: scroll.id,
    zksync: zkSync.id,
  };
  const openChainTokenFromList = () => {
    setOpenFromList(true);
    setOpenToList(false);
  };

  const openChainTokenToList = () => {
    setOpenToList(true);
    setOpenFromList(false);
  };
  const closeChainTokenFromList = () => {
    setOpenFromList(false);
  };
  const closeChainTokenToList = () => {
    setOpenToList(false);
  };

  const handleBridge = async () => {
    console.log("Bridge button clicked");
    console.log("Account:", currentAccount);
    console.log("Amount:", amount);
    console.log("Destination:", selectedToChain);

    if (!currentAccount) {
      await connectWallet();
      return;
    }

    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (!selectedToChain) {
      alert("Select a destination chain");
      return;
    }

    const destinationChainId = chainIdMap[selectedToChain.toLowerCase()];
    console.log("Selected chain:", selectedToChain);
    console.log("Resolved chain ID:", destinationChainId);
    if (!destinationChainId) {
      alert("For local testing, select a supported local destination");
      return;
    }

    try {
      setIsProcessing(true);

      await getTokenBalance();

      const balance = await getTokenBalance();
      const amountInWei = ethers.parseUnits(amount, 18);

      if (balance < amountInWei) {
        alert("Insufficient NBT balance");
        return;
      }
      let isApproved = await checkTokenAllowance(amount);
      if (!isApproved) {
        const receipt = await approveToken(amount);

        console.log("Approval transaction hash:", receipt.hash);
        console.log("Approval status:", receipt.status);

        isApproved = await checkTokenAllowance(amount);

        console.log("Allowance sufficient:", isApproved);

        if (!isApproved) {
          throw new Error("Token approval was not confirmed");
        }
      }

      const bridgeResult = await initiateBridge(
        amount,
        destinationChainId,
        currentAccount,
      );
      console.log("Bridge transaction hash:", bridgeResult.receipt.hash);
      console.log("Bridge transaction status:", bridgeResult.receipt.status);
      console.log("Bridge nonce:", bridgeResult.nonce);
      const bridgeTransaction = await getBridgeTransaction(bridgeResult.nonce);
      console.log("Bridge transaction details:", bridgeTransaction);
      if (bridgeTransaction) {
        console.log(
          "Destination Chain ID:",
          bridgeTransaction.destinationChainId.toString(),
        );
        console.log("Bridge Status:", bridgeTransaction.status.toString());
        console.log(
          "Bridge Fee:",
          ethers.formatUnits(bridgeTransaction.fee, 18),
          "NBT",
        );
      }
      await getTokenBalance();
      alert("Bridge transaction confirmed");
    } catch (error) {
      console.error("Bridge failed:", error);
      alert(error.shortMessage || error.message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredChains = chains.filter((chain) =>
    chain.toLowerCase().includes(searchChain.toLowerCase()),
  );
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://transfer.layerzero-api.com/v1/tokens",
      );

      const data = await response.json();

      setTokens(data.tokens);
      console.log("First token:", data.tokens[0]);
      console.log("Full token data:", data.tokens[0]);
      console.log("Chain-related fields:", Object.keys(data.tokens[0]));
      console.log("Unique chain keys:", [
        ...new Set(data.tokens.map((token) => token.chainKey)),
      ]);
      const uniqueChains = [
        ...new Set(data.tokens.map((token) => token.chainKey)),
      ];

      setChains(uniqueChains);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (currentAccount) {
      getTokenBalance();
    }
  }, [currentAccount]);
  return (
    <div className={Style.swapBarBox}>
      <div className={Style.swapBarBox_container}>
        {/*Setting box*/}
        <div className={Style.swapBarBox_setting}>
          <p>
            Advanced Settings{" "}
            <span>
              <TbSettings2 className={Style.setting_icon} />
            </span>
          </p>
        </div>

        <div className={Style.swapBarBox_transferSwap_box}>
          <div
            className={`${Style.swapBarBox_transferSwap_box_transfer} ${
              selected === 0 ? Style.selected : ""
            }`}
            onClick={() => setSelected(0)}
          >
            <p>
              <span>
                <TbTransferIn /> Transfer
              </span>
            </p>
          </div>
          <div
            className={`${Style.swapBarBox_transferSwap_box_swap} ${
              selected === 1 ? Style.selected : ""
            }`}
            onClick={() => setSelected(1)}
          >
            <p>
              <RiSwap2Line /> Swap
            </p>
          </div>
        </div>

        {/*TransferSwap From Box*/}
        <div className={Style.swapBarBox_transferSwapFrom_box}>
          <div className={Style.swapBarBox_transferSwapFrom_box_accAddress}>
            <p>
              {currentAccount
                ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                : "Wallet not connected"}
            </p>{" "}
          </div>
          {!openFromList ? (
            <div className={Style.swapBarBox_transferSwapTo_box_mainSelectBox}>
              <div
                className={
                  Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain
                }
                onClick={() => openChainTokenFromList()}
              >
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_nameIcon
                  }
                >
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_nameIcon_svg
                    }
                  >
                    {selectedFromChain
                      ? selectedFromChain.slice(0, 2).toUpperCase()
                      : ""}{" "}
                  </div>

                  <span>
                    <p>
                      {selectedFromChain
                        ? selectedFromChain.slice(0, 3).toUpperCase()
                        : "From"}
                    </p>
                    <p> {selectedFromChain || "Not Selected"}</p>
                  </span>
                </div>
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_listIcon
                  }
                >
                  <IoIosArrowDown />
                </div>
              </div>
              <div
                className={Style.swapBarBox_transferSwapTo_box_selectAmountBox1}
              >
                <input
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_typeAmount
                  }
                />
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection
                  }
                >
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection_item1
                    }
                  >
                    <FiLink2 />
                  </div>
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection_item2
                    }
                  >
                    <p>Max</p>
                  </div>
                </div>
              </div>
              <div
                className={Style.swapBarBox_transferSwapTo_box_selectAmountBox2}
              >
                <p
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox2_chainValue
                  }
                >
                  $0.00
                </p>
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox2_loaderBox
                  }
                ></div>
              </div>
            </div>
          ) : (
            <div className={Style.transfer_box_ChainTokenList}>
              <div className={Style.transfer_box_ChainTokenList_searchBar}>
                <input
                  placeholder="Search source token and chain"
                  type="text"
                  value={searchChain}
                  onChange={(e) => setSearchChain(e.target.value)}
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_typeAmount
                  }
                />
                <div
                  className={
                    Style.swapBarBox_transferSwapFrom_box_mainSelectBox_selectChain_listIcon
                  }
                >
                  <IoIosArrowUp onClick={() => closeChainTokenFromList()} />
                </div>
              </div>
              {filteredChains.map((chain) => (
                <div
                  className={Style.transfer_box_ChainTokenList_container}
                  key={chain}
                  onClick={() => {
                    console.log("Selected chain:", chain);
                    console.log("Lowercase chain:", chain.toLowerCase());
                    setSelectedFromChain(chain);
                    setOpenToList(false);
                    if (!selectedFromChain) {
                      setOpenFromList(true);
                    } else {
                      setOpenFromList(false);
                    }
                  }}
                >
                  <div
                    className={Style.transfer_box_ChainTokenList_container_left}
                  >
                    <div
                      className={
                        Style.transfer_box_ChainTokenList_container_left_icon
                      }
                    >
                      {chain.slice(0, 2).toUpperCase()}
                    </div>

                    <div
                      className={
                        Style.transfer_box_ChainTokenList_container_left_chainTokenName
                      }
                    >
                      <p
                        className={
                          Style.transfer_box_ChainTokenList_container_left_chainTokenName_chainTokenData
                        }
                      >
                        {chain}
                      </p>

                      <p
                        className={
                          Style.transfer_box_ChainTokenList_container_left_chainTokenName_chainTokenName
                        }
                      >
                        {chain}
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      Style.transfer_box_ChainTokenList_container_right
                    }
                  >
                    <p>0.00</p>
                    <p>$0.00</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*TransferSwap to Box*/}
        <div className={Style.swapBarBox_transferSwapTo_box}>
          <div className={Style.swapBarBox_transferSwapTo_box_customBox}>
            <div
              className={
                Style.swapBarBox_transferSwapTo_box_customBox_accAddress
              }
            >
              <p>Connect Solana Wallet</p>
            </div>
            <div
              className={
                Style.swapBarBox_transferSwapTo_box_customBox_selectCustomAddress
              }
            >
              <p>Custom Address </p>
            </div>
          </div>

          {!openToList ? (
            <div className={Style.swapBarBox_transferSwapTo_box_mainSelectBox}>
              <div
                className={
                  Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain
                }
                onClick={() => openChainTokenToList()}
              >
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_nameIcon
                  }
                >
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_nameIcon_svg
                    }
                  >
                    {selectedToChain
                      ? selectedToChain.slice(0, 2).toUpperCase()
                      : ""}{" "}
                  </div>

                  <span>
                    <p>
                      {" "}
                      {selectedToChain
                        ? selectedToChain.slice(0, 3).toUpperCase()
                        : "To"}
                    </p>
                    <p> {selectedToChain || "Not Selected"}</p>
                  </span>
                </div>
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain_listIcon
                  }
                >
                  <IoIosArrowDown onClick={() => openChainTokenToList()} />
                </div>
              </div>
              <div
                className={Style.swapBarBox_transferSwapTo_box_selectAmountBox1}
              >
                <input
                  placeholder="0.00"
                  type="number"
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_typeAmount
                  }
                />
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection
                  }
                >
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection_item1
                    }
                  >
                    <FiLink2 />
                  </div>
                  <div
                    className={
                      Style.swapBarBox_transferSwapTo_box_selectAmountBox1_rightSection_item2
                    }
                  >
                    <p>Max</p>
                  </div>
                </div>
              </div>
              <div
                className={Style.swapBarBox_transferSwapTo_box_selectAmountBox2}
              >
                <p
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox2_chainValue
                  }
                >
                  $0.00
                </p>
                <div
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox2_loaderBox
                  }
                ></div>
              </div>
            </div>
          ) : (
            <div className={Style.transfer_box_ChainTokenList}>
              <div className={Style.transfer_box_ChainTokenList_searchBar}>
                <input
                  placeholder="Search source token and chain"
                  type="text"
                  value={searchChain}
                  onChange={(e) => setSearchChain(e.target.value)}
                  className={
                    Style.swapBarBox_transferSwapTo_box_selectAmountBox1_typeAmount
                  }
                />
                <div
                  className={
                    Style.swapBarBox_transferSwapFrom_box_mainSelectBox_selectChain_listIcon
                  }
                >
                  <IoIosArrowUp onClick={() => closeChainTokenToList()} />
                </div>
              </div>
              {filteredChains.map((chain) => (
                <div
                  className={Style.transfer_box_ChainTokenList_container}
                  key={chain}
                  onClick={() => {
                    setSelectedToChain(chain);
                    setOpenToList(false);
                    if (!selectedFromChain) {
                      setOpenFromList(true);
                    } else {
                      setOpenFromList(false);
                    }
                  }}
                >
                  <div
                    className={Style.transfer_box_ChainTokenList_container_left}
                  >
                    <div
                      className={
                        Style.transfer_box_ChainTokenList_container_left_icon
                      }
                    >
                      {chain.slice(0, 2).toUpperCase()}
                    </div>

                    <div
                      className={
                        Style.transfer_box_ChainTokenList_container_left_chainTokenName
                      }
                    >
                      <p
                        className={
                          Style.transfer_box_ChainTokenList_container_left_chainTokenName_chainTokenData
                        }
                      >
                        {chain}
                      </p>

                      <p
                        className={
                          Style.transfer_box_ChainTokenList_container_left_chainTokenName_chainTokenName
                        }
                      >
                        {chain}
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      Style.transfer_box_ChainTokenList_container_right
                    }
                  >
                    <p>0.00</p>
                    <p>$0.00</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={Style.connectWalletBtn}>
          <button
            className={Style.connectWalletBtn_btn}
            onClick={handleBridge}
            disabled={
              isProcessing ||
              (Boolean(currentAccount) &&
                (!amount ||
                  !Number.isFinite(Number(amount)) ||
                  Number(amount) <= 0 ||
                  !selectedToChain))
            }
          >
            {isProcessing
              ? "Processing..."
              : !currentAccount
                ? "Connect Wallet"
                : "Bridge"}
          </button>
        </div>

        <div className={Style.swapBarBox_container_footerText}>
          <p>Advanced Mode</p>
          <p>Powered by Vineet Nagar</p>
        </div>
      </div>
    </div>
  );
};

export default SwapBarBox;

import React, { useState, useEffect } from "react";
import Style from "./swapBarBox.module.css";
import { TbSettings2 } from "react-icons/tb";
import { TbTransferIn } from "react-icons/tb";
import { RiSwap2Line } from "react-icons/ri";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiLink2 } from "react-icons/fi";
const SwapBarBox = () => {
  const [selected, setSelected] = useState(0);
  const [openFromList, setOpenFromList] = useState(false);
  const [openToList, setOpenToList] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedFromChain, setSelectedFromChain] = useState(null);
  const [selectedToChain, setSelectedToChain] = useState(null);
  const [searchChain, setSearchChain] = useState("");
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

      const uniqueChains = [
        ...new Set(data.tokens.map((token) => token.chainKey)),
      ];

      setChains(uniqueChains);
    };

    fetchData();
  }, []);

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
            <p>Connect Solana Wallet</p>
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
            <div
              className={Style.swapBarBox_transferSwapTo_box_mainSelectBox}
              onClick={() => openChainTokenToList()}
            >
              <div
                className={
                  Style.swapBarBox_transferSwapTo_box_mainSelectBox_selectChain
                }
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
          <button className={Style.connectWalletBtn_btn}>Connect Wallet</button>
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

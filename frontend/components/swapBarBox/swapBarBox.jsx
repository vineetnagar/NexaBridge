import React, { useState } from "react";
import Style from "./swapBarBox.module.css";
import { TbSettings2 } from "react-icons/tb";
import { TbTransferIn } from "react-icons/tb";
import { RiSwap2Line } from "react-icons/ri";
import { SiSolana } from "react-icons/si";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiLink2 } from "react-icons/fi";
import Button from "../Button/Button";
const SwapBarBox = () => {
  const [selected, setSelected] = useState(0);

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

        {/*TransferSwap From Box*/}
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
        <div className={Style.swapBarBox_transferSwapFrom_box}>
          <div className={Style.swapBarBox_transferSwapFrom_box_accAddress}>
            <p>Connect Solana Wallet</p>
          </div>
          <div className={Style.swapBarBox_transferSwapFrom_box_mainSelectBox}>
            <div
              className={
                Style.swapBarBox_transferSwapFrom_box_mainSelectBox_selectChain
              }
            >
              <div
                className={
                  Style.swapBarBox_transferSwapFrom_box_mainSelectBox_selectChain_nameIcon
                }
              >
                <SiSolana />{" "}
                <span>
                  <p>SOL</p>
                  <p>Solana</p>
                </span>
              </div>
              <div
                className={
                  Style.swapBarBox_transferSwapFrom_box_mainSelectBox_selectChain_listIcon
                }
              >
                <IoIosArrowDown />
              </div>
            </div>
            <div
              className={Style.swapBarBox_transferSwapFrom_box_selectAmountBox1}
            >
              <input
                placeholder="0.00"
                type="number"
                className={
                  Style.swapBarBox_transferSwapFrom_box_selectAmountBox1_typeAmount
                }
              />
              <div
                className={
                  Style.swapBarBox_transferSwapFrom_box_selectAmountBox1_rightSection
                }
              >
                <div
                  className={
                    Style.swapBarBox_transferSwapFrom_box_selectAmountBox1_rightSection_item1
                  }
                >
                  <FiLink2 />
                </div>
                <div
                  className={
                    Style.swapBarBox_transferSwapFrom_box_selectAmountBox1_rightSection_item2
                  }
                >
                  <p>Max</p>
                </div>
              </div>
            </div>
            <div
              className={Style.swapBarBox_transferSwapFrom_box_selectAmountBox2}
            >
              <p
                className={
                  Style.swapBarBox_transferSwapFrom_box_selectAmountBox2_chainValue
                }
              >
                $0.00
              </p>
              <div
                className={
                  Style.swapBarBox_transferSwapFrom_box_selectAmountBox2_loaderBox
                }
              ></div>
            </div>
          </div>
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

          <div className={Style.swapBarBox_transferSwapTo_box_mainSelectBox}>
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
                <SiSolana />{" "}
                <span>
                  <p>SOL</p>
                  <p>Solana</p>
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
        </div>

        <div className={Style.connectWalletBtn}>
          <button className={Style.connectWalletBtn_btn}>Connect Wallet</button>
        </div>

        <div className={Style.swapBarBox_container_footerText}>
          <p>Powered by Vineet Nagar</p>
        </div>
      </div>
    </div>
  );
};

export default SwapBarBox;

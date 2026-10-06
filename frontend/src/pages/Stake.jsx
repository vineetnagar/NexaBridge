import React from "react";
import Style from "../style/Stake.module.css";
import { WiStars } from "react-icons/wi";
import { FaCompass } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { GiStarSattelites } from "react-icons/gi";

const Stake = () => {
  return (
    <div className={Style.stake}>
      <div className={Style.stake_container}>
        <div className={Style.stake_container_headings}>
          <h1>NexaBridge Stake</h1>
          <p>
            Stake and lock STG tokens to receive veSTG. Participate in
            NexaBridge DAO governance and earn a share of transfer fees
            distributed monthly.
          </p>
        </div>
        <div className={Style.stake_container_selectNetwork}>
          <div className={Style.stake_container_selectNetwork_claimFeesBox}>
            <div
              className={Style.stake_container_selectNetwork_claimFeesBox_left}
            >
              <span>
                <WiStars />
              </span>
              <span>Claim Staking Fees . 0</span>
            </div>
            <div
              className={Style.stake_container_selectNetwork_claimFeesBox_right}
            >
              <p>Reset</p>
              <div
                className={
                  Style.stake_container_selectNetwork_claimFeesBox_right_networkList
                }
              >
                Network:{" "}
                <span>
                  <FaCompass /> <IoIosArrowDown />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={Style.stake_container_claimed_feesData}>
          No staking fees to claim yet.
        </div>

        <div className={Style.stake_container_stakedDataBoxes}>
          <div className={Style.stake_container_stakedDataBoxes_STGLocked}>
            <div
              className={Style.stake_container_stakedDataBoxes_STGLocked_top}
            >
              <div
                className={
                  Style.stake_container_stakedDataBoxes_STGLocked_top_left
                }
              >
                <p>Total STG Locked</p>
                <span>
                  <p>14,501,116.27</p>
                </span>
              </div>
              <div
                className={
                  Style.stake_container_stakedDataBoxes_STGLocked_top_right
                }
              >
                <span>
                  <FaStar />
                </span>
              </div>
              <div className={Style.verticalLine}></div>
              <div
                className={
                  Style.stake_container_stakedDataBoxes_STGLocked_top_left
                }
              >
                <p>Total VeSTG</p>
                <span>
                  <p>324,465.8</p>
                </span>
              </div>
              <div
                className={
                  Style.stake_container_stakedDataBoxes_STGLocked_top_right
                }
              >
                <span>
                  <GiStarSattelites />
                </span>
              </div>
            </div>
            <div
              className={Style.stake_container_stakedDataBoxes_STGLocked_bottom}
            >
              <hr />
              <div
                className={
                  Style.stake_container_stakedDataBoxes_STGLocked_bottom_data
                }
              >
                <div
                  className={
                    Style.stake_container_stakedDataBoxes_STGLocked_bottom_data_PercentSTGLocked
                  }
                >
                  <p>Percent STG Locked</p>
                  <span>
                    <p>24.21%</p>
                  </span>
                </div>
                <div
                  className={
                    Style.stake_container_stakedDataBoxes_STGLocked_bottom_data_AVGLockTime
                  }
                >
                  <p>Global Average lock time</p>
                  <span>
                    <p>25 days</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;

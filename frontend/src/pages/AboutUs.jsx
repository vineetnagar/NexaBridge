import React, { useState } from "react";
import Style from "../style/AboutUs.module.css";
import { BiLogoTelegram } from "react-icons/bi";
import { RiArrowDropRightLine } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { RiSettings4Fill } from "react-icons/ri";
import { IoCubeSharp } from "react-icons/io5";
import { TbGridDots } from "react-icons/tb";
import { GoPlus } from "react-icons/go";

const AboutUs = () => {
  const [openQuestion1, setOpenQuestion1] = useState(false);
  const [openQuestion2, setOpenQuestion2] = useState(false);
  const [openQuestion3, setOpenQuestion3] = useState(false);
  const [openQuestion4, setOpenQuestion4] = useState(false);

  const questionOpened1 = () => {
    if (!openQuestion1) {
      setOpenQuestion1(true);
      setOpenQuestion2(false);
      setOpenQuestion3(false);
      setOpenQuestion4(false);
    } else {
      setOpenQuestion1(false);
    }
  };
  const questionOpened2 = () => {
    if (!openQuestion2) {
      setOpenQuestion2(true);
      setOpenQuestion1(false);
      setOpenQuestion3(false);
      setOpenQuestion4(false);
    } else {
      setOpenQuestion2(false);
    }
  };
  const questionOpened3 = () => {
    if (!openQuestion3) {
      setOpenQuestion3(true);
      setOpenQuestion2(false);
      setOpenQuestion1(false);
      setOpenQuestion4(false);
    } else {
      setOpenQuestion3(false);
    }
  };
  const questionOpened4 = () => {
    if (!openQuestion4) {
      setOpenQuestion4(true);
      setOpenQuestion2(false);
      setOpenQuestion3(false);
      setOpenQuestion1(false);
    } else {
      setOpenQuestion4(false);
    }
  };

  return (
    <div className={Style.aboutUs}>
      <div className={Style.aboutUs_container}>
        {/*Hero Text*/}
        <div className={Style.aboutUs_container_heroText}>
          <h2>Join the NexaBridge </h2>
          <h2>Community</h2>
          <p>Connect with Stargate enthusiasts from around the world and</p>
          <p> participate in the decentralized governance of the protocol.</p>
        </div>
        <div className={Style.aboutUs_container_joinUsBlocks}>
          {/*Telegram Block*/}
          <div className={Style.aboutUs_container_joinUsBlocks_Telegram}>
            <div
              className={Style.aboutUs_container_joinUsBlocks_Telegram_block}
            >
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Telegram_block_top
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Telegram_block_top_left
                  }
                >
                  <BiLogoTelegram />
                  <span>Telegram</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Telegram_block_top_right
                  }
                >
                  <RiArrowDropRightLine />
                </div>
              </div>
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Telegram_block_bottom
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Telegram_block_bottom_box
                  }
                >
                  <HiInformationCircle /> <span>Chat with Us</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Telegram_block_bottom_box
                  }
                >
                  <HiUserGroup /> <span>+13k</span>
                </div>
              </div>
            </div>
          </div>

          {/*Twitter*/}
          <div className={Style.aboutUs_container_joinUsBlocks_Twitter}>
            <div className={Style.aboutUs_container_joinUsBlocks_Twitter_block}>
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Twitter_block_top
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Twitter_block_top_left
                  }
                >
                  <FaXTwitter />
                  <span>X</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Twitter_block_top_right
                  }
                >
                  <RiArrowDropRightLine />
                </div>
              </div>
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Twitter_block_bottom
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Twitter_block_bottom_box
                  }
                >
                  <HiInformationCircle />
                  <span>Updates</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Twitter_block_bottom_box
                  }
                >
                  <HiUserGroup />
                  <span>+312k</span>
                </div>
              </div>
            </div>
          </div>

          {/*Linkedin Block */}
          <div className={Style.aboutUs_container_joinUsBlocks_Linkedin}>
            <div
              className={Style.aboutUs_container_joinUsBlocks_Linkedin_block}
            >
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Linkedin_block_top
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Linkedin_block_top_left
                  }
                >
                  <FaLinkedin />
                  <span>Linkedin</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Linkedin_block_top_right
                  }
                >
                  <RiArrowDropRightLine />
                </div>
              </div>
              <div
                className={
                  Style.aboutUs_container_joinUsBlocks_Linkedin_block_bottom
                }
              >
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Linkedin_block_bottom_box
                  }
                >
                  <HiInformationCircle />
                  <span>Help Center</span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_joinUsBlocks_Linkedin_block_bottom_box
                  }
                >
                  <HiUserGroup />
                  <span>+316k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Frequently asked questions*/}
        <div className={Style.aboutUs_container_questionsBlock}>
          <div className={Style.aboutUs_container_questionsBlock_heroText}>
            <h2>Frequently</h2>
            <h2>Asked Questions</h2>
            <p>Learn more about NexaBridge</p>
          </div>

          <div className={Style.aboutUs_container_questionsBlock_question}>
            {/*ques 1*/}
            <div
              className={Style.aboutUs_container_questionsBlock_question_box}
              onClick={() => questionOpened1()}
            >
              <div
                className={
                  Style.aboutUs_container_questionsBlock_question_box_main
                }
              >
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_left
                  }
                >
                  <span>
                    <FaStar className={Style.questionIcon} /> What is
                    NexaBridge?
                  </span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_right
                  }
                >
                  <span>
                    <GoPlus />
                  </span>
                </div>
              </div>
              <div
                className={`${Style.aboutUs_container_questionsBlock_question_box_info} ${
                  openQuestion1 ? Style.open : ""
                }`}
              >
                <p>
                  {" "}
                  Stargate is the global liquidity layer for cross-chain money
                  movement, built to enable you to bridge crypto between
                  different blockchains with the speed and certainty of the
                  internet. Trusted by leading protocols and connected to over
                  80 blockchains, Stargate transfers native assets quickly at
                  low-cost, with guaranteed delivery and instant transaction
                  settlement. With over $65B in value moved to date, Stargate is
                  the trusted bridge and the standard for how you move money
                  onchain.
                </p>
              </div>
            </div>
            {/*ques 2*/}
            <div
              className={Style.aboutUs_container_questionsBlock_question_box}
              onClick={() => questionOpened2()}
            >
              <div
                className={
                  Style.aboutUs_container_questionsBlock_question_box_main
                }
              >
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_left
                  }
                >
                  <span>
                    <RiSettings4Fill className={Style.questionIcon} /> How does
                    NexaBridge work?
                  </span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_right
                  }
                >
                  <span>
                    <GoPlus />
                  </span>
                </div>
              </div>
              <div
                className={`${Style.aboutUs_container_questionsBlock_question_box_info} ${
                  openQuestion2 ? Style.open : ""
                }`}
              >
                <p>
                  Stargate is the global liquidity layer for cross-chain money
                  movement, built to enable you to bridge crypto between
                  different blockchains with the speed and certainty of the
                  internet. Trusted by leading protocols and connected to over
                  80 blockchains, Stargate transfers native assets quickly at
                  low-cost, with guaranteed delivery and instant transaction
                  settlement. With over $65B in value moved to date, Stargate is
                  the trusted bridge and the standard for how you move money
                  onchain.
                </p>
              </div>
            </div>
            {/*ques 3*/}
            <div
              className={Style.aboutUs_container_questionsBlock_question_box}
              onClick={() => questionOpened3()}
            >
              <div
                className={
                  Style.aboutUs_container_questionsBlock_question_box_main
                }
              >
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_left
                  }
                >
                  <span>
                    <IoCubeSharp className={Style.questionIcon} /> Which
                    Blockchain does it support?
                  </span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_right
                  }
                >
                  <span>
                    <GoPlus />
                  </span>
                </div>
              </div>
              <div
                className={`${Style.aboutUs_container_questionsBlock_question_box_info} ${
                  openQuestion3 ? Style.open : ""
                }`}
              >
                <p>
                  Stargate is the global liquidity layer for cross-chain money
                  movement, built to enable you to bridge crypto between
                  different blockchains with the speed and certainty of the
                  internet. Trusted by leading protocols and connected to over
                  80 blockchains, Stargate transfers native assets quickly at
                  low-cost, with guaranteed delivery and instant transaction
                  settlement. With over $65B in value moved to date, Stargate is
                  the trusted bridge and the standard for how you move money
                  onchain.
                </p>
              </div>
            </div>
            {/*ques 4*/}
            <div
              className={Style.aboutUs_container_questionsBlock_question_box}
              onClick={() => questionOpened4()}
            >
              <div
                className={
                  Style.aboutUs_container_questionsBlock_question_box_main
                }
              >
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_left
                  }
                >
                  <span>
                    <TbGridDots className={Style.questionIcon} /> How can I
                    integrate NexaBridge in my dApp?
                  </span>
                </div>
                <div
                  className={
                    Style.aboutUs_container_questionsBlock_question_box_main_right
                  }
                >
                  <span>
                    <GoPlus />
                  </span>
                </div>
              </div>
              <div
                className={`${Style.aboutUs_container_questionsBlock_question_box_info} ${
                  openQuestion4 ? Style.open : ""
                }`}
              >
                <p>
                  Stargate is the global liquidity layer for cross-chain money
                  movement, built to enable you to bridge crypto between
                  different blockchains with the speed and certainty of the
                  internet. Trusted by leading protocols and connected to over
                  80 blockchains, Stargate transfers native assets quickly at
                  low-cost, with guaranteed delivery and instant transaction
                  settlement. With over $65B in value moved to date, Stargate is
                  the trusted bridge and the standard for how you move money
                  onchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

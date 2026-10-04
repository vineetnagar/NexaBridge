import React, { useState } from "react";
import Style from "./NavBar.module.css";
import { Link } from "react-router-dom";
import nexaBridgeLogo from "../../img/nexaBridgeLogo.svg";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import Button from "../Button/Button";
import { LuRabbit } from "react-icons/lu";

const NavBar = () => {
  const [icon, openIcon] = useState(false);
  const openResources = () => {
    if (!icon) {
      openIcon(true);
    } else {
      openIcon(false);
    }
  };

  return (
    <>
      <div className={Style.navbar}>
        <div className={Style.navbar_container}>
          <div className={Style.navbar_container_left}>
            <div className={Style.navbar_container_left_logo}>
              <img
                src={nexaBridgeLogo}
                alt="logo"
                className={Style.website_logo}
              />
            </div>

            <div className={Style.navbar_container_left_heading}>
              <h2>NexaBridge</h2>
            </div>
            <div className={Style.navbar_container_left_links}>
              <ul>
                <p>Stake</p>
                <p>Overview</p>
                <p>Value Transfer API</p>
                <p onClick={() => openResources()}>
                  Resources {icon ? <MdArrowDropUp /> : <MdArrowDropDown />}
                  {icon && (
                    <div className={Style.resources_list}>
                      <div className={Style.resources_list1}>
                        <p>Developers</p>
                        <Link
                          to="https://github.com/vineetnagar"
                          className={Style.resources_element}
                        >
                          GitHub
                        </Link>
                        <Link
                          to="https://github.com/vineetnagar/NexaBridge"
                          className={Style.resources_element}
                        >
                          Docs
                        </Link>
                      </div>
                      <div className={Style.resources_list2}>
                        <p>Learn</p>
                        <Link className={Style.resources_element}>FAQ</Link>
                        <Link to="about-us" className={Style.resources_element}>
                          About
                        </Link>
                      </div>
                      <hr />
                      <div className={Style.resources_list_social}>
                        <Link to="https://x.com/VNagar26340">
                          <RiTwitterXLine />
                        </Link>
                        <p>
                          <FaTelegramPlane />
                        </p>
                        <Link to="https://www.linkedin.com/in/dhakad-vineet-53722131a/">
                          <FaLinkedin />
                        </Link>
                      </div>
                    </div>
                  )}
                </p>
              </ul>
            </div>
          </div>

          <div className={Style.navbar_container_right}>
            <Button
              btnName="Connect wallet"
              icon={<LuRabbit />}
              className={Style.navbar_container_account_btn}
            ></Button>
            <div
              className={Style.navbar_container_right_menu}
              onClick={() => openResources()}
            >
              {icon ? <MdOutlineRestaurantMenu /> : <IoMenu />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

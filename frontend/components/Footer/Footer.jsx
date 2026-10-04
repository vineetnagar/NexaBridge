import React from "react";
import Style from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_container}>
        <div className={Style.footer_container_headings}>
          <p>NexaBridge</p>
          <p>Developers</p>
          <p>Learn</p>
          <p>Support</p>
          <p>Community</p>
          <p>Partners</p>
        </div>
        <hr />
        <div className={Style.footer_container_subInfo}>
          <div className={Style.footer_container_subInfo_first}>
            <p>Transfer</p>
            <p>Earn</p>
            <p>Stake</p>
            <p>Overview</p>
          </div>
          <div className={Style.footer_container_subInfo_second}>
            <p>Github</p>
            <p>Docs</p>
          </div>
          <div className={Style.footer_container_subInfo_third}>
            <p>FAQ</p>
          </div>
          <div className={Style.footer_container_subInfo_fourth}>
            <p>Help Center</p>
            <p>Latest Updates</p>
          </div>
          <div className={Style.footer_container_subInfo_fifth}>
            <p>Discord</p>
            <p>Telegram</p>
            <p>NexaBridge(X)</p>
            <p>Carrers</p>
          </div>
          <div className={Style.footer_container_subInfo_sixth}>
            <p>Provide Liquidity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import Style from "./Button.module.css";

const Button = ({ btnName, icon }) => {
  return (
    <div className={Style.box}>
      <button className={Style.button}>
        <span className={Style.icon}>{icon}</span> &nbsp; &nbsp;
        <span className={Style.btnName}>{btnName}</span>
      </button>
    </div>
  );
};

export default Button;

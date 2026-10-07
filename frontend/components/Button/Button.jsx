import React from "react";
import Style from "./Button.module.css";

const Button = ({ btnName, icon, handleClick }) => {
  return (
    <div className={Style.box}>
      <button className={Style.button} onClick={() => handleClick()}>
        <span className={Style.icon}>{icon}</span> &nbsp; &nbsp;
        <span className={Style.btnName}>{btnName}</span>
      </button>
    </div>
  );
};

export default Button;

import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import NavBar from "../components/NavBar/NavBar";
import SwapBarBox from "../components/swapBarBox/swapBarBox";

function App() {
  return (
    <>
      <NavBar />
      <SwapBarBox />
    </>
  );
}

export default App;

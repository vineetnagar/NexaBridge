import { Routes, Route } from "react-router-dom";

import NavBar from "../components/NavBar/NavBar";
import SwapBarBox from "../components/swapBarBox/swapBarBox";
import AboutUs from "./pages/AboutUs";

import "./App.css";

function App() {
  return (
    <>
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<SwapBarBox />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import SwapBarBox from "../components/swapBarBox/swapBarBox";
import AboutUs from "./pages/AboutUs";

import "./App.css";
import Stake from "./pages/Stake";
import { NexaBridgeProvider } from "./Context/NexaBridgeContext";

function App() {
  return (
    <NexaBridgeProvider>
      <div className="app">
        <NavBar />

        <main className="main">
          <Routes>
            <Route path="/" element={<SwapBarBox />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/stake" element={<Stake />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </NexaBridgeProvider>
  );
}
export default App;

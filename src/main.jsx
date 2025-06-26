import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import HirakuTop from "./HirakuTop.jsx";
import HirakuChat from "./HirakuChat.jsx"; // ← 追加予定
import "./index.css";
import HirakuOutput from "./pages/HirakuOutput";
import HirakuLogs from "./pages/HirakuLogs";
import HirakuLogDetail from "./pages/HirakuLogDetail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/HirakuChat" element={<HirakuChat />} />
      <Route path="/HirakuOutput" element={<HirakuOutput />} />
      <Route path="/HirakuLogs" element={<HirakuLogs />} />
      <Route path="/HirakuLogDetail" element={<HirakuLogDetail />} />
    </Routes>
  </BrowserRouter>
);
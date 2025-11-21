import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { BrowserRouter, Routes, Route } from "react-router";
import Embed from "./app/components/player/Embed";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="embed" element={<Embed />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

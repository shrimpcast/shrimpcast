import "react-app-polyfill/stable";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { BrowserRouter, Routes, Route } from "react-router";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

fetch("/serviceworkerstatus.json", {
  cache: "no-store",
})
  .then(async (res) => {
    const serviceWorkerStatus = await res.json();
    console.log("Service worker enabled: " + serviceWorkerStatus.enabled);
    if (serviceWorkerStatus.enabled) serviceWorkerRegistration.register();
    else serviceWorkerRegistration.unregister();
  })
  .catch((ex) => console.log(ex));

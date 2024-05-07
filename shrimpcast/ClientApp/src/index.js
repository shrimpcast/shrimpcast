import "react-app-polyfill/stable";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();

import "./polyfills";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { createBrowserRouter, RouterProvider } from "react-router";
import Embed from "./app/components/player/Embed";

window.BrowserSupport.checkBrowserSupport(true);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const router = createBrowserRouter([
  { path: "embed", element: <Embed /> },
  { path: "*", element: <App /> },
]);

router.subscribe((state) => {
  const { historyAction } = state;
  if (historyAction === "REPLACE") return;
  document.dispatchEvent(new CustomEvent("navigationEvent"));
});

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

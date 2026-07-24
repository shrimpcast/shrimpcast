/**
 * Checks browser support by detecting required features
 * Runs outside the React tree so it also works in browsers that cannot parse ES6
 **/
"use strict";
var BrowserSupport = {
  // From https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/flexgap.js
  supportsFlexGap: function () {
    var flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    document.documentElement.appendChild(flex);
    var flexHeight = flex.scrollHeight;
    var isSupported = flexHeight === 1 || flexHeight === 2;
    flex.parentNode.removeChild(flex);
    return isSupported;
  },

  supportsCssMinMathFunction: function () {
    try {
      return CSS.supports("width", "min(1px, 2px)");
    } catch (e) {
      return false;
    }
  },

  isBrowserSupported: function () {
    if (!this.supportsFlexGap() || !this.supportsCssMinMathFunction()) return false;
    return true;
  },

  displayBrowserUnsupported: function () {
    const rootElement = document.querySelector("#root");
    rootElement.style.display = "none";
    if (document.getElementById("unsupported-browser-error-message")) return;
    var errorMessageElement = document.createElement("p");
    errorMessageElement.id = "unsupported-browser-error-message";
    errorMessageElement.textContent = "Your browser is too old to run this app.";
    document.body.appendChild(errorMessageElement);
  },

  checkBrowserSupport: function (throwIfUnsupported) {
    if (this.isBrowserSupported()) return;
    this.displayBrowserUnsupported();
    if (!throwIfUnsupported) return;
    throw new Error("Unsupported browser detected");
  },
};

BrowserSupport.checkBrowserSupport(false);

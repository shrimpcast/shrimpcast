function supportsFlexGap() {
  const flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  const supported = flex.scrollHeight === 1;
  document.body.removeChild(flex);

  return supported;
}

function supportsCssMinMathFunction() {
  try {
    return CSS.supports("width", "min(1px, 2px)");
  } catch (e) {
    return false;
  }
}

isBrowserSupported = function () {
  if (!supportsFlexGap() || !supportsCssMinMathFunction()) return false;
  return true;
};

displayBrowserUnsupported = function () {
  const oldBrowsersElement = document.querySelector("#oldbrowsers");
  const rootElement = document.querySelector("#root");
  oldBrowsersElement.style.display = "block";
  rootElement.style.display = "none";
};

window.checkBrowserSupport = function (throwIfUnsupported) {
  if (isBrowserSupported()) return;
  displayBrowserUnsupported();
  if (!throwIfUnsupported) return;
  throw new Error("Unsupported browser detected");
};

checkBrowserSupport(false);

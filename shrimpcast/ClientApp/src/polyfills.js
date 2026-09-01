import "react-app-polyfill/stable";
if (!Object.hasOwn) {
  Object.defineProperty(Object, "hasOwn", {
    value: function (obj, prop) {
      if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      return Object.prototype.hasOwnProperty.call(obj, prop);
    },
    configurable: true,
    writable: true,
    enumerable: false,
  });
}

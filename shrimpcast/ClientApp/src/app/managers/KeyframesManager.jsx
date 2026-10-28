import { keyframes } from "@emotion/react";

class KeyframesManager {
  static goldenGlowCache = new Map();

  static getGoldenGlowKeyframes = (color) => {
    if (!this.goldenGlowCache.has(color)) {
      this.goldenGlowCache.set(
        color,
        keyframes`
          from {
            text-shadow: 0 0 5px ${color}, 0 0 5px ${color};
          }
          to {
            text-shadow: 0 0 20px ${color}, 0 0 20px ${color};
          }`
      );
    }
    return this.goldenGlowCache.get(color);
  };
}

export default KeyframesManager;

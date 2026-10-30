import MediaServerManager from "./MediaServerManager";

class LoadBalancingManager {
  static Random(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  static WeightedPick(instances) {
    let total = Math.random() * 100;

    for (let i = 0; i < instances.length; i++) {
      const weight = +instances[i];

      if (total < weight) return i + 1;
      total -= weight;
    }
  }

  static RandomBetweenExcept(instances) {
    const max = +instances[0];
    const except = instances[1].split(",").map((i) => +i);
    let pick = this.Random(max);
    while (except.includes(pick)) pick = this.Random(max);
    return pick;
  }

  static ResolveBalancing(input, isThumbnail) {
    const { name, streamOverride, lbSettings } = input;
    const isOverrideUrl = MediaServerManager.IsURL(streamOverride);
    const streamUrlPath = isOverrideUrl.pathname || `/api/mediaserver/streams/${streamOverride || name}/index.m3u8`;
    const origin = isOverrideUrl.origin || window.location.origin;
    if (!lbSettings) return origin + streamUrlPath;
    const hostname = isOverrideUrl.hostname || window.location.hostname;
    return this.DoResolve(streamUrlPath, hostname, lbSettings, isThumbnail);
  }

  static DoResolve(streamUrlPath, hostname, lbs, isThumbnail) {
    let pick;

    if (isNaN(lbs)) {
      if (lbs.startsWith("w")) {
        pick = this.WeightedPick(lbs.replace("w", "").split(","));
      }
      if (lbs.startsWith("ei")) {
        pick = this.RandomBetweenExcept(lbs.replace("ei", "").split("_"));
      }
    } else {
      pick = this.Random(lbs);
    }

    const origin = `https://lb${pick}.${hostname}` + streamUrlPath;
    if (!isThumbnail) console.log("Resolved origin: " + origin);
    return origin;
  }
}

export default LoadBalancingManager;

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

  static ResolveBalancing(input, cacheTimestampKey) {
    if (!input?.startsWith("[lbs]")) return input;
    if (cacheTimestampKey && window[cacheTimestampKey]) return window[cacheTimestampKey];

    const url = input.split("[/lbs]");
    const lbs = url[0].replace("[lbs]", "");
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

    const origin = url[1].replace("{lbi}", pick);
    console.log("Resolved origin: " + origin);
    if (cacheTimestampKey) window[cacheTimestampKey] = origin;
    return origin;
  }
}

export default LoadBalancingManager;

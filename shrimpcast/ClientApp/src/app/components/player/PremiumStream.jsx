import { useEffect } from "react";
import NothingPlaying from "./NothingPlaying";

const PremiumStream = () => {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("openPremiumStream"));
  }, []);

  return <NothingPlaying message={"This is a premium stream, please buy a pass :-)"} />;
};

export default PremiumStream;

import { useEffect } from "react";
import NothingPlaying from "./NothingPlaying";

const PremiumStream = () => {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("openPremiumStream"));
  }, []);

  return <NothingPlaying message={"This stream is exclusive to gold users. Get a pass to join in!"} />;
};

export default PremiumStream;

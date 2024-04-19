import { Fireworks } from "@fireworks-js/react";
import React, { useEffect, useRef } from "react";

const ShowFireworks = (props) => {
  const ref = useRef(null),
    { enableFireworks } = props.configuration;

  useEffect(() => {
    if (enableFireworks) {
      ref.current.start();
    }
  }, [enableFireworks]);

  return (
    <>
      {enableFireworks && (
        <Fireworks
          ref={ref}
          options={{ opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 2,
            pointerEvents:'none',
          }}
        />
      )}
    </>
  );
};

export default ShowFireworks;

import React from "react";
import Snowfall from "react-snowfall";

const ShowSnow = (props) => {
  const { enableChristmasTheme, snowflakeCount } = props.configuration;

  return (
    <>
      {enableChristmasTheme && (
        <div
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Snowfall snowflakeCount={snowflakeCount} />
        </div>
      )}
    </>
  );
};

export default ShowSnow;

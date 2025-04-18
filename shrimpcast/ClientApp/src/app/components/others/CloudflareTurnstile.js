import { Box, Typography } from "@mui/material";
import postscribe from "postscribe";
import { useState, useEffect } from "react";
import CenteredSpinner from "../loaders/CenteredSpinner";

const CloudflareTurnstile = ({ config }) => {
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  useEffect(() => {
    if (!turnstileLoaded) {
      postscribe(
        "#c-cf-turnstile-js",
        `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>`,
        {
          done: () => setTurnstileLoaded(true),
          error: (ex) => console.log(ex),
        }
      );
    } else {
      window.turnstile.render("#turnstile", {
        sitekey: config.turnstilePublicKey,
        callback: function (token) {
          console.log("Succeded challenge: " + token);
          window.location.search = `?TT=${token}`;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileLoaded]);

  return (
    <Box textAlign={"center"}>
      <div id="c-cf-turnstile-js"></div>
      {!turnstileLoaded ? (
        <CenteredSpinner turnstail={true} />
      ) : (
        <>
          {config.turnstileTitle && (
            <Typography variant="h4" color={"primary.600"} mb={1}>
              {config.turnstileTitle}
            </Typography>
          )}
          <div id="turnstile" data-theme={config.useDarkTheme ? "dark" : "light"}></div>
        </>
      )}
    </Box>
  );
};

export default CloudflareTurnstile;

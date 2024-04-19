import { Alert, Container } from "@mui/material";
import CountdownTimer from "../others/CountdownTimer";

const Centered = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%);",
  webkitTransform: "translate(-50%, -50%);",
};

const ErrorAlert = (props) => {
  const { disconnectMessage } = props,
    isCountdown = disconnectMessage && new Date(disconnectMessage).toString() !== "Invalid Date";

  return (
    <Container sx={Centered}>
      <Alert severity={isCountdown ? "info" : "error"}>
        {isCountdown ? (
          <CountdownTimer timestamp={disconnectMessage} />
        ) : disconnectMessage ? (
          disconnectMessage
        ) : (
          "Could not establish a connection with the server. Refresh to try again."
        )}
      </Alert>
    </Container>
  );
};

export default ErrorAlert;

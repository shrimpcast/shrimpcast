import ErrorAlert from "./ErrorAlert";

const FallbackError = ({ error }) => {
  const message = `The following runtime error occurred: ${error.stack}. Please report this message (${process.env.REACT_APP_VERSION}).`;
  return <ErrorAlert disconnectMessage={message} />;
};

export default FallbackError;

import ErrorAlert from "./ErrorAlert";

const FallbackError = ({ error }) => {
  const message = `The following runtime error occurred: ${error.stack}. Please report this message (${import.meta.env.VITE_APP_VERSION}).`;
  return <ErrorAlert disconnectMessage={message} />;
};

export default FallbackError;

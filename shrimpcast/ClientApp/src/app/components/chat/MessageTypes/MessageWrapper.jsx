import { Zoom } from "@mui/material";

const MessageWrapper = ({ useTransition, children }) => {
  if (useTransition) return <Zoom in={true}>{children}</Zoom>;
  else return <>{children}</>;
};

export default MessageWrapper;

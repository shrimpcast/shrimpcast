import { Fade } from "@mui/material";

const MessageWrapper = ({ useTransition, children }) => {
  if (useTransition) return <Fade in={true}>{children}</Fade>;
  else return <>{children}</>;
};

export default MessageWrapper;

import React, { useEffect, useRef, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  DialogContent,
  Divider,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TokenManager from "../../../managers/TokenManager";
import InvoiceTable from "./InvoiceTable";
import KeyframesManager from "../../../managers/KeyframesManager";
import { yellow } from "@mui/material/colors";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const DialogSx = {
    borderRadius: "10px",
    boxShadow: 24,
    bgcolor: "#424242",
  },
  DialogTitleSx = {
    fontSize: "22px",
    pb: "10px",
    fontWeight: "bold",
    color: "#fff",
  },
  DialogContentSx = {
    padding: "20px",
    bgcolor: "#303030",
    borderRadius: "5px",
  },
  BuyButtonSx = {
    bgcolor: "#ff9800",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    "&:hover": {
      bgcolor: "#e68900",
    },
  },
  InvoiceSx = {
    height: "520px",
    border: "none",
    width: "334px",
  },
  GoldenPassGlow = (color) => ({
    fontWeight: "bold",
    color,
    animation: `${KeyframesManager.getGoldenGlowKeyframes(color)} 1s infinite alternate`,
  });

const GoldenPassDialog = (props) => {
  const { closeDialog, configuration, goldenPassTitle, signalR, colours } = props,
    { enableStripe, enableBTCServer, goldenPassValue } = configuration,
    [amount, setAmount] = useState(goldenPassValue),
    customAmountReference = useRef(null),
    [colour, setColour] = useState(colours[0].colourHex),
    [loading, setLoading] = useState(false),
    [invoices, setInvoices] = useState(null),
    [toastMessage, setToastMessage] = useState(""),
    [showToast, setShowToast] = useState(false),
    closeToast = () => setShowToast(false),
    [checkoutUrl, setCheckoutUrl] = useState(""),
    closeCheckoutDialog = () => setCheckoutUrl(""),
    getInvoices = async () => {
      const invoices = await TokenManager.GetSessionInvoices(signalR);
      setInvoices(invoices);
    },
    beginPurchase = async (isCrypto) => {
      setLoading(true);
      const response = await TokenManager.BeginGoldenPassPurchase(signalR, isCrypto, amount);
      setLoading(false);
      if (!response || response.includes("Error")) {
        setToastMessage(response || "Error: could not complete purchase.");
        setShowToast(true);
        return;
      }

      if (isCrypto) setCheckoutUrl(response);
      else window.open(response, "_self");
      getInvoices();
    },
    [alignment, setAlignment] = useState("default"),
    handleAlignment = (event, newAlignment) => {
      if (!newAlignment) return;
      setAlignment(newAlignment);

      if (newAlignment === "default") {
        setAmount(goldenPassValue);
      } else {
        setTimeout(() => customAmountReference.current.focus(), 100);
      }
    },
    setCustomAmount = (event, isBlur) => {
      const customAmount = +event.target.value;
      if (isNaN(customAmount)) return;
      if (isBlur && customAmount < goldenPassValue) {
        setAmount(goldenPassValue);
        return;
      }
      setAmount(customAmount);
    };

  useEffect(() => {
    getInvoices();
    window.__glowShowcaseInterval = setInterval(
      () =>
        setColour((colour) => {
          let index = colours.findIndex((c) => c.colourHex === colour);
          if (index + 1 === colours.length) index = -1;
          return colours[index + 1].colourHex;
        }),
      2000,
    );
    return () => {
      setInvoices(null);
      clearInterval(window.__glowShowcaseInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog open={true} onClose={closeDialog} maxWidth={"sm"} fullWidth PaperProps={{ sx: DialogSx }}>
        <DialogTitle sx={DialogTitleSx}>
          GET YOUR {goldenPassTitle}{" "}
          <Typography variant="span" className="neon-text" color={yellow[600]}>
            GOLDEN PASS
            <WorkspacePremiumIcon sx={{ position: "relative", top: "5px" }} />
          </Typography>
          <Divider color="#FFF" />
        </DialogTitle>
        <DialogContent sx={DialogContentSx}>
          <Typography variant="body1" marginTop="5px">
            Get the {goldenPassTitle} golden pass if you wish to support the site, and enjoy complimentary benefits such
            as:
          </Typography>
          <Box marginTop="10px" mb={1}>
            <Typography variant="body2" sx={GoldenPassGlow(colour)}>
              - <WorkspacePremiumIcon sx={{ fontSize: "13px", position: "relative", top: "1px" }} /> Glowie username
            </Typography>
            <Typography variant="body2">- No cooldown between messages</Typography>
            <Typography variant="body2">- Unlimited duration </Typography>
            {enableBTCServer && <Typography variant="body2">- 100% anonymous via crypto</Typography>}
            <Typography variant="body2">- All payments are processed automatically</Typography>
          </Box>
          <Box mb={2}>
            <Typography display="inline-block" variant="body1">
              Contribution amount:
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
              sx={{ ml: 1 }}
            >
              <ToggleButton value="default" aria-label="default aligned">
                USD ${goldenPassValue}
              </ToggleButton>
              <ToggleButton
                value="custom"
                aria-label="custom aligned"
                sx={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
              >
                CUSTOM $
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              onChange={setCustomAmount}
              onBlur={(e) => setCustomAmount(e, true)}
              variant="outlined"
              type="number"
              size="small"
              value={amount.toString()}
              inputProps={{
                sx: {
                  height: "21.5px",
                  width: "60px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
                display: alignment !== "custom" ? "none" : "initial",
              }}
              inputRef={customAmountReference}
            />
          </Box>
          {enableBTCServer && (
            <Box justifyContent="center" display="flex">
              <Button
                disabled={loading || !enableBTCServer}
                onClick={() => beginPurchase(true)}
                variant="contained"
                sx={BuyButtonSx}
              >
                Contribute with crypto - USD ${amount}
                {loading && <CircularProgress color="primary" sx={{ ml: "10px" }} size={14} />}
              </Button>
            </Box>
          )}
          {enableStripe && (
            <Box justifyContent="center" display="flex" mt={2}>
              <Button
                disabled={loading || !enableStripe}
                onClick={() => beginPurchase(false)}
                variant="contained"
                sx={BuyButtonSx}
              >
                Contribute with card (stripe) - USD ${amount}
                {loading && <CircularProgress color="primary" sx={{ ml: "10px" }} size={14} />}
              </Button>
            </Box>
          )}
          <InvoiceTable invoices={invoices} setCheckoutUrl={setCheckoutUrl} />
        </DialogContent>
      </Dialog>
      {showToast && (
        <Snackbar open={showToast} autoHideDuration={7500} onClose={closeToast}>
          <Alert
            severity={toastMessage.includes("Enabled") ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
      {checkoutUrl && (
        <Dialog open={true} onClose={closeCheckoutDialog} sx={{ borderRadius: "5px" }}>
          <iframe style={InvoiceSx} src={checkoutUrl} title="checkout-page" />
        </Dialog>
      )}
    </>
  );
};

export default GoldenPassDialog;

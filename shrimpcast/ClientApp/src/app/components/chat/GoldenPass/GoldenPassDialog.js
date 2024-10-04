import React, { useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent, Divider, Typography, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TokenManager from "../../../managers/TokenManager";
import InvoiceTable from "./InvoiceTable";

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
  };

const GoldenPassDialog = (props) => {
  const { closeDialog, configuration, goldenPassTitle, signalR } = props,
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
    beginPurchase = async () => {
      setLoading(true);
      const response = await TokenManager.BeginGoldenPassPurchase(signalR);
      setLoading(false);
      if (!response || response.includes("Error")) {
        setToastMessage(response || "Error: could not complete purchase.");
        setShowToast(true);
        return;
      }

      setCheckoutUrl(response);
      getInvoices();
    };

  useEffect(() => {
    getInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog open={true} onClose={closeDialog} maxWidth={"sm"} fullWidth PaperProps={{ sx: DialogSx }}>
        <DialogTitle sx={DialogTitleSx}>
          GET YOUR {goldenPassTitle}{" "}
          <Typography variant="span" color="secondary.400">
            GOLDEN PASS
            <WorkspacePremiumIcon sx={{ position: "relative", top: "5px" }} />
          </Typography>
          <Divider color="#FFF" />
        </DialogTitle>
        <DialogContent sx={DialogContentSx}>
          <Typography variant="body1" marginTop="5px">
            Buy the {goldenPassTitle} golden pass if you wish to support the site, and enjoy complimentary benefits such
            as:
          </Typography>
          <Box marginTop="10px" mb={3}>
            <Typography variant="body2" className="golden-glow">
              - Glowie username
            </Typography>
            <Typography variant="body2">- Unlimited duration </Typography>
            <Typography variant="body2">- 100% anonymous via crypto</Typography>
          </Box>
          <Box justifyContent="center" display="flex">
            <Button disabled={loading} onClick={beginPurchase} variant="contained" sx={BuyButtonSx}>
              Buy Golden Pass (USD ${configuration.goldenPassValue}){" "}
              {loading && <CircularProgress color="primary" sx={{ ml: "10px" }} size={14} />}
            </Button>
          </Box>

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

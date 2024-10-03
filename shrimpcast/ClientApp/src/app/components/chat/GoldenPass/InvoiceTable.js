import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
} from "@mui/material";

const TableSx = {
    borderRadius: "5px",
    mt: "20px",
    padding: "15px",
  },
  StatusLoaderSx = {
    position: "relative",
    left: "5px",
    top: "2px",
  },
  InvoicesLoaderSx = {
    textAlign: "center",
    width: "100%",
    mt: "5px",
  };

const InvoiceTable = ({ invoices, setCheckoutUrl }) => {
  return (
    <TableContainer component={Paper} sx={TableSx}>
      <Typography textAlign="center" variant="h5" component="h5" gutterBottom>
        Invoices
      </Typography>
      <Divider />
      {invoices ? (
        invoices.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Checkout</TableCell>
                <TableCell>Created at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {invoice.status}
                    {(invoice.status === "Processing" || invoice.status === "New") && (
                      <CircularProgress size={12} sx={StatusLoaderSx} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => setCheckoutUrl(invoice.checkoutLink)}>open</Button>
                  </TableCell>
                  <TableCell>{new Date(invoice.createdTime * 1000).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography mt="5px">No records found</Typography>
        )
      ) : (
        <Box sx={InvoicesLoaderSx}>
          <CircularProgress size={36} />
        </Box>
      )}
    </TableContainer>
  );
};

export default InvoiceTable;

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
  CircularProgress,
  Box,
  Divider,
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

const InvoiceTable = ({ invoices }) => {
  return (
    <TableContainer component={Paper} sx={TableSx}>
      <Typography variant="h4" component="h4" gutterBottom>
        Invoices
      </Typography>
      <Divider />
      {invoices ? (
        invoices.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Checkout link</TableCell>
                <TableCell>Created time</TableCell>
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
                    <Link href={invoice.checkoutLink} target="_blank" rel="noopener">
                      open
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(invoice.createdTime * 1000).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography mt="5px">No invoices found</Typography>
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

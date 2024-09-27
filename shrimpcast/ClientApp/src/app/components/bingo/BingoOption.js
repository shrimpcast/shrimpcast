import React from "react";
import { Box, Card } from "@mui/material";
import { styled } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";
import { AutoTextSize } from "auto-text-size";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";
import BingoManager from "../../managers/BingoManager";

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(1),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      cursor: "pointer",
    },
    position: "relative",
  })),
  CardContentSx = {
    height: 85,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
  };

const BingoOption = React.memo((props) => {
  const { bingoOptionId, content, isChecked, signalR } = props,
    canAutoSize = Boolean(window.ResizeObserver),
    markAsChecked = async (BingoOptionId) => {
      await BingoManager.ToggleOptionStatus(signalR, BingoOptionId);
    };

  return (
    <Grid xs={6} sm={3} md={12 / 5}>
      <StyledCard background="red" onClick={() => markAsChecked(bingoOptionId)}>
        <Box sx={CardContentSx}>
          {canAutoSize ? (
            <AutoTextSize mode="box">
              <p className="noselect">{content}</p>
            </AutoTextSize>
          ) : (
            <p className="noselect">{content}</p>
          )}
        </Box>
        {isChecked && (
          <Box sx={{ position: "absolute", height: "100%" }}>
            <CloseIcon sx={{ height: "100px", width: "100px", color: red[500] }} />
          </Box>
        )}
      </StyledCard>
    </Grid>
  );
});

export default BingoOption;

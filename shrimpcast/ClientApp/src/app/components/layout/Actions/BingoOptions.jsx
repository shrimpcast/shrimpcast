import GenericActionList from "./GenericActionList";
import BingoManager from "../../../managers/BingoManager";
import { GridOnOutlined as GridOnOutlinedIcon } from "@mui/icons-material";

const BingoOptions = (props) => {
  return (
    <GenericActionList
      title="Bingo options"
      getItems={BingoManager.GetOptions}
      removeItem={BingoManager.RemoveOption}
      icon={GridOnOutlinedIcon}
      identifier="bingoOptionId"
      contentIdentifier="content"
      customButton="Add option"
      gad_description="Bingo option content"
      gad_title="Add bingo option"
      gad_handleSubmit={BingoManager.NewOption}
      showScroll={true}
      {...props}
    />
  );
};

export default BingoOptions;

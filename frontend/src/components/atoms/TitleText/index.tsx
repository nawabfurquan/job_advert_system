import { Typography } from "@mui/material";
import React from "react";
import theme from "../../../utils/theme/theme";

interface ITitleText {
  text: string;
}

const TitleText: React.FC<ITitleText> = ({ text }) => {
  return (
    <Typography variant="h4" gutterBottom color={theme.palette.grey[800]}>
      {text}
    </Typography>
  );
};

export default TitleText;

import { Link, SxProps, Theme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import theme from "../../../utils/theme/theme";

interface INavButton {
  value: number;
  currentValue: number;
  handleChange: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newValue: number
  ) => void;
  to: string;
  text: string;
}

const NavButton: React.FC<INavButton> = ({
  value,
  currentValue,
  handleChange,
  to,
  text,
}: INavButton) => {
  const styles = (val: number): SxProps<Theme> => {
    return {
      marginRight: "2vw",
      padding: "1vh",
      paddingBottom: "1.5vh",
      borderBottom:
        value === val ? `2px solid ${theme.palette.primary.main}` : undefined,
      ":hover": {
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.grey[200],
      },
      ...theme.typography.button,
      fontSize: "1rem",
    };
  };

  return (
    <Link
      className="header-button"
      sx={{ ...styles(currentValue) }}
      component={RouterLink}
      underline="none"
      onClick={(e) => handleChange(e, currentValue)}
      to={to}
    >
      {text}
    </Link>
  );
};

export default NavButton;

import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import theme from "../../../utils/theme/theme";
import { ExpandMore } from "@mui/icons-material";

export interface IFilterOption {
  title: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}
const FilterOption: React.FC<IFilterOption> = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Select chip options
  const handleChipClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        mb: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: 1,
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            cursor: "pointer",
            userSelect: "none",
            color: theme.palette.grey[700],
          }}
        >
          {title}
        </Typography>
        <IconButton onClick={toggleOpen} data-testid="filter_expand">
          <ExpandMore />
        </IconButton>
      </Box>
      {isOpen && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {options.map((option) => (
            <Chip
              key={option}
              label={option}
              clickable
              onClick={() => handleChipClick(option)}
              color={selectedOptions.includes(option) ? "primary" : "default"}
              variant={selectedOptions.includes(option) ? "filled" : "outlined"}
              sx={{ ...theme.typography.body2 }}
              data-testid="filter_chip"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FilterOption;

import { Box } from "@mui/material";
import { Oval } from "react-loader-spinner";
import theme from "../../../utils/theme/theme";

const Loader = () => {
  return (
    <Box
      sx={{
        mt: 16,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Oval
        visible={true}
        height="80"
        width="80"
        color={theme.palette.primary.main}
        secondaryColor={theme.palette.grey[400]}
        ariaLabel="oval-loading"
      />
    </Box>
  );
};

export default Loader;

import { Box, Button, Container, Typography } from "@mui/material";
import theme from "../../../utils/theme/theme";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "90vh",
        p: 3,
        mt: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: "10vh",
          height: "30vh",
          justifyContent: "space-around",
          py: 2,
        }}
      >
        <Typography variant="h3" sx={{ color: theme.palette.grey[800] }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
          Not Found
        </Typography>
        <Button variant="contained">
          <Link
            to={"/"}
            style={{
              textDecoration: "none",
              color: theme.palette.common.white,
            }}
            data-testid="homepage_btn"
          >
            Back to Homepage
          </Link>
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;

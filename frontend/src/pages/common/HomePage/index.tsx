import React from "react";
import { Container, Typography, Button, Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  FEATURE_LIST,
  HOME_DESCRIPTION,
  HOME_TITLE,
} from "../../../utils/constants/constants";
import theme from "../../../utils/theme/theme";
import { useAuth } from "../../../utils/context/authContext";

const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin, isEmployer } = useAuth();
  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container>
        <Box
          sx={{
            textAlign: "center",
            my: 8,
            py: 6,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: theme.palette.grey[800] }}
          >
            {HOME_TITLE}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            paragraph
            sx={{ color: theme.palette.grey[700], mb: 4 }}
          >
            {HOME_DESCRIPTION}
          </Typography>
          <Box sx={{ mt: 4 }}>
            {/* Links */}
            {isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                sx={{ mr: 2 }}
                to={
                  isAdmin
                    ? "/admin/dashboard"
                    : isEmployer
                    ? "/employer/dashboard"
                    : "/user/dashboard"
                }
                data-testid="signup_btn"
              >
                Go to Dashboard
              </Button>
            )}
            {!isAuthenticated || (!isAdmin && !isEmployer) ? (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/jobs"
                sx={{ mr: 2 }}
                data-testid="job_btn"
              >
                Search Jobs
              </Button>
            ) : (
              <></>
            )}
            {!isAuthenticated && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  sx={{ mr: 2 }}
                  data-testid="login_btn"
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/signup"
                  data-testid="signup_btn"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ my: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ textAlign: "center", mb: 4, color: theme.palette.grey[800] }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {FEATURE_LIST.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 2, color: theme.palette.primary.main }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey[600] }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;

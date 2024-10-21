import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import { useAuth } from "../../../utils/context/authContext";
import { JOB_HUB } from "../../../utils/constants/constants";
import { toast, ToastContainer } from "react-toastify";

interface IHeader {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<IHeader> = ({ setIsLoading }) => {
  // State variables
  const { isAuthenticated, isAdmin, isEmployer, logout } = useAuth();
  const navigate = useNavigate();

  // Logout
  const handleClick = async () => {
    try {
      setIsLoading(true);
      await logout(navigate);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Styling border for the links
  const styles = {
    color: "white",
    textDecoration: "none",
    "&.active": {
      borderBottom: "2px solid white",
    },
    "&:hover": {
      borderBottom: "2px solid white",
    },
    mx: 1,
    borderRadius: 0,
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.header }}>
      <Container>
        <ToastContainer />
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            <NavLink
              to="/"
              style={{
                textDecoration: "none",
                color: "white",
                fontSize: "1.4rem",
              }}
            >
              {JOB_HUB}
            </NavLink>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? (
              // Different header options for admin or employer
              isAdmin || isEmployer ? (
                <>
                  <Button
                    component={NavLink}
                    to={isAdmin ? "/admin/dashboard" : "/employer/dashboard"}
                    sx={{
                      ...styles,
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={NavLink}
                    to={isAdmin ? "/admin/jobs" : "/employer/jobs"}
                    sx={{
                      ...styles,
                    }}
                  >
                    Jobs
                  </Button>
                  <Button
                    component={NavLink}
                    to={
                      isAdmin ? "/admin/applications" : "/employer/applications"
                    }
                    sx={{
                      ...styles,
                    }}
                  >
                    Applications
                  </Button>
                  <Button
                    component={NavLink}
                    to={isAdmin ? "/admin/profile" : "/employer/profile"}
                    sx={{
                      ...styles,
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    sx={{
                      ...styles,
                    }}
                    onClick={handleClick}
                    data-testid="logout"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                // Header options for user
                <>
                  <Button
                    component={NavLink}
                    to="/user/dashboard"
                    sx={{
                      ...styles,
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={NavLink}
                    to="/jobs"
                    sx={{
                      ...styles,
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    component={NavLink}
                    to="/user/applications"
                    sx={{
                      ...styles,
                    }}
                  >
                    Applications
                  </Button>
                  <Button
                    component={NavLink}
                    to="/user/profile"
                    sx={{
                      ...styles,
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    sx={{
                      ...styles,
                    }}
                    onClick={() => logout(navigate)}
                  >
                    Logout
                  </Button>
                </>
              )
            ) : (
              <>
                <Button
                  component={NavLink}
                  to="/jobs"
                  sx={{
                    ...styles,
                  }}
                >
                  Search
                </Button>
                <Button
                  component={NavLink}
                  to="/login"
                  sx={{
                    ...styles,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={NavLink}
                  to="/signup"
                  sx={{
                    ...styles,
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

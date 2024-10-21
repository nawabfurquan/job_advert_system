import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { postLogin } from "../../../utils/api/authRequests";
import { useAuth } from "../../../utils/context/authContext";
import { Oval } from "react-loader-spinner";
import {
  FORGOT_PASSWORD,
  LOGIN,
  SIGN_UP_LINK,
} from "../../../utils/constants/constants";
import theme from "../../../utils/theme/theme";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addAuthData } = useAuth();
  const navigate = useNavigate();

  // Handle Login
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validator.isEmail(email)) {
      try {
        setLoading(true);
        // API call
        const response = await postLogin({ email, password });
        const user = response.data?.user;
        const authToken = response.data?.authToken;
        const refreshToken = response.data?.refreshToken;
        if (user && authToken && refreshToken) {
          const isAdmin = user?.isAdmin;
          const isEmployer = user?.isEmployer;
          // Set Auth Token
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("refreshToken", refreshToken);
          // Add Auth Data
          addAuthData({
            isAdmin: isAdmin,
            isEmployer: isEmployer,
            isAuthenticated: true,
            user: {
              ...user,
            },
          });
          // Navigate to dashboard
          navigate(
            isAdmin
              ? "/admin/dashboard"
              : isEmployer
              ? "/employer/dashboard"
              : "/user/dashboard"
          );
        }
      } catch (err: any) {
        // Error Handling
        if (err?.response) {
          const message = err?.response?.data?.message || "An Error occurred";
          toast.error(message);
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid Email. Please try again.");
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            {!loading ? (
              <>
                <ToastContainer />
                <Typography component="h1" variant="h5" color={"primary.dark"}>
                  {LOGIN}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "email_field" }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    inputProps={{ "data-testid": "password_field" }}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                    <Typography color="error" variant="body1" mt={1}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    data-testid="login_btn"
                  >
                    {LOGIN}
                  </Button>
                  <Box display="flex" justifyContent="space-between">
                    <Link
                      component={RouterLink}
                      to="/signup"
                      variant="body2"
                      data-testid="signup_btn"
                    >
                      {SIGN_UP_LINK}
                    </Link>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="body2"
                      data-testid="forgot_btn"
                    >
                      {FORGOT_PASSWORD}
                    </Link>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ mt: 16 }}>
                <Oval
                  visible={true}
                  height="80"
                  width="80"
                  color={theme.palette.primary.main}
                  secondaryColor={theme.palette.grey[400]}
                  ariaLabel="oval-loading"
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../utils/theme/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resetPassword,
  tokenExpiryCheck,
} from "../../../utils/api/authRequests";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";
import { Oval } from "react-loader-spinner";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkExpiry = async () => {
    try {
      setLoading(true);
      // Check token expiry
      const response = await tokenExpiryCheck(token as string);
      if (response.data?.expired) {
        setExpired(response.data?.expired);
      } else {
        setExpired(true);
      }
    } catch (err: any) {
      toast.error("An error occured");
      setExpired(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkExpiry();
  }, [token]);

  const handleSubmit = async () => {
    // Validate password
    const isValidPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });
    const isPasswordMatch = validator.equals(password, confirmPassword);

    if (isValidPassword && isPasswordMatch) {
      try {
        setLoading(true);

        // Reset password
        const response = await resetPassword(token as string, { password });
        if (response.data?.success) {
          toast.success("Password changed successfully.", {
            onClose: () => navigate("/login"),
          });
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
      if (!isPasswordMatch) {
        setError("Passwords do no match");
      } else {
        setError("Invalid Password");
      }
    }
  };

  return (
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
          alignItems: "center",
          backgroundColor: "white",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 16,
            width: "50%",
          }}
        >
          {!loading ? (
            // Expired link
            expired ? (
              <>
                <Typography component="h1" variant="h5" color={"primary.dark"}>
                  This link is expired
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
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
                </Box>
              </>
            ) : (
              <>
                <Typography component="h1" variant="h5" color={"primary.dark"}>
                  Reset Password
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ mt: 4 }}
                    color={theme.palette.grey[800]}
                  >
                    Enter your new password
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.85rem",
                      color: theme.palette.warning.light,
                    }}
                  >
                    The password should be atleast 8 characters with a
                    combination of uppercase, lowercase letters, numbers and
                    special characters
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoFocus
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {error && (
                    <Typography
                      color="error"
                      variant="body1"
                      mt={2}
                      sx={{ fontSize: "1.1rem" }}
                    >
                      {error}. Please try again.
                    </Typography>
                  )}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>

                  <ToastContainer />
                </Box>
              </>
            )
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
  );
};

export default ResetPasswordPage;

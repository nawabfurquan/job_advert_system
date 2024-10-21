import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Oval } from "react-loader-spinner";
import theme from "../../../utils/theme/theme";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import validator from "validator";
import { forgotPassword } from "../../../utils/api/authRequests";
import { toast, ToastContainer } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validate email
    const isValidEmail = validator.isEmail(email);
    if (isValidEmail) {
      try {
        setLoading(true);
        // Forgot password API call
        const response = await forgotPassword({ email });
        if (response.data?.success) {
          toast.success("Reset Password link sent");
        }
      } catch (err: any) {
        // Error Handling
        const message = err?.response?.data?.message ?? "An Error occurred";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid Email");
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
          }}
        >
          {!loading ? (
            <>
              <Typography component="h1" variant="h5" color={"primary.dark"}>
                Forgot Password
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ mt: 4 }}
                  color={theme.palette.grey[800]}
                >
                  Enter your email to receive the link to reset password:
                </Typography>
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  data-testid="login_btn"
                >
                  Back to Login
                </Link>
                <ToastContainer />
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
  );
};

export default ForgotPasswordPage;

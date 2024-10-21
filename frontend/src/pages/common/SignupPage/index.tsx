import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import { LOGIN_LINK, SIGN_UP } from "../../../utils/constants/constants";
import { Oval } from "react-loader-spinner";
import { postSignup } from "../../../utils/api/authRequests";
import { useAuth } from "../../../utils/context/authContext";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";

const SignupPage = () => {
  // State variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleValue, setToggleValue] = useState("user");
  const { addAuthData } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChangeToggle = (e: any, value: string) => {
    setToggleValue(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Check if password is same
    const isValidEmail = validator.isEmail(email);
    const isValidPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });
    const isPasswordMatch = validator.equals(password, confirmPassword);
    const isValidPhone = validator.isMobilePhone(phone);

    if (isValidEmail && isPasswordMatch && isValidPassword && isValidPhone) {
      try {
        // Signup API call
        let requestBody: any = {
          email,
          name,
          password,
          phone: Number(phone),
        };

        if (toggleValue === "employer") {
          requestBody["isEmployer"] = true;
          requestBody["access_code"] = code;
        }
        const response = await postSignup({
          ...requestBody,
        });
        const authToken = response.data?.authToken;
        const refreshToken = response.data?.refreshToken;
        const user = response.data?.user;

        if (authToken && user && refreshToken) {
          // Set Auth Token
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("refreshToken", refreshToken);
          // Add Auth Data
          addAuthData({
            isAdmin: user.isAdmin,
            isEmployer: user.isEmployer,
            isAuthenticated: true,
            user: {
              ...user,
            },
          });
          // Navigate to dashboard
          navigate(
            user.isAdmin
              ? "/admin/dashboard"
              : user.isEmployer
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
      // Setting error
      if (!isValidEmail) {
        setError("Invalid Email");
      } else if (!isPasswordMatch) {
        setError("Passwords do no match");
      } else if (!isValidPhone) {
        setError("Invalid Phone Number");
      } else {
        setError("Invalid Password");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
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
            justifyContent: "center",
            backgroundColor: "white",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
            }}
          >
            {!loading ? (
              <>
                <ToggleButtonGroup
                  color="primary"
                  value={toggleValue}
                  exclusive
                  onChange={handleChangeToggle}
                  sx={{ width: "50%" }}
                >
                  <ToggleButton value={"user"} sx={{ width: "50%" }}>
                    User
                  </ToggleButton>
                  <ToggleButton
                    value={"employer"}
                    sx={{ width: "50%" }}
                    data-testid="employer_btn"
                  >
                    Employer
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography
                  component="h1"
                  variant="h5"
                  color={"primary.dark"}
                  sx={{ mt: 4 }}
                >
                  {SIGN_UP}
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mt: 1, width: "50%" }}
                >
                  <TextField
                    id="name"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Enter your Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    inputProps={{ "data-testid": "name_field" }}
                  />
                  <TextField
                    id="email"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Enter your Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "email_field" }}
                  />
                  <PhoneInput
                    value={phone}
                    onChange={(e) => setPhone(e)}
                    placeholder="Enter your Phone Number"
                    inputStyle={{ width: "100%", ...theme.typography.body1 }}
                    enableSearch
                    containerStyle={{
                      width: "100%",
                      height: "100%",
                      marginTop: "16px",
                    }}
                    inputProps={{ "data-testid": "phone_field" }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Enter your Password"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mt: 4 }}
                    inputProps={{ "data-testid": "password_field" }}
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
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    autoComplete="current-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mt: 4 }}
                    inputProps={{ "data-testid": "confirm_field" }}
                  />
                  {toggleValue === "employer" && (
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="code"
                      label="Code"
                      id="code"
                      autoComplete="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  )}
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
                    sx={{ mt: 3, mb: 2 }}
                    data-testid="signup_btn"
                  >
                    {SIGN_UP}
                  </Button>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                  >
                    <Link
                      component={RouterLink}
                      to="/login"
                      variant="body2"
                      data-testid="login_btn"
                    >
                      {LOGIN_LINK}
                    </Link>
                  </Box>
                </Box>
              </>
            ) : (
              <Box>
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

export default SignupPage;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import TitleText from "../../../components/atoms/TitleText";
import { useAuth } from "../../../utils/context/authContext";
import validator from "validator";
import theme from "../../../utils/theme/theme";
import Loader from "../../../components/organisms/Loader";
import { ExpandMore } from "@mui/icons-material";
import {
  updatePassword,
  updateUserById,
} from "../../../utils/api/userRequests";
import { toast, ToastContainer } from "react-toastify";
import PhoneInput from "react-phone-input-2";

const AdminEmployerProfilePage: React.FC = () => {
  // State variables
  const { user, isAdmin, addAuthData } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone?.toString() ?? "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const isValidEmail = validator.isEmail(email);
    const isValidPhone = validator.isMobilePhone(phone);

    if (isValidEmail && isValidPhone) {
      try {
        setLoading(true);
        // Update user by id
        const response = await updateUserById(
          user?.userId,
          { email, name, phone: Number(phone) },
          false
        );

        if (response.data?.user) {
          // Add auth data
          addAuthData({
            isAuthenticated: true,
            isAdmin: response.data.user?.isAdmin,
            isEmployer: response.data.user?.isEmployer,
            user: response.data.user,
          });
          toast.success("Updated Successfully");
        }
      } catch (err: any) {
        // Setting error
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
      if (!isValidEmail) setError("Invalid Email");
      else setError("Invalid Phone");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    // Validate password
    const isValidPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });

    // Compare password and confirm password
    const isPasswordEqual = validator.equals(password, confirmPassword);
    if (isValidPassword && isPasswordEqual) {
      try {
        setLoading(true);
        // Update password
        const response = await updatePassword({
          userId: user?.userId,
          password,
        });
        if (response.data?.success) {
          toast.success("Password changed successfully.");
        }
      } catch (err: any) {
        // Error Handling
        if (err.response) {
          const message = err?.response?.data?.message || "An Error occurred";
          toast.error(message);
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Setting password error
      if (!isPasswordEqual) {
        setPasswordError("Passwords do no match");
      } else if (!isValidPassword) {
        setPasswordError("Invalid Password");
      }
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "white",
        p: 3,
        mt: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "600px" }}>
        {!loading ? (
          <>
            <TitleText text={`${isAdmin ? "Admin" : "Employer"} Profile`} />
            <Box sx={{ mt: "5vh" }}>
              <ToastContainer />
              {/* Personal details */}
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ backgroundColor: theme.palette.grey[200] }}
                >
                  <Typography variant="h6">Update Personal Details</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                  <Box
                    sx={{ paddingX: 2, paddingBottom: 2 }}
                    component="form"
                    onSubmit={handleSave}
                  >
                    <Typography variant="h6">Name</Typography>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Name"
                      type="text"
                      fullWidth
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Email
                    </Typography>
                    <TextField
                      margin="dense"
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Phone
                    </Typography>
                    <PhoneInput
                      value={phone}
                      onChange={(e) => setPhone(e)}
                      placeholder="Enter your Phone Number"
                      inputStyle={{ width: "100%", ...theme.typography.body1 }}
                      enableSearch
                      containerStyle={{
                        width: "100%",
                        height: "100%",
                        marginBottom: "16px",
                      }}
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
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
              {/* Password */}
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ backgroundColor: theme.palette.grey[200] }}
                >
                  <Typography variant="h6">Update Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ paddingX: 2, paddingBottom: 2 }}
                    component={"form"}
                    onSubmit={handlePasswordChange}
                  >
                    <Typography variant="h6">Password</Typography>
                    <TextField
                      margin="dense"
                      label="Password"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Confirm Password
                    </Typography>
                    <TextField
                      margin="dense"
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {passwordError && (
                      <Typography
                        color="error"
                        variant="body1"
                        mt={2}
                        sx={{ fontSize: "1.1rem" }}
                      >
                        {passwordError}. Please try again.
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      type="submit"
                    >
                      Change Password
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default AdminEmployerProfilePage;

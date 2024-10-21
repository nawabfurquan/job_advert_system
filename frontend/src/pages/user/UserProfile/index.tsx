import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  Divider,
  AccordionDetails,
} from "@mui/material";
import { useAuth } from "../../../utils/context/authContext";
import {
  getResumeById,
  getUserById,
  updatePassword,
  updateUserById,
} from "../../../utils/api/userRequests";
import TitleText from "../../../components/atoms/TitleText";
import Loader from "../../../components/organisms/Loader";
import theme from "../../../utils/theme/theme";
import { Download, ExpandMore, UploadFile } from "@mui/icons-material";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";
import UserProfilePersonal from "../../../components/organisms/UserProfilePersonal";
import UserProfilePreference from "../../../components/organisms/UserProfilePreference";

const UserProfilePage: React.FC = () => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const { user, setUser } = useAuth();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState<string[]>([]);
  const [salary, setSalary] = useState<number | null>(null);
  const [resume, setResume] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const getUserData = async () => {
    try {
      setLoading(true);
      // Get user by user id
      const userResponse = await getUserById(user?.userId);
      const userData = userResponse.data?.user;
      // Setting user data
      if (userData) {
        setUserId(userData.userId);
        setEmail(userData.email);
        setName(userData.name);
        setPhone(userData?.phone?.toString() ?? "");
        setLocation(userData?.location || "");
        setSkills(userData?.skills || []);
        setJobType(userData?.preferences?.jobType || []);
        setIndustry(userData?.preferences?.industry || []);
        setPreferredLocation(userData?.preferences?.location || []);
        setSalary(userData?.preferences?.salary ?? null);
        setResume(userData?.resume);
        setResumeFile(userData?.resume);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Deleting by passing the item and set function
  const handleDelete =
    (
      itemToDelete: string,
      setFunc: React.Dispatch<React.SetStateAction<string[]>>
    ) =>
    () => {
      setFunc((prev) => prev.filter((item) => item !== itemToDelete));
    };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    // Validating password
    const isValidPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });
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
          toast.success("Password updated successfully");
          setPassword("");
          setConfirmPassword("");
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
      // Validation error handling
      if (!isPasswordEqual) {
        setPasswordError("Passwords do no match");
      } else if (!isValidPassword) {
        setPasswordError("Invalid Password");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validating email
    const isValidEmail = validator.isEmail(email);
    const isValidPhone = validator.isMobilePhone(phone);

    if (isValidEmail && isValidPhone) {
      try {
        setLoading(true);

        let formData: { [key: string]: any } = {};
        let isResume = false;

        // Checking if each field is empty or not before sending the data
        if (userId && name && email) {
          formData.userId = userId;
          formData.name = name;
          formData.email = email;
        }

        if (phone !== null) {
          formData.phone = Number(phone);
        }

        if (location) {
          formData.location = location;
        }

        if (skills.length > 0) {
          formData.skills = skills;
        }
        if (jobType.length > 0) {
          formData.preferences = { ...formData.preferences, jobType };
        }
        if (industry.length > 0) {
          formData.preferences = { ...formData.preferences, industry };
        }
        if (preferredLocation.length > 0) {
          formData.preferences = {
            ...formData.preferences,
            location: preferredLocation,
          };
        }
        if (salary !== null) {
          formData.preferences = { ...formData.preferences, salary };
        }

        // Checking if resume file is updated
        if (
          resumeFile !== null &&
          JSON.stringify(resume) !== JSON.stringify(resumeFile)
        ) {
          isResume = true;
          formData.resume = resumeFile;
        }

        // Update user
        const response = await updateUserById(userId, formData, isResume);
        if (response.data?.user) {
          setUser(response.data.user);
          toast.success("Updated successfully");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      if (!isValidEmail) setError("Invalid Email");
      else setError("Invalid Phone Number");
    }
  };

  const handleUpload = (e: any) => {
    setResumeError("");
    const file = e.target.files[0];
    if (file) {
      // Accept only pdf files
      if (file?.type !== "application/pdf" || file?.size > 2e6) {
        toast.error("Please upload a file of .pdf format within 2MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      // Get Resume by id
      const response = await getResumeById(resume?.userFileId);
      const url = window.URL.createObjectURL(response.data);
      // Link to download file
      const link = document.createElement("a");
      link.href = url;
      // Adding file name
      link.setAttribute("download", resume?.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
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
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        {!loading ? (
          <>
            <ToastContainer />
            <TitleText text="User Profile" />

            <Box sx={{ mt: "5vh" }}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ backgroundColor: theme.palette.grey[200] }}
                >
                  <Typography variant="h6">Update Personal Details</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                  <Box component={"form"} onSubmit={handleSubmit}>
                    {/* User Personal details */}
                    <UserProfilePersonal
                      email={email}
                      name={name}
                      location={location}
                      phone={phone}
                      setEmail={setEmail}
                      setLocation={setLocation}
                      setName={setName}
                      setPhone={setPhone}
                    />
                    {/* Resume */}
                    <Box
                      sx={{
                        p: 2,
                        my: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFile />}
                        >
                          {resumeFile?.name ? "Replace" : "Upload"} Resume/CV
                          (.pdf format within 2MB)
                          <input
                            type="file"
                            onChange={handleUpload}
                            hidden
                            accept="application/pdf"
                          />
                        </Button>

                        {resumeFile?.name && (
                          <Typography
                            variant="button"
                            color="GrayText"
                            sx={{
                              ml: 2,
                              textTransform: "none",
                              textDecoration: "underline",
                            }}
                          >
                            {resumeFile?.name}
                          </Typography>
                        )}
                      </Box>
                      {resumeError && (
                        <Typography variant="body2" color="error">
                          {resumeError}
                        </Typography>
                      )}
                      {resume?.name && (
                        <Button
                          component="label"
                          variant="outlined"
                          color="secondary"
                          startIcon={<Download />}
                          onClick={handleDownload}
                          sx={{ mt: 3 }}
                        >
                          Download Resume/CV
                        </Button>
                      )}
                    </Box>

                    {/* User Profile Skills and Preferences */}
                    <UserProfilePreference
                      handleDelete={handleDelete}
                      industry={industry}
                      jobType={jobType}
                      preferredLocation={preferredLocation}
                      salary={salary}
                      setIndustry={setIndustry}
                      setJobType={setJobType}
                      setPreferredLocation={setPreferredLocation}
                      setSalary={setSalary}
                      setSkills={setSkills}
                      skills={skills}
                    />
                    {/* Showing error */}
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
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        data-testid="save_btn"
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              {/* Update Password */}
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ backgroundColor: theme.palette.grey[200] }}
                >
                  <Typography variant="h6">Update Password</Typography>
                </AccordionSummary>
                <Divider />
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
                      inputProps={{ "data-testid": "confirm_field" }}
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
                      type="submit"
                      color="primary"
                      sx={{ mt: 2 }}
                      data-testid="change_btn"
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

export default UserProfilePage;

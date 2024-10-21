import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../utils/theme/theme";
import { CloseRounded, UploadFile } from "@mui/icons-material";
import { createApplication } from "../../../utils/api/applicationRequests";
import { useAuth } from "../../../utils/context/authContext";
import PhoneInput from "react-phone-input-2";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";

interface IJobApplyModal {
  openModal: boolean;
  handleClose: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  jobId: string;
  initApplication: () => Promise<void>;
}

const JobApplyModal: React.FC<IJobApplyModal> = ({
  openModal,
  handleClose,
  jobId,
  userId,
  initApplication,
  setIsLoading,
}) => {
  // State variables
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [resume, setResume] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState<any>(null);
  const { user } = useAuth();
  const [resumeError, setResumeError] = useState("");
  const [coverError, setCoverError] = useState("");
  const [error, setError] = useState("");

  // Setting user data
  useEffect(() => {
    setEmail(user.email);
    setName(user.name);
    setPhone(user?.phone?.toString() ?? "");
    setLocation(user?.location);
    setResume(user?.resume);
  }, [user]);

  const applyJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validating email
    const isValidEmail = validator.isEmail(email);
    const isValidPhone = validator.isMobilePhone(phone);

    if (isValidEmail && isValidPhone && resume?.name) {
      try {
        setIsLoading(true);

        let formData: { [key: string]: any } = {};
        formData["jobId"] = jobId;
        formData["userId"] = userId;
        formData["email"] = email;
        formData["name"] = name;
        formData["phone"] = Number(phone);
        formData["location"] = location;
        formData["resume"] = resume;

        if (coverLetter?.name) {
          formData["coverLetter"] = coverLetter;
        }
        // Create application API call
        const response = await createApplication(
          formData,
          resume ? true : false
        );
        if (response.data?.application) {
          handleClose();
          initApplication();
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "An error occurred");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!isValidEmail) {
        setError("Invalid Email");
      } else if (!isValidPhone) {
        setError("Invalid Phone Number");
      } else {
        setError("Resume not uploaded");
      }
    }
  };

  const handleUpload = (e: any) => {
    setResumeError("");
    const file = e.target.files[0];
    if (file) {
      // Accept only pdf files
      if (file.type !== "application/pdf" || file?.size > 2e6) {
        setResumeError("Please upload a file of .pdf format within 2MB");
        return;
      }
      setResume(file);
    }
  };

  const handleCoverUpload = (e: any) => {
    setCoverError("");
    const file = e.target.files[0];
    if (file) {
      // Accept only pdf files
      if (file.type !== "application/pdf" || file?.size > 2e6) {
        setCoverError("Please upload a file of .pdf format within 2MB");
        return;
      }
      setCoverLetter(file);
    }
  };

  return (
    <Modal open={openModal}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            width: "50%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              height: "10%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.palette.header,
              px: 2,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            <ToastContainer />
            <Typography variant="h6" color="white">
              Confirm your application
            </Typography>
            <IconButton
              onClick={() => {
                setError("");
                setCoverError("");
                setResumeError("");
                handleClose();
              }}
              sx={{
                ":hover": {
                  border: "none",
                  background: "none",
                },
              }}
            >
              <CloseRounded sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <Box sx={{ px: 2, mt: 2 }} component={"form"} onSubmit={applyJob}>
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              disabled
              required
            />
            <PhoneInput
              value={phone}
              onChange={(e) => setPhone(e)}
              placeholder="Enter your Phone Number"
              inputStyle={{ width: "100%", ...theme.typography.body1 }}
              enableSearch
              containerStyle={{
                width: "100%",
                marginTop: 8,
                marginBottom: 8,
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                mt: 2,
                mb: 4,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  fontSize: "0.8rem",
                  color: theme.palette.grey[700],
                }}
              >
                Resume
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFile />}
                >
                  {resume?.name ? "Replace" : "Upload"} Resume/CV (.pdf within
                  2MB)
                  <input
                    type="file"
                    onChange={handleUpload}
                    hidden
                    accept="application/pdf"
                  />
                </Button>
                {resume?.name && (
                  <Typography
                    variant="button"
                    color="GrayText"
                    sx={{
                      ml: 2,
                      textTransform: "none",
                      textDecoration: "underline",
                    }}
                  >
                    {resume?.name}
                  </Typography>
                )}
              </Box>
            </Box>
            {resumeError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {resumeError}
              </Typography>
            )}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 4,
              }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
              >
                {coverLetter?.name ? "Replace" : "Upload"} Cover Letter
                (Optional) (.pdf within 2MB)
                <input
                  type="file"
                  onChange={handleCoverUpload}
                  hidden
                  accept="application/pdf"
                />
              </Button>
              {coverLetter?.name && (
                <Typography
                  variant="button"
                  color="GrayText"
                  sx={{
                    ml: 2,
                    textTransform: "none",
                    textDecoration: "underline",
                  }}
                >
                  {coverLetter?.name}
                </Typography>
              )}
            </Box>
            {coverError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {coverError}
              </Typography>
            )}

            {/* Showing error */}
            {error && (
              <Typography
                color="error"
                variant="body1"
                mt={1}
                mb={2}
                sx={{ fontSize: "1.1rem" }}
              >
                {error}. Please try again.
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              data-testid="job_modal_apply_btn"
            >
              Apply Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobApplyModal;

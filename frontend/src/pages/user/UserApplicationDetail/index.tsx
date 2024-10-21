import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../utils/theme/theme";
import Loader from "../../../components/organisms/Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteApplicationById,
  downloadApplicationFile,
  getApplicationById,
} from "../../../utils/api/applicationRequests";
import { toast, ToastContainer } from "react-toastify";
import { APPROVED, REJECTED } from "../../../utils/constants/constants";

const UserApplicationDetail = () => {
  // State variables
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState<any>();
  const navigate = useNavigate();

  const getApplicationDetails = async () => {
    try {
      setIsLoading(true);
      // Getting application by id
      const response = await getApplicationById(id as string);
      if (response?.data?.application) {
        setApplication(response?.data?.application);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) getApplicationDetails();
  }, [id]);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      // Get application file data
      const response = await downloadApplicationFile(
        application?.userInfo?.resume?.applicationFileId
      );
      const url = window.URL.createObjectURL(response.data);
      // Link to download file
      const link = document.createElement("a");
      link.href = url;
      // Assigning name to file
      link.setAttribute("download", application?.userInfo?.resume?.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);

      // Delete application by id
      const response = await deleteApplicationById(id as string);

      // Refetching data
      if (response.data?.success) {
        await getApplicationDetails();
        toast.success("Deleted successfully");
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverDownload = async () => {
    try {
      setIsLoading(true);
      // Get application file data
      const response = await downloadApplicationFile(
        application?.userInfo?.coverLetter?.applicationFileId
      );
      const url = window.URL.createObjectURL(response.data);
      // Link to download file
      const link = document.createElement("a");
      link.href = url;
      // Assigning name to file
      link.setAttribute("download", application?.userInfo?.coverLetter?.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
        mt: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        {!isLoading ? (
          <Card sx={{ p: 4 }}>
            <CardContent>
              <ToastContainer />
              <Typography
                variant="h4"
                gutterBottom
                color={theme.palette.grey[700]}
              >
                Application Details
              </Typography>
              <Box sx={{ ml: 2 }}>
                {application?.status?.toLowerCase() !== "pending" && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
                    <Typography
                      variant="h6"
                      color={
                        application?.status?.toLowerCase() === "approved"
                          ? theme.palette.success.light
                          : theme.palette.error.main
                      }
                    >
                      {application?.status?.toLowerCase() === "approved"
                        ? APPROVED
                        : REJECTED}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mt: "5vh" }}>
                  <Typography variant="h6">Job Title:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.jobTitle}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Job Company:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.jobCompany}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Name:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.userInfo?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Email:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.userInfo?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Phone:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.userInfo?.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Location:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.userInfo?.location}
                  </Typography>
                </Box>
                {application?.userInfo?.resume && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="h6">Resume:</Typography>

                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleDownload}
                      sx={{
                        ml: 2,
                        textTransform: "none",
                        textDecoration: "underline",
                      }}
                      data-testid="download_resume"
                    >
                      {application?.userInfo?.resume?.name}
                    </Button>
                  </Box>
                )}
                {application?.userInfo?.coverLetter && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="h6">Cover Letter:</Typography>

                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleCoverDownload}
                      sx={{
                        ml: 2,
                        textTransform: "none",
                        textDecoration: "underline",
                      }}
                      data-testid="download_coverletter"
                    >
                      {application?.userInfo?.coverLetter?.name}
                    </Button>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Date:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontSize: "1.1rem" }}
                  >
                    {application?.date?.split("T")?.[0]}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="h6">Status:</Typography>
                  <Typography
                    variant="h6"
                    color={
                      application?.status?.toLowerCase() === "pending"
                        ? theme.palette.warning.main
                        : application?.status?.toLowerCase() === "rejected"
                        ? theme.palette.error.main
                        : theme.palette.success.main
                    }
                    sx={{
                      ml: 2,
                    }}
                  >
                    {application?.status?.toUpperCase()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  {/* Withdraw application button */}
                  {application?.status?.toLowerCase() === "pending" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleWithdraw}
                      sx={{ mt: 4 }}
                    >
                      Withdraw
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                    sx={{ mt: 4 }}
                    data-testid="go_back"
                  >
                    Go Back
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default UserApplicationDetail;

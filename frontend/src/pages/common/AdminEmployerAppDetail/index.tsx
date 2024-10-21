import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/organisms/Loader";
import { useEffect, useState } from "react";
import {
  deleteApplicationById,
  downloadApplicationFile,
  getApplicationById,
  updateApplicationById,
} from "../../../utils/api/applicationRequests";
import { Application } from "../../../utils/types/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import theme from "../../../utils/theme/theme";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../utils/context/authContext";

const AdminEmployerAppDetail: React.FC = () => {
  const { applicationId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [application, setApplication] = useState<Application>();

  const getApplication = async () => {
    try {
      setIsLoading(true);
      // Calling getApplicationById to get data
      const response = await getApplicationById(applicationId as string);

      const applicationData = response.data?.application;
      if (applicationData)
        // Setting response data to application
        setApplication({
          applicationId: applicationData.applicationId,
          jobTitle: applicationData.jobTitle,
          userName: applicationData.userName,
          userEmail: applicationData.userEmail,
          jobCompany: applicationData.jobCompany,
          date: applicationData.date,
          userInfo: applicationData.userInfo,
          status: applicationData.status.split("T")[0],
        });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApplication();
  }, [applicationId]);

  const handleStatusChange = async (
    applicationId: string,
    updatedStatus: string
  ) => {
    try {
      setIsLoading(true);

      // Calling updateApplicationById to update application
      const response = await updateApplicationById(applicationId, {
        ...application,
        status: updatedStatus,
      });

      // Refetching application data
      if (response.data?.updatedApplication) {
        await getApplication();
        toast.success("Updated successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Delete application by id
      const response = await deleteApplicationById(applicationId as string);

      // Refetching data
      if (response.data?.success) {
        navigate(-1);
      }
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
          applicationId && application ? (
            <>
              <ToastContainer />
              <Card sx={{ px: 4, pb: 4, pt: 2 }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Application Details
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: "5vh" }}
                  >
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
                      color={theme.palette.primary.main}
                      sx={{
                        color:
                          application?.status?.toLowerCase() === "pending"
                            ? theme.palette.warning.main
                            : application?.status?.toLowerCase() === "rejected"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        ml: 2,
                      }}
                    >
                      {application.status.toUpperCase()}
                    </Typography>
                  </Box>

                  <Box
                    mt={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    {isAdmin ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    ) : application?.status?.toLowerCase() === "pending" ? (
                      <Box
                        mt={3}
                        sx={{ width: "20%" }}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() =>
                            handleStatusChange(
                              application.applicationId,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleStatusChange(
                              application.applicationId,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <></>
                    )}

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(-1)}
                      sx={{ height: "50%" }}
                      data-testid="back"
                    >
                      Back to Applications
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </>
          ) : (
            <Typography variant="h5">Application not found</Typography>
          )
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default AdminEmployerAppDetail;

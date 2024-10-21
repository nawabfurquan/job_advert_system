import { useEffect, useState } from "react";
import { Box, Typography, Grid, Container, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import { deleteJobById, getJobsByOwner } from "../../../utils/api/jobRequests";
import {
  getApplicationsByEmployerId,
  updateApplicationById,
} from "../../../utils/api/applicationRequests";
import { useAuth } from "../../../utils/context/authContext";
import { Application, Job } from "../../../utils/types/types";
import Loader from "../../../components/organisms/Loader";
import TitleText from "../../../components/atoms/TitleText";
import AdminJobCard from "../../../components/organisms/AdminJobCard";
import AdminApplicationCard from "../../../components/organisms/AdminApplicationCard";
import { toast, ToastContainer } from "react-toastify";

const EmployerDashboard = () => {
  // State variables
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);

      // Getting job, application and count data
      const jobResponse = await getJobsByOwner(user?.userId);
      const appResponse = await getApplicationsByEmployerId(user?.userId);

      const jobList = jobResponse.data?.jobList;

      if (jobList && jobList.length > 0) {
        setJobs(jobList?.slice(0, 3));
      }

      const appList = appResponse.data?.applicationList;
      if (appList && appList.length > 0) {
        setApplications(appList?.slice(0, 3));
      }
    } catch (err: any) {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) getData();
  }, [user]);

  const handleDelete = async (jobId: string) => {
    try {
      setIsLoading(true);
      // Deleting the job by id and refetching the data
      const response = await deleteJobById(jobId);
      if (response.data?.success) {
        await getData();
        toast.success("Deleted successfully");
      }
    } catch (err: any) {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    updatedStatus: string,
    application: Application
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
        await getData();
        toast.success("Updated successfully");
      }
    } catch (err: any) {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/employer/applications/${id}`);
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
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px", px: 8 }}>
        {!isLoading ? (
          <>
            <ToastContainer />
            <Box sx={{ width: "100%", color: theme.palette.grey[800] }}>
              <TitleText text={`Hi ${user?.name ?? ""}!`} />
            </Box>
            <Box sx={{ mt: 10 }}>
              {/* Jobs */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, color: theme.palette.grey[800] }}
                  gutterBottom
                >
                  Job Adverts
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={RouterLink}
                  to="/employer/jobs/create"
                  data-testid="job_create"
                  sx={{ mt: 2, mb: 3, ml: 4 }}
                >
                  Create Job
                </Button>
                {jobs.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/employer/jobs"
                    sx={{ mt: 2, mb: 3, ml: 4 }}
                    data-testid="jobs_view_all"
                  >
                    View All
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {jobs?.length > 0 ? (
                  jobs.map((job, index) => (
                    <AdminJobCard
                      job={job}
                      navigateToEdit={() =>
                        navigate(`/employer/jobs/${job?.jobId}`)
                      }
                      index={index}
                      handleDelete={handleDelete}
                      key={index}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      mt: 6,
                      ml: 4,
                      width: "50%",
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: theme.palette.body,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        p: 2,
                        color: theme.palette.grey[800],
                      }}
                    >
                      No Jobs to display
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Box>

            <Box sx={{ mt: 10 }}>
              {/* Applications */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, color: theme.palette.grey[800] }}
                  gutterBottom
                >
                  Job Applications
                </Typography>
                {applications.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/employer/applications"
                    data-testid="app_view_all"
                    sx={{ mt: 2, mb: 3, ml: 4 }}
                  >
                    View All
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {applications.length > 0 ? (
                  applications.map((application, index) => (
                    <AdminApplicationCard
                      application={application}
                      handleStatusChange={handleStatusChange}
                      key={index}
                      navigateTo={`/employer/applications/${application?.applicationId}`}
                      handleView={handleView}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      mt: 6,
                      ml: 4,
                      width: "50%",
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: theme.palette.body,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        p: 2,
                        color: theme.palette.grey[800],
                      }}
                    >
                      No Applications to display
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Box>
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default EmployerDashboard;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
} from "@mui/material";
import { useAuth } from "../../../utils/context/authContext";
import { Link as RouterLink } from "react-router-dom";
import { Application, Job } from "../../../utils/types/types";
import {
  deleteApplicationById,
  getApplicationByUserId,
} from "../../../utils/api/applicationRequests";
import Loader from "../../../components/organisms/Loader";
import { getRecommendedJobs } from "../../../utils/api/jobRequests";
import TitleText from "../../../components/atoms/TitleText";
import UserJobCard from "../../../components/organisms/UserJobCard";
import UserApplicationCard from "../../../components/organisms/UserApplicationCard";
import theme from "../../../utils/theme/theme";
import { toast, ToastContainer } from "react-toastify";

const UserDashboard: React.FC = () => {
  // State variables
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getData = async () => {
    try {
      setLoading(true);
      // Get recommended jobs for the user
      const jobResponse = await getRecommendedJobs(user.userId);
      // Get the applications for the user
      const response = await getApplicationByUserId(user.userId);
      const jobList = jobResponse.data?.jobs;
      const applicationList = response.data?.applicationList;
      // Showing only first 3 applications
      if (applicationList) {
        setApplications(applicationList?.slice(0, 3));
      }

      // Showing only first 3 jobs
      if (jobList) {
        setRecommendedJobs(jobList?.slice(0, 3));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    try {
      setLoading(true);
      // Delete application by id
      const response = await deleteApplicationById(applicationId);

      // Refetching data
      if (response.data?.success) {
        await getData();
        toast.success("Deleted successfully");
      }
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
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        {!loading ? (
          <>
            <ToastContainer />
            <TitleText text={`Hi ${user.name}!`} />
            {/* Recommended Job List */}
            <Box mt={8} sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" gutterBottom>
                Recommended Jobs
              </Typography>
              {recommendedJobs.length > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/user/recommended"
                  sx={{ mt: 2, mb: 3, ml: 4 }}
                  data-testid="job_view_all"
                >
                  View All
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <UserJobCard job={job} key={job.jobId} />
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

            {/* Application List */}
            <Box mt={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" gutterBottom>
                My Applications
              </Typography>
              {applications.length > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/user/applications"
                  sx={{ mt: 2, mb: 3, ml: 4 }}
                  data-testid="app_view_all"
                >
                  View All
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <UserApplicationCard
                    application={application}
                    handleWithdraw={handleWithdraw}
                    key={application.applicationId}
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
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default UserDashboard;

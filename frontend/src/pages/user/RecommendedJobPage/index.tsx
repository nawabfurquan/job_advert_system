import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Modal,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import dayjs from "dayjs";
import { Job } from "../../../utils/types/types";
import { getRecommendedJobs } from "../../../utils/api/jobRequests";
import { Oval } from "react-loader-spinner";
import { useAuth } from "../../../utils/context/authContext";
import TitleText from "../../../components/atoms/TitleText";
import Loader from "../../../components/organisms/Loader";
import { toast, ToastContainer } from "react-toastify";

const RecommendedJobPage = () => {
  // State variables
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getData = async () => {
    try {
      setIsLoading(true);

      // Getting recommended jobs
      const jobResponse = await getRecommendedJobs(user?.userId);
      const jobList = jobResponse.data?.jobs;

      if (jobList) {
        setRecommendedJobs(jobList);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        {!isLoading ? (
          <>
            <ToastContainer />
            <TitleText text="Recommended Jobs For You" />
            {/* Recommended job list */}
            <Grid container spacing={3} mt={4}>
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <Grid item xs={12} sm={6} md={4} key={job.jobId}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          color={theme.palette.grey[800]}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color={theme.palette.grey[600]}
                        >
                          {job.company}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.grey[700]}
                        >
                          {job.location}
                        </Typography>
                        <Box
                          mt={2}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            component={RouterLink}
                            to={`/jobs/${job.jobId}`}
                            data-testid="job_view"
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    mt: 6,
                    ml: 4,
                    width: "100%",
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
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default RecommendedJobPage;

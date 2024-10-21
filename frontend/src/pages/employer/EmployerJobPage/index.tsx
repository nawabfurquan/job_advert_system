import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Job } from "../../../utils/types/types";
import { deleteJobById, getJobsByOwner } from "../../../utils/api/jobRequests";
import TitleText from "../../../components/atoms/TitleText";
import Loader from "../../../components/organisms/Loader";
import AdminJobCard from "../../../components/organisms/AdminJobCard";
import theme from "../../../utils/theme/theme";
import { useAuth } from "../../../utils/context/authContext";
import { toast, ToastContainer } from "react-toastify";

const EmployerJobPage = () => {
  // State variables
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getData = async () => {
    try {
      setIsLoading(true);
      // Getting all jobs data
      const jobResponse = await getJobsByOwner(user?.userId);
      const jobList = jobResponse.data?.jobList;

      if (jobList && jobList.length > 0) {
        setJobs(jobList);
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

  const onCreate = () => {
    navigate("/employer/jobs/create");
  };

  const handleDelete = async (jobId: string) => {
    try {
      setIsLoading(true);
      // Delete Job by id
      const response = await deleteJobById(jobId);
      if (response.data?.success) {
        await getData();
        toast.success("Deleted successfully");
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
        backgroundColor: "white",
        p: 3,
        mt: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        {!isLoading ? (
          <>
            <ToastContainer />
            <TitleText text="Job Management" />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onCreate()}
              sx={{ mt: 2, mb: 3 }}
            >
              Create Job
            </Button>
            <Grid container spacing={3}>
              {jobs.length ? (
                jobs.map((job, index) => (
                  <AdminJobCard
                    job={job}
                    index={index}
                    navigateToEdit={() =>
                      navigate(`/employer/jobs/${job?.jobId}`)
                    }
                    handleDelete={handleDelete}
                    key={index}
                  />
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

export default EmployerJobPage;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Button,
} from "@mui/material";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import { deleteJobById, getAllJobs } from "../../../utils/api/jobRequests";
import {
  deleteApplicationById,
  getAllApplications,
  updateApplicationById,
} from "../../../utils/api/applicationRequests";
import { useAuth } from "../../../utils/context/authContext";
import { getAllCount } from "../../../utils/api/adminRequests";
import { Oval } from "react-loader-spinner";
import { Application, Job } from "../../../utils/types/types";
import Loader from "../../../components/organisms/Loader";
import TitleText from "../../../components/atoms/TitleText";
import AdminCountCard from "../../../components/molecules/AdminCountCard";
import AdminJobCard from "../../../components/organisms/AdminJobCard";
import AdminApplicationCard from "../../../components/organisms/AdminApplicationCard";
import { toast, ToastContainer } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState<{
    user: Number;
    application: Number;
    job: Number;
  }>({
    user: 0,
    application: 0,
    job: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();

  const getData = async () => {
    try {
      setIsLoading(true);

      // Getting job, application and count data
      const jobResponse: any = await getAllJobs();
      const appResponse = await getAllApplications();
      const countResponse = await getAllCount();

      setCount({
        user: countResponse.data?.user,
        application: countResponse.data?.application,
        job: countResponse.data?.job,
      });

      const jobList = jobResponse.data?.jobList;

      if (jobList && jobList.length > 0) {
        setJobs(jobList?.slice(0, 3));
      }

      const appList = appResponse.data?.applicationList;

      if (appList && appList.length > 0) {
        setApplications(appList?.slice(0, 3));
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
      toast.error(err?.response?.data?.message ?? "An error occurred");
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
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      setIsLoading(true);

      // Delete application by id
      const response = await deleteApplicationById(id);

      // Refetching data
      if (response.data?.success) {
        await getData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/applications/${id}`);
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
            <Grid container spacing={3} justifyContent={"center"} mt={2}>
              <AdminCountCard
                to="/admin/jobs"
                text="Total Jobs"
                count={count?.job?.toString()}
              />
              <AdminCountCard
                to="/admin/applications"
                text="Total Applications"
                data-testid="app_count"
                count={count?.application?.toString()}
              />
            </Grid>
            <Box sx={{ mt: 10 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, color: theme.palette.grey[800] }}
                  gutterBottom
                >
                  Job Adverts
                </Typography>
                {jobs.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/admin/jobs"
                    data-testid="job_view_all"
                    sx={{ mt: 2, mb: 3, ml: 4 }}
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
                        navigate(`/admin/jobs/${job?.jobId}`)
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
                    to="/admin/applications"
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
                      handleView={handleView}
                      navigateTo={`/admin/applications/${application?.applicationId}`}
                      isAdmin={isAdmin}
                      handleDelete={handleDeleteApplication}
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

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  List,
  ListItemText,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import theme from "../../../utils/theme/theme";
import { getJobById } from "../../../utils/api/jobRequests";
import Loader from "../../../components/organisms/Loader";
import { Job } from "../../../utils/types/types";
import { useAuth } from "../../../utils/context/authContext";
import { checkUserApplication } from "../../../utils/api/applicationRequests";
import JobDetailModal from "../../../components/organisms/JobDetailModal";
import JobApplyModal from "../../../components/organisms/JobApplyModal";
import { updateInteractions } from "../../../utils/api/userRequests";
import { toast, ToastContainer } from "react-toastify";

const JobDetailPage: React.FC = () => {
  // State variables
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [job, setJob] = useState<Job>();
  const { isAuthenticated, user, setUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [applicationId, setApplicationId] = useState<string>();
  const [applied, setApplied] = useState(false);

  const getJob = async () => {
    try {
      setIsLoading(true);
      // Getting job by id
      const response = await getJobById(id as string);

      const jobData = response.data?.job;
      if (jobData)
        // Setting job data
        setJob({
          jobId: jobData.jobId,
          title: jobData.title,
          description: jobData.description,
          requirements: jobData?.requirements,
          responsibilities: jobData?.responsibilities,
          skills: jobData?.skills,
          postedDate: jobData?.postedDate?.split?.("T")?.[0],
          industry: jobData?.industry,
          company: jobData?.company,
          location: jobData?.location,
          salary: jobData?.salary,
          jobType: jobData?.jobType,
          deadline: jobData?.deadline?.split?.("T")?.[0],
        });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingApplication = async () => {
    try {
      setIsLoading(true);
      if (!user.isAdmin && isAuthenticated) {
        // Checking if user has applied for the job
        const applicationResponse = await checkUserApplication(
          user.userId,
          id as string
        );
        if (applicationResponse.data) {
          setApplicationId(applicationResponse.data?.applicationId);
          setApplied(applicationResponse.data?.applied);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const patchInteractions = async () => {
    try {
      setIsLoading(true);
      // Update interactions by user id and job id
      const response = await updateInteractions(user.userId, { jobId: id });
      if (response.data?.success) {
        const userResponse = response.data?.user;
        setUser(userResponse);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize application
  const initApplication = async () => {
    if (id) {
      getJob();
    }

    if (user) {
      checkExistingApplication();
      if (
        user?.interactions?.indexOf?.(id) === -1 &&
        !user?.isAdmin &&
        !user?.isEmployer
      ) {
        patchInteractions();
      }
    }
  };

  useEffect(() => {
    initApplication();
  }, [id, user]);

  const handleClick = async () => {
    // Handling apply button click
    if (isAuthenticated) {
      setOpenApplyModal(true);
    } else {
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
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
          id && job ? (
            <>
              <ToastContainer />
              <Card sx={{ p: 4 }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    gutterBottom
                    color={theme.palette.grey[700]}
                  >
                    {job?.title}
                  </Typography>
                  <Typography variant="h6">{job?.company}</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {job?.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Skills:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {job?.skills?.map?.((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          fontSize: "1rem",
                          backgroundColor: theme.palette.grey[300],
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Requirements:
                  </Typography>
                  <List>
                    {job?.requirements?.map?.((req, index) => (
                      <ListItemText key={index}>- {req}</ListItemText>
                    ))}
                  </List>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Responsibilities:
                  </Typography>
                  <List>
                    {job?.responsibilities?.map?.((req, index) => (
                      <ListItemText key={index}>- {req}</ListItemText>
                    ))}
                  </List>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Location</b>: {job?.location}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Salary</b>: £{job?.salary}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Job Type</b>: {job?.jobType}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Industry</b>: {job?.industry}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Posted on</b>:{" "}
                    {new Date(job?.postedDate as string).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Deadline</b>:{" "}
                    {new Date(job?.deadline as string).toLocaleDateString()}
                  </Typography>
                  <Box mt={3} display="flex" justifyContent="space-between">
                    {!isAuthenticated ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                      >
                        Apply
                      </Button>
                    ) : !user.isAdmin && !user.isEmployer ? (
                      !applied ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleClick}
                        >
                          Apply
                        </Button>
                      ) : (
                        <Box>
                          <Button variant="contained" disabled>
                            Applied
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ ml: 2 }}
                            onClick={() =>
                              navigate(`/user/applications/${applicationId}`)
                            }
                          >
                            View Application
                          </Button>
                        </Box>
                      )
                    ) : (
                      <></>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(-1)}
                    >
                      Go Back
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              <JobDetailModal openModal={openModal} handleClose={handleClose} />
              {isAuthenticated && !user.isAdmin && (
                <JobApplyModal
                  openModal={openApplyModal}
                  handleClose={() => setOpenApplyModal(false)}
                  initApplication={initApplication}
                  jobId={id}
                  userId={user.userId}
                  setIsLoading={setIsLoading}
                />
              )}
            </>
          ) : (
            <Typography variant="h5">Job not found</Typography>
          )
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default JobDetailPage;

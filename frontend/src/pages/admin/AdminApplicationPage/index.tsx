import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import {
  deleteApplicationById,
  getAllApplications,
  updateApplicationById,
} from "../../../utils/api/applicationRequests";
import Loader from "../../../components/organisms/Loader";
import { Application } from "../../../utils/types/types";
import TitleText from "../../../components/atoms/TitleText";
import AdminApplicationCard from "../../../components/organisms/AdminApplicationCard";
import theme from "../../../utils/theme/theme";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../utils/context/authContext";
import { useNavigate } from "react-router-dom";

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      // Getting all applications data
      const response = await getAllApplications();
      const applicationList = response.data?.applicationList;
      if (applicationList) {
        setApplications(applicationList);
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

  const handleStatusChange = async (
    applicationId: string,
    updatedStatus: string,
    application: Application
  ) => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      // Delete application by id
      const response = await deleteApplicationById(id);

      // Refetching data
      if (response.data?.success) {
        await getData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
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
        mt: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }} data-testid="box">
        {!loading ? (
          <>
            <ToastContainer />
            <TitleText text="Job Applications" />
            <Grid container spacing={3} mt={2} data-testid="grid_container">
              {applications.length > 0 ? (
                applications.map((application, index) => (
                  <AdminApplicationCard
                    application={application}
                    handleStatusChange={handleStatusChange}
                    key={index}
                    handleView={handleView}
                    isAdmin={isAdmin}
                    handleDelete={handleDelete}
                    navigateTo={`/admin/applications/${application?.applicationId}`}
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

export default AdminApplicationsPage;
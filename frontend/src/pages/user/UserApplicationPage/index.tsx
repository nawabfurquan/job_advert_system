import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useAuth } from "../../../utils/context/authContext";
import { Application } from "../../../utils/types/types";
import {
  deleteApplicationById,
  getApplicationByUserId,
} from "../../../utils/api/applicationRequests";
import Loader from "../../../components/organisms/Loader";
import TitleText from "../../../components/atoms/TitleText";
import UserApplicationCard from "../../../components/organisms/UserApplicationCard";
import theme from "../../../utils/theme/theme";
import { toast, ToastContainer } from "react-toastify";

const UserApplicationsPage: React.FC = () => {
  // State variables
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);

      // Getting application by user id
      const response = await getApplicationByUserId(user.userId);
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

  const handleWithdraw = async (applicationId: string) => {
    try {
      setLoading(true);
      // Withdrawing an application
      const response = await deleteApplicationById(applicationId);

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
            <TitleText text="My Applications" />
            {/* Application list */}
            <Grid container spacing={3} mt={2}>
              {applications.length > 0 ? (
                applications.map((application, index) => (
                  <UserApplicationCard
                    application={application}
                    handleWithdraw={handleWithdraw}
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
                      color: theme.palette.grey[700],
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

export default UserApplicationsPage;

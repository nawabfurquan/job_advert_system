import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Application } from "../../../utils/types/types";
import theme from "../../../utils/theme/theme";
import { Link } from "react-router-dom";

interface IAdminApplicationCard {
  application: Application;
  handleView: (id: string) => void;
  handleStatusChange: (
    applicationId: string,
    updatedStatus: string,
    application: Application
  ) => Promise<void>;
  navigateTo: string;
  handleDelete?: (id: string) => Promise<void>;
  isAdmin?: boolean;
}

const AdminApplicationCard: React.FC<IAdminApplicationCard> = ({
  application,
  handleStatusChange,
  handleDelete,
  navigateTo,
  isAdmin,
  handleView,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={application?.applicationId}>
      <Card sx={{ px: 2, boxShadow: 2 }}>
        <CardContent
          data-testid="admin_app_card"
          sx={{
            textDecoration: "none",
            color: theme.palette.grey[800],
          }}
        >
          <Typography variant="h6">
            {application?.jobTitle?.substring?.(0, 28)}
          </Typography>
          <Typography variant="body1">
            Company: {application?.jobCompany}
          </Typography>

          <Typography variant="body2" mt={1}>
            Date: {new Date(application?.date)?.toLocaleDateString()}
          </Typography>
          <Box
            mt={3}
            sx={{ width: "100%" }}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                color:
                  // Changing color according to status
                  application?.status?.toLowerCase() === "pending"
                    ? theme.palette.warning.main
                    : application?.status?.toLowerCase() === "rejected"
                    ? theme.palette.error.main
                    : theme.palette.success.main,
              }}
            >
              {application?.status?.toUpperCase()}
            </Typography>
          </Box>
          <Box
            mt={3}
            sx={{ width: "100%" }}
            display="flex"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleView(application?.applicationId)}
            >
              View
            </Button>
            {!isAdmin ? (
              application?.status?.toLowerCase() === "pending" ? (
                <>
                  {" "}
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() =>
                      handleStatusChange(
                        application?.applicationId,
                        "Approved",
                        application
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
                        "Rejected",
                        application
                      )
                    }
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <></>
              )
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete?.(application.applicationId)}
              >
                Delete
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AdminApplicationCard;

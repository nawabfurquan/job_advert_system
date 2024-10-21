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

interface IUserApplicationCard {
  application: Application;
  handleWithdraw: (applicationId: string) => Promise<void>;
}

const UserApplicationCard: React.FC<IUserApplicationCard> = ({
  application,
  handleWithdraw,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6">{application.jobTitle}</Typography>
          <Typography variant="body1">{application.jobCompany}</Typography>
          <Typography
            variant="h6"
            mt={2}
            sx={{
              color:
                application?.status?.toLowerCase() === "pending"
                  ? theme.palette.warning.main
                  : application?.status?.toLowerCase() === "rejected"
                  ? theme.palette.error.main
                  : theme.palette.success.main,
              textTransform: "uppercase",
            }}
          >
            {application.status}
          </Typography>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={`/user/applications/${application.applicationId}`}
              data-testid="user_app_view"
            >
              View
            </Button>
            {application?.status?.toLowerCase() === "pending" && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleWithdraw(application.applicationId)}
              >
                Withdraw
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserApplicationCard;

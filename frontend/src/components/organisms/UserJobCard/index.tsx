import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Job } from "../../../utils/types/types";
import theme from "../../../utils/theme/theme";
import { Link } from "react-router-dom";

interface IUserJobCard {
  job: Job;
}

const UserJobCard: React.FC<IUserJobCard> = ({ job }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" color={theme.palette.grey[800]}>
            {job.title}
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.grey[600]}>
            {job.company}
          </Typography>
          <Typography variant="subtitle1" color={theme.palette.grey[700]}>
            {job.location}
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={`/jobs/${job.jobId}`}
              data-testid="user_job_view"
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserJobCard;

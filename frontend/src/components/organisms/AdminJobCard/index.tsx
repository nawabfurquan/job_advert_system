import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Job } from "../../../utils/types/types";
import theme from "../../../utils/theme/theme";
import { Link, NavigateFunction } from "react-router-dom";

interface IAdminJobCard {
  job: Job;
  index: number;
  navigateToEdit: () => void;
  handleDelete: (jobId: string) => Promise<void>;
}

const AdminJobCard: React.FC<IAdminJobCard> = ({
  job,
  index,
  navigateToEdit,
  handleDelete,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" sx={{ color: theme.palette.grey[800] }}>
            {job.title}
          </Typography>

          <Typography variant="body1">{job.company}</Typography>
          <Box mt={1}>
            <Typography variant="caption" mt={2} sx={{ fontSize: "0.85rem" }}>
              {job?.location}
            </Typography>
          </Box>
          <Typography variant="caption">
            {job?.description?.substring(0, 30)}...
          </Typography>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="primary"
              onClick={navigateToEdit}
              data-testid="admin_job_edit"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(job.jobId)}
              data-testid="admin_job_delete"
            >
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AdminJobCard;

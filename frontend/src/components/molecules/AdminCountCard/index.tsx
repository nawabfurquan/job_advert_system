import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import theme from "../../../utils/theme/theme";
import { Link } from "react-router-dom";

interface IAdminCountCard {
  to: string;
  text: string;
  count: string;
}

const AdminCountCard: React.FC<IAdminCountCard> = ({ to, text, count }) => {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          width: "100%",
        }}
      >
        <CardContent>
          <Box
            component={Link}
            sx={{
              width: "100%",
              height: "100%",
              textDecoration: "none",
            }}
            to={to}
            data-testid="count_card"
          >
            <Typography variant="h6" sx={{ color: theme.palette.grey[800] }}>
              {text}
            </Typography>
            <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
              {count}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AdminCountCard;

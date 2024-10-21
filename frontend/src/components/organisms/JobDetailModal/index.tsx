import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import theme from "../../../utils/theme/theme";
import { CloseRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface IJobDetailModal {
  openModal: boolean;
  handleClose: () => void;
}

const JobDetailModal: React.FC<IJobDetailModal> = ({
  openModal,
  handleClose,
}) => {
  return (
    <Modal open={openModal}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            width: "40%",
            height: "40%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              height: "20%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.palette.header,
              px: 2,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            <Typography variant="h6" color="white">
              Sign in to continue applying
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                ":hover": {
                  border: "none",
                  background: "none",
                },
              }}
            >
              <CloseRounded sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color={theme.palette.grey[800]}>
                New User?
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                to="/signup"
              >
                Sign up
              </Button>
            </Box>
            <Divider sx={{ height: "100%" }} orientation="vertical" />
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color={theme.palette.grey[800]}>
                Already a user?
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                to="/login"
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobDetailModal;

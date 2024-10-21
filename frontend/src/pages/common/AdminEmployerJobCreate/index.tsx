import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  MenuItem,
  Autocomplete,
  InputAdornment,
  createFilterOptions,
} from "@mui/material";
import { createJob } from "../../../utils/api/jobRequests";
import { useNavigate } from "react-router-dom";
import { Job } from "../../../utils/types/types";
import Loader from "../../../components/organisms/Loader";
import TitleText from "../../../components/atoms/TitleText";
import { Add, Delete } from "@mui/icons-material";
import theme from "../../../utils/theme/theme";
import {
  industriesData,
  jobTypesData,
  locationsData,
  skillsData,
} from "../../../utils/data/data";
import { toast, ToastContainer } from "react-toastify";

const filter = createFilterOptions<string>();

const AdminEmployerJobCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Initiliasing with empty values
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    responsibilities: [] as string[],
    skills: [] as string[],
    industry: "",
    company: "",
    location: "",
    salary: 0,
    jobType: "",
    deadline: "",
  });

  const [currentReq, setCurrentReq] = useState("");
  const [currentRes, setCurrentRes] = useState("");

  // Handle change of job field
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle delete skill
  const handleDeleteSkill = (index: number) => {
    setForm({
      ...form,
      skills: form.skills.filter((res, i) => i !== index),
    });
  };

  // Handle add requirement
  const handleAddReq = () => {
    if (currentReq.trim()) {
      setForm({
        ...form,
        requirements: [...form.requirements, currentReq.trim()],
      });
      setCurrentReq("");
    }
  };

  // Handle add responsibility
  const handleAddRes = () => {
    if (currentRes.trim()) {
      setForm({
        ...form,
        responsibilities: [...form.responsibilities, currentRes.trim()],
      });
      setCurrentRes("");
    }
  };

  // Handle delete requirement
  const handleDeleteReq = (index: number) => {
    setForm({
      ...form,
      requirements: form.requirements.filter((req, i) => i !== index),
    });
  };

  // Handle delete responsibility
  const handleDeleteRes = (index: number) => {
    setForm({
      ...form,
      responsibilities: form.responsibilities.filter((res, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Preprocessing job data before sending
      const jobData: Job = {
        ...form,
        jobId: "",
        description: form.description.trim(),
        salary: Number(form.salary),
      };

      // Creating job
      const response = await createJob(jobData);
      if (response.data?.job) navigate(-1);
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
      <Box
        sx={{ width: "100%", maxWidth: "600px" }}
        component={"form"}
        onSubmit={handleSubmit}
      >
        {!loading ? (
          <>
            <ToastContainer />
            <TitleText text="Create Job" />
            {/* Title */}
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ "data-testid": "title_field" }}
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              inputProps={{ "data-testid": "desc_field" }}
            />

            {/* Company */}
            <TextField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ "data-testid": "company_field" }}
            />

            {/* Skills field */}
            <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <Autocomplete
                  freeSolo
                  options={skillsData
                    .filter(
                      (skill) =>
                        !form.skills
                          ?.map((skill) => skill.toLowerCase())
                          ?.includes(skill.toLowerCase())
                    )
                    ?.sort()}
                  onChange={(_e, newValue) => {
                    if (newValue && !form.skills?.includes(newValue)) {
                      setForm({
                        ...form,
                        skills: [...form.skills, newValue as string],
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Skills" />
                  )}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {form?.skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      color="primary"
                      label={skill}
                      sx={{ fontSize: "1rem" }}
                      onDelete={() => handleDeleteSkill(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Divider />

            {/* Requirement */}
            <Box sx={{ display: "flex", mt: 1 }}>
              <TextField
                label="Add Requirement"
                value={currentReq}
                onChange={(e) => setCurrentReq(e.target.value)}
                fullWidth
                margin="normal"
                inputProps={{ "data-testid": "req_field" }}
              />
              <IconButton
                color="primary"
                onClick={handleAddReq}
                sx={{ ":hover": { backgroundColor: "transparent" } }}
              >
                <Add />
              </IconButton>
            </Box>
            <List>
              {form.requirements.map((req, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: theme.palette.body,
                    mb: 1,
                    borderRadius: 2,
                    ...theme.typography.body1,
                  }}
                >
                  <ListItemText>{req}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteReq(index)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider />

            {/* Responsibility */}
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <TextField
                label="Add Responsibility"
                value={currentRes}
                onChange={(e) => setCurrentRes(e.target.value)}
                fullWidth
                margin="normal"
                inputProps={{ "data-testid": "res_field" }}
              />
              <IconButton
                color="primary"
                onClick={handleAddRes}
                sx={{ ":hover": { backgroundColor: "transparent" } }}
              >
                <Add />
              </IconButton>
            </Box>
            <List>
              {form.responsibilities.map((res, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: theme.palette.body,
                    mb: 1,
                    borderRadius: 2,
                    ...theme.typography.body1,
                  }}
                >
                  <ListItemText>{res}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteRes(index)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider />

            {/* Industry */}
            <TextField
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              select
              label="Industry"
              fullWidth
              margin="normal"
              sx={{ mt: 3 }}
            >
              {industriesData.map((industry, index) => (
                <MenuItem value={industry} key={index}>
                  {industry}
                </MenuItem>
              ))}
            </TextField>

            {/* Location */}
            <Autocomplete
              fullWidth
              freeSolo
              options={locationsData}
              sx={{ mt: 3 }}
              value={form.location}
              disableClearable
              onChange={(e, newValue) =>
                setForm({ ...form, location: newValue as string })
              }
              filterOptions={(options, params) => {
                const filteredOptions = filter(options, params);

                const { inputValue } = params;
                // Check if option exist
                const isExisting = options.some(
                  (option) => inputValue === option
                );
                // Add custom input option
                if (inputValue !== "" && !isExisting) {
                  filteredOptions.push(inputValue);
                }

                return filteredOptions;
              }}
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
            />

            {/* Job Type */}
            <TextField
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              select
              label="Job Type"
              fullWidth
              margin="normal"
              sx={{ mt: 3 }}
            >
              {jobTypesData.map((jobType, index) => (
                <MenuItem value={jobType} key={index}>
                  {jobType}
                </MenuItem>
              ))}
            </TextField>

            {/* Salary */}
            <TextField
              label="Salary"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              fullWidth
              type="number"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
              }}
            />
            {/* Deadline */}
            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                data-testid="create"
                type="submit"
              >
                Create
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
                data-testid="go_back"
              >
                Go Back
              </Button>
            </Box>
          </>
        ) : (
          <Loader />
        )}
      </Box>
    </Container>
  );
};

export default AdminEmployerJobCreate;

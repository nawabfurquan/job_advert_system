import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import theme from "../../../utils/theme/theme";
import { getAllJobs, searchFilteredJobs } from "../../../utils/api/jobRequests";
import { Job } from "../../../utils/types/types";
import Loader from "../../../components/organisms/Loader";
import UserJobCard from "../../../components/organisms/UserJobCard";
import {
  industriesData,
  jobTypesData,
  locationsData,
} from "../../../utils/data/data";
import { ExpandMore } from "@mui/icons-material";
import FilterOption from "../../../components/organisms/FilterOption";
import { toast, ToastContainer } from "react-toastify";

const JobSearchPage = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);

  const handleApplyFilters = async () => {
    // Getting filtered jobs
    const response = await searchFilteredJobs({
      jobType: jobTypes,
      location: locations,
      industry: industries,
      salaryMin,
      salaryMax,
    });
    setJobs(response.data?.jobs);
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      // Getting all jobs
      const jobResponse = await getAllJobs();

      const jobList = jobResponse.data?.jobList;

      if (jobList && jobList.length > 0) {
        setJobs(jobList);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Filter jobs for search bar
    const searchedJobs = jobs.filter((job) => {
      const query = inputSearchQuery?.toLowerCase();
      const title = job?.title?.toLowerCase();
      const company = job?.company?.toLowerCase();
      const location = job?.location?.toLowerCase();
      return (
        title?.includes(query) ||
        company?.includes(query) ||
        location?.includes(query)
      );
    });
    setJobs(searchedJobs);
  };

  const handleClearFilters = () => {
    // Clear filters
    setJobTypes([]);
    setIndustries([]);
    setLocations([]);
    setSalaryMax("");
    setSalaryMin("");
    getData();
  };

  const handleClearSearch = () => {
    // Clear search bar
    setInputSearchQuery("");
    handleClearFilters();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: "2vh",
      }}
    >
      {!isLoading ? (
        <>
          <ToastContainer />
          <Box sx={{ width: "28%", mr: "2vw" }}>
            <Container sx={{ backgroundColor: "white", p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Job filters */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ textTransform: "uppercase" }}
                    data-testid="job_filters"
                  >
                    Job Filters
                  </Typography>
                  <Button
                    onClick={handleClearFilters}
                    color="error"
                    data-testid="clear_filters"
                  >
                    Clear Filters
                  </Button>
                </Box>

                <FilterOption
                  title="Job Types"
                  options={jobTypesData}
                  selectedOptions={jobTypes}
                  setSelectedOptions={setJobTypes}
                />

                <FilterOption
                  title="Locations"
                  options={locationsData}
                  selectedOptions={locations}
                  setSelectedOptions={setLocations}
                />

                <FilterOption
                  title="Industries"
                  options={industriesData}
                  selectedOptions={industries}
                  setSelectedOptions={setIndustries}
                />

                <Box
                  sx={{
                    width: "100%",
                    p: 1,
                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                      color: theme.palette.grey[700],
                    }}
                  >
                    Salary
                  </Typography>
                  <IconButton
                    onClick={() => setIsSalaryOpen(!isSalaryOpen)}
                    data-testid="salary_expand"
                  >
                    <ExpandMore />
                  </IconButton>
                </Box>
                {isSalaryOpen && (
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <TextField
                      label="Min Salary"
                      type="number"
                      fullWidth
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      data-testid="min_sal_field"
                    />
                    <TextField
                      label="Max Salary"
                      type="number"
                      fullWidth
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      data-testid="max_sal_field"
                    />
                  </Box>
                )}

                <Button
                  sx={{ mt: 4 }}
                  onClick={handleApplyFilters}
                  data-testid="apply_filters"
                >
                  Apply Filters
                </Button>
              </Box>
            </Container>
          </Box>

          <Box sx={{ width: "65%" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "white",
                p: 3,
              }}
            >
              <Box sx={{ width: "100%", maxWidth: "1200px" }}>
                {/* Search bar */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    mb: 3,
                  }}
                >
                  <TextField
                    label="Search....   (Job Title, Company or Location)"
                    variant="outlined"
                    fullWidth
                    value={inputSearchQuery}
                    onChange={handleInputChange}
                    data-testid="search_box"
                  />
                  <Button
                    sx={{ ml: 3, mr: 1 }}
                    onClick={handleSearch}
                    variant="outlined"
                    data-testid="search_button"
                  >
                    Search
                  </Button>
                  <Button
                    sx={{ ml: 2, mr: 1 }}
                    color="error"
                    variant="outlined"
                    onClick={handleClearSearch}
                    data-testid="clear_search"
                  >
                    Clear
                  </Button>
                </Box>
                {/* Job list */}
                <Grid container spacing={3} mt={2} data-testid="grid_container">
                  {jobs?.length > 0 ? (
                    jobs?.map((job) => (
                      <UserJobCard job={job} key={job?.jobId} />
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
                        No Jobs to display
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Box>
            </Container>
          </Box>
        </>
      ) : (
        <Box sx={{ height: "100%", width: "100%", backgroundColor: "white" }}>
          <Loader />
        </Box>
      )}
    </Box>
  );
};

export default JobSearchPage;

import {
  Autocomplete,
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  industriesData,
  jobTypesData,
  locationsData,
  skillsData,
} from "../../../utils/data/data";
import theme from "../../../utils/theme/theme";

interface IPreference {
  skills: string[];
  setSkills: (value: React.SetStateAction<string[]>) => void;
  salary: number | null;
  setSalary: (value: React.SetStateAction<number | null>) => void;
  jobType: string[];
  setJobType: (value: React.SetStateAction<string[]>) => void;
  handleDelete: (
    itemToDelete: string,
    setFunc: React.Dispatch<React.SetStateAction<string[]>>
  ) => () => void;
  industry: string[];
  setIndustry: (value: React.SetStateAction<string[]>) => void;
  preferredLocation: string[];
  setPreferredLocation: (value: React.SetStateAction<string[]>) => void;
}

const UserProfilePreference: React.FC<IPreference> = ({
  skills,
  setSkills,
  salary,
  setSalary,
  jobType,
  setJobType,
  handleDelete,
  industry,
  setIndustry,
  preferredLocation,
  setPreferredLocation,
}) => {
  return (
    <>
      <Box
        sx={{
          border: "1px solid " + theme.palette.grey[400],
          p: 2,
          mt: 2,
        }}
      >
        <Autocomplete
          freeSolo
          options={skillsData
            .filter(
              (skill) =>
                !skills
                  ?.map((skill) => skill.toLowerCase())
                  ?.includes(skill.toLowerCase())
            )
            ?.sort()}
          onChange={(_e, newValue) => {
            if (newValue && !skills?.includes(newValue)) {
              setSkills([...skills, newValue as string]);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Skills" />}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 1,
          }}
        >
          {skills.map((skill, index) => (
            <Chip
              key={index}
              color="primary"
              label={skill}
              sx={{ fontSize: "1rem" }}
              onDelete={handleDelete(skill, setSkills)}
            />
          ))}
        </Box>
      </Box>
      <Typography variant="h6" sx={{ my: 2 }}>
        Preferences
      </Typography>
      {/* Job type preferences */}
      <Box
        sx={{
          border: "1px solid " + theme.palette.grey[400],
          p: 2,
          mt: 2,
        }}
      >
        <Autocomplete
          freeSolo
          options={jobTypesData
            .filter(
              (item) =>
                !jobType
                  ?.map((type) => type.toLowerCase())
                  ?.includes(item.toLowerCase())
            )
            ?.sort()}
          onChange={(_e, newValue) => {
            if (newValue && !jobType?.includes(newValue)) {
              setJobType([...jobType, newValue as string]);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Preferred Job Types" />
          )}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 1,
          }}
        >
          {jobType.map((type, index) => (
            <Chip
              key={index}
              label={type}
              color="primary"
              sx={{ fontSize: "1rem" }}
              onDelete={handleDelete(type, setJobType)}
            />
          ))}
        </Box>
      </Box>
      {/* Industry preferences */}
      <Box
        sx={{
          border: "1px solid " + theme.palette.grey[400],
          p: 2,
          mt: 2,
        }}
      >
        <Autocomplete
          freeSolo
          options={industriesData
            .filter(
              (item) =>
                !industry
                  ?.map((i) => i.toLowerCase())
                  ?.includes(item.toLowerCase())
            )
            ?.sort()}
          onChange={(_e, newValue) => {
            if (newValue && !industry?.includes(newValue)) {
              setIndustry([...industry, newValue as string]);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Preferred Industries" />
          )}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 1,
          }}
        >
          {industry.map((type, index) => (
            <Chip
              key={index}
              label={type}
              color="primary"
              sx={{ fontSize: "1rem" }}
              onDelete={handleDelete(type, setIndustry)}
            />
          ))}
        </Box>
      </Box>
      {/* Location preferences */}
      <Box
        sx={{
          border: "1px solid " + theme.palette.grey[400],
          p: 2,
          mt: 2,
        }}
      >
        <Autocomplete
          freeSolo
          options={locationsData
            .filter(
              (item) =>
                !preferredLocation
                  ?.map((l) => l.toLowerCase())
                  ?.includes(item.toLowerCase())
            )
            ?.sort()}
          onChange={(_e, newValue) => {
            if (newValue && !preferredLocation?.includes(newValue)) {
              setPreferredLocation([...preferredLocation, newValue as string]);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Preferred Locations" />
          )}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 1,
          }}
        >
          {preferredLocation.map((loc, index) => (
            <Chip
              key={index}
              label={loc}
              color="primary"
              sx={{ fontSize: "1rem" }}
              onDelete={handleDelete(loc, setPreferredLocation)}
            />
          ))}
        </Box>
      </Box>
      <TextField
        label="Minimum Expected Salary"
        name="salary"
        value={salary ?? ""}
        onChange={(e) =>
          setSalary(e.target.value ? Number(e.target.value) : null)
        }
        fullWidth
        type="number"
        sx={{ mt: 2 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
        }}
      />
    </>
  );
};

export default UserProfilePreference;

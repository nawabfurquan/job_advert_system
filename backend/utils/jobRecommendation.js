import levenshtein from "fast-levenshtein";

export const checkUserAndJobMatch = (user, job) => {
  // Predefined score weights for each field
  let scoreWeights = {
    skills: 0.4,
    industry: 0.2,
    location: 0.1,
    jobType: 0.1,
    salary: 0.2,
  };

  let jobMatchScore = 0;

  // Boolean flags
  let jobTypeMatched = false;
  let industryMatched = false;
  let locationMatched = false;

  // Job skills and details
  const jobSkillsList = job?.skills?.map?.((item) => item?.toLowerCase());
  const jobIndustry = job?.industry?.toLowerCase();
  const jobType = job?.jobType?.toLowerCase();
  const jobLocation = job?.location?.toLowerCase();
  const jobSalary = job?.salary;

  // User skills and preferences
  const preferences = user?.preferences;
  const userSkillList = user?.skills?.map?.((item) => item?.toLowerCase());
  const userIndustryList = preferences?.industry?.map?.((item) =>
    item?.toLowerCase()
  );
  const userJobTypeList = preferences?.jobType?.map?.((item) =>
    item?.toLowerCase()
  );
  const userLocationList = preferences?.location?.map?.((item) =>
    item?.toLowerCase()
  );
  const userSalary = preferences?.salary;

  // Checking if industry of job matches with user's preference
  if (jobIndustry) {
    userIndustryList?.forEach((userIndustry) => {
      if (levenshtein.get(userIndustry, jobIndustry) <= 2)
        industryMatched = true;
    });
  }

  // Adding score if industry is matched
  if (industryMatched) {
    jobMatchScore += scoreWeights.industry;
  }

  // Checking if jobType of job matches with user's preference
  if (jobType) {
    userJobTypeList?.forEach((userJobType) => {
      if (levenshtein.get(userJobType, jobType) <= 2) jobTypeMatched = true;
    });
  }

  // Adding score if job type is matched
  if (jobTypeMatched) {
    jobMatchScore += scoreWeights.jobType;
  }

  // Checking if the location matches
  if (jobLocation) {
    userLocationList?.forEach((userLocation) => {
      if (levenshtein.get(userLocation, jobLocation) <= 2)
        locationMatched = true;
    });
  }

  // Adding score if the location is matched
  if (locationMatched) {
    jobMatchScore += scoreWeights.location;
  }

  // Checking if salary of job matches with user's preference
  if (jobSalary && userSalary <= jobSalary) {
    jobMatchScore += scoreWeights.salary;
  }

  // Filtering user's skills by comparing the job's requirements
  if (userSkillList?.length > 0 && jobSkillsList?.length > 0) {
    const skillMatchLength = userSkillList?.filter?.((userSkill) => {
      let flag = false;
      jobSkillsList?.forEach?.((jobSkill) => {
        // Using Levenshtein to compare the skill
        if (levenshtein.get(jobSkill, userSkill) <= 2) {
          flag = true;
          return;
        }
      });
      if (flag) {
        return userSkill;
      }
    })?.length;

    // Adding score based on the skills matched
    jobMatchScore += skillMatchLength * scoreWeights.skills;
  }

  return jobMatchScore;
};

export const checkJobMatch = (job1, job2) => {
  // Predefined weights for each field
  let scoreWeights = {
    skills: 0.5,
    industry: 0.2,
    location: 0.1,
    jobType: 0.1,
  };

  let jobMatchScore = 0;

  // Boolean flags
  let jobTypeMatched = false;
  let industryMatched = false;
  let locationMatched = false;

  // Comparing the job industry
  if (
    job1?.industry &&
    job2?.industry &&
    levenshtein.get(
      job1?.industry?.toLowerCase(),
      job2?.industry?.toLowerCase()
    ) <= 2
  ) {
    industryMatched = true;
  }

  // Adding score if industry is matched
  if (industryMatched) {
    jobMatchScore += scoreWeights.industry;
  }

  // Comparing the job types
  if (
    job1?.jobType &&
    job2?.jobType &&
    levenshtein.get(
      job1?.jobType?.toLowerCase(),
      job2?.jobType?.toLowerCase()
    ) <= 2
  ) {
    jobTypeMatched = true;
  }

  // Adding score if job type is matched
  if (jobTypeMatched) {
    jobMatchScore += scoreWeights.jobType;
  }

  // Comparing the locations of job
  if (
    job1?.location &&
    job2?.location &&
    levenshtein.get(
      job1?.location?.toLowerCase(),
      job2?.location?.toLowerCase()
    ) <= 2
  ) {
    locationMatched = true;
  }

  // Adding score if location is matched
  if (locationMatched) {
    jobMatchScore += scoreWeights.location;
  }

  // Comparing the skills of the jobs
  if (job1?.skills?.length > 0 && job2?.skills?.length > 0) {
    const skillMatchLength = job1.skills?.filter?.((skill_1) => {
      const jobSkill_1 = skill_1?.toLowerCase();
      let flag = false;
      job2?.skills?.forEach((jobSkill_2) => {
        // Using Levenshtein to compare the skill
        if (levenshtein.get(jobSkill_2?.toLowerCase(), jobSkill_1) <= 2) {
          flag = true;
          return;
        }
      });
      if (flag) {
        return skill_1;
      }
    })?.length;

    // Adding score based on the skills matched
    jobMatchScore += skillMatchLength * scoreWeights.skills;
  }

  return jobMatchScore;
};

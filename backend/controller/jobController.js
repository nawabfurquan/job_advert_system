import { JobModel } from "../model/jobModel.js";
import { v4 } from "uuid";
import {
  checkJobMatch,
  checkUserAndJobMatch,
} from "../utils/jobRecommendation.js";
import { UserModel } from "../model/userModel.js";
import transporter from "../utils/sendEmail.js";
import _ from "lodash";
import { ApplicationModel } from "../model/applicationModel.js";

export const getAllJobs = async (_req, res) => {
  try {
    // Fetch job list
    const jobList = await JobModel.find();
    if (jobList?.length === 0 || !jobList) {
      return res.status(200).json({ message: "No jobs found", jobList: [] });
    }

    // Return job list
    res.status(200).json({ jobList });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getJobByJobId = async (req, res) => {
  try {
    // Find job by id
    const job = await JobModel.findOne({ jobId: req.params?.jobId });
    if (!job) {
      return res.status(404).json({ message: "Job Not found" });
    }

    res.status(200).json({ job });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const createJob = async (req, res) => {
  try {
    // Create a new job
    const job = await JobModel.create({
      jobId: v4(),
      title: req.body?.title,
      description: req.body?.description,
      company: req.body?.company,
      location: req.body?.location,
      postedDate: Date.now(),
      userId: req?.userId,
      skills: req.body?.skills,
      requirements: req.body?.requirements,
      responsibilities: req.body?.responsibilities,
      salary: req.body?.salary,
      industry: req.body?.industry,
      jobType: req.body?.jobType,
      deadline: req.body?.deadline,
    });

    // Creating new link for accessing the job
    const urlJobPost = `${process.env.FRONT_END_URL}/jobs/${job.jobId}`;

    const users = await UserModel.find();

    // Traversing the user list
    await Promise.all(
      users?.map(async (user) => {
        if (!user.isAdmin && !user.isEmployer) {
          // Calculating match score for user and job
          const jobScore = checkUserAndJobMatch(user, job);

          // If the score is greater than 0.7 send mail to the user with the job link
          if (jobScore >= 0.7) {
            await transporter.sendMail({
              from: process.env.EMAIL,
              to: user.email,
              subject: "New Job Post",
              html: `
              <p>A new job has been posted which matches with your profile. Given below are the job details:</p>
              <div style="border: 1px solid black; padding: 2%;width: fit-content;">
              <h4><u>Job Title:</u> ${job.title}</h4>
              <h4><u>Company:</u> ${job.company}</h4>
              <h4><u>Location:</u> ${job.location}</h4>
              </div>
              <p>Click on the below link to visit the job post</p>
              <a href=${urlJobPost}>Visit Job Post</a>
            `,
            });
          }
        }
      })
    );

    res.status(201).json({ job });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const deleteJobByJobId = async (req, res) => {
  try {
    const jobSearchParams = {
      jobId: req.params?.jobId,
    };

    const user = await UserModel.findOne({ userId: req?.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user?.isEmployer) {
      jobSearchParams["userId"] = user.userId;
    }

    // Find and delete the job by id
    const deletedJob = await JobModel.findOneAndDelete({
      ...jobSearchParams,
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Deletion successful", success: true });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const updateJobByJobId = async (req, res) => {
  try {
    // Find and update job by id
    const user = await UserModel.findOne({ userId: req?.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobSearchParams = {
      jobId: req.params?.jobId,
    };

    if (user.isEmployer) {
      jobSearchParams["userId"] = req?.userId;
    }

    const job = await JobModel.findOneAndUpdate(
      {
        ...jobSearchParams,
      },
      { $set: { ...req.body, lastUpdated: Date.now() } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Updation successful", job });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    // Getting Job List
    const jobList = await JobModel.find();
    if (jobList?.length === 0 || !jobList) {
      return res.status(200).json({ message: "No jobs found", jobList: [] });
    }

    // Getting user
    const userId = req.params?.userId;
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(200).json({ message: "User not found", jobList: [] });
    }

    const interactions = user?.interactions;

    // Extracting the interacted jobs
    const interactedJobs = jobList?.filter((job) => {
      if (interactions?.indexOf(job.jobId) !== -1) return job;
    });

    let similarJobs = [];

    // Getting similar jobs
    interactedJobs?.map((interactedJob) => {
      jobList?.forEach((job) => {
        if (job.jobId !== interactedJob.jobId) {
          // Checking job match with the interacted and non-interacted jobs
          const score = checkJobMatch(interactedJob, job);

          // Choose only the ones with score more than 0.5
          if (
            score > 0.5 &&
            similarJobs?.filter((s) => s?.jobId === job.jobId)
          ) {
            job["score"] = score;
            similarJobs.push(job);
          }
        }
      });
    });

    // Limiting similar jobs
    similarJobs = similarJobs?.sort((a, b) => b.score - a.score)?.slice(0, 6);

    const matchedJobs = jobList
      // Performing job match for each job
      ?.map((job) => {
        const score = checkUserAndJobMatch(user, job);
        job["score"] = score;
        return job;
      })
      // Sorting the job based on the score
      ?.sort((a, b) => b.score - a.score)
      ?.filter((job) => job.score > 0.7)
      ?.slice(0, 6);

    // Combining similar jobs and user's matched jobs
    const combinedJobList = [...similarJobs, ...matchedJobs];

    // Getting unique job list
    const uniqueJobList = _.uniqBy(combinedJobList, "jobId")
      // Defining the required fields
      ?.map((job) => ({
        jobId: job.jobId,
        title: job.title,
        description: job?.description,
        requirements: job?.requirements,
        responsibilities: job?.responsibilities,
        jobType: job?.jobType,
        salary: job?.salary,
        industry: job?.industry,
        company: job.company,
        location: job?.location,
        postedDate: job.postedDate,
        deadline: job.deadline,
        skills: job?.skills,
      }));

    const finalJobList = [];

    // Filtering the jobs which don't have application
    await Promise.all(
      uniqueJobList?.map(async (job) => {
        const application = await ApplicationModel.findOne({
          jobId: job.jobId,
          userId,
        });

        if (!application) {
          finalJobList.push(job);
        }
      })
    );

    res.status(200).json({ jobs: finalJobList });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const { jobType, location, industry, salaryMin, salaryMax } = req.body;

    let query = {};

    // Querying based on job types
    if (jobType && jobType?.length !== 0)
      query.jobType = { $in: Array.isArray(jobType) ? jobType : [jobType] };

    // Querying based on locations
    if (location && location?.length !== 0)
      query.location = { $in: Array.isArray(location) ? location : [location] };

    // Querying based on industries
    if (industry && industry?.length !== 0)
      query.industry = { $in: Array.isArray(industry) ? industry : [industry] };

    // Querying based on salary
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }

    const jobs = await JobModel.find(query);

    if (jobs.length === 0 || !jobs) {
      return res.status(200).json({ message: "No jobs found", jobs: [] });
    }
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

export const getJobsByOwner = async (req, res) => {
  try {
    // Finding the employer
    const user = await UserModel.findOne({ userId: req.params?.employerId });

    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    // Deny access for user who is not employer
    if (!user.isEmployer) {
      return res.status(403).json({ message: "Access Denied" });
    }

    // Finding jobs by user id
    const jobs = await JobModel.find({ userId: user.userId });

    if (jobs?.length === 0 || !jobs) {
      return res.status(200).json({ message: "No jobs found", jobList: [] });
    }

    res.status(200).json({ jobList: jobs });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

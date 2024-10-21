import { ApplicationModel } from "../model/applicationModel.js";
import { v4 } from "uuid";
import { JobModel } from "../model/jobModel.js";
import { UserModel } from "../model/userModel.js";
import { ApplicationFileModel } from "../model/applicationFileModel.js";
import { UserFileModel } from "../model/userFileModel.js";

// Helper function to gather data for application
const getApplicationData = async (application) => {
  const job = await JobModel.findOne({ jobId: application?.jobId });
  if (!job) {
    return null;
  }

  const newApplication = {
    applicationId: application.applicationId,
    jobTitle: job.title,
    jobCompany: job?.company,
    status: application.status,
    date: application?.date,
    userInfo: application?.userInfo,
  };
  return newApplication;
};

export const getAllApplications = async (_req, res) => {
  try {
    // Fetch application list
    const applicationList = await ApplicationModel.find();

    // No applications found
    if (applicationList?.length === 0 || !applicationList) {
      return res
        .status(200)
        .json({ message: "No applications found", applicationList: [] });
    }

    // Calling helper function for each application to gather required user and job data
    const newApplicationList = await Promise.all(
      applicationList.map(async (application) => {
        const newApplication = await getApplicationData(application, res);
        if (newApplication) {
          return newApplication;
        }
      })
    );

    // Empty list
    if (newApplicationList?.length === 0 || !newApplicationList)
      return res.status(200).json({ applicationList: [] });

    res.status(200).json({ applicationList: newApplicationList });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    // Fetch application by id
    const application = await ApplicationModel.findOne({
      applicationId: req.params?.applicationId,
    });

    // Application not found
    if (!application) {
      return res.status(404).json({ message: "Application Not found" });
    }

    // Calling helper function for the application to gather required user and job data
    const newApplication = await getApplicationData(application, res);

    if (!newApplication)
      return res.status(500).json({ message: "An error occured" });

    res.status(200).json({ application: newApplication });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getApplicationByEmployerId = async (req, res) => {
  try {
    // Getting jobs created by the employer
    const jobs = await JobModel.find({ userId: req.params?.employerId });

    // No jobs found
    if (jobs?.length === 0 || !jobs) {
      return res
        .status(200)
        .json({ message: "Jobs Not Found", applicationList: [] });
    }

    let applicationList = [];
    // Traverse the jobs and find applications for each job
    await Promise.all(
      jobs.map(async (job) => {
        const application = await ApplicationModel.find({ jobId: job.jobId });
        if (application?.length !== 0) {
          await Promise.all(
            application.map(async (app) => {
              const newApp = await getApplicationData(app);
              if (newApp) {
                applicationList.push(newApp);
              }
            })
          );
        }
      })
    );

    // No applications found
    if (applicationList?.length === 0 || !applicationList) {
      return res
        .status(200)
        .json({ message: "Applications Not Found", applicationList: [] });
    }

    res.status(200).json({ applicationList });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const getApplicationByUserId = async (req, res) => {
  try {
    // Fetch application by id
    const applicationList = await ApplicationModel.find({
      userId: req.params?.userId,
    });

    // Calling helper function for each application to gather required user and job data
    const newApplicationList = await Promise.all(
      applicationList.map(async (application) => {
        const newApplication = await getApplicationData(application, res);
        return newApplication;
      })
    );

    // No applications found
    if (newApplicationList.length === 0 || !newApplicationList)
      return res.status(200).json({ applicationList: [] });

    res.status(200).json({ applicationList: newApplicationList });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const createApplication = async (req, res) => {
  try {
    // Initialising userInfo with the required field
    const userInfo = {
      email: req?.body?.email,
      name: req?.body?.name,
      phone: req?.body?.phone,
      location: req?.body?.location,
    };

    const applicationId = v4();

    // Creating resume field if file exists
    if (req?.files?.resume?.[0]) {
      const resume = {
        applicationFileId: v4(),
        name: req?.files?.resume?.[0]?.originalname,
        fileType: req?.files?.resume?.[0]?.mimetype,
        data: req?.files?.resume?.[0]?.buffer,
        userId: req?.body?.userId,
        applicationId: applicationId,
      };

      // Creating new field for resume
      const resumeFile = await ApplicationFileModel.create({ ...resume });

      userInfo["resume"] = {
        applicationFileId: resumeFile.applicationFileId,
        name: resumeFile.name,
      };

      // If file is not uploaded, use the existing resume value
    } else if (req?.body?.resume) {
      const fileId = req?.body?.resume?.userFileId;
      const userFile = await UserFileModel.findOne({ userFileId: fileId });

      const resume = {
        applicationFileId: v4(),
        name: userFile?.name,
        fileType: userFile?.fileType,
        data: userFile?.data,
        userId: userFile?.userId,
        applicationId: applicationId,
      };

      const resumeFile = await ApplicationFileModel.create({ ...resume });

      userInfo["resume"] = {
        applicationFileId: resumeFile.applicationFileId,
        name: resumeFile.name,
      };
    }

    // Creating cover letter field
    if (req?.files?.coverLetter?.[0]) {
      const coverLetter = {
        applicationFileId: v4(),
        name: req?.files?.coverLetter?.[0]?.originalname,
        contentType: req?.files?.coverLetter?.[0]?.mimetype,
        data: req?.files?.coverLetter?.[0]?.buffer,
        userId: req?.body?.userId,
        applicationId: applicationId,
      };
      const coverLetterFile = await ApplicationFileModel.create({
        ...coverLetter,
      });

      userInfo["coverLetter"] = {
        applicationFileId: coverLetterFile.applicationFileId,
        name: coverLetterFile.name,
      };
    }

    // Create new application
    const application = await ApplicationModel.create({
      applicationId: applicationId,
      jobId: req.body?.jobId,
      userId: req.body?.userId,
      userInfo: userInfo,
      date: req.body?.date,
    });

    res.status(201).json({
      application,
    });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const deleteApplicationById = async (req, res) => {
  try {
    // Find and delete the application by id
    const deletedApplication = await ApplicationModel.findOneAndDelete({
      applicationId: req.params?.applicationId,
    });

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Deletion successful", success: true });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const updateApplicationById = async (req, res) => {
  try {
    // Find and update the application by id

    const application = await ApplicationModel.findOne({
      applicationId: req.params?.applicationId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Getting job related to application
    const job = await JobModel.findOne({ jobId: application.jobId });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Getting user details
    const user = await UserModel.findOne({ userId: req?.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if the user is employer or admin
    if (job?.userId === user?.userId || user.isAdmin) {
      if (!req.body?.status) {
        return res.status(400).json({ message: "Missing values" });
      }

      // Update application with new status
      const updatedApplication = await ApplicationModel.findOneAndUpdate(
        {
          applicationId: req.params.applicationId,
        },
        {
          $set: {
            status: req.body?.status,
            lastUpdated: Date.now(),
          },
        },
        { new: true }
      );

      // Application not found
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      res
        .status(200)
        .json({ message: "Updation successful", updatedApplication });
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const checkUserApplication = async (req, res) => {
  try {
    // Checking if the user has applied for the job
    const jobId = req.query?.jobId;
    const userId = req.query?.userId;

    // Using jobId and userId to find the application
    const application = await ApplicationModel.findOne({
      jobId: jobId,
      userId: userId,
    });

    if (!application) {
      return res.status(200).json({ applied: false });
    }

    res
      .status(200)
      .json({ applied: true, applicationId: application?.applicationId });
  } catch (err) {
    // Error Handling
    res.status(500);
    res.json({ message: "Internal Server Error", error: err });
  }
};

export const downloadApplicationFile = async (req, res) => {
  const applicationFileId = req.params?.applicationFileId;

  try {
    // Find the file data
    const file = await ApplicationFileModel.findOne({ applicationFileId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // Return the file type and file data
    res.set("Content-Type", file.fileType);
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

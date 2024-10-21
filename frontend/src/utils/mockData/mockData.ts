import { Application, Job } from "../types/types";

// Mock data for testing
export const mockUser = {
  userId: "1",
  name: "User 1",
  email: "user1@test.com",
  phone: 1234,
  location: "Location",
  skills: ["Skill 1"],
  preferences: {
    jobType: ["Job Type 1"],
    industry: ["Industry 1"],
    location: ["Location 1"],
    salary: 10000,
  },
  resume: {
    userFileId: "1",
    name: "resume",
  },
};

export const mockApplications: Application[] = [
  {
    applicationId: "1",
    jobTitle: "Software Engineer",
    status: "Pending",
    jobCompany: "company",
    userEmail: "email",
    userName: "name",
    userInfo: {
      name: "name",
      email: "email",
      phone: 123,
      location: "location",
      resume: {
        applicationFileId: "1",
        name: "resume",
      },
      coverLetter: {
        applicationFileId: "2",
        name: "cl",
      },
    },
    date: "",
  },
  {
    applicationId: "2",
    jobTitle: "Product Manager",
    status: "Approved",
    jobCompany: "company",
    userEmail: "email",
    userName: "name",
    userInfo: {
      name: "name",
      email: "email",
      phone: 123,
      location: "location",
      resume: {
        applicationFileId: "1",
        name: "resume",
      },
      coverLetter: {
        applicationFileId: "2",
        name: "cl",
      },
    },
    date: "",
  },
];

export const mockJobs: Job[] = [
  {
    jobId: "1",
    company: "Company 1",
    title: "Title 1",
  },
  {
    jobId: "2",
    company: "Company 2",
    title: "Title 2",
  },
];

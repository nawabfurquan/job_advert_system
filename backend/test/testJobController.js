import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import {
  createJob,
  deleteJobByJobId,
  getAllJobs,
  getJobByJobId,
  getJobsByOwner,
  getRecommendedJobs,
  searchJobs,
  updateJobByJobId,
} from "../controller/jobController.js";
import { JobModel } from "../model/jobModel.js";
import { UserModel } from "../model/userModel.js";
import transporter from "../utils/sendEmail.js";
import { ApplicationModel } from "../model/applicationModel.js";

use(sinonChai);

describe("test job controller", () => {
  const sandbox = sinon.createSandbox();

  const res = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
  };

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  describe("test getAllJobs", () => {
    it("test success", async () => {
      const jobList = [
        {
          jobId: "1",
          title: "Job 1",
          description: "Desc 1",
          company: "Company 1",
          location: "Location",
          postedDate: "01-01-2024",
          userId: "1",
          deadline: "01-01-2024",
        },
      ];

      sandbox.stub(JobModel, "find").returns(Promise.resolve(jobList));

      await getAllJobs({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ jobList: jobList });
    });

    it("test empty list", async () => {
      sandbox.stub(JobModel, "find").returns(Promise.resolve(undefined));

      await getAllJobs({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "No jobs found",
        jobList: [],
      });
    });

    it("test error", async () => {
      sandbox.stub(JobModel, "find").returns(Promise.reject("error"));

      await getAllJobs({}, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test getJobByJobId", () => {
    it("test success", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };
      const job = {
        jobId: "1",
        title: "Job 1",
        description: "Desc 1",
        company: "Company 1",
        location: "Location",
        postedDate: "01-01-2024",
        userId: "1",
        deadline: "01-01-2024",
      };
      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(job));

      await getJobByJobId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ job });
    });

    it("test no job", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };
      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(undefined));

      await getJobByJobId(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "Job Not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };
      sandbox.stub(JobModel, "findOne").returns(Promise.reject("error"));

      await getJobByJobId(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test createJob", () => {
    it("test success", async () => {
      const job = {
        jobId: "1",
        title: "Job 1",
        description: "Desc 1",
        company: "Company 1",
        location: "Location",
        postedDate: "01-01-2024",
        userId: "1",
        deadline: "01-01-2024",
      };

      const users = [
        {
          userId: "1",
          name: "User",
        },
      ];

      const req = {
        body: {
          ...job,
        },
      };

      sandbox.stub(JobModel, "create").returns(Promise.resolve(job));
      sandbox.stub(UserModel, "find").returns(Promise.resolve(users));
      sandbox.stub(transporter, "sendMail").returns(Promise.resolve(""));

      await createJob(req, res);
      expect(res.status).to.have.calledWith(201);
      expect(res.json).to.have.calledWith({ job });
    });

    it("test error", async () => {
      const job = {
        description: "Desc 1",
        company: "Company 1",
        location: "Location",
        postedDate: "01-01-2024",
        userId: "1",
        deadline: "01-01-2024",
      };

      const req = {
        body: {
          ...job,
        },
      };

      sandbox.stub(JobModel, "create").returns(Promise.reject("error"));

      await createJob(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test deleteJobById", () => {
    it("test success", async () => {
      const req = {
        params: {
          jobId: "1",
        },
        userId: "1",
      };

      sandbox.stub(JobModel, "findOneAndDelete").returns(Promise.resolve("ok"));
      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1" }));

      await deleteJobByJobId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Deletion successful",
        success: true,
      });
    });

    it("test user not found", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await deleteJobByJobId(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "User not found" });
    });

    it("test user not found", async () => {
      const req = {
        params: {
          jobId: "1",
        },
        userId: "1",
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1" }));
      sandbox
        .stub(JobModel, "findOneAndDelete")
        .returns(Promise.resolve(undefined));

      await deleteJobByJobId(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "Job not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          jobId: "1",
        },
        userId: "3",
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.reject("error"));

      await deleteJobByJobId(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test updateJobByJobId", () => {
    it("test success", async () => {
      const job = {
        jobId: "1",
        title: "Job 1",
        description: "Desc 1",
        company: "Company 1",
        location: "Location",
        postedDate: "01-01-2024",
        userId: "1",
        deadline: "01-01-2024",
      };
      const req = {
        params: {
          jobId: "1",
        },
        body: {
          ...job,
        },
        userId: "1",
      };

      sandbox.stub(JobModel, "findOneAndUpdate").returns(Promise.resolve(job));
      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1" }));

      await updateJobByJobId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Updation successful",
        job,
      });
    });

    it("test user not found", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await updateJobByJobId(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "User not found" });
    });

    it("test user not found", async () => {
      const req = {
        params: {
          jobId: "1",
        },
        userId: "1",
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1" }));
      sandbox
        .stub(JobModel, "findOneAndUpdate")
        .returns(Promise.resolve(undefined));

      await updateJobByJobId(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "Job not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          jobId: "1",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.reject("error"));

      await updateJobByJobId(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test getRecommendedJobs", () => {
    it("test success", async () => {
      const jobList = [
        {
          jobId: "1",
          title: "Job 1",
          description: "Desc 1",
          company: "Company 1",
          industry: "Industry 1",
          salary: 30000,
          jobType: "Full-time",
          location: "Location",
          postedDate: "01-01-2024",
          userId: "1",
          deadline: "01-01-2024",
          skills: ["Skill"],
        },
      ];

      const user = {
        userId: "1",
        skills: ["Skill"],
        interactions: [],
        preferences: {
          industry: ["Industry 1"],
          salary: 30000,
          jobType: ["Full-time"],
          location: ["Location"],
        },
      };

      const req = {
        params: {
          userId: "1",
        },
      };

      sandbox.stub(JobModel, "find").returns(Promise.resolve(jobList));
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));
      sandbox
        .stub(ApplicationModel, "findOne")
        .returns(Promise.resolve(undefined));

      await getRecommendedJobs(req, res);

      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        jobs: [
          {
            jobId: "1",
            title: "Job 1",
            description: "Desc 1",
            requirements: undefined,
            responsibilities: undefined,
            jobType: "Full-time",
            salary: 30000,
            industry: "Industry 1",
            company: "Company 1",
            location: "Location",
            postedDate: "01-01-2024",
            deadline: "01-01-2024",
            skills: ["Skill"],
          },
        ],
      });
    });

    it("test error", async () => {
      sandbox.stub(JobModel, "find").rejects("error");

      await getRecommendedJobs({}, res);

      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test searchJobs", () => {
    it("test success", async () => {
      const req = {
        body: {
          jobType: "Full-time",
          location: "Location",
          industry: "Industry",
          salaryMin: "1000",
          salaryMax: "20000",
        },
      };

      const jobs = [
        {
          jobId: "1",
          title: "Job 1",
          description: "Desc 1",
          jobType: "Full-time",
          salary: 10000,
          industry: "Industry",
          company: "Company 1",
          location: "Location",
          postedDate: "01-01-2024",
          deadline: "01-01-2024",
          skills: ["Skill"],
        },
      ];

      sandbox.stub(JobModel, "find").resolves(jobs);
      await searchJobs(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        jobs,
      });
    });

    it("test empty list", async () => {
      sandbox.stub(JobModel, "find").resolves([]);
      await searchJobs({ body: {} }, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        jobs: [],
        message: "No jobs found",
      });
    });

    it("test error", async () => {
      sandbox.stub(JobModel, "find").rejects("error");
      await searchJobs({ body: {} }, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test getJobsByOwner", () => {
    it("test success", async () => {
      const req = {
        query: {
          employerId: "1",
        },
      };

      const user = {
        userId: "1",
        isEmployer: true,
      };

      const jobs = [
        {
          jobId: "1",
          title: "Software Engineer",
          company: "Company 123",
        },
      ];

      sandbox.stub(JobModel, "find").returns(Promise.resolve(jobs));
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));
      await getJobsByOwner(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ jobList: jobs });
    });

    it("test empty job list", async () => {
      const req = {
        query: {
          employerId: "2",
        },
      };

      const user = {
        userId: "2",
        isEmployer: true,
      };

      sandbox.stub(JobModel, "find").returns(Promise.resolve([]));
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));
      await getJobsByOwner(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        jobList: [],
        message: "No jobs found",
      });
    });

    it("test no user", async () => {
      const req = {
        query: {
          employerId: "",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve());
      await getJobsByOwner(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({
        message: "User Not found",
      });
    });

    it("test not employer", async () => {
      const req = {
        query: {
          employerId: "3",
        },
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1", isEmployer: false }));
      await getJobsByOwner(req, res);
      expect(res.status).to.have.calledWith(403);
      expect(res.json).to.have.calledWith({
        message: "Access Denied",
      });
    });

    it("test error", async () => {
      const req = {
        params: {
          employerId: 1,
        },
      };
      sandbox.stub(UserModel, "findOne").returns(Promise.reject("error"));

      await getJobsByOwner(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });
});

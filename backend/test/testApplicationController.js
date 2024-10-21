import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import {
  checkUserApplication,
  createApplication,
  deleteApplicationById,
  downloadApplicationFile,
  getAllApplications,
  getApplicationByEmployerId,
  getApplicationById,
  getApplicationByUserId,
  updateApplicationById,
} from "../controller/applicationController.js";
import { ApplicationModel } from "../model/applicationModel.js";
import { JobModel } from "../model/jobModel.js";
import { UserModel } from "../model/userModel.js";
import { ApplicationFileModel } from "../model/applicationFileModel.js";

use(sinonChai);

describe("test application controller", () => {
  // Create sandbox
  const sandbox = sinon.createSandbox();

  // Response
  const res = {
    set: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
  };

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  describe("test getAllApplications", () => {
    it("test success", async () => {
      const appList = [
        {
          applicationId: "1",
          jobId: "1",
          userId: "1",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      const job = {
        jobId: "1",
        title: "Software Engineer",
        company: "Company 123",
      };

      const finalList = [
        {
          applicationId: "1",
          jobTitle: "Software Engineer",
          jobCompany: "Company 123",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      // Mocking database calls
      sandbox.stub(ApplicationModel, "find").returns(Promise.resolve(appList));
      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(job));

      await getAllApplications({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ applicationList: finalList });
    });

    it("test empty list", async () => {
      sandbox
        .stub(ApplicationModel, "find")
        .returns(Promise.resolve(undefined));

      await getAllApplications({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "No applications found",
        applicationList: [],
      });
    });

    it("test error", async () => {
      sandbox.stub(ApplicationModel, "find").returns(Promise.reject());

      await getAllApplications({}, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test getApplicationById", () => {
    it("test success", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };
      const app = {
        applicationId: "1",
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
        status: "Pending",
        userInfo: {
          email: "email",
          name: "name",
          phone: 123,
          resume: {
            applicationFileId: "1",
            name: "Resume",
          },
          coverLetter: {
            applicationFileId: "1",
            name: "Cover Letter",
          },
          location: "UK",
        },
      };

      const job = {
        jobId: "1",
        title: "Software Engineer",
        company: "Company 123",
      };

      const newApp = {
        applicationId: "1",
        jobTitle: "Software Engineer",
        jobCompany: "Company 123",
        date: "01-01-2024",
        status: "Pending",
        userInfo: {
          email: "email",
          name: "name",
          phone: 123,
          resume: {
            applicationFileId: "1",
            name: "Resume",
          },
          coverLetter: {
            applicationFileId: "1",
            name: "Cover Letter",
          },
          location: "UK",
        },
      };

      sandbox.stub(ApplicationModel, "findOne").returns(Promise.resolve(app));
      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(job));
      await getApplicationById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ application: newApp });
    });

    it("test empty list", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };
      sandbox
        .stub(ApplicationModel, "findOne")
        .returns(Promise.resolve(undefined));

      await getApplicationById(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "Application Not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };
      sandbox.stub(ApplicationModel, "findOne").returns(Promise.reject());

      await getApplicationById(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test getApplicationByEmployerId", () => {
    it("test success", async () => {
      const req = {
        params: {
          employerId: "1",
        },
      };
      const appList = [
        {
          applicationId: "1",
          jobId: "1",
          userId: "1",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      const jobs = [
        {
          jobId: "1",
          title: "Software Engineer",
          company: "Company 123",
        },
      ];

      const newAppList = [
        {
          applicationId: "1",
          jobTitle: "Software Engineer",
          jobCompany: "Company 123",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      sandbox.stub(ApplicationModel, "find").returns(Promise.resolve(appList));
      sandbox.stub(JobModel, "find").returns(Promise.resolve(jobs));
      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(jobs[0]));
      await getApplicationByEmployerId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ applicationList: newAppList });
    });

    it("test empty job list", async () => {
      const req = {
        params: {
          employerId: "1",
        },
      };
      sandbox.stub(JobModel, "find").returns(Promise.resolve([]));

      await getApplicationByEmployerId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Jobs Not Found",
        applicationList: [],
      });
    });

    it("test error", async () => {
      const req = {
        params: {
          employerId: "1",
        },
      };
      sandbox.stub(JobModel, "find").returns(Promise.reject());

      await getApplicationByEmployerId(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test getApplicationByUserId", () => {
    it("test success", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };
      const appList = [
        {
          applicationId: "1",
          jobId: "1",
          userId: "1",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      const newAppList = [
        {
          applicationId: "1",
          jobTitle: "Software Engineer",
          jobCompany: "Company 123",
          date: "01-01-2024",
          status: "Pending",
          userInfo: {
            email: "email",
            name: "name",
            phone: 123,
            resume: {
              applicationFileId: "1",
              name: "Resume",
            },
            coverLetter: {
              applicationFileId: "1",
              name: "Cover Letter",
            },
            location: "UK",
          },
        },
      ];

      sandbox.stub(ApplicationModel, "find").returns(Promise.resolve(appList));
      sandbox.stub(JobModel, "findOne").returns(
        Promise.resolve({
          jobId: "1",
          title: "Software Engineer",
          company: "Company 123",
        })
      );
      await getApplicationByUserId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ applicationList: newAppList });
    });

    it("test error", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };
      sandbox.stub(ApplicationModel, "find").returns(Promise.reject());

      await getApplicationByUserId(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test createApplication", () => {
    it("test success", async () => {
      const app = {
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
      };

      const req = {
        body: {
          ...app,
        },
      };

      sandbox.stub(ApplicationModel, "create").returns(Promise.resolve(app));

      await createApplication(req, res);
      expect(res.status).to.have.calledWith(201);
      expect(res.json).to.have.calledWith({ application: app });
    });

    it("test error", async () => {
      const app = {
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
      };

      const req = {
        body: {
          ...app,
        },
      };

      sandbox.stub(ApplicationModel, "create").returns(Promise.reject());

      await createApplication(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test deleteApplicationById", () => {
    it("test success", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };

      sandbox
        .stub(ApplicationModel, "findOneAndDelete")
        .returns(Promise.resolve("ok"));

      await deleteApplicationById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Deletion successful",
        success: true,
      });
    });

    it("test application not found", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };

      sandbox
        .stub(ApplicationModel, "findOneAndDelete")
        .returns(Promise.resolve(undefined));

      await deleteApplicationById(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "Application not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          applicationId: "1",
        },
      };

      sandbox
        .stub(ApplicationModel, "findOneAndDelete")
        .returns(Promise.reject());

      await deleteApplicationById(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });
  describe("test updateApplicationById", () => {
    it("test success", async () => {
      const app = {
        applicationId: "1",
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
        status: "Pending",
      };
      const updatedApp = {
        applicationId: "1",
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
        status: "Approved",
      };

      const user = {
        userId: "1",
      };

      const job = {
        userId: "1",
      };

      const req = {
        userId: "1",
        params: {
          applicationId: "1",
        },
        body: {
          status: "Approved",
        },
      };

      sandbox.stub(ApplicationModel, "findOne").returns(Promise.resolve(app));
      sandbox
        .stub(ApplicationModel, "findOneAndUpdate")
        .returns(Promise.resolve(updatedApp));

      sandbox.stub(JobModel, "findOne").returns(Promise.resolve(job));
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));

      await updateApplicationById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Updation successful",
        updatedApplication: updatedApp,
      });
    });

    it("test error", async () => {
      const app = {
        applicationId: "1",
        jobId: "1",
        userId: "1",
        date: "01-01-2024",
      };
      const req = {
        params: {
          applicationId: "1",
        },
        body: {
          ...app,
        },
      };

      sandbox.stub(ApplicationModel, "findOne").returns(Promise.reject());

      await updateApplicationById(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });
  describe("test checkUserApplication", () => {
    it("test success", async () => {
      const req = {
        query: {
          userId: "1",
          jobId: "1",
        },
      };

      const app = {
        applicationId: "1",
      };

      sandbox.stub(ApplicationModel, "findOne").returns(Promise.resolve(app));

      await checkUserApplication(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        applied: true,
        applicationId: app.applicationId,
      });
    });

    it("test no application", async () => {
      const req = {
        query: {
          userId: "1",
          jobId: "1",
        },
      };

      sandbox
        .stub(ApplicationModel, "findOne")
        .returns(Promise.resolve(undefined));

      await checkUserApplication(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        applied: false,
      });
    });

    it("test error", async () => {
      const req = {
        query: {
          userId: "1",
          jobId: "1",
        },
      };

      sandbox.stub(ApplicationModel, "findOne").returns(Promise.reject());

      await checkUserApplication(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test downloadApplicationFile", () => {
    it("test success", async () => {
      const req = {
        params: {
          applicationFileId: "1",
        },
      };

      const file = {
        applicationFileId: "1",
        fileType: "application/pdf",
        data: "binary_data",
      };

      sandbox
        .stub(ApplicationFileModel, "findOne")
        .returns(Promise.resolve(file));

      await downloadApplicationFile(req, res);

      expect(res.set).to.have.been.calledWith(
        "Content-Type",
        "application/pdf"
      );
      expect(res.send).to.have.been.calledWith("binary_data");
    });

    it("test no file", async () => {
      const req = {
        params: {
          applicationFileId: "1",
        },
      };

      sandbox
        .stub(ApplicationFileModel, "findOne")
        .returns(Promise.resolve(undefined));

      await downloadApplicationFile(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: "File not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          applicationFileId: "1",
        },
      };

      sandbox.stub(ApplicationFileModel, "findOne").returns(Promise.reject());

      await downloadApplicationFile(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });
});

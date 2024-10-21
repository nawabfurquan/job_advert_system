import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  forgotPassword,
  getAllCount,
  loginController,
  resetPassword,
  signupController,
  tokenExpiryCheck,
  tokenRefresh,
} from "../controller/authController.js";
import { UserModel } from "../model/userModel.js";
import { JobModel } from "../model/jobModel.js";
import { ApplicationModel } from "../model/applicationModel.js";
import transporter from "../utils/sendEmail.js";

use(sinonChai);

describe("test auth controller", () => {
  const sandbox = sinon.createSandbox();

  const res = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
  };

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  describe("test login controller", () => {
    it("test success", async () => {
      const req = {
        body: {
          email: "abc@test.com",
          password: "1234",
        },
      };

      const user = {
        userId: "1",
        email: "abc@test.com",
        name: "Test",
        password: "1234",
        isAdmin: false,
        isEmployer: false,
        phone: 1234,
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));
      sandbox.stub(bcrypt, "compare").returns(Promise.resolve(true));
      sandbox.stub(jwt, "sign").returns("xyz");

      await loginController(req, res);

      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Success",
        authToken: "xyz",
        refreshToken: "xyz",
        user: {
          skills: undefined,
          experience: undefined,
          preferences: undefined,
          location: undefined,
          resume: undefined,
          interactions: undefined,
          userId: "1",
          email: "abc@test.com",
          name: "Test",
          isAdmin: false,
          isEmployer: false,
          phone: 1234,
        },
      });
    });

    it("test invalid email", async () => {
      const req = {
        body: {
          email: "user",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(false);

      await loginController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Invalid Email",
      });
    });

    it("test invalid password", async () => {
      const req = {
        body: {
          email: "user@test.com",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(req.body));
      sandbox.stub(bcrypt, "compare").returns(Promise.resolve(false));

      await loginController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Incorrect Password",
      });
    });

    it("test email not found", async () => {
      const req = {
        body: {
          email: "user@test.com",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await loginController(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({
        message: "Email not found",
      });
    });
  });

  describe("test signup controller", () => {
    it("test success", async () => {
      const req = {
        body: {
          email: "abc@test.com",
          name: "Test",
          password: "1234",
          phone: 1234,
          isEmployer: false,
        },
      };

      const user = {
        userId: "1",
        email: "abc@test.com",
        name: "Test",
        password: "1234",
        phone: 1234,
        isEmployer: false,
        isAdmin: false,
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));
      sandbox.stub(UserModel, "create").returns(Promise.resolve(user));
      sandbox.stub(bcrypt, "compare").returns(Promise.resolve(true));
      sandbox.stub(jwt, "sign").returns("xyz");

      await signupController(req, res);

      expect(res.status).to.have.calledWith(201);
      expect(res.json).to.have.calledWith({
        message: "User Created",
        authToken: "xyz",
        refreshToken: "xyz",
        user: {
          userId: "1",
          email: "abc@test.com",
          name: "Test",
          phone: 1234,
          isEmployer: false,
          isAdmin: false,
        },
      });
    });

    it("test invalid email", async () => {
      const req = {
        body: {
          email: "user",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(false);

      await signupController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Invalid Email",
      });
    });

    it("test user exists", async () => {
      const req = {
        body: {
          email: "user",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(req.body));

      await signupController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Email Already Exists",
      });
    });

    it("test wrong access code", async () => {
      const req = {
        body: {
          email: "employer",
          password: "123",
          isEmployer: true,
          access_code: 123,
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await signupController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Wrong Access Code",
      });
    });

    it("test user exists", async () => {
      const req = {
        body: {
          email: "user",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await signupController(req, res);
      expect(res.status).to.have.calledWith(400);
      expect(res.json).to.have.calledWith({
        message: "Missing values",
      });
    });

    it("test error", async () => {
      const req = {
        body: {
          email: "user",
          password: "123",
        },
      };

      sandbox.stub(validator, "isEmail").returns(true);
      sandbox.stub(UserModel, "findOne").returns(Promise.reject());

      await signupController(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test getAllCount", () => {
    it("test success", async () => {
      const users = [
        {
          userId: "1",
        },
      ];

      const jobs = [
        {
          jobId: "1",
        },
      ];

      const applications = [
        {
          applicationId: "1",
        },
      ];
      sandbox.stub(UserModel, "find").returns(Promise.resolve(users));
      sandbox.stub(JobModel, "find").returns(Promise.resolve(jobs));
      sandbox
        .stub(ApplicationModel, "find")
        .returns(Promise.resolve(applications));

      await getAllCount({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        user: 1,
        job: 1,
        application: 1,
      });
    });

    it("test error", async () => {
      sandbox.stub(UserModel, "find").returns(Promise.reject());

      await getAllCount({}, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test tokenRefresh", () => {
    it("test success", async () => {
      const req = {
        body: {
          token: "xyz",
        },
      };

      const user = {
        userId: "123",
      };

      sandbox.stub(jwt, "verify").returns({ userId: "123" });
      sandbox.stub(jwt, "sign").returns("xyz");
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));

      await tokenRefresh(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        authToken: "xyz",
        refreshToken: "xyz",
      });
    });

    it("test no token", async () => {
      const req = {
        body: {
          token: undefined,
        },
      };

      await tokenRefresh(req, res);
      expect(res.status).to.have.calledWith(401);
      expect(res.json).to.have.calledWith({
        message: "No refresh token provided",
      });
    });

    it("test invalid refresh token", async () => {
      const req = {
        body: {
          token: "xyz",
        },
      };

      sandbox.stub(jwt, "verify").returns({ userId: "123" });
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await tokenRefresh(req, res);
      expect(res.status).to.have.calledWith(401);
      expect(res.json).to.have.calledWith({
        message: "Invalid refresh token",
      });
    });

    it("test error", async () => {
      const req = {
        body: {
          token: "xyz",
        },
      };

      sandbox.stub(jwt, "verify").returns({ userId: "123" });
      sandbox.stub(UserModel, "findOne").returns(Promise.reject());

      await tokenRefresh(req, res);
      expect(res.status).to.have.calledWith(401);
      expect(res.json).to.have.calledWith({
        message: "Token expired or invalid",
      });
    });
  });

  describe("test forgotPassword", () => {
    it("test success", async () => {
      const req = {
        body: {
          email: "user@test.com",
        },
      };

      const user = {
        resetToken: "xyz",
        resetTokenExpiry: "2024-01-01",
        save: () => Promise.resolve(),
      };

      sandbox.stub(transporter, "sendMail").returns(Promise.resolve(""));
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));

      await forgotPassword(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Reset Password Link Sent",
        success: true,
      });
    });

    it("test no email", async () => {
      const req = {
        body: {
          email: undefined,
        },
      };

      await forgotPassword(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({
        message: "Email Not Provided",
      });
    });

    it("test user not found", async () => {
      const req = {
        body: {
          email: "user@test.com",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await forgotPassword(req, res);
      expect(res.status).to.have.calledWith(401);
      expect(res.json).to.have.calledWith({
        message: "User Not Found",
      });
    });

    it("test error", async () => {
      const req = {
        body: {
          email: "user@test.com",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.reject());

      await forgotPassword(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: undefined,
      });
    });
  });

  describe("test resetPassword", () => {
    it("test success", async () => {
      const req = {
        params: {
          token: "xyz",
        },
        body: {
          password: "1234",
        },
      };

      const user = {
        resetToken: "xyz",
        resetTokenExpiry: "2024-01-01",
        save: () => Promise.resolve(),
      };

      sandbox.stub(bcrypt, "hash").resolves("xyz2");
      sandbox.stub(bcrypt, "compare").resolves(false);
      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));

      await resetPassword(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Password changed",
        success: true,
      });
    });

    it("test link expired", async () => {
      const req = {
        params: {
          token: "xyz2",
        },
        body: {
          password: "1234",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(undefined));

      await resetPassword(req, res);
      expect(res.status).to.have.calledWith(401);
      expect(res.json).to.have.calledWith({
        message: "Link Expired",
      });
    });

    it("test error", async () => {
      const req = {
        params: {
          token: "xyz",
        },
        body: {
          password: "",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.reject());

      await resetPassword(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
      });
    });
  });

  describe("test tokenExpiryCheck", () => {
    it("test success", async () => {
      const req = {
        params: {
          token: "xyz",
        },
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "123" }));

      await tokenExpiryCheck(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        expired: false,
      });
    });

    it("test expired", async () => {
      const req = {
        params: {
          token: "xyz2",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve());

      await tokenExpiryCheck(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        expired: true,
      });
    });

    it("test error", async () => {
      const req = {
        params: {
          token: "xyz2",
        },
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.reject());

      await tokenExpiryCheck(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
      });
    });
  });
});

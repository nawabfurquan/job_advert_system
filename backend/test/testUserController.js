import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import bcrypt from "bcryptjs";
import {
  downloadUserFile,
  getAllUsers,
  getUserById,
  removeUserById,
  updateInteractionsByUserId,
  updatePassword,
  updateUserById,
} from "../controller/userController.js";
import { UserModel } from "../model/userModel.js";
import { UserFileModel } from "../model/userFileModel.js";

use(sinonChai);

describe("test user controller", () => {
  const sandbox = sinon.createSandbox();

  const res = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
    set: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  describe("test getAllUsers", () => {
    it("test success", async () => {
      const userList = [
        {
          userId: "1",
          email: "abc@test.com",
          name: "Test",
          phone: 1234,
          isEmployer: false,
          isAdmin: false,
        },
      ];

      sandbox
        .stub(UserModel, "find")
        .returns({ select: () => Promise.resolve(userList) });

      await getAllUsers({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({ users: userList });
    });

    it("test empty list", async () => {
      sandbox
        .stub(UserModel, "find")
        .returns({ select: () => Promise.resolve([]) });

      await getAllUsers({}, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "No users found",
        users: [],
      });
    });

    it("test error", async () => {
      sandbox
        .stub(UserModel, "find")
        .returns({ select: () => Promise.reject("error") });

      await getAllUsers({}, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test getUserById", () => {
    it("test success", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns({ select: () => Promise.resolve({ userId: "1" }) });

      await getUserById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        user: {
          userId: "1",
        },
      });
    });

    it("test no user", async () => {
      const req = {
        params: {
          userId: "3",
        },
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns({ select: () => Promise.resolve() });

      await getUserById(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({
        message: "No user found",
      });
    });

    it("test error", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };

      sandbox
        .stub(UserModel, "findOne")
        .returns({ select: () => Promise.reject("error") });

      await getUserById(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test updateUserById", () => {
    it("test success", async () => {
      const req = {
        body: {
          userId: "1",
        },
      };

      sandbox
        .stub(UserFileModel, "findOne")
        .returns(Promise.resolve({ userFileId: "1" }));
      sandbox
        .stub(UserModel, "findOneAndUpdate")
        .returns({ select: () => Promise.resolve({ userId: "1" }) });

      await updateUserById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        user: {
          userId: "1",
        },
      });
    });
  });

  describe("test updatePassword", () => {
    it("test success", async () => {
      const req = {
        body: {
          userId: "1",
          password: "1234",
        },
      };

      sandbox.stub(bcrypt, "hash").resolves("$efq1");
      sandbox.stub(bcrypt, "compare").resolves(false);
      sandbox
        .stub(UserModel, "findOne")
        .returns(Promise.resolve({ userId: "1", password: "123" }));
      sandbox
        .stub(UserModel, "findOneAndUpdate")
        .returns(Promise.resolve({ userId: "1" }));

      await updatePassword(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        success: true,
        message: "Password changed successfully",
      });
    });
  });

  describe("test removeUserById", () => {
    it("test success", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };

      const user = {
        userId: "1",
        email: "abc@test.com",
        name: "Test",
        phone: 1234,
      };

      sandbox
        .stub(UserModel, "findOneAndDelete")
        .returns({ select: () => Promise.resolve(user) });

      await removeUserById(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Deletion successful",
        user,
      });
    });

    it("test user not found", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };

      sandbox
        .stub(UserModel, "findOneAndDelete")
        .returns({ select: () => Promise.resolve(undefined) });

      await removeUserById(req, res);
      expect(res.status).to.have.calledWith(404);
      expect(res.json).to.have.calledWith({ message: "No user found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          userId: "1",
        },
      };

      sandbox
        .stub(UserModel, "findOneAndDelete")
        .returns({ select: () => Promise.reject("error") });

      await removeUserById(req, res);
      expect(res.status).to.have.calledWith(500);
      expect(res.json).to.have.calledWith({
        message: "Internal Server Error",
        error: "error",
      });
    });
  });

  describe("test downloadUserFile", () => {
    it("test success", async () => {
      const req = {
        params: {
          userFileId: "1",
        },
      };

      const file = {
        userFileId: "1",
        fileType: "application/pdf",
        data: "binary_data",
      };

      sandbox.stub(UserFileModel, "findOne").returns(Promise.resolve(file));

      await downloadUserFile(req, res);

      expect(res.set).to.have.been.calledWith(
        "Content-Type",
        "application/pdf"
      );
      expect(res.send).to.have.been.calledWith("binary_data");
    });

    it("test no file", async () => {
      const req = {
        params: {
          userFileId: "1",
        },
      };

      sandbox
        .stub(UserFileModel, "findOne")
        .returns(Promise.resolve(undefined));

      await downloadUserFile(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: "Resume not found" });
    });

    it("test error", async () => {
      const req = {
        params: {
          userFileId: "1",
        },
      };

      sandbox.stub(UserFileModel, "findOne").returns(Promise.reject());

      await downloadUserFile(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        message: "Internal Server Error",
      });
    });
  });

  describe("test updateInteractionsByUserId", () => {
    it("test success", async () => {
      const req = {
        params: {
          userId: "1",
        },
        body: {
          jobId: "1",
        },
      };

      const user = {
        userId: "1",
        email: "email",
        name: "name",
        isAdmin: false,
        isEmployer: false,
        interactions: [],
        save: () => Promise.resolve(),
      };

      sandbox.stub(UserModel, "findOne").returns(Promise.resolve(user));

      await updateInteractionsByUserId(req, res);
      expect(res.status).to.have.calledWith(200);
      expect(res.json).to.have.calledWith({
        message: "Successfully updated",
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isEmployer: user.isEmployer,
          skills: user?.skills,
          experience: user?.experience,
          preferences: user?.preferences,
          location: user?.location,
          phone: user?.phone,
          resume: user?.resume,
          interactions: ["1"],
        },
      });
    });
  });
});

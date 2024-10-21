import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import mongoose from "mongoose";
import { checkIsAdminOrEmployer } from "../middleware/checkIsAdminOrEmployer.js";
import { UserModel } from "../model/userModel.js";

use(sinonChai);

describe("test checkIsAdminOrEmployer", () => {
  const sandbox = sinon.createSandbox();

  const res = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
  };

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  it("test success", async () => {
    const req = {
      userId: "1",
    };

    sandbox
      .stub(UserModel, "findOne")
      .returns(Promise.resolve({ userId: "1", isEmployer: true }));

    await checkIsAdminOrEmployer(req, res, () => {});
  });

  it("test user not found", async () => {
    const req = {
      userId: "3",
    };

    sandbox.stub(UserModel, "findOne").returns(Promise.resolve());

    await checkIsAdminOrEmployer(req, res, () => {});
    expect(res.status).to.have.calledWith(404);
    expect(res.json).to.have.calledWith({ message: "User not found" });
  });

  it("test no admin", async () => {
    const req = {
      userId: "1",
    };

    sandbox
      .stub(UserModel, "findOne")
      .returns(Promise.resolve({ userId: "1", isEmployer: false }));

    await checkIsAdminOrEmployer(req, res, () => {});
    expect(res.status).to.have.calledWith(403);
    expect(res.json).to.have.calledWith({ message: "Access denied" });
  });

  it("test error", async () => {
    const req = {
      userId: "4",
    };

    sandbox.stub(UserModel, "findOne").returns(Promise.reject());

    await checkIsAdminOrEmployer(req, res, () => {});
    expect(res.status).to.have.calledWith(401);
    expect(res.json).to.have.calledWith({
      message: "Internal Server Error",
      error: undefined,
    });
  });
});

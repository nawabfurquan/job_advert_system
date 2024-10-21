import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { checkAuth } from "../middleware/checkAuth.js";
import { UserModel } from "../model/userModel.js";

use(sinonChai);

describe("test checkAuth", () => {
  // Inspiration from https://github.com/jonathanjwatson
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
      headers: {
        authorization: "Bearer xyz",
      },
    };

    jwt.verify = sandbox.stub().returns({ userId: "abc" });

    await checkAuth(req, res, () => {});
    expect(req).to.have.property("userId");
  });

  it("test invalid token", async () => {
    const req = {
      headers: {},
    };

    await checkAuth(req, res, () => {});
    expect(res.status).to.have.calledWith(401);
    expect(res.json).to.have.calledWith({ message: "User not authorized" });
  });

  it("test no token", () => {
    const req = {
      headers: {
        authorization: undefined,
      },
    };

    expect(checkAuth(req, res, () => {})).to.throw;
  });
});

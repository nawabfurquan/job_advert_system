import { render } from "@testing-library/react";
import JobDetailPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter, useParams } from "react-router-dom";
import { mockJobs, mockUser } from "../../../utils/mockData/mockData";
import { useAuth } from "../../../utils/context/authContext";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("JobDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      setUser: () => {},
    });
  });

  it("render page", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { job: mockJobs[0] },
    });

    render(
      <BrowserRouter>
        <JobDetailPage />
      </BrowserRouter>
    );
  });
});

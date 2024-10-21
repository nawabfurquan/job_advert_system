import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { Application, Job } from "../../../utils/types/types";
import { BrowserRouter } from "react-router-dom";
import UserDashboard from ".";
import { AuthProvider, useAuth } from "../../../utils/context/authContext";
import {
  mockApplications,
  mockJobs,
  mockUser,
} from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("UserDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render dashboard", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobs: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );
  });

  it("click buttons", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobs: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const { getByTestId, getAllByTestId } = render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("user_app_view");
      arr.forEach((a) => fireEvent.click(a));
      const arr1 = getAllByTestId("user_job_view");
      arr1.forEach((a) => fireEvent.click(a));
      fireEvent.click(getByTestId("job_view_all"));
      fireEvent.click(getByTestId("app_view_all"));
    });
  });
});

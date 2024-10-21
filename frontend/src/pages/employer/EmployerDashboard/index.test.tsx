import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { Application, Job } from "../../../utils/types/types";
import { BrowserRouter } from "react-router-dom";
import EmployerDashboard from ".";
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

describe("EmployerDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render dashboard", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobList: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
  });

  it("click buttons", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobList: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const { getByTestId, getAllByTestId } = render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("admin_job_edit");
      arr.forEach((a) => fireEvent.click(a));
      fireEvent.click(getByTestId("jobs_view_all"));
      fireEvent.click(getByTestId("job_create"));
      fireEvent.click(getByTestId("app_view_all"));
    });
  });
});

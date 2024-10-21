import { fireEvent, render, waitFor } from "@testing-library/react";
import AdminDashboard from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { Application, Job } from "../../../utils/types/types";
import { BrowserRouter } from "react-router-dom";
import { mockApplications, mockJobs } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

const count = {
  user: 1,
  application: 2,
  job: 2,
};

describe("AdminApplicationsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render dashboard", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobList: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      })
      .mockResolvedValueOnce({ data: { ...count } });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });

  it("click buttons", async () => {
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({ data: { jobList: mockJobs } })
      .mockResolvedValueOnce({
        data: { applicationList: mockApplications },
      })
      .mockResolvedValueOnce({ data: { ...count } });

    const { getByTestId, getAllByTestId } = render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("count_card");
      arr.forEach((a) => fireEvent.click(a));
      fireEvent.click(getByTestId("job_view_all"));
      fireEvent.click(getByTestId("app_view_all"));
    });
  });
});

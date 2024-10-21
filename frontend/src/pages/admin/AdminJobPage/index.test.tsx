import { fireEvent, render, waitFor } from "@testing-library/react";
import { Job } from "../../../utils/types/types";
import AdminJobPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter } from "react-router-dom";
import { mockJobs } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

describe("AdminJobPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render job page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { jobList: mockJobs },
    });

    const { getAllByTestId } = render(
      <BrowserRouter>
        <AdminJobPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("admin_job_edit");
      arr.forEach((a) => fireEvent.click(a));
    });
  });
});

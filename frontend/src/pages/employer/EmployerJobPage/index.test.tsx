import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { useAuth } from "../../../utils/context/authContext";
import { Job } from "../../../utils/types/types";
import { BrowserRouter } from "react-router-dom";
import EmployerJobPage from ".";
import { mockJobs, mockUser } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("EmployerJobPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render job page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { jobList: mockJobs },
    });
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const { getAllByTestId } = render(
      <BrowserRouter>
        <EmployerJobPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("admin_job_edit");
      arr.forEach((a) => fireEvent.click(a));
    });
  });
});

import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { useAuth } from "../../../utils/context/authContext";
import { BrowserRouter } from "react-router-dom";
import RecommendedJobPage from ".";
import { mockJobs, mockUser } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("RecommendedJobPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render recommended job page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { jobs: mockJobs },
    });

    const { getAllByTestId } = render(
      <BrowserRouter>
        <RecommendedJobPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("job_view");
      arr.forEach((a) => fireEvent.click(a));
    });
  });
});

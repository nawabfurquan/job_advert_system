import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter } from "react-router-dom";
import JobSearchPage from ".";
import { mockJobs, mockUser } from "../../../utils/mockData/mockData";
import { act } from "react";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

describe("JobSearchPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render job page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { jobList: mockJobs },
    });

    const { getAllByTestId, getByTestId } = render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByTestId("job_filters")).toBeInTheDocument();
      expect(getByTestId("grid_container")).toBeInTheDocument();
    });

    act(() => {
      const arr1 = getAllByTestId("filter_expand");
      arr1.forEach((a) => {
        fireEvent.click(a);
      });
      fireEvent.click(getByTestId("salary_expand"));
      fireEvent.click(getByTestId("clear_filters"));
      fireEvent.click(getByTestId("clear_search"));
      const arr = getAllByTestId("user_job_view");
      arr.forEach((a) => fireEvent.click(a));
    });
  });
});

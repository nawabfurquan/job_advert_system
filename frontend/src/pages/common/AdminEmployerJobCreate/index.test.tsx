import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminEmployerJobCreate from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { mockJobs } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  post: jest.fn(),
}));

describe("AdminEmployerJobCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { job: mockJobs[0] },
    });

    const { getByTestId, queryByTestId } = render(
      <BrowserRouter>
        <AdminEmployerJobCreate />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(queryByTestId("oval-loading")).not.toBeInTheDocument();
    });

    fireEvent.change(getByTestId("title_field"), { target: { value: "name" } });
    fireEvent.change(getByTestId("desc_field"), { target: { value: "name" } });
    fireEvent.change(getByTestId("company_field"), {
      target: { value: "name" },
    });
    fireEvent.change(getByTestId("req_field"), { target: { value: "name" } });
    fireEvent.change(getByTestId("res_field"), { target: { value: "name" } });

    fireEvent.click(getByTestId("create"));

    await waitFor(() => {
      expect(queryByTestId("oval-loading")).not.toBeInTheDocument();
    });

    fireEvent.click(getByTestId("go_back"));
  });
});

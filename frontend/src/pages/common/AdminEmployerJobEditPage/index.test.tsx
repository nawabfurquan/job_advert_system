import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter, useParams } from "react-router-dom";
import { mockJobs } from "../../../utils/mockData/mockData";
import AdminEmployerJobEditPage from ".";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("AdminEmployerJobEditPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page", async () => {
    (useParams as jest.Mock).mockReturnValue({ jobId: "1" });
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { job: mockJobs[0] },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <AdminEmployerJobEditPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("go_back"));
    });
  });

  it("render page", async () => {
    (useParams as jest.Mock).mockReturnValue({ jobId: "1" });
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { job: mockJobs[0] },
    });
    (axiosInstance.patch as jest.Mock).mockResolvedValueOnce({
      data: { job: mockJobs[0] },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <AdminEmployerJobEditPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(getByTestId("title_field"), {
        target: { value: "title" },
      });
      fireEvent.click(getByTestId("company_field"), {
        target: { value: "company" },
      });
      fireEvent.click(getByTestId("desc_field"), { target: { value: "desc" } });
      fireEvent.click(getByTestId("add_req"));
      fireEvent.click(getByTestId("add_res"));
      fireEvent.click(getByTestId("edit_btn"));
    });
  });
});

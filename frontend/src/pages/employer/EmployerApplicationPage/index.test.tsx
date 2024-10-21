import { fireEvent, render, waitFor } from "@testing-library/react";
import EmployerApplicationsPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter } from "react-router-dom";
import { Application } from "../../../utils/types/types";
import { mockApplications } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

describe("EmployerApplicationsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { applicationList: mockApplications },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <EmployerApplicationsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByTestId("grid_container")).toBeInTheDocument();
    });
  });

  it("render fire events", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { applicationList: mockApplications },
    });

    const { getAllByTestId } = render(
      <BrowserRouter>
        <EmployerApplicationsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("admin_app_card");
      arr.forEach((a) => fireEvent.click(a));
    });
  });

  it("render empty list", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { applicationList: [] },
    });

    const { getByText } = render(
      <BrowserRouter>
        <EmployerApplicationsPage />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(getByText("No Applications to display")).toBeInTheDocument()
    );
  });
});

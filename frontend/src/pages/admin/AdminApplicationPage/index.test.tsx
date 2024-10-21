// AdminApplicationsPage.test.tsx
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Application } from "../../../utils/types/types";
import AdminApplicationsPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter } from "react-router-dom";
import { mockApplications } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

describe("AdminApplicationsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { applicationList: mockApplications },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <AdminApplicationsPage />
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
        <AdminApplicationsPage />
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

    render(
      <BrowserRouter>
        <AdminApplicationsPage />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("No Applications to display")).toBeInTheDocument()
    );
  });
});

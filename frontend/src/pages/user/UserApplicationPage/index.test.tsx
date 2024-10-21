import { fireEvent, render, waitFor } from "@testing-library/react";
import UserApplicationPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter } from "react-router-dom";
import { Application } from "../../../utils/types/types";
import { mockApplications, mockUser } from "../../../utils/mockData/mockData";
import { useAuth } from "../../../utils/context/authContext";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("UserApplicationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { applicationList: mockApplications },
    });

    render(
      <BrowserRouter>
        <UserApplicationPage />
      </BrowserRouter>
    );
  });

  it("render fire events", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { applicationList: mockApplications },
    });

    const { getAllByTestId } = render(
      <BrowserRouter>
        <UserApplicationPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const arr = getAllByTestId("user_app_view");
      arr.forEach((a) => fireEvent.click(a));
    });
  });

  it("render empty list", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { applicationList: [] },
    });

    const { getByText } = render(
      <BrowserRouter>
        <UserApplicationPage />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(getByText("No Applications to display")).toBeInTheDocument()
    );
  });
});

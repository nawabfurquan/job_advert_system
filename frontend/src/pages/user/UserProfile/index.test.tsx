import { fireEvent, render, waitFor } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { useAuth } from "../../../utils/context/authContext";
import { BrowserRouter } from "react-router-dom";
import UserProfilePage from ".";
import { mockUser } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("UserProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <UserProfilePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(getByTestId("name_field"), {
        target: { value: "name" },
      });
      fireEvent.change(getByTestId("email_field"), {
        target: { value: "abc@test.com" },
      });
      fireEvent.change(getByTestId("phone_field"), {
        target: { value: 113242424 },
      });
      fireEvent.change(getByTestId("location_field"), {
        target: { value: "abc" },
      });
      fireEvent.click(getByTestId("save_btn"));
    });
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <UserProfilePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(getByTestId("password_field"), {
        target: { value: "Test@123" },
      });
      fireEvent.change(getByTestId("confirm_field"), {
        target: { value: "Test@123" },
      });
      fireEvent.click(getByTestId("change_btn"));
    });
  });
});

import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../../../utils/context/authContext";
import LoginPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../utils/api/axiosInstance", () => ({
  post: jest.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ addAuthData: () => {} });
  });
  test("test page", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("signup_btn"));
      fireEvent.click(getByTestId("forgot_btn"));
    });
  });

  test("test page", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValue({
      data: {
        authToken: "123",
        refreshToken: "123",
        user: { userId: "1", isAdmin: false, isEmployer: false },
      },
    });
    const { getByTestId } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(getByTestId("email_field"), {
        target: { value: "abc@test.com" },
      });
      fireEvent.change(getByTestId("password_field"), {
        target: { value: "Test@123" },
      });
      fireEvent.click(getByTestId("login_btn"));
    });
  });
});

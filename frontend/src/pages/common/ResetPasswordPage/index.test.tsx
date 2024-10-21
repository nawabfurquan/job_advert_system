import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import ResetPasswordPage from ".";
import axiosInstance from "../../../utils/api/axiosInstance";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ token: "xyz" });
  });
  test("test page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({ expired: true });
    const { getByTestId } = render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("login_btn"));
      fireEvent.click(getByTestId("signup_btn"));
    });
  });
  test("test page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({ expired: false });
    const { getByTestId } = render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  });
});

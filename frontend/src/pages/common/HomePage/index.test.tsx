import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from ".";
import { useAuth } from "../../../utils/context/authContext";

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
  });
  test("test page", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("job_btn"));
      fireEvent.click(getByTestId("login_btn"));
      fireEvent.click(getByTestId("signup_btn"));
    });
  });
});

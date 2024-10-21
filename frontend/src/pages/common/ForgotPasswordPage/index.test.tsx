import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPasswordPage from ".";

describe("Forgot Password Page", () => {
  test("test page", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("login_btn"));
    });
  });
});

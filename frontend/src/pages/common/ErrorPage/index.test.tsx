import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ErrorPage from ".";

describe("Error Page", () => {
  test("test page", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("homepage_btn"));
    });
  });
});

import { render } from "@testing-library/react";
import Header from ".";
import { BrowserRouter } from "react-router-dom";

test("Header", () => {
  render(
    <BrowserRouter>
      <Header setIsLoading={() => {}} />
    </BrowserRouter>
  );
});

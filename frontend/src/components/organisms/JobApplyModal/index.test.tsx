import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import JobApplyModal from ".";
import { useAuth } from "../../../utils/context/authContext";
import { mockUser } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("JobApplyModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render page", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <JobApplyModal
          openModal
          handleClose={() => {}}
          setIsLoading={() => {}}
          userId={"1"}
          jobId={"1"}
          initApplication={() => Promise.resolve()}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByTestId("job_modal_apply_btn"));
    });
  });
});

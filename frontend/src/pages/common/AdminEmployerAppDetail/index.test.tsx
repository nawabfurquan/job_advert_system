import { fireEvent, render, waitFor } from "@testing-library/react";
import AdminEmployerAppDetail from ".";
import axiosInstance from "../../../utils/api/axiosInstance";
import { BrowserRouter, useParams } from "react-router-dom";
import { mockApplications, mockUser } from "../../../utils/mockData/mockData";
import { useAuth } from "../../../utils/context/authContext";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("AdminEmployerAppDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render page", async () => {
    const mockBlob = new Blob(["data"], { type: "application/pdf" });
    (useParams as jest.Mock).mockReturnValue({ applicationId: "1" });
    (axiosInstance.get as jest.Mock)
      .mockResolvedValueOnce({
        data: { application: mockApplications[0] },
      })
      .mockResolvedValueOnce({ data: mockBlob })
      .mockResolvedValueOnce({ data: mockBlob });

    const { getByTestId, queryByTestId } = render(
      <BrowserRouter>
        <AdminEmployerAppDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(queryByTestId("oval-loading")).not.toBeInTheDocument();
    });

    fireEvent.click(getByTestId("download_resume"));

    await waitFor(() => {
      expect(queryByTestId("oval-loading")).not.toBeInTheDocument();
    });

    fireEvent.click(getByTestId("download_coverletter"));

    await waitFor(() => {
      expect(queryByTestId("oval-loading")).not.toBeInTheDocument();
    });

    fireEvent.click(getByTestId("back"));
  });
});

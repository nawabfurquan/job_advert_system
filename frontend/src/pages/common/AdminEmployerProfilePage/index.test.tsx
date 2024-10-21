import { render } from "@testing-library/react";
import axiosInstance from "../../../utils/api/axiosInstance";
import { useAuth } from "../../../utils/context/authContext";
import { BrowserRouter } from "react-router-dom";
import AdminEmployerProfilePage from ".";
import { mockUser } from "../../../utils/mockData/mockData";

jest.mock("../../../utils/api/axiosInstance", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("AdminEmployerProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("render page", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });

    render(
      <BrowserRouter>
        <AdminEmployerProfilePage />
      </BrowserRouter>
    );
  });
});

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/common/LoginPage";
import SignupPage from "./pages/common/SignupPage";
import Header from "./components/organisms/Header";
import AdminRoutes from "./utils/routes/AdminRoutes";
import UserRoutes from "./utils/routes/UserRoutes";
import HomePage from "./pages/common/HomePage";
import JobSearchPage from "./pages/user/JobSearchPage";
import JobDetailPage from "./pages/user/JobDetailPage";
import ErrorPage from "./pages/common/ErrorPage";
import { useAuth } from "./utils/context/authContext";
import { useState } from "react";
import Loader from "./components/organisms/Loader";
import { Box } from "@mui/material";
import ForgotPasswordPage from "./pages/common/ForgotPasswordPage";
import EmployerRoutes from "./utils/routes/EmployerRoutes";
import ResetPasswordPage from "./pages/common/ResetPasswordPage";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";

function App() {
  const { isAuthenticated, isEmployer, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        {/* Header component */}
        <Header setIsLoading={setIsLoading} />
        {!isLoading ? (
          // Routes
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Authenticated routes */}
            {isAuthenticated ? (
              <>
                {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
                {!isAdmin && !isEmployer && (
                  <Route path="/user/*" element={<UserRoutes />} />
                )}
                {isEmployer && (
                  <Route path="/employer/*" element={<EmployerRoutes />} />
                )}
              </>
            ) : (
              <></>
            )}
            <Route path="/jobs" element={<JobSearchPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Loader />
          </Box>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;

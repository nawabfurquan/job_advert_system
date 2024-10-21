import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployerDashboard from "../../pages/employer/EmployerDashboard";
import EmployerJobPage from "../../pages/employer/EmployerJobPage";
import EmployerApplicationsPage from "../../pages/employer/EmployerApplicationPage";
import ErrorPage from "../../pages/common/ErrorPage";
import AdminEmployerAppDetail from "../../pages/common/AdminEmployerAppDetail";
import AdminEmployerJobEditPage from "../../pages/common/AdminEmployerJobEditPage";
import AdminEmployerJobCreate from "../../pages/common/AdminEmployerJobCreate";
import AdminEmployerProfilePage from "../../pages/common/AdminEmployerProfilePage";

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<EmployerDashboard />} />
      <Route path="/jobs" element={<EmployerJobPage />} />
      <Route path="/jobs/:jobId" element={<AdminEmployerJobEditPage />} />
      <Route path="/jobs/create" element={<AdminEmployerJobCreate />} />
      <Route path="/profile" element={<AdminEmployerProfilePage />} />
      <Route path="/applications" element={<EmployerApplicationsPage />} />
      <Route
        path="/applications/:applicationId"
        element={<AdminEmployerAppDetail />}
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default EmployerRoutes;

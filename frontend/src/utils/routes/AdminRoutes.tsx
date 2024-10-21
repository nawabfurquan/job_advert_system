import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminJobPage from "../../pages/admin/AdminJobPage";
import AdminApplicationsPage from "../../pages/admin/AdminApplicationPage";
import ErrorPage from "../../pages/common/ErrorPage";
import AdminEmployerAppDetail from "../../pages/common/AdminEmployerAppDetail";
import AdminEmployerJobEditPage from "../../pages/common/AdminEmployerJobEditPage";
import AdminEmployerJobCreate from "../../pages/common/AdminEmployerJobCreate";
import AdminEmployerProfilePage from "../../pages/common/AdminEmployerProfilePage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/jobs" element={<AdminJobPage />} />
      <Route path="/jobs/:jobId" element={<AdminEmployerJobEditPage />} />
      <Route path="/profile" element={<AdminEmployerProfilePage />} />
      <Route path="/applications" element={<AdminApplicationsPage />} />
      <Route
        path="/applications/:applicationId"
        element={<AdminEmployerAppDetail />}
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AdminRoutes;

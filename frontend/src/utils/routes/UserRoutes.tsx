import React from "react";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "../../pages/user/UserDashboard";
import UserApplicationsPage from "../../pages/user/UserApplicationPage";
import UserProfilePage from "../../pages/user/UserProfile";
import ErrorPage from "../../pages/common/ErrorPage";
import RecommendedJobPage from "../../pages/user/RecommendedJobPage";
import UserApplicationDetail from "../../pages/user/UserApplicationDetail";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/applications" element={<UserApplicationsPage />} />
      <Route path="/applications/:id" element={<UserApplicationDetail />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/recommended" element={<RecommendedJobPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default UserRoutes;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import Pageframe from "./components/Pageframe/Pageframe";
import ProtectedRoute from "./components/ProtectedRoute";

import Loginpage from "./page/Loginpage";
import Pdpapage from "./page/Pdpapage";

import Tutorialpage from "./page/Tutorialpage"
import ResultViewpage from "./page/ResultViewpage";
import Contactpage from "./page/Contactpage";
import Surveypage from "./page/Surveypage";
import Promptpage from "./page/Promptpage";
import AdminDashboard from "./page/Adminpage/AdminDashboardpage";
import NextSteppage from "./page/NextSteppage";
import Historypage from "./page/Historypage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* PDPA routes — full viewport, no Pageframe */}
        <Route path="/" element={<Pdpapage />} />
        <Route path="/pdpa" element={<Pdpapage />} />

        <Route element={<Pageframe />}>
          {/* Public Routes */}
          <Route path="/login" element={<Loginpage />} />

          {/* Protected Routes */}
          <Route path="/tutorial" element={<ProtectedRoute><Tutorialpage /></ProtectedRoute>} />
          <Route path="/result" element={<Navigate to="/agentic" replace />} />
          <Route path="/result/:id" element={<ProtectedRoute><ResultViewpage /></ProtectedRoute>} />
          <Route path="/survey/:formSet" element={<ProtectedRoute><Surveypage /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contactpage /></ProtectedRoute>} />
          <Route path="/agentic" element={<ProtectedRoute><Promptpage /></ProtectedRoute>} />
          <Route path="/nextstep" element={<ProtectedRoute><NextSteppage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Historypage /></ProtectedRoute>} />
        </Route>
        {/* Admin Dashboard - protected by AuthContext inside the component */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

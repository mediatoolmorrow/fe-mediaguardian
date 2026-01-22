import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pageframe from "./components/Pageframe/Pageframe";
import ProtectedRoute from "./components/ProtectedRoute";

{/* Unprotected Routes */}
import Loginpage from "./page/Loginpage";
import Pdpapage from "./page/Pdpapage";

{/* Protected Routes */}
import Tutorialpage from "./page/Tutorialpage"
import ResultViewpage from "./page/ResultViewpage";
import ResultListpage from "./page/ResultListpage";
import Contactpage from "./page/Contactpage";
import Surveypage from "./page/Surveypage";
import Promptpage from "./page/Promptpage";
import AdminDashboard from "./page/Adminpage/AdminDashboardpage";
import AdminLoginpage from "./page/Adminpage/Loginpage";
import NextSteppage from "./page/NextSteppage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Pageframe />}>
          {/* Public Routes */}
          <Route path="/" element={<Pdpapage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/pdpa" element={<Pdpapage />} />

          {/* Protected Routes */}
          <Route path="/tutorial" element={<ProtectedRoute><Tutorialpage /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultListpage /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><ResultViewpage /></ProtectedRoute>} />
          <Route path="/survey" element={<ProtectedRoute><Surveypage /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contactpage /></ProtectedRoute>} />
          <Route path="/agentic" element={<ProtectedRoute><Promptpage /></ProtectedRoute>} />
          <Route path="/nextstep" element={<ProtectedRoute><NextSteppage /></ProtectedRoute>} />
        </Route>
        <Route>
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/adminlogin" element={<AdminLoginpage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

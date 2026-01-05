import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pageframe from "./components/Pageframe/Pageframe";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Pageframe />}>
          <Route path="/" element={<Pdpapage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/pdpa" element={<Pdpapage />} />
          <Route path="/tutorial" element={<Tutorialpage />} />
          <Route path="/result" element={<ResultListpage />} />
          <Route path="/result/:id" element={<ResultViewpage />} />
          <Route path="/survey" element={<Surveypage />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="/agentic" element={<Promptpage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

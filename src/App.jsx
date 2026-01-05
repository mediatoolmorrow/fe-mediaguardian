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
          <Route path="/" element={<Surveypage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pageframe from "./components/Pageframe/Pageframe";
import Homepage from "./page/Homepage"; {/* Remove This one Later*/}
import Loginpage from "./page/Loginpage"; 
import Pdpapage from "./page/Pdpapage";
import Tutorialpage from "./page/Tutorialpage"
import ResultViewpage from "./page/ResultViewpage";
import ResultListpage from "./page/ResultListpage";
import Contactpage from "./page/Contactpage";
import Surveypage from "./page/Surveypage";
import Promptpage from "./page/PromptPage";

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

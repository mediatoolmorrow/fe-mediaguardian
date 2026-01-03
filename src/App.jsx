import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pageframe from "./components/Pageframe/Pageframe";
import Homepage from "./page/Homepage";
import Loginpage from "./page/Loginpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Pageframe />}>
          <Route path="/" element={<Loginpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

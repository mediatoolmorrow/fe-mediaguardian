import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PromptPage from "./pages/PromptPage";
import VideoPage from "./pages/VideoPage";
import PdpaPage from "./pages/PdpaPage";
import ContactPage from "./pages/ContactPage";
import ResultPage from "./pages/ResultPage";
import ResultViewPage from "./pages/ResultViewPage";
import SurveyPage from "./pages/SurveyPage";

function App() {
  return (
    <div className="w-screen h-screen bg-gray-300 flex justify-center items-center">
      <div className="w-full h-full sm:w-[430px] sm:h-[879px] bg-white sm:rounded-3xl overflow-hidden shadow-2xl">
        <Router>
          <Routes>
            <Route path="/" element={<SurveyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/result/:sessionId" element={<ResultViewPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

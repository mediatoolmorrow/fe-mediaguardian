import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PromptPage from "./pages/PromptPage";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <div className="w-screen h-screen bg-gray-300 flex justify-center items-center">
      <div className="w-full h-full sm:w-[430px] sm:h-[879px] bg-white sm:rounded-3xl overflow-hidden shadow-2xl">
        <Router>
          <Routes>
            <Route path="/" element={<VideoPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

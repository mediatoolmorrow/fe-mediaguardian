import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RESULT_DATA from "../components/data/resultData.json";
import AnswerViewer from "../components/AnswerViewer"; 

function ResultViewPage() {
  const { sessionId } = useParams(); 
  const sessionData = RESULT_DATA[sessionId] || [];

  return (
    <div className="flex flex-col h-screen max-w-[377px] p-4 gap-4"> 
        <AnswerViewer data={sessionData} />
    </div>
  );
}

export default ResultViewPage;

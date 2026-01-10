import React from "react";
import ResultFull from "../components/Result/ResultFull";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function ResultViewpage (){
    const navigate = useNavigate();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
            <ResultFull 
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
            />
            <button className="btn-normal-active" onClick={()=>navigate("/survey")}> ไปต่อ </button> 
        </div>
    );
}

export default ResultViewpage;
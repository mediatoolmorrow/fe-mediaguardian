import React from "react";
import ResultFull from "../components/Result/ResultFull";
import Button from "../components/Button";

function ResultViewpage (){
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
            <ResultFull 
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
            />
            <Button 
                text="ต่อไป"
                variant="normalActive" 
            />
        </div>
    );
}

export default ResultViewpage;
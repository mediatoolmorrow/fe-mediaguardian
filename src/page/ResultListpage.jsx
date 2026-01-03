import React from "react";
import Banner from "../components/Banner";
import ResultSummary from "../components/Result/ResultSummary";

function ResultListpage (){
    return (
        <div className="w-full h-full">
            <div className="flex flex-col items-center justify-center space-y-8"> 
                <Banner 
                imgSource = "src/assets/banner/example.svg" />
                <div className="overflow-y-auto">
                        <ResultSummary/>
                </div>
            </div>
        </div>
    );
}

export default ResultListpage;
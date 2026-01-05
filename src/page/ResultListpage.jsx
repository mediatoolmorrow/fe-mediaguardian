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
                        <ResultSummary 
                        description="Lorem ipsum dolor sit amet consectetur. Aliquet vel felis commodo leo sed vel interdum interdum. Faucibus et ut tempor etiam amet orci ac. Nibh blandit egestas ut viverra rhoncus. Pretium platea placerat sit dolor pharetra pellentesque at. Orci neque nunc a lectus libero fermentum at velit pharetra. Sapien ultrices quam posuere duis dolor et vitae. Commodo nisl eget nibh elementum tellus. Mauris faucibus nulla egestas faucibus ut vitae elementum ac at. Praesent lectus aliquam id tristique ultrices urna a." />
                </div>
            </div>
        </div>
    );
}

export default ResultListpage;
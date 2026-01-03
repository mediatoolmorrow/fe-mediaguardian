import React from "react";
import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import ContactCard from "../components/ContactCard";
import ChoiceCard from "../components/ChoiceCard";
import ChoiceCheck from "../components/Survey/ChoiceCheck";
import Modal from "../components/Modal";
import ResultSummary from "../components/Result/ResultSummary";

function Homepage (){
    return (
        <div className="">
            <ResultSummary 
            description ="Lorem ipsum dolor sit amet consectetur. Aliquet vel felis commodo leo sed vel interdum interdum. Faucibus et ut tempor etiam amet orci ac. Nibh blandit egestas ut viverra rhoncus. Pretium platea placerat sit dolor pharetra pellentesque at. Orci neque nunc a lectus libero fermentum at velit pharetra. Sapien ultrices quam posuere duis dolor et vitae. Commodo nisl eget nibh elementum tellus. Mauris faucibus nulla egestas faucibus ut vitae elementum ac at. Praesent lectus aliquam id tristique ultrices urna a." />
        </div>
    );
}

export default Homepage;
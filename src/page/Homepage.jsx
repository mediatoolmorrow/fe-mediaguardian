import React from "react";
import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import ContactCard from "../components/ContactCard";
import ChoiceCard from "../components/ChoiceCard";
import ChoiceCheck from "../components/Survey/ChoiceCheck";
import Modal from "../components/Modal";
import ResultSummary from "../components/Result/ResultSummary";
import ResultFull from "../components/Result/ResultFull";
import Login from "../components/login";

function Homepage (){
    return (
        <div className="">
            <Login />
        </div>
    );
}

export default Homepage;
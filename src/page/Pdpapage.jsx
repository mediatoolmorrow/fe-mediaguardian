import React from "react";
import { useNavigate } from "react-router-dom";

function Pdpapage() {
  const navigate = useNavigate();
    return (
        <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-[424px] h-full max-h-[600px] flex flex-col items-center"> 
                <h1 className="text-primary text-3xl sm:text-5xl font-bold mb-3 sm:mb-6 flex-shrink-0">
                    PDPA
                </h1>
                <div className="w-full flex-1 min-h-0 overflow-y-auto text-sm sm:text-base mb-3 sm:mb-6 px-1">
                    <p className="text-gray-700 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur. Adipiscing quis sit gravida a et enim iaculis aliquam ultrices. Lorem vitae nec mi convallis mi. Sed aenean vitae et dictumst lacus elementum egestas eu urna. Amet turpis felis praesent vitae urna et faucibus. Urna dolor turpis pellentesque ut nisi molestie egestas aliquet. Proin enim pharetra imperdiet amet duis ac orci ac tortor. Phasellus augue diam malesuada nisi ut enim sagittis. Luctus molestie volutpat orci praesent a tortor pellentesque in malesuada. Eu sit a arcu hac
                        <br /><br />
                        faucibus amet mollis.Lorem ipsum dolor sit amet consectetur. Adipiscing quis sit gravida a et enim iaculis aliquam ultrices. Lorem vitae nec mi convallis mi. Sed aenean vitae et dictumst lacus elementum egestas eu urna. Amet turpis felis praesent vitae urna et faucibus. Urna dolor turpis pellentesque ut nisi molestie egestas aliquet. Proin enim pharetra imperdiet amet duis ac orci ac tortor. Phasellus augue diam malesuada nisi ut enim sagittis. Luctus molestie volutpat orci praesent a tortor pellentesque in malesuada. Eu sit a arcu hac faucibus amet mollis.
                    </p>
                </div>
                <div className="flex w-full items-center justify-center">
                    <button className="btn-normal-active disable:btn-normal-inactive" onClick={()=>{navigate("/login");}}> ยอมรับ </button>
                </div>
            </div>
        </div>
    );
}

export default Pdpapage;
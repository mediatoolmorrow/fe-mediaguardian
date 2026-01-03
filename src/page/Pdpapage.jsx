import React from "react";
import Button from "../components/Button";

function Pdpapage (){
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="max-h-[630px] max-w-[424px] min-h-[480px] min-w-[362px] text-center flex flex-col items-center justify-center space-y-6"> 
            <p className="text-primary text-5xl font-bold">
                PDPA
            </p>
            <p className="overflow-y-scroll">
                Lorem ipsum dolor sit amet consectetur. Adipiscing quis sit gravida a et enim iaculis aliquam ultrices. Lorem vitae nec mi convallis mi. Sed aenean vitae et dictumst lacus elementum egestas eu urna. Amet turpis felis praesent vitae urna et faucibus. Urna dolor turpis pellentesque ut nisi molestie egestas aliquet. Proin enim pharetra imperdiet amet duis ac orci ac tortor. Phasellus augue diam malesuada nisi ut enim sagittis. Luctus molestie volutpat orci praesent a tortor pellentesque in malesuada. Eu sit a arcu hac

                faucibus amet mollis.Lorem ipsum dolor sit amet consectetur. Adipiscing quis sit gravida a et enim iaculis aliquam ultrices. Lorem vitae nec mi convallis mi. Sed aenean vitae et dictumst lacus elementum egestas eu urna. Amet turpis felis praesent vitae urna et faucibus. Urna dolor turpis pellentesque ut nisi molestie egestas aliquet. Proin enim pharetra imperdiet amet duis ac orci ac tortor. Phasellus augue diam malesuada nisi ut enim sagittis. Luctus molestie volutpat orci praesent a tortor pellentesque in malesuada. Eu sit a arcu hac faucibus amet mollis.
            </p>
            <Button 
                text = "ยอมรับ"
                variant = "normalActive"
            />
            </div>
        </div>
    );
}

export default Pdpapage; 
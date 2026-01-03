import React from "react";
import Button from "../Button";

export default function ResultSummary({description}){
    return (
        <div className="flex min-w-[376px] min-h-[166px] max-w-[648px] max-h-[209px] gap-4">
            <img src="src/assets/icon/result.svg" className="w-11 h-11"/>
            <div className="flex flex-col items-center">
                <p className="mb-1 font-bold self-start text-sm"> ผลลัพธ์จากการประมวลผล </p>
                <p className="mb-6 self-start text-xs max-w-md"> {description} </p>
                <Button className="p-4"
                text="เลือกและแก้ไข" 
                variant="normalActive"/>
            </div>

        </div>
    );
}
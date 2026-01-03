import React from "react";

export default function Banner (imgSource) {
    return (
        <div className="w-screen max-h-[133px] object-cover">
            <img src={imgSource}/>
        </div>
    );
}
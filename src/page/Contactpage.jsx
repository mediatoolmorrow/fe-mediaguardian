import React from "react";
import Banner from "../components/Banner";
import ContactCard from "../components/ContactCard";

function Contactpage (){
    return (
        <div className="w-full h-full">
            <div className="flex flex-col items-center justify-center space-y-8"> 
                <Banner 
                imgSource = "src/assets/banner/example.svg" />
                <p className="text-2xl sm:text-3xl font-bold text-primary w-xs sm:w-xl text-center"> แนะนำช่องทางในการติดต่อ ข้อความช่วยเหลือ </p>
                <div className="overflow-y-auto p-2">
                        <ContactCard 
                        title = "ศูนย์ช่วยเหลือสังคม กระทรวงการพัฒนาสังคม และความมั่นคงของมนุษย์ (พม.)" 
                        description="Lorem ipsum dolor sit amet consectetur. Nunc dui tortor tincidunt sed pharetra."
                        tel="Call : 02-0001234" />
                </div>
            </div>
        </div>
    );
}

export default Contactpage;
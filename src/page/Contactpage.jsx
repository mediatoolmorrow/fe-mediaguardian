import React from "react";
import Banner from "../components/Banner";
import ContactCard from "../components/ContactCard";
import Button from "../components/Button";

function Contactpage() {
  const contact_list = [
    {
      id: 1,
      title:
        "ศูนย์ช่วยเหลือสังคม กระทรวงการพัฒนาสังคม และความมั่นคงของมนุษย์ (พม.)",
      description:
        "ให้คำปรึกษาและช่วยเหลือด้านสังคมสำหรับประชาชนทั่วไป",
      tel: "02-000-1234",
      icon: "/src/assets/contact/pm.png",
    },
    {
      id: 2,
      title: "สายด่วนสุขภาพจิต กรมสุขภาพจิต",
      description:
        "บริการรับฟังปัญหา ให้คำแนะนำ และดูแลด้านสุขภาพจิต",
      tel: "1323",
      icon: "/src/assets/contact/sorkorbor.png",
    },
    {
      id: 3,
      title: "แจ้งเหตุฉุกเฉิน สายด่วน 191",
      description:
        "ติดต่อเจ้าหน้าที่ตำรวจในกรณีเหตุฉุกเฉิน",
      tel: "191",
      icon: "/src/assets/contact/nbc.png",
    },
  ];
  
  return (
    <div className="w-full">
        <Banner imgSource="src/assets/banner/example.svg" />
      <div className="flex flex-col items-center py-6 sm:py-8 gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center px-4">
          แนะนำช่องทางในการติดต่อขอความช่วยเหลือ
        </h1>
        <div className="w-full max-w-4xl px-3 sm:px-4 flex flex-col items-center gap-4 sm:gap-6">
          {contact_list.map((item) => (
            <ContactCard
              key={item.id}
              imageSource={item.icon}
              title={item.title}
              description={item.description}
              tel={`Call : ${item.tel}`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 max-w-screen p-4 items-center justify-center"> 
        <Button 
        text = "กลับไปก่อนหน้า"
        variant="normalInactive"/>
        <Button 
        text = "กลับไปหน้าแรก"
        variant="normalActive"/>
      </div>
    </div>
  );
}

export default Contactpage;
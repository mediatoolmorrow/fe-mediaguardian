import React from "react";
import Banner from "../components/Banner";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";
import contactData from "../utils/contact.json";

function Contactpage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Banner imgSource="/banner/example.svg" />

      <div className="flex flex-col items-center py-6 sm:py-8 gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center px-4">
          แนะนำช่องทางในการติดต่อขอความช่วยเหลือ
        </h1>

        <div className="w-full max-w-4xl px-3 sm:px-4 flex flex-col items-center gap-4 sm:gap-6">
          {contactData.contacts.map((item) => (
            <ContactCard
              key={item.id}
              imageSource={item.image}
              title={item.name_th}
              description={item.description}
              tel={item.channels.call}
              link={item.channels.website}
              email={item.channels.email}
              facebook={item.channels.facebook}
              line={item.channels.line}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 max-w-screen p-4 items-center justify-center">
        <button
          className="btn-normal-active bg-button"
          onClick={() => navigate("/nextstep")}
        >
          กลับไปก่อนหน้า
        </button>
        <button
          className="btn-normal-active"
          onClick={() => navigate("/agentic")}
        >
          กลับไปหน้าแรก
        </button>
      </div>
    </div>
  );
}

export default Contactpage;

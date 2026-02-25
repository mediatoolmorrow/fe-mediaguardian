import React, { useMemo } from "react";
import Banner from "../components/Banner";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";
import categories from "../utils/matchingPrompt.json";
import contactData from "../utils/contact.json";
function Contactpage() {
  const navigate = useNavigate();

  const promptData = JSON.parse(
    localStorage.getItem("promptData")
  );

  const problemIds = promptData?.problems || [];

  if (!promptData) {
    navigate("/");
    return null;
  }

  const matchedContactIds = useMemo(() => {
    if (problemIds.length === 0) return [];

    const ids = new Set();

    categories.categories.forEach(cat => {
      if (problemIds.includes(cat.id)) {
        cat.contacts.forEach(cid => ids.add(cid));
      }
    });

    return Array.from(ids);
  }, [problemIds]);

  const matchedContacts = useMemo(() => {
    return contactData.contacts
      .filter(contact => matchedContactIds.includes(contact.id))
      .sort((a, b) => a.order - b.order);
  }, [matchedContactIds]);

  return (
    <div className="w-full">
      <Banner imgSource="/banner/03_Agentic_Banner.webp" />

      <div className="flex flex-col items-center py-6 sm:py-8 gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center px-4">
          แนะนำช่องทางในการติดต่อ <br/> และขอความช่วยเหลือ
        </h1>

        {matchedContacts.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            ยังไม่พบช่องทางช่วยเหลือที่ตรงกับปัญหานี้
          </p>
        )}

        {matchedContacts.map(item => (
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

      <div className="flex gap-2 p-4 items-center justify-center">
        <button
          className="btn-normal-active bg-button"
          onClick={() => navigate(-1)}
        >
          กลับไปก่อนหน้า
        </button>
      </div>
    </div>
  );
}

export default Contactpage;

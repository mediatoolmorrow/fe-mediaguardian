import React, { useState } from "react";
import Banner from "../components/Banner";
import ChoiceSelect from "../components/Survey/ChoiceSelect";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NextSteppage() {
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();
  const { backendUser } = useAuth();

  const handleSurvey3Click = () => {
    navigate("/survey/3", { state: { fromContact: true } });
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleHomeClick = () => {
    navigate("/survey/2", { state: { fromContact: true } });
  };

  const closeModal = () => {
    setShowShareModal(false);
  };

  return (
    <div className="w-full max-h-screen flex flex-col">
      <Banner imgSource="./banner/03_Agentic_Banner.webp" />

      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <Modal onClose={closeModal} />
        </div>
      )}

      <div className="w-full flex-1 flex flex-col items-center p-4 sm:p-8 py-8">
        <div className="w-full items-center justify-center mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary text-center px-4 mx-8 sm:px-0">
            คุณต้องการทำอะไรกับข้อมูลนี้ต่อ ?
          </h2>
        </div>

        <div className="w-full max-w-[424px] flex flex-col items-center gap-4 px-4 sm:px-0">
          {/* Only show "ประเมินความพึงพอใจ" if survey 2 has been submitted */}
          {backendUser?.isSubmitFirstForm && (
            <ChoiceSelect
              onClick={handleSurvey3Click}
              text="ประเมินความพึงพอใจ"
            />
          )}

          <ChoiceSelect
            onClick={handleContactClick}
            text="ช่องทางในการติดต่อ ขอความช่วยเหลือ"
          />

          <ChoiceSelect
            onClick={handleShareClick}
            text="แชร์ต่อ"
          />

          {/* Show "กลับสู่หน้าแรก" only if survey 2 has NOT been submitted yet */}
          {!backendUser?.isSubmitFirstForm && (
            <ChoiceSelect
              onClick={handleHomeClick}
              text="กลับสู่หน้าแรก"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NextSteppage;
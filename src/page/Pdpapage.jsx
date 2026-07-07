import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pdpaData from "../utils/filePDPA.json";
import { useTrackStep } from "../hooks/useTrackStep";

function Pdpapage() {
  useTrackStep(1);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !localStorage.getItem('user_ref')) {
      localStorage.setItem('user_ref', ref);
    }
    if (params.has('openExternalBrowser')) {
      params.delete('openExternalBrowser');
      const clean = params.toString();
      window.history.replaceState({}, '', clean ? `?${clean}` : window.location.pathname);
    }
  }, []);

  const renderContent = (content) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} className="ml-4 mb-3">
          {item.type && (
            <>
              <p className="font-semibold mb-1">• {item.type}</p>
              {item.details && Array.isArray(item.details) && (
                <ul className="list-disc ml-6 space-y-1">
                  {item.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </>
          )}
          {item.purpose && (
            <>
              <p className="font-semibold mb-1">• {item.purpose}</p>
              {item.description && (
                <p className="ml-6 text-gray-600">{item.description}</p>
              )}
            </>
          )}
          {typeof item === 'string' && (
            <p className="mb-1">• {item}</p>
          )}
        </div>
      ));
    }
    if (typeof content === 'string') {
      return <p className="ml-4">{content}</p>;
    }
    return null;
  };

  return (
    <>
      {/* Full-screen PDPA image */}
      <div className="w-full h-full relative overflow-hidden pb-[56px]">
        {/* Desktop image */}
        <img
          src="/pdpa/DPA_Desktop.jpg"
          alt="PDPA"
          className="hidden sm:block w-full h-full object-cover"
        />
        {/* Mobile image */}
        <img
          src="/pdpa/PDPA_Mobile.jpg"
          alt="PDPA"
          className="block sm:hidden w-full h-full object-cover"
        />
      </div>

      {/* Bottom popup bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-[0_-2px_16px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center justify-center gap-4">
        <p className="text-sm text-gray-700 font-medium">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
          >
            อ่านนโยบาย
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>

      {/* PDPA Content Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal panel */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
              <h2 className="text-lg font-bold text-primary">PDPA</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-gray-700 leading-relaxed">
              {pdpaData.title && (
                <h3 className="text-xl font-bold mb-2">{pdpaData.title}</h3>
              )}
              {pdpaData.organization && (
                <p className="text-base mb-4 text-gray-600">{pdpaData.organization}</p>
              )}
              {pdpaData.description && (
                <p className="mb-6 leading-relaxed">{pdpaData.description}</p>
              )}
              {pdpaData.sections?.map(section => (
                <div key={section.id} className="mb-6">
                  <h4 className="font-bold text-base mb-3">
                    {section.id}. {section.title}
                  </h4>
                  {renderContent(section.content)}
                </div>
              ))}
              {pdpaData.contact && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-base mb-2">ติดต่อเรา</p>
                  {pdpaData.contact.company && <p className="mb-1">{pdpaData.contact.company}</p>}
                  {pdpaData.contact.email && <p className="mb-1">Email: {pdpaData.contact.email}</p>}
                  {pdpaData.contact.phone && <p>โทร: {pdpaData.contact.phone}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t flex-shrink-0">
              <button
                className="btn-normal-active w-full"
                onClick={() => navigate("/login")}
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pdpapage;

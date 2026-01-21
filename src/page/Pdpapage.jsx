import React from "react";
import { useNavigate } from "react-router-dom";
import pdpaData from "../utils/filePDPA.json";

function Pdpapage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[424px] h-full max-h-[600px] flex flex-col items-center">

        <h1 className="text-primary text-3xl sm:text-5xl font-bold mb-3 sm:mb-6 flex-shrink-0">
          PDPA
        </h1>

        <div className="w-full flex-1 min-h-0 overflow-y-auto text-sm sm:text-base mb-3 sm:mb-6 px-1 text-gray-700 leading-relaxed">

          <p className="mb-4 text-xl">
            {pdpaData.description}
          </p>

          {pdpaData.sections.map(section => (
            <div key={section.id} className="mb-4">
              <h2 className="font-bold text-xl mb-2">
                {section.id}. {section.title}
              </h2>

              {Array.isArray(section.content) ? (
                section.content.map((item, index) => (
                  <div key={index} className="ml-4 text-xl mb-2">
                    {item.type && (
                      <p className="font-semibold">• {item.type}</p>
                    )}
                    {item.details && (
                      <ul className="list-disc ml-6">
                        {item.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="ml-4 text-xl">{section.content}</p>
              )}
            </div>
          ))}

          <div className="mt-6 text-xl">
            <p className="font-bold">ติดต่อเรา</p>
            <p>{pdpaData.contact.company}</p>
            <p>Email: {pdpaData.contact.email}</p>
            <p>โทร: {pdpaData.contact.phone}</p>
          </div>

        </div>

        <div className="flex w-full items-center justify-center">
          <button
            className="btn-normal-active disable:btn-normal-inactive"
            onClick={() => navigate("/login")}
          >
            ยอมรับ
          </button>
        </div>

      </div>
    </div>
  );
}

export default Pdpapage;

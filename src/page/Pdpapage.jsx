import React from "react";
import { useNavigate } from "react-router-dom";
import pdpaData from "../utils/filePDPA.json";
import { useTrackStep } from "../hooks/useTrackStep";

function Pdpapage() {
  useTrackStep(1);
  const navigate = useNavigate();

  const renderContent = (content) => {
    // Handle array of objects
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} className="ml-4 mb-3">
          {/* Handle object with type/details structure */}
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
          
          {/* Handle object with purpose/description structure */}
          {item.purpose && (
            <>
              <p className="font-semibold mb-1">• {item.purpose}</p>
              {item.description && (
                <p className="ml-6 text-gray-600">{item.description}</p>
              )}
            </>
          )}
          
          {/* Handle plain string in array */}
          {typeof item === 'string' && (
            <p className="mb-1">• {item}</p>
          )}
        </div>
      ));
    }
    
    // Handle plain string
    if (typeof content === 'string') {
      return <p className="ml-4">{content}</p>;
    }
    
    return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[424px] h-full max-h-[600px] flex flex-col items-center">
        
        <h1 className="text-primary text-3xl sm:text-5xl font-bold mb-3 sm:mb-6 flex-shrink-0">
          PDPA
        </h1>

        <div className="w-full flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 text-sm sm:text-base mb-3 sm:mb-6 px-1 text-gray-700 leading-relaxed">
          
          {/* Title and Organization */}
          {pdpaData.title && (
            <h2 className="text-2xl font-bold mb-2">{pdpaData.title}</h2>
          )}
          
          {pdpaData.organization && (
            <p className="text-lg mb-4 text-gray-600">{pdpaData.organization}</p>
          )}

          {/* Description */}
          {pdpaData.description && (
            <p className="mb-6 text-base leading-relaxed">
              {pdpaData.description}
            </p>
          )}

          {/* Sections */}
          {pdpaData.sections?.map(section => (
            <div key={section.id} className="mb-6">
              <h3 className="font-bold text-lg mb-3">
                {section.id}. {section.title}
              </h3>
              {renderContent(section.content)}
            </div>
          ))}

          {/* Contact Information */}
          {pdpaData.contact && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="font-bold text-lg mb-2">ติดต่อเรา</p>
              {pdpaData.contact.company && (
                <p className="mb-1">{pdpaData.contact.company}</p>
              )}
              {pdpaData.contact.email && (
                <p className="mb-1">Email: {pdpaData.contact.email}</p>
              )}
              {pdpaData.contact.phone && (
                <p>โทร: {pdpaData.contact.phone}</p>
              )}
            </div>
          )}

        </div>

        <div className="flex w-full items-center justify-center flex-shrink-0">
          <button
            className="btn-normal-active disabled:btn-normal-inactive"
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
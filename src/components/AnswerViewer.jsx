import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

function AnswerViewer({ data }) {
  const [editableData, setEditableData] = useState(data || []);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (index, newValue) => {
    const updatedData = [...editableData];
    updatedData[index] = { ...updatedData[index], description: newValue };
    setEditableData(updatedData);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1 p-2 max-w-[349px] rounded space-y-4">
        {editableData.length > 0 ? (
          editableData.map((item, idx) => (
            <div key={idx} className="p-2">
              <p className="font-bold mb-2">{item.topic}</p>
              <div className="max-h-[556px] overflow-y-auto text-sm">
                {isEditing ? (
                  <textarea
                    className="w-full p-2"
                    value={item.description}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    rows={6}
                  />
                ) : (
                  <div className="prose">
                    <ReactMarkdown>{item.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No result Avaliable</p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-2">
            <button
            className="px-4 py-2 flex items-center gap-2"
            onClick={() => setIsEditing(!isEditing)}
            >
            {isEditing ? (
                <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
                </>
            ) : (
                <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h6m2 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6" />
                </svg>
                Edit
                </>
            )}
            </button>
        <button
            className="px-4 py-2 flex items-center gap-2"
          onClick={() => {
            const textToCopy = editableData
              .map((item) => item.description)
              .join("\n\n");
            navigator.clipboard.writeText(textToCopy);
            alert("Copied to clipboard!");
          }}
        >
         <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h6m2 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6" />
                </svg>
          Copy
        </button>
      </div>
    </div>
  );
}

export default AnswerViewer;

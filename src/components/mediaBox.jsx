import React, { useState } from "react";
import { FaFileAlt, FaLink, FaImage } from "react-icons/fa";

export default function MediaBox() {
  const [mode, setMode] = useState("text");

  const icons = {
    text: <FaFileAlt />,
    link: <FaLink />,
    image: <FaImage />,
  };

  const fields = {
    text: <textarea className="media-box__textarea" placeholder="Add Text" />,
    link: <textarea className="media-box__textarea" placeholder="Add Link" />,
    image: <Dropzone />,
  };

  return (
    <div className="media-box">
      <div className="media-box__form">
        <form className="w-full h-full text-sm">{fields[mode]}</form>
      </div>

      <div className="flex items-center mt-2 gap-2">
        <div className="media-box__icon">{icons[mode]}</div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="media-box__select"
        >
          <option value="text">Agentic AI</option>
          <option value="link">Link</option>
          <option value="image">Image</option>
        </select>
      </div>
    </div>
  );
}

function Dropzone() {
  const [preview, setPreview] = useState(null);
  const inputRef = React.useRef();

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div
      className="dropzone"
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="dropzone__preview" />
      ) : (
        <div className="flex flex-col justify-center rounded-2xl items-center w-full h-full ">
          ลากภาพเพื่ออัพโหลด หรือกดเพื่ออัพโหลด
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

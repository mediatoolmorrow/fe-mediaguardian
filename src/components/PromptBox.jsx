import React, { useState, useEffect } from "react";

export default function PromptBox({
  readOnly = false,
  onModeChange,
  onContentChange,
  onValidationChange,
  initialMode = "text",
  initialContent = ""
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialMode);
  const [dragActive, setDragActive] = useState(false);
  const [textContent, setTextContent] = useState(initialContent);
  const [linkContent, setLinkContent] = useState(initialContent);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const mode = [
    {
      id: "text",
      displayName: "Text Content",
      icon: "/icon/message.svg",
    },
    /*
    {
      id: "link",
      displayName: "Link Content",
      icon: "/icon/link.svg",
    },
    */
    {
      id: "image",
      displayName: "Image Content",
      icon: "/icon/image.svg",
    },
  ];

  const current = mode.find((m) => m.id === selected);

  // Notify parent of mode changes
  useEffect(() => {
    if (onModeChange) {
      onModeChange(selected);
    }
  }, [selected, onModeChange]);

  // Notify parent of content changes
  useEffect(() => {
    if (onContentChange) {
      let content = null;
      if (selected === "text") {
        content = textContent;
      } else if (selected === "link") {
        content = linkContent;
      } else if (selected === "image") {
        content = { preview: uploadedImage, file: imageFile };
      }
      onContentChange(content);
    }
  }, [selected, textContent, linkContent, uploadedImage, imageFile, onContentChange]);

  // Validate content and notify parent
  useEffect(() => {
    if (onValidationChange) {
      let isValid = false;
      if (selected === "text") {
        isValid = textContent.trim().length > 0;
      } else if (selected === "link") {
        isValid = linkContent.trim().length > 0;
      } else if (selected === "image") {
        isValid = uploadedImage !== null;
      }
      onValidationChange(isValid);
    }
  }, [selected, textContent, linkContent, uploadedImage, onValidationChange]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setUploadedImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  return (
    <div className="relative max-w-[647px] bg-white border border-primary rounded-2xl p-4 flex flex-col"
    style={{ height: '180px' }}>
      <div className="flex-1 mb-3 overflow-hidden">
        {selected === "text" && (
          <div className="w-full h-full border border-primary rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary">
            <textarea
              placeholder="วางคอนเทนต์ที่เป็นตัวหนังสือของคุณที่นี่..."
              className="w-full h-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
              readOnly={readOnly}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          </div>
        )}

        {selected === "link" && (
          <div className="w-full h-full border border-primary rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary flex items-center">
            <input
              type="url"
              placeholder="โปรดใส่ลิงก์วิดีโอ ที่มีเนื้อหาคำพูดที่ไม่เหมาะสม ความยาวไม่เกิน 3 นาที "
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              readOnly={readOnly}
              value={linkContent}
              onChange={(e) => setLinkContent(e.target.value)}
            />
          </div>
        )}

        {selected === "image" && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
            }`}
          >
            {uploadedImage ? (
              <div className="relative w-full h-full">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                {!readOnly && (
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : (
              <label className="cursor-pointer text-center p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={readOnly}
                />
                <div className="text-sm text-gray-400">
                  <span className="text-primary">อัปโหลดรูปภาพ</span> หรือลากไฟล์มาวางที่นี่
                </div>
              </label>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="relative w-[133px]">
          <button
            disabled={readOnly}
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full h-[27px] text-white bg-primary rounded-lg px-2 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <img src={current.icon} className="w-3 h-3" alt="" />
              <span>{current.displayName}</span>
            </div>
            <img src="/icon/dropdown.svg" alt="" />
          </button>

          {open && (
            <div className="absolute top-full mt-1 z-10 w-full bg-white border border-[#F0F0F0] rounded-lg shadow p-1">
              {mode
                .filter((item) => item.id !== selected)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelected(item.id);
                      setOpen(false);
                    }}
                    className="group w-full px-2 py-1.5 flex items-center gap-2 text-xs text-text hover:bg-primary hover:text-white rounded-lg transition-colors"
                  >
                    <img
                      src={item.icon}
                      className="w-3 h-3 brightness-50 group-hover:brightness-0 group-hover:invert transition-all"
                      alt=""
                    />
                    <span>{item.displayName}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
         {readOnly && (
          <span className="absolute bottom-1/10 right-4 text-xs underline text-gray-400">
            *ไม่สามารถแก้ไขได้ในขั้นตอนนี้
          </span>
        )}
      </div>
    </div>
  );
}

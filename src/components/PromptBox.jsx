import React, { useState } from "react";

export default function PromptBox() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("text");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const mode = [
    {
      id: "text",
      displayName: "Text Content",
      icon: "public/icon/message.svg",
    },
    {
      id: "link",
      displayName: "Link Content",
      icon: "public/icon/link.svg",
    },
    {
      id: "image",
      displayName: "Image Content",
      icon: "public/icon/image.svg",
    },
  ];

  const current = mode.find((m) => m.id === selected);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setUploadedImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[647px] bg-white border border-primary rounded-2xl p-4 flex flex-col" style={{ height: '180px' }}>
      <div className="flex-1 mb-3 overflow-hidden">
        {selected === "text" && (
          <div className="w-full h-full border border-primary rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary">
            <textarea
              placeholder="วางเนื้อหาของคุณที่นี่..."
              className="w-full h-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        )}

        {selected === "link" && (
          <div className="w-full h-full border border-primary rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary flex items-center">
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
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
                <button 
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer text-center p-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileInput}
                  className="hidden" 
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
      </div>
    </div>
  );
}
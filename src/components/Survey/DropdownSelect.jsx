import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function DropdownSelect({ options, value, onChange, placeholder = "-- เลือกคำตอบ --" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLabel = value !== null && value !== undefined ? options[value] : null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(index) {
    onChange(index);
    setOpen(false);
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 border border-button rounded-md bg-white text-sm font-medium text-left focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <span className={selectedLabel ? "text-gray-700" : "text-gray-400"}>
          {selectedLabel ?? placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0 ml-2">
          {selectedLabel && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-button rounded-md shadow-lg max-h-52 overflow-y-auto py-1">
          {options.map((opt, index) => (
            <li
              key={index}
              onClick={() => handleSelect(index)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-white transition-colors ${
                value === index ? "bg-accent/10 font-medium text-accent" : "text-gray-700"
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

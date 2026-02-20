import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export default function SearchableDropdown({ options, value, onChange, placeholder = "-- เลือกคำตอบ --" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = value !== null && value !== undefined ? options[value] : null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(index) {
    onChange(index);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-button rounded-md shadow-lg">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          {/* Options list */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-400">ไม่พบผลลัพธ์</li>
            ) : (
              filtered.map((opt) => {
                const originalIndex = options.indexOf(opt);
                return (
                  <li
                    key={originalIndex}
                    onClick={() => handleSelect(originalIndex)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-white transition-colors ${
                      value === originalIndex ? "bg-accent/10 font-medium text-accent" : "text-gray-700"
                    }`}
                  >
                    {opt}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

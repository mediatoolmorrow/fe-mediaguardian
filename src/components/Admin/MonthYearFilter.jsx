const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2024;
const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

export default function MonthYearFilter({ month, year, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={month ?? ""}
        onChange={(e) => onChange({ month: e.target.value ? Number(e.target.value) : null, year })}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">ทุกเดือน</option>
        {THAI_MONTHS.map((name, i) => (
          <option key={i + 1} value={i + 1}>{name}</option>
        ))}
      </select>

      <select
        value={year ?? ""}
        onChange={(e) => onChange({ month, year: e.target.value ? Number(e.target.value) : null })}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">ทุกปี</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {(month || year) && (
        <button
          onClick={() => onChange({ month: null, year: null })}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          ล้าง
        </button>
      )}
    </div>
  );
}

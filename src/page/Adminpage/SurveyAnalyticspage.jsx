import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Download, Users, RefreshCw } from "lucide-react";
import MonthYearFilter from "../../components/Admin/MonthYearFilter";
import { surveyTemplate } from "../../utils/surveyTemplate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Renders a Doughnut with a fixed-size canvas + scrollable custom legend
// so the card never grows/shrinks regardless of label count.
function DoughnutWithLegend({ title, labels, data, backgroundColor }) {
  const hasData = data?.length > 0;

  const chartData = {
    labels,
    datasets: [{ data, backgroundColor }],
  };

  // Hide the built-in legend; we draw our own below
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: "60%",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",         // fills the grid cell (h-64 = 16rem)
        minHeight: 0,
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#4B5563",
          textAlign: "center",
          marginBottom: "0.375rem",
          flexShrink: 0,
        }}
      >
        {title}
      </h3>

      {hasData ? (
        <>
          {/* Fixed-height donut canvas */}
          <div style={{ height: "9rem", flexShrink: 0, position: "relative" }}>
            <Doughnut data={chartData} options={options} />
          </div>

          {/* Scrollable legend */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginTop: "0.5rem",
              paddingRight: "0.25rem",
              // thin custom scrollbar
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E1 transparent",
            }}
          >
            {labels.map((label, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  marginBottom: "0.2rem",
                  fontSize: "0.72rem",
                  color: "#374151",
                  lineHeight: 1.3,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "0.625rem",
                    height: "0.625rem",
                    borderRadius: "50%",
                    backgroundColor: backgroundColor[i % backgroundColor.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {label}
                </span>
                <span style={{ marginLeft: "auto", fontWeight: 600, flexShrink: 0 }}>
                  {data[i]}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9CA3AF",
            fontSize: "0.875rem",
          }}
        >
          No data
        </div>
      )}
    </div>
  );
}

export default function SurveyAnalyticspage({
  chartData,
  loading,
  error,
  onDownloadCSV,
  onRefresh,
  downloading,
}) {
  const [filter, setFilter] = useState({ month: null, year: null });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onRefresh(newFilter);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading survey analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { totalResponses, demographics, satisfaction, behaviorChange } = chartData;

  const occupationOptions = surveyTemplate.Set[0].questions[2].options;
  const incomeOptions = surveyTemplate.Set[0].questions[3].options;

  const resolveLabels = (labels, options) => {
    if (!labels) return [];
    return labels.map((label) => {
      const idx = parseInt(label);
      if (!isNaN(idx) && options[idx] !== undefined) return options[idx];
      return label;
    });
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Each donut card is h-64 (16rem). The grid cells must have a fixed height so
  // the DoughnutWithLegend flex layout can work correctly.
  const donutCellStyle = { height: "16rem" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-3xl font-bold text-gray-900">{totalResponses}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MonthYearFilter
            month={filter.month}
            year={filter.year}
            onChange={handleFilterChange}
          />
          <button
            onClick={() => onRefresh(filter)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={onDownloadCSV}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            {downloading ? "Downloading..." : "Download CSV"}
          </button>
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pl-3 border-l-4 border-blue-600">
          แผนภูมิสรุปภาพรวม
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div style={donutCellStyle}>
            <DoughnutWithLegend
              title="เพศ"
              labels={demographics?.gender?.labels ?? []}
              data={demographics?.gender?.data ?? []}
              backgroundColor={demographics?.gender?.backgroundColor ?? []}
            />
          </div>
          <div style={donutCellStyle}>
            <DoughnutWithLegend
              title="อายุ"
              labels={demographics?.age?.labels ?? []}
              data={demographics?.age?.data ?? []}
              backgroundColor={demographics?.age?.backgroundColor ?? []}
            />
          </div>
          <div style={donutCellStyle}>
            <DoughnutWithLegend
              title="อาชีพ"
              labels={resolveLabels(demographics?.occupation?.labels, occupationOptions)}
              data={demographics?.occupation?.data ?? []}
              backgroundColor={demographics?.occupation?.backgroundColor ?? []}
            />
          </div>
          <div style={donutCellStyle}>
            <DoughnutWithLegend
              title="รายได้"
              labels={resolveLabels(demographics?.income?.labels, incomeOptions)}
              data={demographics?.income?.data ?? []}
              backgroundColor={demographics?.income?.backgroundColor ?? []}
            />
          </div>
        </div>
      </div>

      {/* Satisfaction */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pl-3 border-l-4 border-blue-600">
          ท่านพึงพอใจกับการใช้งานเครื่องมือในครั้งนี้มากน้อยเพียงใด
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                ท่านพึงพอใจกับการใช้งานเครื่องมือในครั้งนี้มากน้อยเพียงใด
              </h3>
              <span className="text-lg font-semibold text-blue-600">
                Avg: {satisfaction?.averages?.toolSatisfaction || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: satisfaction?.toolSatisfaction?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [{ label: "Responses", data: satisfaction?.toolSatisfaction?.data || [0, 0, 0, 0, 0], backgroundColor: "#3B82F6" }],
                }}
                options={barOptions}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                ท่านตั้งใจว่าจะแนะนำแพลตฟอร์มนี้ให้เพื่อนหรือคนรู้จักของท่านได้ใช้งาน
              </h3>
              <span className="text-lg font-semibold text-blue-600">
                Avg: {satisfaction?.averages?.recommendationIntent || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: satisfaction?.recommendationIntent?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [{ label: "Responses", data: satisfaction?.recommendationIntent?.data || [0, 0, 0, 0, 0], backgroundColor: "#10B981" }],
                }}
                options={barOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Change */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pl-3 border-l-4 border-blue-600">
          แบบสอบถามพฤติกรรมการหลังการใช้งาน
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { key: "appliedInRealLife", label: "ฉันได้นำข้อความจากเครื่องมือนี้ไปปรับใช้ในการสื่อสารจริงบนโลกออนไลน์", color: "#8B5CF6" },
            { key: "receivedBenefits", label: "ฉันได้รับประโยชน์จากการใช้งานแพลตฟอร์มนี้เพื่อสื่อสารอย่างสร้างสรรค์", color: "#EC4899" },
            { key: "improvedCommunication", label: "หลังจากที่ฉันได้ลองใช้เครื่องมือนี้ ฉันรู้สึกว่า การสื่อสารของฉันดีขึ้น และส่งผลเชิงบวกต่อผู้อื่นมากขึ้น", color: "#F59E0B" },
            { key: "willingToUseAgain", label: "ถ้าฉันอยากสื่อสารเชิงบวกบนโลกออนไลน์ ฉันอยากเข้ามาใช้เครื่องมือนี้เพื่อช่วยให้สื่อสารได้ดีขึ้น", color: "#06B6D4" },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">{label}</h3>
                <span className="text-lg font-semibold text-purple-600">
                  Avg: {behaviorChange?.averages?.[key] || "0"}
                </span>
              </div>
              <div className="h-64">
                <Bar
                  data={{
                    labels: behaviorChange?.[key]?.labels || ["1", "2", "3", "4", "5"],
                    datasets: [{ label: "Responses", data: behaviorChange?.[key]?.data || [0, 0, 0, 0, 0], backgroundColor: color }],
                  }}
                  options={barOptions}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
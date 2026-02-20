import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Download,
  MessageSquareHeart,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Shield,
  User,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import MonthYearFilter from "../../components/Admin/MonthYearFilter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function formatDate(createdAt) {
  if (!createdAt) return "-";
  const seconds = createdAt._seconds ?? createdAt.seconds;
  if (!seconds) return "-";
  return new Date(seconds * 1000).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function FeedbackAnalyticspage({
  feedbackData,
  loading,
  error,
  onDownloadCSV,
  onRefresh,
  downloading,
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [filter, setFilter] = useState({ month: null, year: null });
  const [topTab, setTopTab] = useState("good");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onRefresh(newFilter);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading feedback analytics...</p>
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

  if (!feedbackData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No feedback data available</p>
      </div>
    );
  }

  const {
    totalFeedbacks = 0,
    goodCount = 0,
    badCount = 0,
    adminFeedbackCount = 0,
    userFeedbackCount = 0,
    feedbackDistribution,
    feedbackByProblem,
    feedbackByGoal,
    dailyTimeline,
    topQuestions,
    recentFeedbacks = [],
  } = feedbackData;

  const chartBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const barOptions = {
    ...chartBase,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const lineOptions = {
    ...chartBase,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const doughnutOptions = { ...chartBase, cutout: "60%" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <MessageSquareHeart className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Feedback</p>
            <p className="text-3xl font-bold text-gray-900">{totalFeedbacks}</p>
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
          {onDownloadCSV && (
            <button
              onClick={onDownloadCSV}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Download size={18} />
              {downloading ? "Downloading..." : "Export CSV"}
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Like</p>
            <p className="text-2xl font-bold text-green-600">{goodCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Improve</p>
            <p className="text-2xl font-bold text-yellow-600">{badCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-full">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admin Feedback</p>
            <p className="text-2xl font-bold text-purple-600">{adminFeedbackCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">User Feedback</p>
            <p className="text-2xl font-bold text-blue-600">{userFeedbackCount}</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Distribution Doughnut */}
        {feedbackDistribution && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
              ภาพรวมของ Feedback
            </h2>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: feedbackDistribution.labels.map((l) => l.replace(/\s*\(Bad\)/i, "")),
                  datasets: [
                    {
                      data: feedbackDistribution.data,
                      backgroundColor: feedbackDistribution.backgroundColor.map((c, i) =>
                        i === 1 ? "#F59E0B" : c
                      ),
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            </div>
          </div>
        )}

        {/* Daily Timeline Line Chart */}
        {dailyTimeline && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
              แผนภาพ Feedback รายวัน
            </h2>
            <div className="h-64">
              <Line
                data={{
                  labels: dailyTimeline.labels,
                  datasets: dailyTimeline.datasets.map((ds) => ({
                    ...ds,
                    tension: 0.3,
                    fill: false,
                    ...(ds.label === "Improve" && {
                      borderColor: "#F59E0B",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                    }),
                  })),
                }}
                options={lineOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback by Problem */}
        {feedbackByProblem && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
              Feedback ที่ได้รับแยกตามปัญหา
            </h2>
            <div className="h-72">
              <Bar
                data={{
                  labels: feedbackByProblem.labels,
                  datasets: feedbackByProblem.datasets.map((ds) =>
                    ds.label === "Improve" ? { ...ds, backgroundColor: "#F59E0B" } : ds
                  ),
                }}
                options={{
                  ...barOptions,
                  indexAxis: "y",
                  plugins: { ...barOptions.plugins },
                }}
              />
            </div>
          </div>
        )}

        {/* Feedback by Goal */}
        {feedbackByGoal && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
              Feedback ที่ได้รับแยกตามเป้าหมาย
            </h2>
            <div className="h-72">
              <Bar
                data={{
                  labels: feedbackByGoal.labels,
                  datasets: feedbackByGoal.datasets.map((ds) =>
                    ds.label === "Improve" ? { ...ds, backgroundColor: "#F59E0B" } : ds
                  ),
                }}
                options={barOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Top Questions */}
      {/* 
      {topQuestions && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
            Top Questions
          </h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTopTab("good")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                topTab === "good"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Like ({topQuestions.good?.length ?? 0})
            </button>
            <button
              onClick={() => setTopTab("bad")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                topTab === "bad"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Improve ({topQuestions.bad?.length ?? 0})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Question</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Option</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Problem</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Goal</th>
                  <th className="text-center py-3 px-4 font-medium text-green-600">👍</th>
                  <th className="text-center py-3 px-4 font-medium text-red-600">👎</th>
                </tr>
              </thead>
              <tbody>
                {(topQuestions[topTab] ?? []).map((q, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700 max-w-xs">
                      <p className="line-clamp-2">{q.question}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-[140px]">
                      <p className="line-clamp-2 text-xs">{q.optionTitle}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs whitespace-nowrap">
                        {q.problem}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs whitespace-nowrap">
                        {q.goal}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-green-600">{q.good}</td>
                    <td className="py-3 px-4 text-center font-bold text-red-600">{q.bad}</td>
                  </tr>
                ))}
                {!(topQuestions[topTab]?.length) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      */}
      {/* Recent Feedbacks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
          Feedback ล่าสุด
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Problem</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Goal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Question</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedbacks.map((fb, index) => {
                const hasExp =
                  fb.explanations &&
                  (fb.explanations.reason ||
                    fb.explanations.example ||
                    fb.explanations.explanation);
                const rowKey = fb.id || index;
                return (
                  <React.Fragment key={rowKey}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        {formatDate(fb.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fb.feedbackType === "good"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {fb.feedbackType === "good" ? "👍 Like" : "💡 Improve"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fb.isAdminFeedback
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {fb.isAdminFeedback ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          {fb.problem}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {fb.goal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs">
                        <p className="line-clamp-2 text-xs">{fb.question}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasExp && (
                          <button
                            onClick={() => toggleRow(rowKey)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {expandedRows[rowKey] ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedRows[rowKey] && fb.explanations && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="py-3 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            {fb.explanations.reason && (
                              <div className="p-3 bg-white rounded-lg border">
                                <p className="font-medium text-gray-600 mb-1">Reason</p>
                                <p className="text-gray-700">{fb.explanations.reason}</p>
                              </div>
                            )}
                            {fb.explanations.example && (
                              <div className="p-3 bg-white rounded-lg border">
                                <p className="font-medium text-gray-600 mb-1">Example</p>
                                <p className="text-gray-700">{fb.explanations.example}</p>
                              </div>
                            )}
                            {fb.explanations.explanation && (
                              <div className="p-3 bg-white rounded-lg border">
                                <p className="font-medium text-gray-600 mb-1">Explanation</p>
                                <p className="text-gray-700">{fb.explanations.explanation}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {recentFeedbacks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No feedback data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

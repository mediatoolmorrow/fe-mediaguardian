import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Download, MessageSquareHeart, RefreshCw, ThumbsUp, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function FeedbackAnalyticspage({
  feedbackData,
  loading,
  error,
  onDownloadCSV,
  onRefresh,
  downloading,
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  const { summary, optionStats, recentFeedback } = feedbackData;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: "60%",
  };

  // Overall rating distribution chart
  const overallRatingData = {
    labels: ["ชอบ", "อยากให้ปรับปรุง"],
    datasets: [
      {
        data: [summary?.totalLikes || 0, summary?.totalImproves || 0],
        backgroundColor: ["#10B981", "#F59E0B"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header with Total & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <MessageSquareHeart className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Feedback</p>
            <p className="text-3xl font-bold text-gray-900">{summary?.totalFeedback || 0}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Likes</p>
              <p className="text-2xl font-bold text-green-600">{summary?.totalLikes || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Improvement Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{summary?.totalImproves || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-gray-500">Like Ratio</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.likeRatio || "0%"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-gray-500">With Explanations</p>
              <p className="text-2xl font-bold text-purple-600">{summary?.withExplanations || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Rating Distribution</h2>
          <div className="h-64">
            <Doughnut data={overallRatingData} options={doughnutOptions} />
          </div>
        </div>

        {/* Ratings by Option */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ratings by Option</h2>
          <div className="h-64">
            <Bar
              data={{
                labels: ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"],
                datasets: [
                  {
                    label: "ชอบ",
                    data: [
                      optionStats?.option1?.likes || 0,
                      optionStats?.option2?.likes || 0,
                      optionStats?.option3?.likes || 0,
                    ],
                    backgroundColor: "#10B981",
                  },
                  {
                    label: "อยากให้ปรับปรุง",
                    data: [
                      optionStats?.option1?.improves || 0,
                      optionStats?.option2?.improves || 0,
                      optionStats?.option3?.improves || 0,
                    ],
                    backgroundColor: "#F59E0B",
                  },
                ],
              }}
              options={barOptions}
            />
          </div>
        </div>
      </div>

      {/* Recent Feedback Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">User Role</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Option 1</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Option 2</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Option 3</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback?.map((feedback, index) => (
                <React.Fragment key={feedback.id || index}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{feedback.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        feedback.role === 'researcher' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feedback.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feedback.ratings?.option1 === 'like' ? (
                        <span className="text-green-600">👍</span>
                      ) : (
                        <span className="text-yellow-600">💡</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feedback.ratings?.option2 === 'like' ? (
                        <span className="text-green-600">👍</span>
                      ) : (
                        <span className="text-yellow-600">💡</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feedback.ratings?.option3 === 'like' ? (
                        <span className="text-green-600">👍</span>
                      ) : (
                        <span className="text-yellow-600">💡</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feedback.hasExplanations && (
                        <button
                          onClick={() => toggleRow(feedback.id || index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRows[feedback.id || index] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedRows[feedback.id || index] && feedback.explanations && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="py-3 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-600 mb-1">ตัวเลือกที่ 1:</p>
                            <p className="text-gray-700">{feedback.explanations.option1 || "-"}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-600 mb-1">ตัวเลือกที่ 2:</p>
                            <p className="text-gray-700">{feedback.explanations.option2 || "-"}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-600 mb-1">ตัวเลือกที่ 3:</p>
                            <p className="text-gray-700">{feedback.explanations.option3 || "-"}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {(!recentFeedback || recentFeedback.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
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

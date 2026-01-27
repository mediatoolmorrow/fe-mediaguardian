import React from "react";
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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Download, Users, RefreshCw } from "lucide-react";

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

export default function SurveyAnalyticspage({
  chartData,
  loading,
  error,
  onDownloadCSV,
  onRefresh,
  downloading,
}) {
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

  const { totalResponses, demographics, satisfaction, behaviorChange, timeline } = chartData;

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

  return (
    <div className="space-y-6">
      {/* Header with Total & Actions */}
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
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
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

      {/* Demographics Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6"> แผนภูมิสรุปภาพรวม </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gender */}
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center"> เพศ </h3>
            {demographics?.gender?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: demographics.gender.labels,
                  datasets: [
                    {
                      data: demographics.gender.data,
                      backgroundColor: demographics.gender.backgroundColor,
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data</div>
            )}
          </div>

          {/* Age */}
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center"> อายุ </h3>
            {demographics?.age?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: demographics.age.labels,
                  datasets: [
                    {
                      data: demographics.age.data,
                      backgroundColor: demographics.age.backgroundColor,
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data</div>
            )}
          </div>

          {/* Occupation */}
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center"> อาชีพ </h3>
            {demographics?.occupation?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: demographics.occupation.labels,
                  datasets: [
                    {
                      data: demographics.occupation.data,
                      backgroundColor: demographics.occupation.backgroundColor,
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data</div>
            )}
          </div>

          {/* Income */}
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center"> รายได้ </h3>
            {demographics?.income?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: demographics.income.labels,
                  datasets: [
                    {
                      data: demographics.income.data,
                      backgroundColor: demographics.income.backgroundColor,
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Satisfaction Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6"> ท่านพึงพอใจกับการใช้งานเครื่องมือในครั้งนี้มากน้อยเพียงใด </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool Satisfaction */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600"> ท่านพึงพอใจกับการใช้งานเครื่องมือในครั้งนี้มากน้อยเพียงใด</h3>
              <span className="text-lg font-semibold text-blue-600">
                Avg: {satisfaction?.averages?.toolSatisfaction || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: satisfaction?.toolSatisfaction?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: satisfaction?.toolSatisfaction?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#3B82F6",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>

          {/* Recommendation Intent */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">ท่านตั้งใจว่าจะแนะนำแพลตฟอร์มนี้ให้เพื่อนหรือคนรู้จักของท่านได้ใช้งาน</h3>
              <span className="text-lg font-semibold text-blue-600">
                Avg: {satisfaction?.averages?.recommendationIntent || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: satisfaction?.recommendationIntent?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: satisfaction?.recommendationIntent?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#10B981",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Change Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6"> แบบสอบถามพฤติกรรมการหลังการใช้งาน </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applied in Real Life */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600"> ฉันได้นำข้อความจากเครื่องมือนี้ไปปรับใช้ในการสื่อสารจริงบนโลกออนไลน์ </h3>
              <span className="text-lg font-semibold text-purple-600">
                Avg: {behaviorChange?.averages?.appliedInRealLife || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: behaviorChange?.appliedInRealLife?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: behaviorChange?.appliedInRealLife?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#8B5CF6",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>

          {/* Received Benefits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">ฉันได้รับประโยชน์จากการใช้งานแพลตฟอร์มนี้เพื่อสื่อสารอย่างสร้างสรรค์</h3>
              <span className="text-lg font-semibold text-purple-600">
                Avg: {behaviorChange?.averages?.receivedBenefits || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: behaviorChange?.receivedBenefits?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: behaviorChange?.receivedBenefits?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#EC4899",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>

          {/* Improved Communication */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">หลังจากที่ฉันได้ลองใช้เครื่องมือนี้ ฉันรู้สึกว่า การสื่อสารของฉันดีขึ้น และส่งผลเชิงบวกต่อผู้อื่นมากขึ้น</h3>
              <span className="text-lg font-semibold text-purple-600">
                Avg: {behaviorChange?.averages?.improvedCommunication || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: behaviorChange?.improvedCommunication?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: behaviorChange?.improvedCommunication?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#F59E0B",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>

          {/* Willing to Use Again */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">ถ้าฉันอยากสื่อสารเชิงบวกบนโลกออนไลน์ ฉันอยากเข้ามาใช้เครื่องมือนี้เพื่อช่วยให้สื่อสารได้ดีขึ้น</h3>
              <span className="text-lg font-semibold text-purple-600">
                Avg: {behaviorChange?.averages?.willingToUseAgain || "0"}
              </span>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: behaviorChange?.willingToUseAgain?.labels || ["1", "2", "3", "4", "5"],
                  datasets: [
                    {
                      label: "Responses",
                      data: behaviorChange?.willingToUseAgain?.data || [0, 0, 0, 0, 0],
                      backgroundColor: "#06B6D4",
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6"> แบบสอบถามที่ถูกส่งเข้ามา </h2>
        <div className="h-80">
          <Line
            data={{
              labels: timeline?.labels || [],
              datasets: [
                {
                  label: "Survey Completions",
                  data: timeline?.data || [],
                  borderColor: "#3B82F6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

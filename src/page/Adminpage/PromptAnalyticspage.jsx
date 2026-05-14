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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  RefreshCw,
  MessageSquare,
  Users,
  UserPlus,
  ClipboardCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Repeat
} from "lucide-react";
import MonthYearFilter from "../../components/Admin/MonthYearFilter";

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

export default function PromptAnalyticspage({
  chartData,
  loading,
  error,
  onRefresh,
  onDownloadCSV,
  downloading,
}) {
  const [showAllLinks, setShowAllLinks] = useState(false);
  const INITIAL_LINKS_COUNT = 20;
  const [filter, setFilter] = useState({ month: null, year: null });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onRefresh(newFilter);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
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
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">ไม่มีข้อมูล</p>
      </div>
    );
  }

  const {
    totalPrompts,
    uniqueUsers,
    totalRegisteredUsers,
    averagePromptsPerUser,
    surveyCompletionStats,
    surveyCompletion,
    userUsageDistribution,
    newVsReturning,
    modeDistribution,
    problems,
    concerns,
    approaches,
    goals,
    timeline,
    dailyTimeline,
    linkList,
  } = chartData;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: "60%",
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    let date;

    // Handle Firestore Timestamp object {_seconds, _nanoseconds}
    if (dateValue._seconds !== undefined) {
      date = new Date(dateValue._seconds * 1000);
    }
    // Handle Firestore Timestamp with seconds/nanoseconds
    else if (dateValue.seconds !== undefined) {
      date = new Date(dateValue.seconds * 1000);
    }
    // Handle Unix timestamp in seconds (10 digits)
    else if (typeof dateValue === 'number' && dateValue < 10000000000) {
      date = new Date(dateValue * 1000);
    }
    // Handle Unix timestamp in milliseconds or ISO string
    else {
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const detectPlatform = (url) => {
    if (!url) return "อื่นๆ";
    try {
      const host = new URL(url).hostname.replace(/^www\./, "").replace(/^m\./, "");
      if (host.includes("facebook.com") || host.includes("fb.com") || host.includes("fb.watch")) return "Facebook";
      if (host.includes("tiktok.com") || host.includes("vm.tiktok.com")) return "TikTok";
      if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
      if (host.includes("instagram.com")) return "Instagram";
      if (host.includes("twitter.com") || host.includes("x.com")) return "X (Twitter)";
      if (host.includes("line.me") || host.includes("lin.ee")) return "LINE";
      return "อื่นๆ";
    } catch {
      return "อื่นๆ";
    }
  };

  const PLATFORM_COLORS = {
    "Facebook":   "#1877F2",
    "TikTok":     "#010101",
    "YouTube":    "#FF0000",
    "Instagram":  "#E1306C",
    "X (Twitter)":"#1DA1F2",
    "LINE":       "#06C755",
    "อื่นๆ":      "#9CA3AF",
  };

  const platformCounts = (() => {
    if (!linkList || linkList.length === 0) return null;
    const counts = {};
    linkList.forEach((link) => {
      const p = detectPlatform(link.url);
      counts[p] = (counts[p] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([k]) => k),
      data: sorted.map(([, v]) => v),
      colors: sorted.map(([k]) => PLATFORM_COLORS[k] || "#9CA3AF"),
      raw: counts,
    };
  })();

  const surveyCompletionRate = totalRegisteredUsers > 0
    ? Math.round((surveyCompletionStats?.completedAllSurveys / totalRegisteredUsers) * 100)
    : 0;

  const displayedLinks = showAllLinks
    ? linkList
    : linkList?.slice(0, INITIAL_LINKS_COUNT);

  return (
    <div className="space-y-6">
      {/* Header with Refresh & Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">สถิติการใช้งาน</h2>
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
            รีเฟรช
          </button>
          <button
            onClick={onDownloadCSV}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            {downloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด CSV"}
          </button>
        </div>
      </div>

      {/* Row 1: Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">จำนวนการใช้งานทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalPrompts)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ที่กลับมาใช้งานซ้ำ</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(uniqueUsers)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ใช้ลงทะเบียนทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalRegisteredUsers)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <ClipboardCheck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">อัตราการทำแบบสอบถามครบ</p>
              <p className="text-2xl font-bold text-gray-900">{surveyCompletionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Survey Completion & New vs Returning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Completion */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">สถานะการทำแบบสอบถาม</h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{surveyCompletionStats?.completedSurvey1 || 0}</p>
              <p className="text-xs text-gray-600">แบบสอบถาม 1</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{surveyCompletionStats?.completedSurvey2 || 0}</p>
              <p className="text-xs text-gray-600">แบบสอบถาม 2</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{surveyCompletionStats?.completedSurvey3 || 0}</p>
              <p className="text-xs text-gray-600">แบบสอบถาม 3</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{surveyCompletionStats?.completedAllSurveys || 0}</p>
              <p className="text-xs text-gray-600">ครบทุกแบบ</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48">
            {surveyCompletion?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: surveyCompletion.labels,
                  datasets: [{
                    label: "จำนวนผู้ตอบ",
                    data: surveyCompletion.data,
                    backgroundColor: surveyCompletion.backgroundColor,
                  }],
                }}
                options={{
                  ...chartOptions,
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* New vs Returning */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">ผู้ใช้ใหม่ vs ผู้ใช้ที่กลับมา</h3>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">ผู้ใช้ใหม่</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{newVsReturning?.data?.[0] || 0}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">ผู้ใช้ที่กลับมา</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{newVsReturning?.data?.[1] || 0}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48">
            {newVsReturning?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: newVsReturning.labels,
                  datasets: [{
                    data: newVsReturning.data,
                    backgroundColor: newVsReturning.backgroundColor,
                  }],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Usage Frequency & Mode Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Frequency */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">ความถี่ในการใช้งาน</h3>
          <div className="h-64">
            {userUsageDistribution?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: userUsageDistribution.labels,
                  datasets: [{
                    label: "จำนวนผู้ใช้",
                    data: userUsageDistribution.data,
                    backgroundColor: userUsageDistribution.backgroundColor,
                  }],
                }}
                options={{
                  ...chartOptions,
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Mode Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">ประเภทการใช้งาน</h3>
          <div className="h-64">
            {modeDistribution?.data?.length > 0 ? (
              <Doughnut
                data={{
                  labels: modeDistribution.labels,
                  datasets: [{
                    data: modeDistribution.data,
                    backgroundColor: modeDistribution.backgroundColor,
                  }],
                }}
                options={doughnutOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Problems & Concerns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">ประเภทปัญหา</h3>
          <div className="h-64">
            {problems?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: problems.labels,
                  datasets: [{
                    label: "จำนวน",
                    data: problems.data,
                    backgroundColor: problems.backgroundColor,
                  }],
                }}
                options={horizontalBarOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">ความกังวล</h3>
          <div className="h-64">
            {concerns?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: concerns.labels,
                  datasets: [{
                    label: "จำนวน",
                    data: concerns.data,
                    backgroundColor: concerns.backgroundColor,
                  }],
                }}
                options={horizontalBarOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Approaches & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approaches */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">แนวทางการสื่อสาร</h3>
          <div className="h-64">
            {approaches?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: approaches.labels,
                  datasets: [{
                    label: "จำนวน",
                    data: approaches.data,
                    backgroundColor: approaches.backgroundColor,
                  }],
                }}
                options={horizontalBarOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">เป้าหมาย</h3>
          <div className="h-64">
            {goals?.data?.length > 0 ? (
              <Bar
                data={{
                  labels: goals.labels,
                  datasets: [{
                    label: "จำนวน",
                    data: goals.data,
                    backgroundColor: goals.backgroundColor,
                  }],
                }}
                options={horizontalBarOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 6: Monthly Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">การใช้งานรายเดือน</h3>
        <div className="h-64">
          {timeline?.data?.length > 0 ? (
            <Line
              data={{
                labels: timeline.labels,
                datasets: [{
                  label: "จำนวนการใช้งาน",
                  data: timeline.data,
                  borderColor: "#3B82F6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                }],
              }}
              options={lineOptions}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
          )}
        </div>
      </div>

      {/* Row 7: Daily Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">การใช้งานรายวัน (30 วันล่าสุด)</h3>
        <div className="h-64">
          {dailyTimeline?.data?.length > 0 ? (
            <Line
              data={{
                labels: dailyTimeline.labels,
                datasets: [{
                  label: "จำนวนการใช้งาน",
                  data: dailyTimeline.data,
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  fill: true,
                  tension: 0.4,
                }],
              }}
              options={lineOptions}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">ไม่มีข้อมูล</div>
          )}
        </div>
      </div>

      {/* Row 8: Platform Distribution */}
      {platformCounts && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
            แพลตฟอร์มที่ส่งลิงก์มาวิเคราะห์
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platformCounts.labels.map((label, i) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ backgroundColor: PLATFORM_COLORS[label] + "18" }}>
                  <p className="text-2xl font-bold" style={{ color: PLATFORM_COLORS[label] }}>
                    {platformCounts.data[i]}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{label}</p>
                  <p className="text-xs text-gray-400">
                    {Math.round((platformCounts.data[i] / linkList.length) * 100)}%
                  </p>
                </div>
              ))}
            </div>
            {/* Doughnut chart */}
            <div className="h-56">
              <Doughnut
                data={{
                  labels: platformCounts.labels,
                  datasets: [{
                    data: platformCounts.data,
                    backgroundColor: platformCounts.colors,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }],
                }}
                options={doughnutOptions}
              />
            </div>
          </div>
        </div>
      )}

      {/* Row 9: Link List */}
      {linkList && linkList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-3 border-l-4 border-blue-600">
            ลิงก์ที่วิเคราะห์ ({linkList.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-48">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {displayedLinks?.map((link, index) => (
                  <tr key={link.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 break-all"
                      >
                        <span className="truncate max-w-md">{link.url}</span>
                        <ExternalLink size={14} className="flex-shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(link.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {linkList.length > INITIAL_LINKS_COUNT && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllLinks(!showAllLinks)}
                className="flex items-center gap-2 mx-auto px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showAllLinks ? (
                  <>
                    <ChevronUp size={18} />
                    แสดงน้อยลง
                  </>
                ) : (
                  <>
                    <ChevronDown size={18} />
                    ดูเพิ่มเติม ({linkList.length - INITIAL_LINKS_COUNT} รายการ)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

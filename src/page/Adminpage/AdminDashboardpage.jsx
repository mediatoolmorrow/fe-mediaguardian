import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import VideoManagement from "../../components/Admin/VideoManagement";
import LoadingScreen from '../../components/Admin/LoadingScreen';
import Statisticspage from './Statisticpage';
import SurveyAnalyticspage from './SurveyAnalyticspage';
import PromptAnalyticspage from './PromptAnalyticspage';
import FeedbackAnalyticspage from './FeedbackAnalyticspage';
import AdminManagementpage from './AdminManagementpage';
import UserListpage from './UserListpage';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { backendUser, isAdmin, isSuperAdmin, loading: authLoading, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState('survey');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [videoUrl, setVideoUrl] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pageViews: 0,
    avgSession: '0m 0s',
    bounceRate: '0%',
    userGrowth: 0,
    viewsGrowth: 0,
    sessionChange: 0,
    bounceChange: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const [surveyChartData, setSurveyChartData] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyError, setSurveyError] = useState('');
  const [csvDownloading, setCsvDownloading] = useState(false);

  // Prompt Analytics State
  const [promptChartData, setPromptChartData] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState('');
  const [promptCsvDownloading, setPromptCsvDownloading] = useState(false);

  // Feedback Analytics State
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackCsvDownloading, setFeedbackCsvDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && backendUser && isAdmin) {
      loadVideoUrl();
      loadStats();
      loadSurveyChartData();
      loadPromptChartData();
      loadFeedbackData();
    }
  }, [authLoading, backendUser, isAdmin]);

  const getToken = () => localStorage.getItem('backend_token');

  const handleBackToApp = () => {
    navigate('/agentic');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePageChange = (page) => {
    if ((page === 'admin-management' || page === 'user-list') && !isSuperAdmin) {
      return;
    }
    setCurrentPage(page);
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: 'Generate realistic website statistics in JSON only: {"totalUsers": number, "pageViews": number, "avgSession": "string like 4m 32s", "bounceRate": "string like 42.3%", "userGrowth": number, "viewsGrowth": number, "sessionChange": number, "bounceChange": number}'
          }]
        })
      });

      const data = await response.json();
      const resultText = data.content.find(item => item.type === 'text')?.text || '';
      const cleanText = resultText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);
      setStats(result);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadSurveyChartData = async () => {
    setSurveyLoading(true);
    setSurveyError('');
    try {
      const token = getToken();
      if (!token) {
        setSurveyError('No authentication token found');
        return;
      }
      const response = await api.getSurveyChartData(token);
      if (response.success) {
        setSurveyChartData(response.data);
      } else {
        setSurveyError(response.message || 'Failed to load survey data');
      }
    } catch (error) {
      console.error('Failed to load survey chart data:', error);
      setSurveyError(error.message || 'Failed to load survey data');
    } finally {
      setSurveyLoading(false);
    }
  };
 

  const handleDownloadCSV = async () => {
    setCsvDownloading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('No authentication token found');
        return;
      }
      await api.downloadSurveyCSV(token);
    } catch (error) {
      console.error('Failed to download CSV:', error);
      alert('Failed to download CSV: ' + error.message);
    } finally {
      setCsvDownloading(false);
    }
  };

  const loadPromptChartData = async () => {
    setPromptLoading(true);
    setPromptError('');
    try {
      const token = getToken();
      if (!token) {
        setPromptError('No authentication token found');
        return;
      }
      const response = await api.getPromptChartData(token);
      if (response.success) {
        setPromptChartData(response.data);
      } else {
        setPromptError(response.message || 'Failed to load prompt data');
      }
    } catch (error) {
      console.error('Failed to load prompt chart data:', error);
      setPromptError(error.message || 'Failed to load prompt data');
    } finally {
      setPromptLoading(false);
    }
  };

  const handleDownloadPromptCSV = async () => {
    setPromptCsvDownloading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('No authentication token found');
        return;
      }
      await api.downloadPromptCSV(token);
    } catch (error) {
      console.error('Failed to download Prompt CSV:', error);
      alert('Failed to download CSV: ' + error.message);
    } finally {
      setPromptCsvDownloading(false);
    }
  };

  // Mock feedback data - replace with actual API call when backend is ready
  const loadFeedbackData = async () => {
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      // TODO: Replace with actual API call: await api.getFeedbackData(token);
      // For now, using mock data
      const mockData = {
        summary: {
          totalFeedback: 156,
          totalLikes: 312,
          totalImproves: 156,
          likeRatio: "66.7%",
          withExplanations: 45
        },
        optionStats: {
          option1: { likes: 98, improves: 58 },
          option2: { likes: 112, improves: 44 },
          option3: { likes: 102, improves: 54 }
        },
        recentFeedback: [
          {
            id: 1,
            date: "2024-01-15 14:30",
            role: "admin",
            ratings: { option1: "like", option2: "improve", option3: "like" },
            hasExplanations: true,
            explanations: {
              option1: "ข้อมูลถูกต้องและเป็นประโยชน์มาก",
              option2: "ควรเพิ่มรายละเอียดเกี่ยวกับแหล่งอ้างอิง",
              option3: "ตอบตรงประเด็นดี"
            }
          },
          {
            id: 2,
            date: "2024-01-15 12:15",
            role: "researcher",
            ratings: { option1: "like", option2: "like", option3: "improve" },
            hasExplanations: true,
            explanations: {
              option1: "วิเคราะห์ได้ครอบคลุม",
              option2: "ชอบวิธีการนำเสนอ",
              option3: "ควรเพิ่มมุมมองที่หลากหลายขึ้น"
            }
          },
          {
            id: 3,
            date: "2024-01-15 10:45",
            role: "user",
            ratings: { option1: "like", option2: "like", option3: "like" },
            hasExplanations: false,
            explanations: null
          },
          {
            id: 4,
            date: "2024-01-14 16:20",
            role: "user",
            ratings: { option1: "improve", option2: "like", option3: "like" },
            hasExplanations: false,
            explanations: null
          },
          {
            id: 5,
            date: "2024-01-14 09:30",
            role: "admin",
            ratings: { option1: "improve", option2: "improve", option3: "like" },
            hasExplanations: true,
            explanations: {
              option1: "ข้อมูลยังไม่ครบถ้วน ควรเพิ่มบริบท",
              option2: "ภาษาที่ใช้ยังไม่เหมาะสมกับกลุ่มเป้าหมาย",
              option3: "ดีแล้ว"
            }
          }
        ]
      };

      setFeedbackData(mockData);
    } catch (error) {
      console.error('Failed to load feedback data:', error);
      setFeedbackError(error.message || 'Failed to load feedback data');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleDownloadFeedbackCSV = async () => {
    setFeedbackCsvDownloading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.downloadFeedbackCSV(token);
      alert('Feedback CSV download will be available when backend API is implemented');
    } catch (error) {
      console.error('Failed to download Feedback CSV:', error);
      alert('Failed to download CSV: ' + error.message);
    } finally {
      setFeedbackCsvDownloading(false);
    }
  };

  const loadVideoUrl = async () => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: 'Return a sample YouTube embed URL in JSON only: {"videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"}'
          }]
        })
      });

      const data = await response.json();
      const resultText = data.content.find(item => item.type === 'text')?.text || '';
      const cleanText = resultText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);
      setVideoUrl(result.videoUrl);
    } catch (error) {
      console.error('Failed to load video URL:', error);
      setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    }
  };

  const validateYouTubeUrl = (url) => {
    const embedPattern = /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/;
    const watchPattern = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(&.*)?$/;
    const shortPattern = /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]+(\?.*)?$/;
    return embedPattern.test(url) || watchPattern.test(url) || shortPattern.test(url);
  };

  const convertToEmbedUrl = (url) => {
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    return url;
  };

  const handleSaveVideo = async (url) => {
    setSaveError('');
    setSaveMessage('');

    if (!url.trim()) {
      setSaveError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setSaveError('Please enter a valid YouTube URL');
      return;
    }

    setIsSaving(true);

    try {
      const embedUrl = convertToEmbedUrl(url);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Simulate saving video URL: ${embedUrl}. Return JSON only: {"success": true, "message": "Video URL updated successfully"}`
          }]
        })
      });

      const data = await response.json();
      const resultText = data.content.find(item => item.type === 'text')?.text || '';
      const cleanText = resultText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);

      if (result.success) {
        setVideoUrl(embedUrl);
        setSaveMessage(result.message);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveError('Failed to save video URL. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!backendUser) {
    navigate('/login');
    return null;
  }

  // Access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-600 text-2xl font-semibold mb-2">Access Denied</p>
          <p className="text-gray-500 mb-6">You do not have admin privileges to access this page.</p>
          <button
            onClick={() => navigate('/tutorial')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }

  // Build adminUser object from backendUser for Header/components
  const adminUser = {
    email: backendUser.email,
    username: backendUser.username || backendUser.displayName,
    role: backendUser.role,
    isSuperAdmin: isSuperAdmin,
    isAdmin: isAdmin
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'survey':
        return 'Survey Analytics';
      case 'prompts':
        return 'Prompt Analytics';
      case 'feedback':
        return 'Feedback Analytics';
      case 'stats':
        return 'Website Statistics';
      case 'tutorial':
        return 'Manage Tutorial Video';
      case 'admin-management':
        return 'Admin Management';
      case 'user-list':
        return 'User List';
      default:
        return 'Admin Dashboard';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'survey':
        return (
          <SurveyAnalyticspage
            chartData={surveyChartData}
            loading={surveyLoading}
            error={surveyError}
            onDownloadCSV={handleDownloadCSV}
            onRefresh={loadSurveyChartData}
            downloading={csvDownloading}
          />
        );
      case 'prompts':
        return (
          <PromptAnalyticspage
            chartData={promptChartData}
            loading={promptLoading}
            error={promptError}
            onRefresh={loadPromptChartData}
            onDownloadCSV={handleDownloadPromptCSV}
            downloading={promptCsvDownloading}
          />
        );
      case 'feedback':
        return (
          <FeedbackAnalyticspage
            feedbackData={feedbackData}
            loading={feedbackLoading}
            error={feedbackError}
            onRefresh={loadFeedbackData}
            onDownloadCSV={handleDownloadFeedbackCSV}
            downloading={feedbackCsvDownloading}
          />
        );
      case 'stats':
        return <Statisticspage stats={stats} loading={statsLoading} />;
      case 'tutorial':
        return (
          <VideoManagement
            videoUrl={videoUrl}
            onSave={handleSaveVideo}
            loading={isSaving}
            error={saveError}
            successMessage={saveMessage}
          />
        );
      case 'admin-management':
        if (!isSuperAdmin) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 text-xl font-semibold">Access Denied</p>
                <p className="text-gray-500 mt-2">You need Super Admin privileges to access this page.</p>
              </div>
            </div>
          );
        }
        return <AdminManagementpage currentUserEmail={backendUser?.email} />;
      case 'user-list':
        if (!isSuperAdmin) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 text-xl font-semibold">Access Denied</p>
                <p className="text-gray-500 mt-2">You need Super Admin privileges to access this page.</p>
              </div>
            </div>
          );
        }
        return <UserListpage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
        isSuperAdmin={isSuperAdmin}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={getPageTitle()}
          adminUser={adminUser}
          onLogout={handleLogout}
          onBackToApp={handleBackToApp}
        />

        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

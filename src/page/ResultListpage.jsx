import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import ResultSummary from "../components/Result/ResultSummary";
import FeedbackPopUp from "../components/FeedbackPopUp";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ResultListpage() {
    const navigate = useNavigate();
    const { loading: authLoading, backendUser, isAdmin } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCount, setDisplayCount] = useState(5);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [showFeedbackTest, setShowFeedbackTest] = useState(false);

    useEffect(() => {
         if (authLoading) {
            return;
        }

        const fetchResults = async () => {
            const token = localStorage.getItem('backend_token');

            if (!token) {
                setError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
                setLoading(false);
                return;
            }

            try {
                const data = await api.getLatestResults(token, displayCount);
                let resultsList = [];
                let total = 0;

                if (Array.isArray(data)) {
                    resultsList = data;
                    total = data.length;
                } else if (data && Array.isArray(data.results)) {
                    resultsList = data.results;
                    total = data.total || data.totalCount || data.results.length;
                } else if (data && Array.isArray(data.prompts)) {
                    resultsList = data.prompts;
                    total = data.total || data.totalCount || data.prompts.length;
                } else if (data && Array.isArray(data.data)) {
                    resultsList = data.data;
                    total = data.total || data.totalCount || data.data.length;
                }

                // Helper to parse Firestore Timestamp or regular date
                const getTimestamp = (dateValue) => {
                    if (!dateValue) return 0;
                    // Firestore Timestamp with _seconds
                    if (dateValue._seconds !== undefined) {
                        return dateValue._seconds * 1000;
                    }
                    // Firestore Timestamp with seconds
                    if (dateValue.seconds !== undefined) {
                        return dateValue.seconds * 1000;
                    }
                    // Regular date string or timestamp
                    return new Date(dateValue).getTime() || 0;
                };

                // Sort by newest first
                resultsList.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

                setResults(resultsList);
                setTotalCount(total);
                setHasMore(resultsList.length === displayCount && resultsList.length < total);
                setError(null);
            } catch (err) {
                console.error("Error fetching results:", err);
                setError(err.message || "ไม่สามารถโหลดประวัติได้");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchResults();
    }, [authLoading, displayCount]);

    const handleLoadMore = () => {
        setLoadingMore(true);
        setDisplayCount(prev => prev + 5);
    };

    const getInputPreview = (result) => {
        if (result.input?.content) return result.input.content;
        if (result.input?.videoUrl) return result.input.videoUrl;
        if (result.input?.imageUrl) return "รูปภาพ";
        return null;
    };

    // Extract description for preview - handles both structured and raw output
    const getDescriptionPreview = (result) => {
        const output = result.output;

        // If output is structured JSON with factChecking
        if (output && typeof output === 'object' && output.factChecking) {
            // Return summary if available, otherwise combine key parts
            if (output.summary) return output.summary;
            if (output.factChecking?.facts) return output.factChecking.facts;
            return "ผลการวิเคราะห์";
        }

        // If output has raw fallback
        if (output && typeof output === 'object' && output.raw) {
            return output.raw;
        }

        // Fallback to old format
        return result.llmResponse || result.output?.text || (typeof output === 'string' ? output : "") || "";
    };

    if (loading || authLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-gray-500">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md text-center">
                    {error}
                </div>
                <button
                    className="btn-normal-active"
                    onClick={() => navigate("/login")}
                >
                    เข้าสู่ระบบ
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div className="flex flex-col items-center justify-center space-y-6 pb-8">
                <Banner imgSource="/banner/03_Agentic_Banner.webp" />

                <div className="w-full max-w-[648px] px-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-primary">ประวัติการวิเคราะห์</h2>
                            <p className="text-xs text-gray-500">คลิกที่รายการเพื่อดูรายละเอียด</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {results.length} / {totalCount} รายการ
                        </span>
                    </div>

                    {results.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                            <img
                                src="/icon/result.svg"
                                alt="No results"
                                className="w-16 h-16 mx-auto mb-4 opacity-50"
                            />
                            <p className="text-gray-500 mb-2">ยังไม่มีประวัติการวิเคราะห์</p>
                            <p className="text-xs text-gray-400 mb-4">เริ่มวิเคราะห์เนื้อหาเพื่อรับคำแนะนำ</p>
                            <button
                                className="btn-normal-active w-auto mx-auto"
                                onClick={() => navigate("/agentic")}
                            >
                                เริ่มวิเคราะห์เนื้อหา
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {results.map((result, index) => (
                                    <ResultSummary
                                        key={result._id || result.id}
                                        id={result._id || result.id}
                                        description={getDescriptionPreview(result)}
                                        mode={result.mode}
                                        createdAt={result.createdAt}
                                        inputPreview={getInputPreview(result)}
                                        resultNumber={totalCount - index}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-3 text-primary rounded-lg hover:underline transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                กำลังโหลด...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                โหลดเพิ่มเติม
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* TEST SECTION - Remove after testing */}
                <div className="w-full max-w-[648px] px-4 mt-6 p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
                    <p className="text-red-600 font-bold mb-2">Test Feedback Popup</p>
                    <p className="text-sm text-gray-600 mb-3">
                        Current Role: <span className="font-medium">
                            {isAdmin ? "Admin" : backendUser?.role === "researcher" ? "Researcher" : "User"}
                        </span>
                    </p>
                    <button
                        onClick={() => setShowFeedbackTest(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Open Feedback Popup
                    </button>
                </div>

                <FeedbackPopUp
                    isOpen={showFeedbackTest}
                    onClose={() => setShowFeedbackTest(false)}
                    onContinue={(data) => {
                        console.log("Feedback data:", data);
                        alert("Feedback submitted! Check console for data.");
                        setShowFeedbackTest(false);
                    }}
                />
            </div>
        </div>
    );
}

export default ResultListpage;
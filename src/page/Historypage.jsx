import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResultSummary from "../components/Result/ResultSummary";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Historypage() {
    const navigate = useNavigate();
    const { loading: authLoading } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCount, setDisplayCount] = useState(10);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

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
                    if (dateValue._seconds !== undefined) {
                        return dateValue._seconds * 1000;
                    }
                    if (dateValue.seconds !== undefined) {
                        return dateValue.seconds * 1000;
                    }
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
        setDisplayCount(prev => prev + 10);
    };

    const getInputPreview = (result) => {
        if (result.input?.content) return result.input.content;
        if (result.input?.videoUrl) return result.input.videoUrl;
        if (result.input?.imageUrl) return "รูปภาพ";
        return null;
    };

    const getDescriptionPreview = (result) => {
        const output = result.output;

        // Helper to ensure we return a string
        const extractText = (value) => {
            if (!value) return "";
            if (typeof value === 'string') return value;
            if (Array.isArray(value)) return value.filter(v => typeof v === 'string').join(", ");
            return "";
        };

        // Handle analysis object structure
        if (output && typeof output === 'object' && output.analysis) {
            const analysis = output.analysis;
            // Try to get readable text from analysis fields
            if (analysis.situation_scan) return extractText(analysis.situation_scan);
            if (analysis.summary) return extractText(analysis.summary);
            if (analysis.description) return extractText(analysis.description);
            if (analysis.content) return extractText(analysis.content);
            return "ผลการวิเคราะห์";
        }

        if (output && typeof output === 'object' && output.factChecking) {
            if (output.summary) return extractText(output.summary);
            if (output.factChecking?.facts) return extractText(output.factChecking.facts);
            return "ผลการวิเคราะห์";
        }

        if (output && typeof output === 'object' && output.raw) {
            return extractText(output.raw);
        }

        // Try various fields directly on output
        if (output && typeof output === 'object') {
            if (output.situation_scan) return extractText(output.situation_scan);
            if (output.summary) return extractText(output.summary);
            if (output.text) return extractText(output.text);
            if (output.content) return extractText(output.content);
        }

        // Try result level fields
        if (result.llmResponse) return extractText(result.llmResponse);

        // If output is a string, return it
        if (typeof output === 'string') return output;

        return "ผลการวิเคราะห์";
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
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="w-full max-w-[648px] px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <img src="/icon/history.svg" alt="history" className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl font-bold text-primary">ประวัติทั้งหมด</h1>
                                <p className="text-xs text-gray-500">รายการประวัติการวิเคราะห์ของคุณ</p>
                            </div>
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
                                className="btn-normal-active"
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
                                        isLatest={index === 0}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                กำลังโหลด...
                                            </>
                                        ) : (
                                            <>
                                                ดูเพิ่ม
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Historypage;

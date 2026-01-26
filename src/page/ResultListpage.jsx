import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import ResultSummary from "../components/Result/ResultSummary";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ResultListpage() {
    const navigate = useNavigate();
    const { loading: authLoading } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Wait for auth to finish loading
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
                // Backend extracts userId from JWT token
                const data = await api.getLatestResults(token, 5);
                // Handle various response formats
                let resultsList = [];
                if (Array.isArray(data)) {
                    resultsList = data;
                } else if (data && Array.isArray(data.results)) {
                    resultsList = data.results;
                } else if (data && Array.isArray(data.prompts)) {
                    resultsList = data.prompts;
                } else if (data && Array.isArray(data.data)) {
                    resultsList = data.data;
                }
                setResults(resultsList);
                setError(null);
            } catch (err) {
                console.error("Error fetching results:", err);
                setError(err.message || "ไม่สามารถโหลดประวัติได้");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading]);

    const getInputPreview = (result) => {
        if (result.input?.content) return result.input.content;
        if (result.input?.videoUrl) return result.input.videoUrl;
        if (result.input?.imageUrl) return "รูปภาพ";
        return null;
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
            <div className="flex flex-col items-center justify-center space-y-6 p-4">
                <Banner imgSource="/banner/example.svg" />

                <div className="w-full max-w-[648px]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-primary">ประวัติการวิเคราะห์</h2>
                            <p className="text-xs text-gray-500">คลิกที่รายการเพื่อดูรายละเอียด</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {results.length} รายการ
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
                        <div className="space-y-3">
                            {results.map((result) => (
                                <ResultSummary
                                    key={result._id || result.id}
                                    id={result._id || result.id}
                                    description={result.llmResponse || result.output?.text || result.output || ""}
                                    mode={result.mode}
                                    createdAt={result.createdAt}
                                    inputPreview={getInputPreview(result)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <button
                            className="btn-normal-active"
                            onClick={() => navigate("/agentic")}
                        >
                            วิเคราะห์เนื้อหาใหม่
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultListpage;

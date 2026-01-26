import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResultFull from "../components/Result/ResultFull";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ResultViewpage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUser, refreshBackendUser } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refresh user data on mount to get latest flags
    useEffect(() => {
        refreshBackendUser();
    }, []);

    useEffect(() => {
        const fetchResult = async () => {
            const token = localStorage.getItem('backend_token');

            if (!token) {
                setError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
                setLoading(false);
                return;
            }

            try {
                const data = await api.getResultById(token, id);
                setResult(data);
            } catch (err) {
                console.error("Error fetching result:", err);
                setError(err.message || "ไม่สามารถโหลดผลลัพธ์ได้");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResult();
        }
    }, [id]);

    if (loading) {
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
                    onClick={() => navigate("/result")}
                >
                    กลับไปหน้ารายการ
                </button>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
                <p className="text-gray-500">ไม่พบผลลัพธ์</p>
                <button
                    className="btn-normal-active"
                    onClick={() => navigate("/result")}
                >
                    กลับไปหน้ารายการ
                </button>
            </div>
        );
    }

    // Extract the LLM response text
    const responseText = result.llmResponse || result.output?.text || result.output || "";

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
            {/* Mode indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>โหมด:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {result.mode === 'text' ? 'ข้อความ' : result.mode === 'image' ? 'รูปภาพ' : 'ลิงก์'}
                </span>
                {result.createdAt && (() => {
                    try {
                        const date = new Date(result.createdAt);
                        if (isNaN(date.getTime())) return null;
                        return (
                            <span className="text-xs text-gray-400">
                                {date.toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        );
                    } catch {
                        return null;
                    }
                })()}
            </div>

            <ResultFull description={responseText} />

            <div className="flex gap-3">
                <button
                    className="btn-normal-inactive"
                    onClick={() => navigate("/result")}
                >
                    กลับไปหน้ารายการ
                </button>
                <button
                    className="btn-normal-active"
                    onClick={() => {
                        // Navigate to correct survey based on isSubmitFirstForm flag
                        // If isSubmitFirstForm is false -> show survey 2 (first time after result)
                        // If isSubmitFirstForm is true -> show survey 3 (subsequent times)
                        if (backendUser?.isSubmitFirstForm) {
                            navigate("/survey/3");
                        } else {
                            navigate("/survey/2");
                        }
                    }}
                >
                    ไปต่อ
                </button>
            </div>
        </div>
    );
}

export default ResultViewpage;

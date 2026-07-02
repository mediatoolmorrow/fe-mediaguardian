import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTrackStep } from "../hooks/useTrackStep";
import ResultFull from "../components/Result/ResultFull";
import FeedbackPopUp from "../components/FeedbackPopUp";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";

const MAX_REGENERATE_PER_RESULT = 3;

function ResultViewpage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    useTrackStep(6);
    const { backendUser, refreshBackendUser } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [regenerating, setRegenerating] = useState(false);
    const [regenerateError, setRegenerateError] = useState(null);

    // Check if survey was completed (from navigation state)
    const [isSurveySubmitted, setIsSurveySubmitted] = useState(
        location.state?.surveyCompleted || false
    );
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

    // Store feedback data from ResultFull
    const [feedbackData, setFeedbackData] = useState({
        ratings: {},
        explanations: {},
        questionTexts: {},
        optionTitles: {},
        completedCount: 0,
        totalCount: 0,
        isAllComplete: false
    });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

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
                setError(err.message || "ไม่สามารถโหลดผลลัพธ์ได้");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResult();
        }
    }, [id]);

    const handleCopyAction = () => {};

   const handleContinue = async () => {
        const token = localStorage.getItem('backend_token');
        const hasRatings = Object.keys(feedbackData.ratings || {}).length > 0;

        if (hasRatings && token) {
            // Submit in background — don't await, don't block navigation
            (async () => {
                try {
                    const feedbacks = [];
                    Object.entries(feedbackData.ratings || {}).forEach(([key, rating]) => {
                        if (rating) {
                            const [optionIndex, questionIndex] = key.split('-').map(Number);
                            const rawText = feedbackData.questionTexts?.[key] || "";
                            const cleanText = rawText.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n").trim();
                            feedbacks.push({
                                optionIndex,
                                questionIndex,
                                rating,
                                optionTitle: feedbackData.optionTitles?.[key] || `ข้อแนะนำที่ ${optionIndex + 1}`,
                                example: cleanText,
                                explanations: feedbackData.explanations?.[key] || null
                            });
                        }
                    });
                    await api.submitFeedback(token, id, { feedbacks });
                } catch (err) {
                    // Silently ignore — navigation already happened
                }
            })();
        }

        navigate("/nextstep", { state: { resultId: id } });
    };

    // Handle feedback change from ResultFull
    const handleFeedbackChange = (data) => {
        setFeedbackData(data);
    };

    // Handle feedback popup continue
    const handleFeedbackContinue = (feedbackData) => {
        setShowFeedbackPopup(false);
        navigate("/nextstep");
    };

    // Get regenerate count from result
    const regenerateCount = result?.regenerateCount || 0;
    const canRegenerate = regenerateCount < MAX_REGENERATE_PER_RESULT;

    // Handle regenerate
    const handleRegenerate = async () => {
        if (!canRegenerate || regenerating) return;

        const token = localStorage.getItem('backend_token');
        if (!token) {
            setRegenerateError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            return;
        }

        setRegenerating(true);
        setRegenerateError(null);

        try {
            const newResult = await api.regenerateAdvice(token, id);
            setResult(newResult);
        } catch (err) {
            // Check for rate limit error
            const errorMsg = err.message?.toLowerCase() || '';
            if (
                err.status === 429 ||
                errorMsg.includes('rate limit') ||
                errorMsg.includes('limit reached') ||
                errorMsg.includes('daily limit') ||
                errorMsg.includes('too many requests') ||
                errorMsg.includes('exceeded')
            ) {
                setRegenerateError("ถึงขีดจำกัดการสร้างใหม่วันนี้แล้ว");
            } else if (errorMsg.includes('regenerate limit')) {
                setRegenerateError("ถึงขีดจำกัดการสร้างใหม่สำหรับคำตอบนี้แล้ว (3 ครั้ง)");
            } else {
                setRegenerateError(err.message || "ไม่สามารถสร้างคำตอบใหม่ได้");
            }
        } finally {
            setRegenerating(false);
        }
    };

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
                    onClick={() => navigate("/agentic")}
                >
                    เริ่มต้นใหม่ทั้งหมด
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
                    onClick={() => navigate("/agentic")}
                >
                    เริ่มต้นใหม่ทั้งหมด
                </button>
            </div>
        );
    }

    // Extract the LLM response - check for structured output first
    // Try multiple possible locations for the output data
    let output = result.output || result.result || result.data || result.response;
    const rawOutput = result.rawOutput || result.llmResponse || result.raw || "";

    // Determine if we have structured output or raw text
    let structuredOutput = null;
    let fallbackText = rawOutput;

    // Helper function to safely parse JSON
    const safeParseJSON = (str) => {
        if (typeof str !== 'string') return str;
        try {
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    };

    // Try to parse output if it's a string
    if (typeof output === 'string') {
        const parsed = safeParseJSON(output);
        if (parsed) {
            output = parsed;
        } else {
            // Not valid JSON, use as fallback text
            fallbackText = output;
            output = null;
        }
    }

    // Check if output is nested (e.g., output.output or output.result)
    if (output && typeof output === 'object') {
        // Handle nested structure
        if (output.output && typeof output.output === 'object') {
            output = output.output;
        } else if (output.result && typeof output.result === 'object') {
            output = output.result;
        } else if (typeof output.output === 'string') {
            const parsed = safeParseJSON(output.output);
            if (parsed) {
                output = parsed;
            }
        }
    }

    if (output && typeof output === 'object') {
        if (output.raw && !output.decisionMaking) {
            fallbackText = output.raw;
        } else if (output.factChecking || output.decisionMaking || output.impact || output.options) {
            structuredOutput = output;
        } else {
            fallbackText = JSON.stringify(output, null, 2);
        }
    }

    if (!structuredOutput && result) {
        if (result.decisionMaking || result.factChecking || result.options) {
            structuredOutput = result;
        }
    }

    return (
        <div className="w-full min-h-full flex flex-col items-center py-6 px-4">
            <div className="w-full max-w-[500px] px-4 mb-4">
                {regenerateError && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {regenerateError}
                    </div>
                )}
                {!canRegenerate && !regenerateError && (
                    <p className="mt-2 text-xs text-gray-500">
                        ถึงขีดจำกัดการสร้างใหม่สำหรับคำตอบนี้แล้ว
                    </p>
                )}
            </div>

            <ResultFull
                resultId={id}
                description={fallbackText}
                structuredOutput={structuredOutput}
                onCopy={handleCopyAction}
                allowNavigation={!isSurveySubmitted}
                onFeedbackChange={handleFeedbackChange}
            />

            <div className="w-full max-w-[500px] mt-6 px-4 space-y-4">
                {/* Progress indicator
                {feedbackData.totalCount > 0 && (
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ให้คะแนนคำแนะนำแล้ว {feedbackData.completedCount}/{feedbackData.totalCount} ข้อ
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(feedbackData.completedCount / feedbackData.totalCount) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
                */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        สร้างใหม่แล้ว {regenerateCount}/{MAX_REGENERATE_PER_RESULT} ครั้ง
                    </span>
                    <button
                        onClick={handleRegenerate}
                        disabled={!canRegenerate || regenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            canRegenerate && !regenerating
                                ? 'bg-primary text-white hover:bg-primary/90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                        {regenerating ? 'กำลังสร้างใหม่...' : 'วิเคราะห์คำตอบอีกครั้ง'}
                    </button>
                </div>

                <button
                    className={"w-full py-3 rounded-full font-medium transition-colors bg-primary text-white hover:bg-primary/90"}
                    onClick={handleContinue}
                >
                    ไปต่อ
                </button>
                
                <button
                    className="text-primary w-full py-3 underline font-medium transition-colors"
                    onClick={() => navigate("/agentic")}
                >
                    เริ่มต้นใหม่ทั้งหมด
                </button>

            </div>
        </div>
    );
}

export default ResultViewpage;
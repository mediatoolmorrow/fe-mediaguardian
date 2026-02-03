import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ResultFull from "../components/Result/ResultFull";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ResultViewpage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUser, refreshBackendUser } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Check if survey was completed (from navigation state)
    const [isSurveySubmitted, setIsSurveySubmitted] = useState(
        location.state?.surveyCompleted || false
    );

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

    // Handle copy action - navigate to survey with result ID
    const handleCopyAction = () => {
        // Navigate to correct survey based on isSubmitFirstForm flag
        if (backendUser?.isSubmitFirstForm) {
            navigate("/survey/3", { state: { resultId: id } });
        } else {
            navigate("/survey/2", { state: { resultId: id } });
        }
    };

    // Handle continue button - only works after survey is submitted
    const handleContinue = () => {
        if (!isSurveySubmitted) return;
        navigate("/nextstep");
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
                    วิเคราะห์เนื้อหาใหม่
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
                    วิเคราะห์เนื้อหาใหม่
                </button>
            </div>
        );
    }

    // Extract the LLM response - check for structured output first
    let output = result.output;
    const rawOutput = result.rawOutput || result.llmResponse || "";

    // Debug: Log the result structure
    console.log("Result data:", result);
    console.log("Output type:", typeof output);
    console.log("Output value:", output);

    // Determine if we have structured output or raw text
    let structuredOutput = null;
    let fallbackText = rawOutput;

    // Try to parse output if it's a string
    if (typeof output === 'string') {
        try {
            output = JSON.parse(output);
        } catch (e) {
            // Not valid JSON, use as fallback text
            fallbackText = output;
            output = null;
        }
    }

    if (output && typeof output === 'object') {
        // Check if it's structured JSON (has factChecking or decisionMaking) or raw fallback (has raw property)
        if (output.raw) {
            // JSON parsing failed on backend, use raw text
            fallbackText = output.raw;
        } else if (output.factChecking || output.decisionMaking || output.impact) {
            // Structured output available
            structuredOutput = output;
        } else {
            // Unknown format, try to use as text
            fallbackText = JSON.stringify(output);
        }
    }

    return (
        <div className="w-full min-h-full flex flex-col items-center py-6 px-4">
            <ResultFull 
                description={fallbackText} 
                structuredOutput={structuredOutput}
                onCopy={handleCopyAction}
            />

            <div className="w-full max-w-[500px] mt-6 px-4">
                <button
                    className={`w-full py-3 rounded-full font-medium transition-colors ${
                        isSurveySubmitted 
                            ? 'bg-primary text-white hover:bg-primary/90' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleContinue}
                    disabled={!isSurveySubmitted}
                >
                    {isSurveySubmitted ? 'ไปต่อ' : 'กรุณาทำแบบสอบถามก่อน'}
                </button>
                
                {!isSurveySubmitted && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                        คลิก "คัดลอก" เพื่อไปทำแบบสอบถาม
                    </p>
                )}
            </div>
        </div>
    );
}

export default ResultViewpage;
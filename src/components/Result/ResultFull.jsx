import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FeedbackModal from "./FeedbackModal";

function ResultFull({
    description,
    structuredOutput,
    onCopy,
    onSurveyComplete,
    allowNavigation = true,
    onFeedbackChange
}) {
    const { backendUser, isAdmin } = useAuth();
    const [showToast, setShowToast] = useState(false);
    const [activeOptionTab, setActiveOptionTab] = useState(0);

    // Feedback state for each option
    const [ratings, setRatings] = useState({});
    const [explanations, setExplanations] = useState({});

    // Modal state for admin feedback
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [pendingFeedback, setPendingFeedback] = useState({ feedbackKey: "0-0", ratingType: null });

    const isAdminOrResearcher = isAdmin || backendUser?.role === "researcher";

    const handleCopy = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                // silent
            }
            document.body.removeChild(textArea);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        if (allowNavigation && onCopy) {
            onCopy();
        }
    };

    // Calculate total questions across all options
    const getTotalQuestionKeys = () => {
        const keys = [];
        options.forEach((option, optionIndex) => {
            const questions = parseQuestions(option.recommendation);
            questions.forEach((_, qIndex) => {
                keys.push(`${optionIndex}-${qIndex}`);
            });
        });
        return keys;
    };

    // Get question text by key
    const getQuestionText = (feedbackKey) => {
        const [optionIdx, questionIdx] = feedbackKey.split('-').map(Number);
        const option = options[optionIdx];
        if (!option) return "";
        const questions = parseQuestions(option.recommendation);
        return questions[questionIdx]?.text || "";
    };

    // Get option title by index
    const getOptionTitle = (optionIdx) => {
        const option = options[optionIdx];
        return option?.title || `ข้อแนะนำที่ ${optionIdx + 1}`;
    };

    // Notify parent with feedback data and completion status
    const notifyFeedbackChange = (newRatings, newExplanations) => {
        if (onFeedbackChange) {
            const allKeys = getTotalQuestionKeys();
            const completedCount = allKeys.filter(key => newRatings[key]).length;
            const totalCount = allKeys.length;
            const isAllComplete = completedCount === totalCount && totalCount > 0;

            // Build questionTexts map for each rated question
            const questionTexts = {};
            const optionTitles = {};
            Object.keys(newRatings).forEach(key => {
                if (newRatings[key]) {
                    questionTexts[key] = getQuestionText(key);
                    const [optionIdx] = key.split('-').map(Number);
                    optionTitles[key] = getOptionTitle(optionIdx);
                }
            });

            onFeedbackChange({
                ratings: newRatings,
                explanations: newExplanations,
                questionTexts,
                optionTitles,
                completedCount,
                totalCount,
                isAllComplete
            });
        }
    };

    // feedbackKey format: "optionIndex-questionIndex" e.g. "0-0", "0-1", "1-2"
    const handleRatingChange = (feedbackKey, value) => {
        if (isAdminOrResearcher) {
            // For admin/researcher: open modal to collect detailed feedback
            setPendingFeedback({ feedbackKey, ratingType: value });
            setShowFeedbackModal(true);
        } else {
            // For regular user: just toggle the selection (no modal)
            const newRatings = {
                ...ratings,
                [feedbackKey]: ratings[feedbackKey] === value ? null : value
            };
            setRatings(newRatings);
            notifyFeedbackChange(newRatings, explanations);
        }
    };

    // Handle feedback submission from modal (admin/researcher only)
    const handleFeedbackSubmit = (feedbackKey, ratingType, answers) => {
        const newRatings = {
            ...ratings,
            [feedbackKey]: ratingType
        };
        setRatings(newRatings);

        const newExplanations = {
            ...explanations,
            [feedbackKey]: {
                reason: answers.reason,
                example: answers.example,
                explanation: answers.explanation
            }
        };
        setExplanations(newExplanations);
        notifyFeedbackChange(newRatings, newExplanations);
    };

    const getModalInitialValues = (feedbackKey) => {
        const existing = explanations[feedbackKey] || {};
        return {
            reason: existing.reason || "",
            example: existing.example || "",
            explanation: existing.explanation || ""
        };
    };

    // Parse recommendation text to extract individual questions
    const parseQuestions = (recommendationText) => {
        if (!recommendationText) return [];

        // Split by คำถามที่ pattern (supports both <b> tags and plain text)
        const pattern = /(<b>)?คำถามที่\s*(\d+)\s*:?\s*(<\/b>)?/gi;
        const parts = recommendationText.split(pattern).filter(Boolean);

        // If no คำถามที่ found, return the whole text as one question
        if (!pattern.test(recommendationText)) {
            return [{ label: "", text: recommendationText }];
        }

        // Rebuild questions from split parts
        const questions = [];
        let currentText = "";
        let currentNum = null;

        // Reset pattern for matching
        const matchPattern = /(<b>)?คำถามที่\s*(\d+)\s*:?\s*(<\/b>)?/gi;
        let match;
        let lastIndex = 0;

        while ((match = matchPattern.exec(recommendationText)) !== null) {
            // Save previous question if exists
            if (currentNum !== null) {
                const endIndex = match.index;
                const text = recommendationText.substring(lastIndex, endIndex).trim();
                questions.push({
                    label: `คำถามที่ ${currentNum}`,
                    text: text
                });
            }

            currentNum = match[2];
            lastIndex = match.index + match[0].length;
        }

        // Add the last question
        if (currentNum !== null) {
            const text = recommendationText.substring(lastIndex).trim();
            questions.push({
                label: `คำถามที่ ${currentNum}`,
                text: text
            });
        }

        return questions.length > 0 ? questions : [{ label: "", text: recommendationText }];
    };

    const options = structuredOutput?.decisionMaking?.options
        || structuredOutput?.options
        || [];

    if (!structuredOutput || !options.length) {
        return null;
    }

    const currentOption = options[activeOptionTab];

    return (
        <>
            <style>{`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -10px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -10px); }
                }
                .animate-fade-in-out {
                    animation: fadeInOut 2s ease-in-out;
                }
            `}</style>

            {showToast && (
                <div className="fixed bottom-1/2 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 animate-fade-in-out text-sm sm:text-base">
                    คัดลอกแล้ว
                </div>
            )}

            <div className="w-full max-w-[500px] px-3 sm:px-4 space-y-3 sm:space-y-4">
                <div className="px-2">
                    <h2 className="font-bold text-primary text-center text-xl sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        วิธีการสื่อสาร ตัดสินใจ และหาทางออก <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                    </h2>
                    <h2 className="font-bold text-primary text-center text-xl sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        Solution & Decision Making  <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                    </h2>
                </div>

                <div className="bg-white items-center flex flex-col justify-center p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 space-y-1">
                    <div className="flex gap-2 flex-wrap justify-center w-full">
                        {options.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveOptionTab(index)}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                                    activeOptionTab === index
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                                }`}
                            >
                                ข้อแนะนำที่ {index + 1}
                            </button>
                        ))}
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 italic"> สามารถเลือกดูได้ 3 ข้อแนะนำ </p>
                    </div>

                    {currentOption && (
                        <div className="space-y-3 sm:space-y-4 w-full">
                            {/* แนวทางการสื่อสาร - Title */}
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">แนวทางการสื่อสาร</p>
                                <div className="border border-primary text-black px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center font-medium text-sm sm:text-base">
                                    {currentOption.title || `ทางเลือกที่ ${activeOptionTab + 1}`}
                                </div>
                            </div>

                            {/* ข้อความที่แนะนำ - Each question in separate gray box */}
                            {currentOption.recommendation && (
                                <div className="space-y-3">
                                    <p className="text-xs sm:text-sm text-gray-600">ข้อความที่แนะนำ</p>

                                    {/* Render each question in its own gray box */}
                                    {parseQuestions(currentOption.recommendation).map((question, qIndex) => {
                                        const feedbackKey = `${activeOptionTab}-${qIndex}`;
                                        return (
                                            <div key={qIndex} className="bg-gray-100 rounded-lg p-3 sm:p-4 space-y-3">
                                                {/* Question label */}
                                                {question.label && (
                                                    <p className="text-xs font-semibold text-primary">
                                                        {question.label}
                                                    </p>
                                                )}

                                                {/* Question text */}
                                                <p
                                                    className="text-xs sm:text-sm text-gray-800 [&_b]:font-bold text-start break-words leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: question.text
                                                            .replace(/\r\n|\r|\n/g, "<br/>")
                                                            .replace(/\\n/g, "<br/>")
                                                    }}
                                                />

                                                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                question.text
                                                                    .replace(/<[^>]*>/g, "")
                                                                    .replace(/\\n/g, "\n")
                                                            )
                                                        }
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-200 rounded-lg text-xs transition-colors border border-gray-300"
                                                        title="คัดลอก"
                                                    >
                                                        <img src="/icon/copy.svg" alt="Copy" className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span>คัดลอก</span>
                                                    </button>

                                                    {/* Spacer */}
                                                    <div className="flex-1" />

                                                    {/* Like button */}
                                                    <button
                                                        onClick={() => handleRatingChange(feedbackKey, "like")}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                                                            ratings[feedbackKey] === "like"
                                                                ? "border-primary bg-primary/10 text-primary"
                                                                : "border-gray-300 bg-white hover:border-primary/50 text-gray-600"
                                                        }`}
                                                        title="ชอบ"
                                                    >
                                                        <span>👍</span>
                                                        <span className="hidden sm:inline">ชอบ</span>
                                                    </button>

                                                    {/* Improve button */}
                                                    <button
                                                        onClick={() => handleRatingChange(feedbackKey, "improve")}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                                                            ratings[feedbackKey] === "improve"
                                                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                                                : "border-gray-300 bg-white hover:border-yellow-300 text-gray-600"
                                                        }`}
                                                        title="อยากให้ปรับปรุง"
                                                    >
                                                        <span>👎</span>
                                                        <span className="hidden sm:inline">ปรับปรุง</span>
                                                    </button>
                                                </div>

                                                {/* Show saved feedback summary for admin/researcher */}
                                                {isAdminOrResearcher && ratings[feedbackKey] && explanations[feedbackKey] && (
                                                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs text-gray-600 font-medium">
                                                                บันทึกของคุณ
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    setPendingFeedback({ feedbackKey, ratingType: ratings[feedbackKey] });
                                                                    setShowFeedbackModal(true);
                                                                }}
                                                                className="text-xs text-primary hover:underline"
                                                            >
                                                                แก้ไข
                                                            </button>
                                                        </div>
                                                        {explanations[feedbackKey].reason && (
                                                            <p className="text-xs text-gray-700 mb-1">
                                                                <span className="font-medium">สาเหตุ:</span> {explanations[feedbackKey].reason}
                                                            </p>
                                                        )}
                                                        {explanations[feedbackKey].example && (
                                                            <p className="text-xs text-gray-700 mb-1">
                                                                <span className="font-medium">ตัวอย่าง:</span> {explanations[feedbackKey].example}
                                                            </p>
                                                        )}
                                                        {explanations[feedbackKey].explanation && (
                                                            <p className="text-xs text-gray-700">
                                                                <span className="font-medium">เหตุผล:</span> {explanations[feedbackKey].explanation}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ข้อแนะนำในการใช้ - Examples */}
                            {currentOption.examples && currentOption.examples.length > 0 && (
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">ข้อแนะนำในการใช้</p>
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                                        {currentOption.examples.map((example, i) => (
                                            <p key={i} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-gray-400 flex-shrink-0">-</span>
                                                <span className="break-words">{example}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Guide */}
                            {currentOption.action_guide && currentOption.action_guide.length > 0 && (
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">แนวทางปฏิบัติ</p>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 space-y-2">
                                        {currentOption.action_guide.map((guide, i) => (
                                            <p key={i} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-orange-400 flex-shrink-0">•</span>
                                                <span className="break-words">{guide}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Legal Reference Box - แสดงเฉพาะเมื่อ field มีอยู่และไม่ว่าง */}
                            {'legal_reference' in currentOption && currentOption.legal_reference?.trim() && (
                                <div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">⚖️</span>
                                            <p className="text-xs sm:text-sm font-medium text-blue-800">อ้างอิงกฎหมาย</p>
                                        </div>
                                        <p className="text-xs sm:text-sm text-blue-700 break-words leading-relaxed">
                                            {currentOption.legal_reference}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Modal for Admin/Researcher */}
            <FeedbackModal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                onSubmit={handleFeedbackSubmit}
                feedbackKey={pendingFeedback.feedbackKey}
                ratingType={pendingFeedback.ratingType}
                initialValues={getModalInitialValues(pendingFeedback.feedbackKey)}
            />
        </>
    );
}

export default ResultFull;

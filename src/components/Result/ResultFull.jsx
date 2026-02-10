import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ResultFull({ 
    description, 
    structuredOutput, 
    onCopy, 
    onSurveyComplete, 
    allowNavigation = true,
    onFeedbackChange // New prop to send feedback data to parent
}) {
    const { backendUser, isAdmin } = useAuth();
    const [showToast, setShowToast] = useState(false);
    const [activeOptionTab, setActiveOptionTab] = useState(0);
    
    // Feedback state for each option
    const [ratings, setRatings] = useState({});
    const [explanations, setExplanations] = useState({});

    const isAdminOrResearcher = isAdmin || backendUser?.role === "researcher";

    // Debug logging
    console.log('=== ResultFull Debug ===');
    console.log('structuredOutput:', structuredOutput);
    console.log('decisionMaking:', structuredOutput?.decisionMaking);
    console.log('options:', structuredOutput?.decisionMaking?.options);
    console.log('description:', description?.substring?.(0, 100) || description);
    console.log('========================');

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
                console.error('Failed to copy:', err);
            }
            document.body.removeChild(textArea);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        if (allowNavigation && onCopy) {
            onCopy();
        }
    };

    const handleRatingChange = (optionIndex, value) => {
        const newRatings = {
            ...ratings,
            [optionIndex]: ratings[optionIndex] === value ? null : value
        };
        setRatings(newRatings);
        
        // Notify parent component
        if (onFeedbackChange) {
            onFeedbackChange({
                ratings: newRatings,
                explanations: isAdminOrResearcher ? explanations : null
            });
        }
    };

    const handleExplanationChange = (optionIndex, fieldIndex, value) => {
        const newExplanations = {
            ...explanations,
            [optionIndex]: {
                ...(explanations[optionIndex] || {}),
                [fieldIndex]: value
            }
        };
        setExplanations(newExplanations);
        
        // Notify parent component
        if (onFeedbackChange) {
            onFeedbackChange({
                ratings: ratings,
                explanations: isAdminOrResearcher ? newExplanations : null
            });
        }
    };

    const options = structuredOutput?.decisionMaking?.options
        || structuredOutput?.options
        || [];

    if (!structuredOutput || !options.length) {
        return (
            <div className="w-full max-w-[500px] px-4">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {description || "ไม่มีข้อมูล"}
                </div>
            </div>
        );
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
                
                <div className="bg-white items-center flex flex-col justify-center p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4"> 
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

                            {currentOption.recommendation && (
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">ข้อความที่แนะนำ</p>

                                <div className="bg-gray-100 rounded-lg p-3 sm:p-4 relative">

                                <p
                                    className="text-xs sm:text-sm text-gray-800 [&_b]:font-bold text-start pr-6 sm:pr-8 break-words leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                    __html: currentOption.recommendation
                                    .replace(/\r\n|\r|\n/g, "<br/>")    
                                    .replace(/\\n/g, "<br/>")      
                                    }}
                                />

                                 <button
                                    onClick={() =>
                                    handleCopy(
                                        currentOption.recommendation
                                        .replace(/<[^>]*>/g, "")    
                                        .replace(/\\n/g, "\n")     
                                    )
                                    }
                                    className="absolute bottom-2 right-2 p-1 sm:p-1.5 bg-white hover:bg-gray-200 rounded text-xs gap-1 justify-center items-center flex transition-colors"
                                    title="คัดลอก"
                                >
                                    <img src="/icon/copy.svg" alt="Copy" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">คัดลอก</span>
                                </button>

                                </div>
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
                        </div>
                    )}

                    {/* Like/Dislike Feedback Section */}
                    <div className="w-full border-t pt-4 space-y-3">
                        <p className="text-xs sm:text-sm text-gray-600 text-center font-medium">
                            คุณคิดอย่างไรกับข้อแนะนำที่ {activeOptionTab + 1}?
                        </p>
                        
                        {/* Rating buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRatingChange(activeOptionTab, "like")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                                    ratings[activeOptionTab] === "like"
                                        ? "border-primary bg-primary/10"
                                        : "border-gray-200 hover:border-primary/50 bg-white"
                                }`}
                            >
                                <span>👍</span>
                                <span>ชอบ</span>
                            </button>

                            <button
                                onClick={() => handleRatingChange(activeOptionTab, "improve")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                                    ratings[activeOptionTab] === "improve"
                                        ? "border-yellow-500 bg-yellow-50"
                                        : "border-gray-200 hover:border-yellow-300 bg-white"
                                }`}
                            >
                                <span>💡</span>
                                <span>อยากให้ปรับปรุง</span>
                            </button>
                        </div>

                        {/* Admin/Researcher text boxes */}
                        {isAdminOrResearcher && (
                            <div className="space-y-2 pt-2">
                                <p className="text-xs text-gray-600 font-medium">
                                    บันทึกสำหรับผู้วิจัย
                                </p>
                                {[1, 2, 3].map((fieldNum) => (
                                    <div key={fieldNum}>
                                        <label className="text-xs text-gray-500 mb-1 block">
                                            หมายเหตุ {fieldNum}
                                        </label>
                                        <textarea
                                            value={explanations[activeOptionTab]?.[fieldNum] || ''}
                                            onChange={(e) => handleExplanationChange(activeOptionTab, fieldNum, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                                            rows="2"
                                            placeholder={`บันทึกหมายเหตุที่ ${fieldNum}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResultFull;
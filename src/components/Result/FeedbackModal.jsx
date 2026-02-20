import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function FeedbackModal({
    isOpen,
    onClose,
    onSubmit,
    feedbackKey, // format: "optionIndex-questionIndex" e.g. "0-0", "0-1"
    ratingType, // "like" or "improve"
    initialValues = {}
}) {
    // Parse feedbackKey to get display info
    const [optionIdx, questionIdx] = (feedbackKey || "0-0").split("-").map(Number);
    const [answers, setAnswers] = useState({
        reason: "",
        example: "",
        explanation: ""
    });

    // Reset form when modal opens with new data
    useEffect(() => {
        if (isOpen) {
            setAnswers({
                reason: initialValues.reason || "",
                example: initialValues.example || "",
                explanation: initialValues.explanation || ""
            });
        }
    }, [isOpen, initialValues]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(feedbackKey, ratingType, answers);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    const ratingLabel = ratingType === "like" ? "ชอบ" : "อยากให้ปรับปรุง";
    const ratingEmoji = ratingType === "like" ? "👍" : "💡";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{ratingEmoji}</span>
                            <h3 className="font-semibold text-gray-800">
                                บันทึกสำหรับข้อแนะนำที่ {optionIdx + 1} - คำถามที่ {questionIdx + 1}
                            </h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Selected Rating Display */}
                    <div className="px-4 pt-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                            ratingType === "like"
                                ? "bg-primary/10 text-primary border border-primary"
                                : "bg-yellow-50 text-yellow-700 border border-yellow-500"
                        }`}>
                            <span>{ratingEmoji}</span>
                            <span>{ratingLabel}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-4 space-y-4">
                        {/* Question 1 */}
                        <div>
                            <label className="text-sm text-gray-700 font-medium mb-2 block">
                                1. สาเหตุที่{ratingType === "like" ? "ชอบ" : "อยากให้ปรับปรุง"}
                            </label>
                            <textarea
                                value={answers.reason}
                                onChange={(e) => setAnswers({ ...answers, reason: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                                rows="3"
                                placeholder="เขียนสาเหตุ..."
                            />
                        </div>

                        {/* Question 2 */}
                        <div>
                            <label className="text-sm text-gray-700 font-medium mb-2 block">
                                2. ตัวอย่างการปรับปรุง
                            </label>
                            <textarea
                                value={answers.example}
                                onChange={(e) => setAnswers({ ...answers, example: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                                rows="3"
                                placeholder="เขียนตัวอย่าง..."
                            />
                        </div>

                        {/* Question 3 */}
                        <div>
                            <label className="text-sm text-gray-700 font-medium mb-2 block">
                                3. เหตุผลอธิบายตัวอย่าง
                            </label>
                            <textarea
                                value={answers.explanation}
                                onChange={(e) => setAnswers({ ...answers, explanation: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                                rows="3"
                                placeholder="เขียนเหตุผล..."
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FeedbackModal;

import React, { useState } from "react";
import Button from "../Button";

export default function ResultSummary({description}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(description);

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(editedText);
    };

    const renderMarkdown = (text) => {
        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="font-bold text-base mt-3 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="font-bold text-lg mt-3 mb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="font-bold text-xl mt-3 mb-2">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline" target="_blank" rel="noopener noreferrer">$1</a>')
            // Line breaks
            .replace(/\n/g, '<br/>');
        
        return html;
    };

    return (
        <div className="flex flex-col min-w-[376px] min-h-[586px] max-h-[598px] max-w-[648px] gap-2">
            <div className="flex gap-4 flex-1 overflow-hidden">
                <img src="src/assets/icon/result.svg" className="w-11 h-11 flex-shrink-0"/>
                <div className="flex flex-col flex-1 min-h-0">
                    <p className="mb-1 font-bold text-sm flex-shrink-0"> ผลลัพธ์จากการประมวลผล </p>
                    {isEditing ? (
                        <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="flex-1 text-xs max-w-lg p-2 mb-2 border border-button/20 rounded-md resize-none focus:outline-none focus:border-accent overflow-y-auto"
                        />
                    ) : (
                        <div 
                            className="flex-1 text-xs max-w-lg mb-2 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(editedText) }}
                        />
                    )}
                </div>
            </div>
            
            <div className="flex gap-3 justify-end items-center flex-shrink-0">
                {isEditing ? (
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 text-sm px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
                    >
                        บันทึก
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm px-4 py-2 hover:bg-button/10 rounded transition-colors"
                    >
                        <img
                            src="/src/assets/icon/edit.svg"
                            alt="Edit"
                            className="w-4 h-4"
                        />
                        แก้ไข
                    </button>
                )}
                
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm px-4 py-2 hover:bg-button/10 rounded transition-colors"
                >
                    <img
                        src="/src/assets/icon/copy.svg"
                        alt="Copy"
                        className="w-4 h-4"
                    />
                    คัดลอก
                </button>
            </div>
        </div>
    );
}
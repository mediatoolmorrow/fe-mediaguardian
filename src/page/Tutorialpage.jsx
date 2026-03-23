import React from "react";
import { useNavigate } from "react-router-dom";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/RRBNQawOQHs";

const slide = {
    title: "เกี่ยวกับแพลตฟอร์ม",
    description: "แพลตฟอร์มที่นำเทคโนโลยี Agentic AI เข้ามาช่วยเปลี่ยนความกังวลเป็นคำพูดสร้างสรรค์ โดยผ่านการเทรนจากผู้เชี่ยวชาญ ซึ่งเครื่องมือ AI นี้ ทำหน้าที่เป็น \"ผู้ช่วยส่วนตัว\" ช่วยวิเคราะห์สื่อที่ไม่เหมาะสม ใน 7 ประเด็นปัญหา ดังนี้",
    listItems: [
        "เนื้อหาที่ไม่เหมาะสมด้านภาษา",
        "เนื้อหาที่ไม่เหมาะสมด้านเพศ",
        "เนื้อหาที่ไม่เหมาะสมด้านความรุนแรง",
        "เนื้อหาที่ไม่เหมาะสมด้านความคิด ความเชื่อ",
        "เนื้อหาที่เกี่ยวกับอาชญากรรมทางเทคโนโลยี ฉ้อโกง หลอกลวง",
        "เนื้อหาที่เกี่ยวกับพนันออนไลน์",
        "เนื้อหาที่เกี่ยวกับการกลั่นแกล้งทางไซเบอร์"
    ],
    continuation: "อีกทั้ง ช่วย \"ร่างข้อความแสดงความคิดเห็น และแนวทางคำถามชวนคิด ชวนคุย\" ให้ผู้ใช้งานนำไปใช้คุยกับลูก คุยกับคนในครอบครัว คุยกับเพื่อนที่ทำงาน และคุยกับคนบนโลกออนไลน์ได้อย่างมั่นใจ เพื่อลดความขัดแย้ง และช่วยสร้างสังคมออนไลน์ที่ปลอดภัยมากยิ่งขึ้น ซึ่งผลลัพธ์ที่ได้จากการประมวลผลควรใช้วิจารณญาณในการนำไปปรับใช้",
};

function Tutorialpage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center w-full h-screen p-4 pt-10 sm:pt-4">

            {/* YouTube embed */}
            <div className="flex-shrink-0 w-full max-w-3xl">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                        src={YOUTUBE_EMBED_URL}
                        title={slide.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl"
                    />
                </div>
            </div>

            {/* Text — only this section scrolls */}
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mt-4 px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [-webkit-overflow-scrolling:touch]">
                <div className="text-left pb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
                        {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        {slide.description}
                    </p>
                    <ul className="text-sm sm:text-base text-gray-600 list-disc list-inside mt-2 space-y-1">
                        {slide.listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    <p className="text-sm sm:text-base text-gray-600 mt-3">
                        {slide.continuation}
                    </p>
                </div>
            </div>

            {/* Button */}
            <div className="flex-shrink-0 flex w-full items-center justify-center py-4">
                <button
                    onClick={() => navigate("/agentic")}
                    className="btn-normal-active"
                >
                    ไปต่อ
                </button>
            </div>
        </div>
    );
}

export default Tutorialpage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChoiceBox from "../components/Survey/ChoiceBox";

function Tutorialpage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            imageDesktop: "/banner/Agentic_Desktop_Size.webp",
            imageMobile: "/banner/Agentic_Mobile_Size.webp",
            title: "เกี่ยวกับแพลตฟอร์ม",
            description: "แพลตฟอร์มที่นำเทคโนโลยี Agentic AI เข้ามาช่วยเปลี่ยนความกังวลเป็นคำพูดสร้างสรรค์ โดยผ่านการเทรนจากผู้เชี่ยวชาญ ซึ่งเครื่องมือ AI นี้ทำหน้าที่เป็น \"ผู้ช่วยส่วนตัว\" ช่วยวิเคราะห์สื่อที่ไม่เหมาะสม ใน 7 ประเด็นปัญหา ดังนี้",
            listItems: [
                "เนื้อหาที่ไม่เหมาะสมด้านภาษา",
                "เนื้อหาที่ไม่เหมาะสมด้านเพศ",
                "เนื้อหาที่ไม่เหมาะสมด้านความรุนแรง",
                "เนื้อหาที่ไม่เหมาะสมด้านความคิด ความเชื่อ",
                "เนื้อหาที่เกี่ยวกับอาชญากรรมทางเทคโนโลยี ฉ้อโกง หลอกลวง",
                "เนื้อหาที่เกี่ยวกับพนันออนไลน์",
                "เนื้อหาที่เกี่ยวกับการกลั่นแกล้งทางไซเบอร์"
            ],
            continuation: "และช่วย \"ร่างข้อความแสดงความคิดเห็น และแนวทางคำถามชวนคิดชวนคุย\" ให้ผู้ใช้งานนำไปใช้คุยกับลูก คุยกับคนในครอบครัว คุยกับเพื่อนที่ทำงาน และคุยกับคนบนโลกออนไลน์ได้อย่างมั่นใจ เพื่อลดความขัดแย้ง และช่วยสร้างสังคมออนไลน์ที่ปลอดภัย",
            footer: "ข้อจำกัดในการใช้งาน แพลตฟอร์มรองรับการใส่ข้อความ รูปภาพ และลิงก์คอนเทนต์ โดยลิงก์ที่ป้อนเข้ามา จะต้องมีความยาวไม่เกิน 3 นาที มีเสียงพูดชัดเจน และควรเป็นคลิปที่ตั้งเป็นสาธารณะ สามารถแชร์ต่อได้โดยไม่ผิดกฎของแพลตฟอร์มนั้น ๆ ซึ่งผลลัพธ์ที่ได้จากการประมวลผลควรใช้วิจารณญาณในการนำไปปรับใช้"
        },
    ];
    
    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };
    
    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    };
    
    const isLastSlide = currentSlide === slides.length - 1;
    const isFirstSlide = currentSlide === 0;
    
    return (
        <div className="flex flex-col items-center w-full h-screen p-4 pt-10 sm:pt-4">

            {/* Image — fixed, never scrolls */}
            <div className="flex-shrink-0 relative max-w-3xl w-full">
                <img
                    src={slides[currentSlide].imageDesktop}
                    alt={slides[currentSlide].title}
                    className="hidden sm:block w-full h-auto rounded-2xl shadow-2xl"
                />
                <img
                    src={slides[currentSlide].imageMobile}
                    alt={slides[currentSlide].title}
                    className="block sm:hidden w-full max-h-44 object-cover rounded-2xl shadow-2xl"
                />
                <a
                    href=""
                    target=""
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-primary text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg shadow-md transition-all underline"
                >
                    ดูวิดีโอแทน
                </a>
                {!isFirstSlide && (
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                    </button>
                )}
                {!isLastSlide && (
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                    </button>
                )}
            </div>

            {/* Dots — fixed, never scrolls */}
            <div className="flex-shrink-0 flex gap-2 mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide
                                ? 'bg-primary w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>

            {/* Text — only this section scrolls */}
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mt-4 px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [-webkit-overflow-scrolling:touch]">
                <div className="text-center pb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                        {slides[currentSlide].title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        {slides[currentSlide].description}
                    </p>
                    {slides[currentSlide].listItems && (
                        <ul className="text-sm sm:text-base text-gray-600 text-left list-disc list-inside mt-2 space-y-1">
                            {slides[currentSlide].listItems.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    )}
                    {slides[currentSlide].continuation && (
                        <p className="text-sm sm:text-base text-gray-600 mt-3">
                            {slides[currentSlide].continuation}
                        </p>
                    )}
                    {slides[currentSlide].footer && (
                        <p className="text-sm sm:text-base text-gray-500 mt-3">
                            {slides[currentSlide].footer}
                        </p>
                    )}
                </div>
            </div>

            {/* Button — fixed, never scrolls */}
            <div className="flex-shrink-0 flex w-full items-center justify-center py-4">
                <button
                    onClick={() => navigate("/agentic")}
                    disabled={!isLastSlide}
                    className={isLastSlide ? "btn-normal-active" : "btn-normal-inactive"}
                >
                    ไปต่อ
                </button>
            </div>
        </div>
    );
}

export default Tutorialpage;
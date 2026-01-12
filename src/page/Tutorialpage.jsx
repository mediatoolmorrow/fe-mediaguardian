import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Tutorialpage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            image: "https://placehold.co/1200x800/24A9C4/FFFFFF/png?text=Slide+1",
            title: "เริ่มต้นใช้งาน",
            description: "วิธีการใช้งานในการเลือกหน้า Prompt ตัวอย่าง"
        },
        {
            image: "https://placehold.co/1200x800/24A9C4/FFFFFF/png?text=Slide+2",
            title: "สำรวจฟีเจอร์",
            description: "ตัวอย่างข้อความ วิธีการอัพโหลดภาพ และลิงก์"
        },
        {
            image: "https://placehold.co/1200x800/24A9C4/FFFFFF/png?text=Slide+3",
            title: "สื่อสาร",
            description: "ตัวอย่างข้อความ ผลที่ได้จาก AI นำไปใช้ได้อย่างง่าย ๆ"
        }
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
        <div className="flex flex-col items-center justify-center w-full max-h-screen overflow-hidden p-4 sm:p-8">
            <div className="flex flex-col items-center justify-between w-full h-full max-w-6xl">
                <div className="flex-1 w-full flex flex-col items-center justify-center relative">
                    
                    <div className="relative w-full max-w-xl">
                        <img 
                            src={slides[currentSlide].image} 
                            alt={slides[currentSlide].title}
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                        
                        {/* YouTube link - top right */}
                        <a 
                            href="YOUR_YOUTUBE_URL_HERE" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg shadow-md transition-all underline"
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
                    
                    <div className="flex gap-2 mt-6">
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
                    
                    <div className="w-full max-w-4xl text-center mt-4 px-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </div>
                
                <div className="flex w-full items-center justify-center pt-6 pb-4">
                    <button 
                        onClick={() => navigate("/agentic")} 
                        disabled={!isLastSlide}
                        className={isLastSlide ? "btn-normal-active" : "btn-normal-inactive"}
                    >
                        ไปต่อ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Tutorialpage;
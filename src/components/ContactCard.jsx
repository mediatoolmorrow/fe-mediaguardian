import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Globe, Facebook } from "lucide-react";

export default function ContactCard({
  imageSource,
  title,
  description,
  tel,
  link,
  email,
  facebook,
  line,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full
        max-w-[655px]
        bg-white
        flex
        items-start
        gap-4
        sm:gap-6
        rounded-md
        p-4
        sm:p-6
        text-left
        shadow-lg
        hover:shadow-xl
        transition
      "
    >
      <div>
        <img
          src={imageSource}
          alt={title}
          className="w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] flex-shrink-0 rounded-full"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-text font-bold text-sm sm:text-base mb-2 sm:mb-3 max-w-xs leading-snug">
          {title}
        </h3>
        
        <p className="text-text/70 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          {tel && (
            <a 
              href={`tel:${tel}`}
              className="flex items-center gap-1 text-text/70 hover:text-primary transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" />
              <span>{tel}</span>
            </a>
          )}
          
          {link && (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-text/70 hover:text-primary transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
          
          {facebook && (
            <a 
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-text/70 hover:text-primary transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          )}
          
          {line && (
            <a 
              href={line}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-text/70 hover:text-primary transition"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              <span>Line</span>
            </a>
          )}
          
          {email && (
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${email.replace('mailto:', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-text/70 hover:text-primary transition"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email</span>
            </a>
          )}
        </div>
      </div>

      <div className="hidden sm:block w-20 flex-shrink-0"></div>
    </div>
  );
}
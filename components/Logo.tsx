"use client"

import React from 'react';

interface LogoProps {
  isDarkMode?: boolean;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ isDarkMode = false, size = 32 }) => {
  // Цвета для светлой и темной темы
  const primaryColor = isDarkMode ? "#A855F7" : "#8B5CF6";
  const secondaryColor = isDarkMode ? "#C084FC" : "#A78BFA";
  const tertiaryColor = isDarkMode ? "#E9D5FF" : "#DDD6FE";
  const bgColor = isDarkMode ? "#1F2937" : "#F9FAFB";
  
  return (
    <div className="flex items-center">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        {/* Фон */}
        <rect width="64" height="64" rx="12" fill={bgColor} />
        
        {/* Волнистые линии */}
        <path d="M8 32C8 32 16 20 32 20C48 20 56 32 56 32" stroke={tertiaryColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M8 42C8 42 16 30 32 30C48 30 56 42 56 42" stroke={secondaryColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M8 52C8 52 16 40 32 40C48 40 56 52 56 52" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
      </svg>
      
      <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        PlainDesk
      </span>
    </div>
  );
};

export default Logo; 
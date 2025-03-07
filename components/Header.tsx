"use client"

import { useState, useEffect } from 'react'
import { Sun, Moon, Plus, Settings } from 'lucide-react'
import Logo from './Logo'

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onThemeToggle }) => {
  return (
    <header 
      className={`h-16 ${
        isDarkMode 
          ? 'bg-gray-800 text-white border-gray-700' 
          : 'bg-white text-gray-900 border-gray-200'
      } shadow-sm flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10 transition-colors duration-200 border-b`}
    >
      {/* Логотип и название */}
      <div className="flex items-center">
        <Logo isDarkMode={isDarkMode} />
      </div>
      
      {/* Правая часть с кнопками */}
      <div className="flex items-center space-x-3">
        {/* Кнопка настроек */}
        <button 
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Настройки"
        >
          <Settings size={18} />
        </button>
        
        {/* Кнопка переключения темы */}
        <button 
          onClick={onThemeToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* Разделитель */}
        <div className={`h-8 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        
        {/* Кнопка профиля */}
        <button 
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-purple-700 text-white hover:bg-purple-600' 
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          }`}
          aria-label="Профиль пользователя"
        >
          <span className="font-medium text-sm">ДХ</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 
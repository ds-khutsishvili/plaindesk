"use client"

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Header from '@/components/Header';
import Board from '@/components/Board';
import { storageService } from '@/services/StorageService';

export default function Home() {
  // Состояние для отслеживания темной темы
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Эффект для определения предпочтений пользователя при загрузке
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Проверяем сохраненные настройки в localStorage
        const userSettings = await storageService.get<{ theme: string }>('user');
        
        if (userSettings && userSettings.theme) {
          // Если есть сохраненные настройки, используем их
          setIsDarkMode(userSettings.theme === 'dark');
        } else {
          // Иначе проверяем системные предпочтения
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
          
          // Сохраняем предпочтения пользователя
          await storageService.set('user', { theme: prefersDark ? 'dark' : 'light' });
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        
        // В случае ошибки используем системные предпочтения
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };
    
    loadTheme();
  }, []);
  
  // Функция для переключения темы
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      // Сохраняем выбор пользователя в localStorage
      await storageService.set('user', { theme: newTheme ? 'dark' : 'light' });
      
      // Обновляем класс на документе для глобальных стилей
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Применяем класс dark к документу при изменении isDarkMode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // Темный фон
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F9FAFB'; // Светлый фон
    }
    
    // Предотвращаем прокрутку страницы
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDarkMode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <main className={`h-screen flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Header isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
        <div className="flex-1 pt-16 relative">
          <Board isDarkMode={isDarkMode} />
        </div>
      </main>
    </DndProvider>
  );
} 
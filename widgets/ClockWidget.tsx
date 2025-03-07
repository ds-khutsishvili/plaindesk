"use client"

/**
 * Виджет часов
 * 
 * Виджет для отображения текущего времени и даты.
 * Автоматически обновляется каждую секунду.
 */

import { useState, useEffect, useCallback } from 'react';
import type { WidgetManifest } from '@/types/Widget';
import { WidgetProps } from './widget-template';

/**
 * Манифест виджета часов
 * Определяет метаданные и ограничения для виджета часов
 */
export const CLOCK_WIDGET_MANIFEST: WidgetManifest = {
  id: 'clock',
  name: 'Часы',
  description: 'Виджет для отображения текущего времени и даты',
  minSize: { width: 100, height: 100 },
  maxSize: { width: 300, height: 300 },
  defaultSize: { width: 200, height: 200 },
  supportsDarkMode: true
};

/**
 * Интерфейс для настроек виджета часов
 */
interface ClockSettings {
  showSeconds?: boolean;
  showDate?: boolean;
  format24h?: boolean;
}

/**
 * Компонент виджета часов
 */
const ClockWidget: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  isDarkMode = false,
}) => {
  // Состояние для хранения текущего времени
  const [time, setTime] = useState(new Date());
  
  // Получаем настройки виджета или используем значения по умолчанию
  const settings: ClockSettings = widget.settings || {
    showSeconds: true,
    showDate: true,
    format24h: true
  };

  // Установка минимального и максимального размера при первом рендеринге
  useEffect(() => {
    if (updateWidget) {
      // Если нет минимального или максимального размера, устанавливаем их
      if (!widget.minSize || !widget.maxSize) {
        updateWidget({
          ...widget,
          minSize: CLOCK_WIDGET_MANIFEST.minSize,
          maxSize: CLOCK_WIDGET_MANIFEST.maxSize,
          lastUpdated: Date.now()
        });
      }
      
      // Если нет настроек, устанавливаем настройки по умолчанию
      if (!widget.settings) {
        updateWidget({
          ...widget,
          settings: {
            showSeconds: true,
            showDate: true,
            format24h: true
          },
          lastUpdated: Date.now()
        });
      }
    }
  }, [widget, updateWidget]);

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Очистка интервала при размонтировании компонента
    return () => {
      clearInterval(timer);
    };
  }, []);

  /**
   * Обработчик изменения настроек
   */
  const handleSettingsChange = useCallback((newSettings: Partial<ClockSettings>) => {
    if (updateWidget) {
      updateWidget({
        ...widget,
        settings: {
          ...settings,
          ...newSettings
        },
        lastUpdated: Date.now()
      });
    }
  }, [widget, settings, updateWidget]);

  // Форматирование времени в зависимости от настроек
  const formatTime = useCallback((date: Date): string => {
    const hours = settings.format24h 
      ? date.getHours() 
      : (date.getHours() % 12 || 12);
    
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    return settings.showSeconds
      ? `${hours}:${minutes}:${seconds}${!settings.format24h ? ` ${ampm}` : ''}`
      : `${hours}:${minutes}${!settings.format24h ? ` ${ampm}` : ''}`;
  }, [settings]);

  // Форматирование даты
  const formattedTime = formatTime(time);
  const formattedDate = time.toLocaleDateString();

  return (
    <div className="p-4 flex flex-col h-full items-center justify-center">
      {/* Заголовок виджета */}
      {widget.title && (
        <div className={`text-lg font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {widget.title}
        </div>
      )}
      
      {/* Отображение времени */}
      <div className={`text-4xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {formattedTime}
      </div>
      
      {/* Отображение даты (если включено в настройках) */}
      {settings.showDate && (
        <div className={`text-sm mt-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default ClockWidget; 
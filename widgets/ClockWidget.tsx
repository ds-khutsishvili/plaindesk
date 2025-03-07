"use client"

/**
 * Виджет часов
 * 
 * Виджет для отображения текущего времени и даты.
 * Автоматически обновляется каждую секунду.
 */

import { useState, useEffect } from 'react';
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
  defaultSize: { width: 200, height: 200 }
};

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

  // Установка минимального и максимального размера при первом рендеринге
  useEffect(() => {
    if (updateWidget && (!widget.minSize || !widget.maxSize)) {
      updateWidget({
        ...widget,
        minSize: CLOCK_WIDGET_MANIFEST.minSize,
        maxSize: CLOCK_WIDGET_MANIFEST.maxSize
      });
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

  // Форматирование времени и даты
  const formattedTime = time.toLocaleTimeString();
  const formattedDate = time.toLocaleDateString();

  return (
    <div className="p-4 flex flex-col h-full items-center justify-center">
      {/* Заголовок виджета */}
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      
      {/* Отображение времени */}
      <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {formattedTime}
      </div>
      
      {/* Отображение даты */}
      <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {formattedDate}
      </div>
    </div>
  );
};

export default ClockWidget; 
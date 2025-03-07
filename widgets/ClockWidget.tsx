"use client"

import { useState, useEffect } from 'react';
import type { Widget } from '@/types/Widget';

interface ClockWidgetProps {
  widget: Widget;
  updateWidget?: (widget: Widget) => void;
  removeWidget?: (id: number) => void;
  isDarkMode?: boolean;
}

// Определяем минимальный и максимальный размер для виджета часов
export const CLOCK_WIDGET_MIN_SIZE = { width: 100, height: 100 };
export const CLOCK_WIDGET_MAX_SIZE = { width: 300, height: 300 };

const ClockWidget: React.FC<ClockWidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  const [time, setTime] = useState(new Date());

  // При первом рендеринге устанавливаем минимальный и максимальный размер
  useEffect(() => {
    if (updateWidget && (!widget.minSize || !widget.maxSize)) {
      updateWidget({
        ...widget,
        minSize: CLOCK_WIDGET_MIN_SIZE,
        maxSize: CLOCK_WIDGET_MAX_SIZE
      });
    }
  }, [widget, updateWidget]);

  // Обновляем время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Форматируем время
  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="p-4 flex flex-col h-full items-center justify-center">
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {formattedTime}
      </div>
      <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {time.toLocaleDateString()}
      </div>
    </div>
  );
};

export default ClockWidget; 
"use client"

import { useState } from 'react';
import type { Widget } from '@/types/Widget';

export interface WidgetProps {
  widget: Widget;
  updateWidget?: (widget: Widget) => void;
  removeWidget?: (id: number) => void;
  isDarkMode?: boolean;
}

// Константы для определения минимального и максимального размера
// Каждый виджет должен переопределить эти значения
export const DEFAULT_MIN_SIZE = { width: 100, height: 80 };
export const DEFAULT_MAX_SIZE = { width: 800, height: 600 };

const WidgetTemplate: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  const [settings, setSettings] = useState(widget.settings || {});

  // Получаем минимальный и максимальный размер виджета
  // Если они не определены в виджете, используем значения из статических свойств
  const minSize = widget.minSize || DEFAULT_MIN_SIZE;
  const maxSize = widget.maxSize || DEFAULT_MAX_SIZE;

  // Обработчик изменения настроек
  const handleSettingsChange = (newSettings: Record<string, any>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (updateWidget) {
      updateWidget({
        ...widget,
        settings: updatedSettings
      });
    }
  };

  // Обработчик удаления виджета
  const handleRemove = () => {
    if (removeWidget) {
      removeWidget(widget.id);
    }
  };

  // При первом рендеринге устанавливаем минимальный и максимальный размер
  // если они еще не установлены
  useState(() => {
    if (!widget.minSize && updateWidget) {
      updateWidget({
        ...widget,
        minSize: DEFAULT_MIN_SIZE,
        maxSize: DEFAULT_MAX_SIZE
      });
    }
  });

  return (
    <div
      className={`rounded-lg shadow-sm flex flex-col p-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
      style={{
        width: `${widget.size.width}px`,
        height: `${widget.size.height}px`,
        minWidth: `${minSize.width}px`,
        minHeight: `${minSize.height}px`,
        maxWidth: `${maxSize.width}px`,
        maxHeight: `${maxSize.height}px`,
      }}
    >
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      <div className="flex-1">
        {/* Placeholder для контента виджета */}
        <div className="h-full flex items-center justify-center text-gray-400">
          Контент виджета
        </div>
      </div>
    </div>
  );
};

export default WidgetTemplate; 
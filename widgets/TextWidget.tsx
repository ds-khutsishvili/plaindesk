"use client"

import { useState, useEffect } from 'react';
import type { Widget } from '@/types/Widget';
import { DEFAULT_MIN_SIZE, DEFAULT_MAX_SIZE } from './widget-template';

interface TextWidgetProps {
  widget: Widget;
  updateWidget?: (widget: Widget) => void;
  removeWidget?: (id: number) => void;
  isDarkMode?: boolean;
}

// Определяем минимальный и максимальный размер для текстового виджета
export const TEXT_WIDGET_MIN_SIZE = { width: 400, height: 200 };
export const TEXT_WIDGET_MAX_SIZE = { width: 600, height: 400 };

const TextWidget: React.FC<TextWidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  const [text, setText] = useState(widget.content?.text || 'Текстовый виджет');
  const [isEditing, setIsEditing] = useState(false);

  // При первом рендеринге устанавливаем минимальный и максимальный размер
  useEffect(() => {
    if (updateWidget && (!widget.minSize || !widget.maxSize)) {
      updateWidget({
        ...widget,
        minSize: TEXT_WIDGET_MIN_SIZE,
        maxSize: TEXT_WIDGET_MAX_SIZE
      });
    }
  }, [widget, updateWidget]);

  // Обработчик изменения текста
  const handleTextChange = (newText: string) => {
    setText(newText);
    
    if (updateWidget) {
      updateWidget({
        ...widget,
        content: { ...widget.content, text: newText }
      });
    }
  };

  // Обработчик удаления виджета
  const handleRemove = () => {
    if (removeWidget) {
      removeWidget(widget.id);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            className={`w-full h-full p-2 rounded-md resize-none ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
            }`}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <div 
            className="h-full cursor-text whitespace-pre-wrap"
            onClick={() => setIsEditing(true)}
          >
            {text || 'Нажмите, чтобы добавить текст'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWidget; 
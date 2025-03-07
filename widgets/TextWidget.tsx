"use client"

/**
 * Текстовый виджет
 * 
 * Виджет для отображения и редактирования текста.
 * Позволяет пользователю вводить и сохранять текстовую информацию.
 */

import { useState, useEffect, useCallback } from 'react';
import type { WidgetManifest } from '@/types/Widget';
import { WidgetProps } from './widget-template';

/**
 * Манифест текстового виджета
 * Определяет метаданные и ограничения для текстового виджета
 */
export const TEXT_WIDGET_MANIFEST: WidgetManifest = {
  id: 'text',
  name: 'Текстовый виджет',
  description: 'Виджет для отображения и редактирования текста',
  minSize: { width: 120, height: 100 },
  maxSize: { width: 600, height: 400 },
  defaultSize: { width: 240, height: 160 },
  supportsDarkMode: true
};

/**
 * Компонент текстового виджета
 */
const TextWidget: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  // Состояние текста и режима редактирования
  const [text, setText] = useState(widget.content?.text || 'Текстовый виджет');
  const [isEditing, setIsEditing] = useState(false);

  // Установка минимального и максимального размера при первом рендеринге
  useEffect(() => {
    if (updateWidget && (!widget.minSize || !widget.maxSize)) {
      updateWidget({
        ...widget,
        minSize: TEXT_WIDGET_MANIFEST.minSize,
        maxSize: TEXT_WIDGET_MANIFEST.maxSize,
        lastUpdated: Date.now()
      });
    }
  }, [widget, updateWidget]);

  // Загрузка текста из содержимого виджета при монтировании
  useEffect(() => {
    if (widget.content?.text) {
      setText(widget.content.text);
    }
  }, [widget.content?.text]);

  /**
   * Обработчик изменения текста
   * Обновляет локальное состояние и вызывает функцию обновления виджета
   */
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    
    if (updateWidget) {
      updateWidget({
        ...widget,
        content: { ...widget.content, text: newText },
        lastUpdated: Date.now()
      });
    }
  }, [widget, updateWidget]);

  /**
   * Обработчик начала редактирования
   */
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  /**
   * Обработчик окончания редактирования
   */
  const handleEndEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Обработчик удаления виджета
  const handleRemove = () => {
    if (removeWidget) {
      removeWidget(widget.id);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Заголовок виджета */}
      {widget.title && (
        <div className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{widget.title}</div>
      )}
      
      {/* Содержимое виджета */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          // Режим редактирования
          <textarea
            className={`w-full h-full p-2 rounded-md resize-none transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
            } border`}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleEndEditing}
            autoFocus
          />
        ) : (
          // Режим просмотра
          <div 
            className={`h-full cursor-text whitespace-pre-wrap transition-colors duration-200 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
            onClick={handleStartEditing}
          >
            {text || 'Нажмите, чтобы добавить текст'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWidget; 
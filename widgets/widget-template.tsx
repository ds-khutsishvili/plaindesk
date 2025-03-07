"use client"

/**
 * Базовый шаблон виджета
 * 
 * Этот файл содержит базовый шаблон, который должны использовать все виджеты.
 * Он определяет общий интерфейс, манифест по умолчанию и базовую функциональность.
 */

import { useState, useEffect } from 'react';
import type { Widget, WidgetManifest } from '@/types/Widget';

/**
 * Интерфейс свойств виджета
 * Все виджеты должны принимать эти свойства
 */
export interface WidgetProps {
  widget: Widget;                              // Данные виджета
  updateWidget?: (widget: Widget) => void;     // Функция для обновления данных виджета
  removeWidget?: (id: number) => void;         // Функция для удаления виджета
  isDarkMode?: boolean;                        // Флаг темного режима
}

/**
 * Манифест виджета по умолчанию
 * Определяет базовые метаданные и ограничения для всех виджетов
 */
export const DEFAULT_WIDGET_MANIFEST: WidgetManifest = {
  id: 'base',
  name: 'Базовый виджет',
  description: 'Базовый шаблон виджета',
  minSize: { width: 100, height: 80 },         // Минимальный размер
  maxSize: { width: 800, height: 600 },        // Максимальный размер
  defaultSize: { width: 240, height: 160 }     // Размер по умолчанию
};

/**
 * Базовый компонент виджета
 * 
 * Служит шаблоном для всех виджетов и предоставляет базовую функциональность.
 * Каждый виджет должен расширять этот шаблон и определять свой собственный манифест.
 */
const WidgetTemplate: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  // Базовое состояние настроек
  const [settings, setSettings] = useState(widget.settings || {});

  // Установка минимального и максимального размера при первом рендеринге
  useEffect(() => {
    if (updateWidget && (!widget.minSize || !widget.maxSize)) {
      updateWidget({
        ...widget,
        minSize: DEFAULT_WIDGET_MANIFEST.minSize,
        maxSize: DEFAULT_WIDGET_MANIFEST.maxSize
      });
    }
  }, [widget, updateWidget]);

  /**
   * Обработчик изменения настроек
   * Обновляет локальное состояние и вызывает функцию обновления виджета
   */
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

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Заголовок виджета */}
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      
      {/* Содержимое виджета */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Это базовый шаблон виджета.
        Создайте свой виджет, расширяя этот шаблон.
      </div>
    </div>
  );
};

export default WidgetTemplate; 
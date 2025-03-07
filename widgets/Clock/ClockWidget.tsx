"use client"

/**
 * Виджет часов
 * 
 * Виджет для отображения текущего времени и даты с поддержкой разных часовых поясов.
 * Автоматически обновляется каждую секунду.
 */

import { useEffect, useCallback } from 'react';
import { WidgetProps } from '../widget-template';
import { useTimezone } from './hooks/useTimezone';
import { TimezoneService } from './services/TimezoneService';
import TimezoneSettings from './components/TimezoneSettings';
import { CLOCK_WIDGET_MANIFEST } from './manifest';

/**
 * Настройки виджета часов
 */
interface ClockSettings {
  showSeconds?: boolean;   // Показывать секунды
  showDate?: boolean;      // Показывать дату
  format24h?: boolean;     // 24-часовой формат
  timezone?: string;       // Часовой пояс
  showTimezone?: boolean;  // Показывать название часового пояса
}

/**
 * Настройки по умолчанию
 */
const defaultSettings: ClockSettings = {
  showSeconds: true,
  showDate: true,
  format24h: true,
  timezone: TimezoneService.getCurrentTimezone(),
  showTimezone: false
};

/**
 * Компонент виджета часов
 */
const ClockWidget: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  isDarkMode = false,
}) => {
  console.log('Рендеринг компонента ClockWidget', { widget, isDarkMode });
  
  // Получаем настройки виджета или используем значения по умолчанию
  const settings: ClockSettings = {
    ...defaultSettings,
    ...widget.settings
  };

  // Используем хук для работы с часовыми поясами
  const {
    currentTime,
    formattedTime,
    fullTimezoneName
  } = useTimezone({
    timezone: settings.timezone || defaultSettings.timezone,
    showSeconds: settings.showSeconds,
    format24h: settings.format24h
  });

  // Установка минимального и максимального размера и настроек по умолчанию при первом рендеринге
  useEffect(() => {
    if (updateWidget) {
      const updates: Partial<typeof widget> = {};
      let needsUpdate = false;

      // Если нет минимального или максимального размера, устанавливаем их из манифеста
      if (!widget.minSize || !widget.maxSize) {
        updates.minSize = CLOCK_WIDGET_MANIFEST.minSize;
        updates.maxSize = CLOCK_WIDGET_MANIFEST.maxSize;
        needsUpdate = true;
      }
      
      // Если нет настроек или они неполные, устанавливаем настройки по умолчанию
      if (!widget.settings || Object.keys(widget.settings).length < Object.keys(defaultSettings).length) {
        updates.settings = {
          ...defaultSettings,
          ...widget.settings
        };
        needsUpdate = true;
      }

      // Если нужно обновить виджет, делаем это
      if (needsUpdate) {
        updateWidget({
          ...widget,
          ...updates,
          lastUpdated: Date.now()
        });
      }
    }
  }, [widget, updateWidget]);

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

  /**
   * Обработчик изменения часового пояса
   */
  const handleTimezoneChange = useCallback((timezone: string) => {
    handleSettingsChange({ timezone });
  }, [handleSettingsChange]);

  /**
   * Обработчик изменения флага отображения названия часового пояса
   */
  const handleShowTimezoneChange = useCallback((showTimezone: boolean) => {
    handleSettingsChange({ showTimezone });
  }, [handleSettingsChange]);

  /**
   * Обработчик закрытия настроек
   */
  const handleCloseSettings = useCallback(() => {
    if (updateWidget) {
      updateWidget({
        ...widget,
        isSettingsOpen: false,
        lastUpdated: Date.now()
      });
    }
  }, [widget, updateWidget]);

  // Форматирование даты
  const formattedDate = currentTime.toLocaleDateString();

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
      
      {/* Отображение названия часового пояса (если включено в настройках) */}
      {settings.showTimezone && (
        <div className={`text-xs mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          {fullTimezoneName}
        </div>
      )}
      
      {/* Настройки виджета (отображаются только когда открыты настройки) */}
      {widget.isSettingsOpen && (
        <div className="mt-4 w-full">
          <TimezoneSettings
            timezone={settings.timezone || defaultSettings.timezone}
            showTimezone={settings.showTimezone || false}
            onTimezoneChange={handleTimezoneChange}
            onShowTimezoneChange={handleShowTimezoneChange}
            onClose={handleCloseSettings}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};

export default ClockWidget; 
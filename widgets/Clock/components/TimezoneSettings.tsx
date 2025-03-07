"use client"

/**
 * Компонент настроек для часового пояса
 * 
 * Этот компонент предоставляет интерфейс для выбора часового пояса
 * и настройки отображения его названия.
 */

import { useCallback } from 'react';
import { TimezoneService } from '../services/TimezoneService';

interface TimezoneSettingsProps {
  timezone?: string;
  showTimezone?: boolean;
  onTimezoneChange: (timezone: string) => void;
  onShowTimezoneChange: (show: boolean) => void;
  onClose?: () => void;
  isDarkMode?: boolean;
}

/**
 * Компонент настроек для часового пояса
 */
const TimezoneSettings: React.FC<TimezoneSettingsProps> = ({
  timezone = TimezoneService.getCurrentTimezone(),
  showTimezone = false,
  onTimezoneChange,
  onShowTimezoneChange,
  onClose,
  isDarkMode = false
}) => {
  // Получаем список популярных часовых поясов
  const popularTimezones = TimezoneService.getPopularTimezones();
  
  // Обработчик изменения часового пояса
  const handleTimezoneChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimezoneChange(e.target.value);
  }, [onTimezoneChange]);
  
  // Обработчик изменения флага отображения названия часового пояса
  const handleShowTimezoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onShowTimezoneChange(e.target.checked);
  }, [onShowTimezoneChange]);
  
  return (
    <div className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Часовой пояс</h4>
        {onClose && (
          <button 
            onClick={onClose}
            className={`px-2 py-1 rounded text-sm ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Закрыть
          </button>
        )}
      </div>
      
      {/* Выбор часового пояса */}
      <div className="mb-2">
        <select
          value={timezone}
          onChange={handleTimezoneChange}
          className={`w-full p-2 rounded border ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}
        >
          {popularTimezones.map((tz) => (
            <option key={tz.id} value={tz.id}>
              {tz.name} ({tz.offset})
            </option>
          ))}
        </select>
      </div>
      
      {/* Флаг отображения названия часового пояса */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showTimezone"
          checked={showTimezone}
          onChange={handleShowTimezoneChange}
          className="mr-2"
        />
        <label htmlFor="showTimezone">Показывать название часового пояса</label>
      </div>
    </div>
  );
};

export default TimezoneSettings; 
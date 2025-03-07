/**
 * Типы для модуля часовых поясов
 */

/**
 * Информация о часовом поясе
 */
export interface TimezoneInfo {
  id: string;           // Идентификатор часового пояса (например, 'Europe/Moscow')
  name: string;         // Отображаемое имя часового пояса
  offset: string;       // Смещение относительно UTC (например, '+03:00')
  region?: string;      // Регион (например, 'Europe', 'Asia')
}

/**
 * Группа часовых поясов
 */
export interface TimezoneGroup {
  region: string;       // Название региона
  timezones: TimezoneInfo[]; // Часовые пояса в этом регионе
}

/**
 * Опции форматирования времени
 */
export interface TimeFormatOptions {
  showSeconds?: boolean; // Показывать секунды
  format24h?: boolean;   // 24-часовой формат
} 
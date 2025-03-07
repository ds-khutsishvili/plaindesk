/**
 * Утилиты для работы с часовыми поясами
 */
import { TimeFormatOptions } from './types';
import { POPULAR_TIMEZONES } from './constants';

/**
 * Получает текущее время в указанном часовом поясе
 * 
 * @param date Дата для преобразования
 * @param timezone Идентификатор часового пояса (например, 'Europe/Moscow')
 * @returns Дата в указанном часовом поясе
 */
export function getTimeInTimezone(date: Date, timezone: string): Date {
  try {
    // Используем Intl.DateTimeFormat для получения времени в нужном часовом поясе
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const dateObj: Record<string, number> = {};
    
    parts.forEach(part => {
      if (part.type !== 'literal') {
        dateObj[part.type] = parseInt(part.value, 10);
      }
    });
    
    return new Date(
      dateObj.year,
      dateObj.month - 1,
      dateObj.day,
      dateObj.hour,
      dateObj.minute,
      dateObj.second
    );
  } catch (error) {
    console.error(`Ошибка при получении времени в часовом поясе ${timezone}:`, error);
    return date; // Возвращаем исходную дату в случае ошибки
  }
}

/**
 * Форматирует время с учетом настроек
 * 
 * @param date Дата для форматирования
 * @param options Опции форматирования
 * @returns Отформатированная строка времени
 */
export function formatTime(date: Date, options: TimeFormatOptions = {}): string {
  const { showSeconds = true, format24h = true } = options;
  
  const hours = format24h 
    ? date.getHours() 
    : (date.getHours() % 12 || 12);
  
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
  return showSeconds
    ? `${hours}:${minutes}:${seconds}${!format24h ? ` ${ampm}` : ''}`
    : `${hours}:${minutes}${!format24h ? ` ${ampm}` : ''}`;
}

/**
 * Получает название часового пояса
 * 
 * @param timezone Идентификатор часового пояса
 * @returns Название часового пояса или сам идентификатор, если название не найдено
 */
export function getTimezoneName(timezone: string): string {
  const timezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === timezone);
  return timezoneInfo ? timezoneInfo.name : timezone;
}

/**
 * Получает смещение часового пояса относительно UTC
 * 
 * @param timezone Идентификатор часового пояса
 * @returns Смещение в формате '+HH:MM' или '-HH:MM'
 */
export function getTimezoneOffset(timezone: string): string {
  const timezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === timezone);
  if (timezoneInfo) {
    return timezoneInfo.offset;
  }
  
  try {
    // Если часовой пояс не найден в списке, пытаемся получить смещение через API
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    
    return timeZonePart ? timeZonePart.value : '';
  } catch (error) {
    console.error(`Ошибка при получении смещения для часового пояса ${timezone}:`, error);
    return '';
  }
}

/**
 * Получает текущий часовой пояс пользователя
 * 
 * @returns Идентификатор текущего часового пояса
 */
export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
} 